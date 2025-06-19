# GitHub Pages 部署說明

## 自動部署到 GitHub Pages

此專案已設置好自動部署到 GitHub Pages 的功能。

### 部署指令

```bash
npm run deploy
```

### 部署流程

1. **編譯專案**: 使用 Vite 將 Vue.js 專案編譯為靜態檔案
2. **推送到 gh-pages 分支**: 將編譯後的 `dist` 資料夾內容推送到 GitHub 的 `gh-pages` 分支
3. **自動發布**: GitHub 會自動將 `gh-pages` 分支的內容發布為網站

### 網站網址

部署完成後，您的網站將可在以下網址訪問：

```
https://gg90052.github.io/ezpage/
```

### 注意事項

- 確保您已推送程式碼到 GitHub repository
- 第一次部署後，可能需要幾分鐘時間才能在網站上看到更新
- 在 GitHub repository 的 Settings > Pages 中，確認 Source 設定為 "Deploy from a branch" 並選擇 "gh-pages" 分支

### 其他指令

- `npm run build`: 只編譯專案，不部署
- `npm run dev`: 啟動開發伺服器
- `npm run preview`: 預覽編譯後的網站

### 疑難排解

如果部署失敗，請檢查：

1. GitHub repository 是否存在且有寫入權限
2. 是否已安裝所有相依套件 (`npm install`)
3. SSH 金鑰是否已正確設定於 GitHub
