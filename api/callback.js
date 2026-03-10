export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { code, error } = req.query;

  if (error) {
    return res.redirect('/?error=cancelled');
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  try {
    // Bước 1: code → short-lived user token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error.message);

    // Bước 2: exchange → long-lived user token (60 ngày)
    const llRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${tokenData.access_token}`
    );
    const llData = await llRes.json();
    const userToken = llData.access_token || tokenData.access_token;

    // Bước 3: lấy danh sách pages + page tokens
    let allPages = [];
    let nextUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${userToken}&limit=100`;

    while (nextUrl) {
      const pagesRes = await fetch(nextUrl);
      const pagesData = await pagesRes.json();
      if (pagesData.error) throw new Error(pagesData.error.message);
      allPages = allPages.concat(pagesData.data || []);
      nextUrl = pagesData.paging?.next || null;
    }

    // Redirect về trang chủ kèm data (encode base64)
    const encoded = Buffer.from(JSON.stringify(allPages)).toString('base64');
    res.redirect(`/?data=${encoded}`);

  } catch (err) {
    res.redirect(`/?error=${encodeURIComponent(err.message)}`);
  }
}
