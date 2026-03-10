# FB Page Token Tool

Tool lấy Facebook Page Access Token qua OAuth — APP_SECRET ẩn hoàn toàn.

## Cấu trúc

```
fb-token-tool/
├── api/
│   └── callback.js     ← Serverless function (chứa APP_SECRET an toàn)
├── public/
│   └── index.html      ← Frontend
├── vercel.json
└── README.md
```

## Deploy lên Vercel

### Bước 1: Push lên GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/fb-token-tool.git
git push -u origin main
```

### Bước 2: Import vào Vercel
- Vào https://vercel.com/new
- Import repo vừa tạo
- Framework Preset: **Other**
- Bấm Deploy

### Bước 3: Điền Environment Variables
Vào Project → Settings → Environment Variables, thêm 3 biến:

| Key | Value |
|-----|-------|
| `APP_ID` | App ID của FB App |
| `APP_SECRET` | App Secret của FB App |
| `REDIRECT_URI` | `https://your-app.vercel.app/api/callback` |

Sau đó **Redeploy** để env có hiệu lực.

### Bước 4: Cập nhật APP_ID trong index.html
Mở `public/index.html`, tìm dòng:
```js
const APP_ID = 'YOUR_APP_ID';
```
Thay bằng App ID thực (APP_ID là public, không sao).

### Bước 5: Cấu hình FB App
Vào FB App Dashboard → Facebook Login → Settings:
- **Valid OAuth Redirect URIs**: `https://your-app.vercel.app/api/callback`

### Bước 6: Bật Live Mode
FB App Dashboard → bật **Live** (thay vì Development).

## Lưu ý
- APP_SECRET **không bao giờ** xuất hiện ở frontend
- Token hiển thị trên màn hình, không lưu server
- Via cần là Admin/Editor của page mới lấy được token
