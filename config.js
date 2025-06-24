// EZPage 前端配置
export const config = {
  // GitHub OAuth設定
  github: {
    clientId: "Ov23liX2Xl95CThk8evQ",
  },

  // Firebase設定
  firebase: {
    projectId: "ezpage-127d9",
    apiUrl: "https://us-central1-ezpage-127d9.cloudfunctions.net/api",
  },

  // 開發環境設定
  development: {
    devMode: true, // 設為 true 時使用本地 API
    localApiUrl: "http://localhost:5001/ezpage-127d9/us-central1/api",
  },
};
