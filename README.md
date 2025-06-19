# EZPage - 輕鬆創建 GitHub Pages

一個讓用戶可以輕鬆上傳 HTML 檔案並自動部署到 GitHub Pages 的網頁服務。

## 功能特色

- 🔐 GitHub OAuth 登入認證
- 📁 支援多檔案上傳（HTML、CSS、JS 等）
- 🚀 自動創建 GitHub repository
- 🌐 自動啟用 GitHub Pages
- 📊 部署歷史管理
- 💅 現代化的使用者介面

## 技術架構

### 前端

- **Vue 3** - 現代化的前端框架
- **TailwindCSS** - 實用優先的 CSS 框架
- **Vite** - 快速的建置工具

### 後端

- **Firebase Functions** - 無伺服器後端服務
- **Firebase Firestore** - 資料庫
- **GitHub API** - GitHub repository 管理

## 安裝與設定

### 1. 克隆專案

\`\`\`bash
git clone <your-repo-url>
cd ezpage
\`\`\`

### 2. 安裝前端依賴

\`\`\`bash
npm install
\`\`\`

### 3. 安裝後端依賴

\`\`\`bash
cd functions
npm install
cd ..
\`\`\`

### 4. Firebase 設定

1. 在[Firebase Console](https://console.firebase.google.com/)創建新專案
2. 啟用 Authentication 和 Firestore
3. 更新`.firebaserc`中的專案 ID
4. 設定 Firebase 環境變數：

\`\`\`bash
firebase functions:config:set github.client_id="your_github_oauth_app_client_id"
firebase functions:config:set github.client_secret="your_github_oauth_app_client_secret"
\`\`\`

### 5. GitHub OAuth 設定

1. 在 GitHub Settings > Developer settings > OAuth Apps 創建新應用程式
2. 設定 Authorization callback URL 為：
   - 開發環境：\`http://localhost:5001/your-project-id/us-central1/api/auth/callback\`
   - 生產環境：\`https://us-central1-your-project-id.cloudfunctions.net/api/auth/callback\`

### 6. 更新前端配置

在\`src/App.vue\`中更新以下設定：

- \`API_BASE_URL\`：Firebase Functions URL
- \`clientId\`：GitHub OAuth App Client ID

## 開發

### 啟動前端開發服務器

\`\`\`bash
npm run dev
\`\`\`

### 啟動 Firebase Functions 模擬器

\`\`\`bash
cd functions
npm run serve
\`\`\`

## 部署

### 部署 Firebase Functions

\`\`\`bash
cd functions
npm run deploy
\`\`\`

### 部署前端到 Firebase Hosting

\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

## 使用方式

1. 使用 GitHub 帳號登入
2. 選擇或拖拽 HTML 檔案到上傳區域
3. 設定 repository 名稱和描述
4. 點擊"部署到 GitHub Pages"
5. 等待部署完成，即可查看您的網站

## 注意事項

- 確保您的 GitHub 帳號有創建 public repository 的權限
- HTML 檔案大小限制為 10MB
- 如果沒有 index.html，系統會自動將第一個 HTML 檔案重命名為 index.html
- GitHub Pages 可能需要幾分鐘時間才能生效

## 支援的檔案類型

- HTML 檔案（.html, .htm）
- CSS 樣式表
- JavaScript 檔案
- 圖片檔案
- 其他靜態資源

## 疑難排解

### GitHub Pages 沒有立即生效

GitHub Pages 通常需要幾分鐘時間來建置和部署，請稍等片刻後再次查看。

### 上傳檔案失敗

請確認：

1. 檔案大小不超過 10MB
2. 檔案格式受支援
3. 網路連線正常

### OAuth 認證失敗

請確認：

1. GitHub OAuth App 設定正確
2. 回調 URL 設定正確
3. Client ID 和 Secret 設定正確

## 開發團隊

- 前端開發：Vue 3 + TailwindCSS
- 後端開發：Firebase Functions + TypeScript
- API 整合：GitHub REST API

## 授權條款

MIT License
