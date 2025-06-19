import axios from "axios";

// Firebase Functions URL (需要替換為實際URL)
// const API_BASE_URL = "https://us-central1-ezpage-127d9.cloudfunctions.net";
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

  async deploy(deployData) {
    const response = await this.axios.post("/deploy", deployData);
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
