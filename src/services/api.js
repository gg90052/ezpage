import axios from "axios";

// Firebase Functions URL - 雲端部署版本
// const API_BASE_URL = "https://us-central1-ezpage-127d9.cloudfunctions.net/api";
// 開發環境可以使用本地 URL：
const API_BASE_URL = "http://localhost:5001/ezpage-127d9/us-central1/api";

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 請求攔截器 - 自動添加 authorization header
    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("github_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async deploy(deployData, isFileUpload = false) {
    const config = {
      // 設定請求攔截器
      transformRequest: [
        function (data, headers) {
          if (isFileUpload) {
            // 檔案上傳：移除 Content-Type，讓瀏覽器自動設定為 multipart/form-data
            delete headers["Content-Type"];
            return data; // FormData 不需要序列化
          } else {
            // JSON 模式：確保 Content-Type 是 application/json 並正確序列化
            headers["Content-Type"] = "application/json";
            return JSON.stringify(data); // 手動序列化 JSON
          }
        },
      ],
    };

    if (isFileUpload) {
      // 添加 timeout 設定，避免大檔案上傳逾時
      config.timeout = 300000; // 5分鐘逾時
      // 增加檔案大小限制
      config.maxContentLength = Infinity;
      config.maxBodyLength = Infinity;
    }

    const response = await this.axios.post("/deploy", deployData, config);
    return response.data;
  }

  async getRepositories() {
    const response = await this.axios.get("/repositories");
    return response.data;
  }

  async deleteRepository(repoName) {
    console.log("準備刪除 repository:", repoName);
    console.log("API 請求 URL:", `${API_BASE_URL}/repositories/${repoName}`);

    try {
      const response = await this.axios.delete(`/repositories/${repoName}`);
      console.log("刪除 repository 成功:", response.data);
      return response.data;
    } catch (error) {
      console.error("API 刪除請求失敗:", error);
      throw error;
    }
  }

  // GitHub OAuth 相關方法
  getAuthUrl() {
    const clientId = "Ov23liX2Xl95CThk8evQ"; // 需要替換為實際的client_id
    const redirectUri = `${API_BASE_URL}/auth/callback`;
    const scope = "repo delete_repo user admin:repo_hook";

    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }
}

export default new ApiService();
