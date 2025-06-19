# EZPage 快速設定指南

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝前端依賴
npm install

# 安裝Firebase Functions依賴
cd functions
npm install
cd ..
```

### 2. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 創建新專案
3. 啟用以下服務：

   - Authentication
   - Firestore Database
   - Functions
   - Hosting

4. 安裝 Firebase CLI：

```bash
npm install -g firebase-tools
firebase login
```

5. 初始化 Firebase 專案：

```bash
firebase init
# 選擇 Functions, Firestore, Hosting
```

6. 更新專案設定：

```bash
# 更新 .firebaserc 中的專案ID
# 更新 firebase.json 配置
```

### 3. GitHub OAuth App 設定

1. 前往 GitHub Settings > Developer settings > OAuth Apps
2. 點擊 "New OAuth App"
3. 填入以下資訊：

   - Application name: `EZPage`
   - Homepage URL: `https://your-project.web.app`
   - Authorization callback URL: `https://us-central1-your-project-id.cloudfunctions.net/api/auth/callback`

4. 獲取 Client ID 和 Client Secret

### 4. 設定環境變數

```bash
# 設定Firebase Functions環境變數
firebase functions:config:set github.client_id="your_github_client_id"
firebase functions:config:set github.client_secret="your_github_client_secret"
```

### 5. 更新前端配置

在 `src/App.vue` 中更新：

```javascript
// 更新API URL
const API_BASE_URL =
  "https://us-central1-your-project-id.cloudfunctions.net/api";

// 更新GitHub Client ID
const clientId = "your_github_client_id";
```

### 6. 開發環境啟動

```bash
# 終端1：啟動前端開發服務器
npm run dev

# 終端2：啟動Firebase Functions模擬器
cd functions
npm run serve
```

前端訪問：http://localhost:3000
Functions 訪問：http://localhost:5001

### 7. 部署到生產環境

```bash
# 建置前端
npm run build

# 部署Firebase Functions
firebase deploy --only functions

# 部署Hosting
firebase deploy --only hosting

# 或一次部署全部
firebase deploy
```

## 🔧 配置檔案說明

### firebase.json

- 配置 Firebase 服務設定
- Functions 和 Hosting 的規則

### .firebaserc

- Firebase 專案別名設定

### functions/src/index.ts

- Firebase Functions 主要邏輯
- GitHub API 整合
- OAuth 認證處理

### src/App.vue

- 前端主要組件
- 用戶介面和交互邏輯

## 🐛 常見問題

### Functions 部署失敗

1. 確認 Node.js 版本為 18
2. 檢查 package.json 中的依賴版本
3. 確認 Firebase 專案設定正確

### OAuth 認證失敗

1. 檢查 GitHub OAuth App 設定
2. 確認 callback URL 正確
3. 檢查環境變數設定

### GitHub Pages 未生效

1. GitHub Pages 需要幾分鐘生效
2. 確認 repository 設定為 public
3. 檢查 GitHub Actions 狀態

## 📝 開發注意事項

1. 本地開發時使用 Firebase 模擬器
2. 確保所有敏感資訊使用環境變數
3. 定期更新依賴套件
4. 遵循 TypeScript 和 Vue 3 最佳實踐

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 創建 Pull Request

## 📄 授權

MIT License
