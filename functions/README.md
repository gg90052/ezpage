# EZPage API Server

EZPage 的後端 API 伺服器，提供 GitHub OAuth 認證和檔案部署功能。

## 功能

- GitHub OAuth 認證
- 部署 HTML/ZIP 檔案到 GitHub Pages
- 管理 GitHub repositories
- 支援三種部署模式：
  - HTML 代碼直接部署
  - HTML 檔案上傳
  - ZIP 檔案上傳並自動解壓

## 安裝

1. 安裝依賴：

```bash
npm install
```

2. 複製環境變數範本：

```bash
cp env.example .env
```

3. 編輯 `.env` 檔案，設定您的 GitHub OAuth 應用程式資訊：

```
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## GitHub OAuth 應用程式設定

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
2. 點擊 "New OAuth App"
3. 填寫以下資訊：
   - **Application name**: EZPage
   - **Homepage URL**: `http://localhost:3000` (開發環境)
   - **Authorization callback URL**: `http://localhost:3001/auth/callback`
4. 創建後複製 Client ID 和 Client Secret 到 `.env` 檔案

## 運行

### 開發模式

```bash
npm run dev
```

### 生產模式

```bash
npm start
```

伺服器將在 `http://localhost:3001` 啟動。

## API 端點

### 認證

- `GET /auth/callback` - GitHub OAuth 回調

### 部署

- `POST /deploy` - 部署檔案到 GitHub Pages
  - 支援 JSON 格式（HTML 代碼）
  - 支援 FormData 格式（檔案上傳）

### Repositories

- `GET /repositories` - 獲取用戶的 GitHub repositories
- `DELETE /repositories/:repoName` - 刪除指定的 repository

### 其他

- `GET /health` - 健康檢查
- `GET /` - API 基本資訊

## 部署方式

### 1. HTML 代碼部署

```javascript
axios.post(
  "/deploy",
  {
    html: "<html>...</html>",
    siteName: "my-site",
    description: "我的網站",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### 2. 檔案上傳部署

```javascript
const formData = new FormData();
formData.append("file", file); // HTML 或 ZIP 檔案
formData.append("siteName", "my-site");
formData.append("description", "我的網站");

axios.post("/deploy", formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});
```

## 環境變數

| 變數名稱               | 說明                                | 預設值                |
| ---------------------- | ----------------------------------- | --------------------- |
| `GITHUB_CLIENT_ID`     | GitHub OAuth 應用程式 Client ID     | 必填                  |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth 應用程式 Client Secret | 必填                  |
| `PORT`                 | 伺服器端口                          | 3001                  |
| `NODE_ENV`             | 環境模式                            | development           |
| `FRONTEND_URL`         | 前端 URL（用於 CORS）               | http://localhost:3000 |

## 錯誤處理

API 會返回標準的 HTTP 狀態碼：

- `200` - 成功
- `400` - 請求錯誤
- `401` - 認證失敗
- `403` - 權限不足
- `404` - 資源不存在
- `500` - 伺服器錯誤

錯誤回應格式：

```json
{
  "error": "錯誤訊息",
  "details": "詳細說明"
}
```
