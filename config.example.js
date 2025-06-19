// 配置檔案範例
// 複製此檔案為 config.js 並填入實際的設定值

export const config = {
  // GitHub OAuth設定
  github: {
    clientId: "your_github_oauth_app_client_id",
  },

  // Firebase設定
  firebase: {
    projectId: "your-firebase-project-id",
    apiUrl: "https://your-project.cloudfunctions.net/api",
  },

  // 開發環境設定
  development: {
    devMode: true,
    localApiUrl: "http://localhost:5001/your-project-id/us-central1/api",
  },
};
