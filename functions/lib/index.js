"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const rest_1 = require("@octokit/rest");
const axios_1 = require("axios");
admin.initializeApp();
// 重新啟用 Firestore 初始化
// const db = admin.firestore();
const app = express();
// CORS設定
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://gg90052.github.io",
        /\.github\.io$/, // 所有 github.io 子域名
    ],
    credentials: true,
}));
// 增加請求大小限制
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// GitHub OAuth設定 - 需要在Firebase Config中設定這些環境變數
// const GITHUB_CLIENT_ID = "Ov23liX2Xl95CThk8evQ";
// const GITHUB_CLIENT_SECRET = "f80563bf8c704bbdc56a1396bd658390de6b4d5f";
const GITHUB_CLIENT_ID = ((_a = functions.config().github) === null || _a === void 0 ? void 0 : _a.client_id) || "Ov23liX2Xl95CThk8evQ";
const GITHUB_CLIENT_SECRET = ((_b = functions.config().github) === null || _b === void 0 ? void 0 : _b.client_secret) ||
    "f80563bf8c704bbdc56a1396bd658390de6b4d5f";
// GitHub OAuth callback處理
app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
        // 使用code交換access token
        const tokenResponse = await axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const { access_token } = tokenResponse.data;
        // 獲取用戶資訊
        const userResponse = await axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });
        const userData = userResponse.data;
        // 返回HTML頁面，將token和用戶資料傳遞給前端
        return res.send(`
      <html>
        <script>
          window.opener.postMessage({
            type: 'GITHUB_AUTH_SUCCESS',
            token: '${access_token}',
            user: ${JSON.stringify(userData)}
          }, '*');
          window.close();
        </script>
      </html>
    `);
    }
    catch (error) {
        console.error("GitHub OAuth失敗:", error);
        return res.status(500).send("認證失敗");
    }
});
// 部署到GitHub Pages
app.post("/deploy", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "未提供有效的認證" });
        }
        const token = authHeader.split(" ")[1];
        // 獲取用戶資訊
        const userResponse = await axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        const userData = userResponse.data;
        const userId = userData.login;
        // 從請求中獲取HTML內容和部署設定
        const { html, siteName, description = "" } = req.body;
        if (!html || !siteName) {
            return res.status(400).json({ error: "請提供HTML內容和網站名稱" });
        }
        // 檢查網站名稱格式（只允許字母、數字、連字號）
        const validRepoName = /^[a-zA-Z0-9.-]+$/.test(siteName);
        if (!validRepoName) {
            return res
                .status(400)
                .json({ error: "網站名稱只能包含字母、數字、點和連字號" });
        }
        // 初始化 Octokit
        const octokit = new rest_1.Octokit({
            auth: token,
        });
        const repoName = `${siteName}`;
        // 檢查repository是否已存在
        let repoExists = false;
        try {
            await octokit.repos.get({
                owner: userId,
                repo: repoName,
            });
            repoExists = true;
        }
        catch (error) {
            if (error.status !== 404) {
                throw error;
            }
        }
        // 如果repository不存在，創建新的
        if (!repoExists) {
            await octokit.repos.createForAuthenticatedUser({
                name: repoName,
                description: description || `使用 EZPage 創建的網站: ${siteName}`,
                homepage: `https://${userId}.github.io/${repoName}`,
                private: false,
                auto_init: true,
            });
        }
        // 獲取main分支的SHA（用於更新文件）
        let sha;
        try {
            const { data: file } = await octokit.repos.getContent({
                owner: userId,
                repo: repoName,
                path: "index.html",
            });
            if (!Array.isArray(file) && file.sha) {
                sha = file.sha;
            }
        }
        catch (error) {
            // 文件不存在，將創建新文件
            if (error.status !== 404) {
                throw error;
            }
        }
        // 上傳或更新index.html文件
        const content = Buffer.from(html).toString("base64");
        await octokit.repos.createOrUpdateFileContents({
            owner: userId,
            repo: repoName,
            path: "index.html",
            message: `部署網站: ${siteName} - ${new Date().toISOString()}`,
            content: content,
            sha: sha, // 如果是更新文件，需要提供SHA
        });
        // 啟用GitHub Pages
        try {
            await octokit.repos.createPagesSite({
                owner: userId,
                repo: repoName,
                source: {
                    branch: "main",
                    path: "/",
                },
            });
        }
        catch (error) {
            // 如果Pages已經啟用，會返回409錯誤，這是正常的
            if (error.status !== 409) {
                console.error("啟用GitHub Pages失敗:", error);
            }
        }
        // 部署URL
        const deploymentUrl = `https://${userId}.github.io/${repoName}`;
        // 返回成功結果
        return res.json({
            success: true,
            url: deploymentUrl,
            repoName: repoName,
            message: "網站部署成功！請等待幾分鐘讓GitHub Pages生效。",
        });
    }
    catch (error) {
        console.error("部署失敗:", error);
        return res.status(500).json({
            error: "部署失敗",
            details: error instanceof Error ? error.message : "未知錯誤",
        });
    }
});
// 獲取用戶的 GitHub repositories
app.get("/repositories", async (req, res) => {
    try {
        console.log("開始獲取用戶的 GitHub repositories...");
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("認證失敗: 未提供有效的認證");
            return res.status(401).json({ error: "未提供有效的認證" });
        }
        const token = authHeader.split(" ")[1];
        console.log("Token:", token ? "存在" : "不存在");
        // 初始化 Octokit
        const octokit = new rest_1.Octokit({
            auth: token,
        });
        // 獲取用戶的 repositories
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            sort: "updated",
            direction: "desc",
            per_page: 50,
        });
        console.log("獲取到 repositories 數量:", repos.length);
        // 格式化 repositories 資料
        const repositories = repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "無描述",
            url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            isPrivate: repo.private,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            hasPages: repo.has_pages,
        }));
        console.log("最終回傳資料:", repositories.length, "個 repositories");
        return res.json(repositories);
    }
    catch (error) {
        console.error("獲取 GitHub repositories 失敗:", error);
        return res.status(500).json({
            error: "獲取 GitHub repositories 失敗",
            details: error instanceof Error ? error.message : "未知錯誤",
        });
    }
});
// 刪除 GitHub repository
app.delete("/repositories/:repoName", async (req, res) => {
    try {
        console.log("開始刪除 GitHub repository...");
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("認證失敗: 未提供有效的認證");
            return res.status(401).json({ error: "未提供有效的認證" });
        }
        const token = authHeader.split(" ")[1];
        const { repoName } = req.params;
        if (!repoName) {
            return res.status(400).json({ error: "請提供要刪除的 repository 名稱" });
        }
        console.log("要刪除的 repository:", repoName);
        // 初始化 Octokit
        const octokit = new rest_1.Octokit({
            auth: token,
        });
        // 獲取用戶資訊
        const userResponse = await axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        const userData = userResponse.data;
        const userId = userData.login;
        // 檢查 repository 是否存在並獲取詳細信息
        let repoInfo;
        try {
            const repoResponse = await octokit.repos.get({
                owner: userId,
                repo: repoName,
            });
            repoInfo = repoResponse.data;
        }
        catch (error) {
            if (error.status === 404) {
                return res.status(404).json({
                    error: "Repository 不存在",
                    repoName: repoName,
                });
            }
            throw error;
        }
        // 檢查是否有刪除權限
        if (repoInfo.owner.login !== userId) {
            return res.status(403).json({
                error: "您不是此 Repository 的擁有者，無法刪除",
                repoName: repoName,
                owner: repoInfo.owner.login,
                currentUser: userId,
            });
        }
        // 檢查是否為 fork
        if (repoInfo.fork) {
            console.log("警告: 嘗試刪除 fork repository:", repoName);
        }
        // 刪除 repository
        await octokit.repos.delete({
            owner: userId,
            repo: repoName,
        });
        console.log("Repository 刪除成功:", repoName);
        return res.json({
            success: true,
            message: `Repository "${repoName}" 已成功刪除`,
            repoName: repoName,
            deletedAt: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("刪除 GitHub repository 失敗:", error);
        // 處理不同類型的錯誤
        if (error instanceof Error) {
            if (error.message.includes("Bad credentials")) {
                return res.status(401).json({
                    error: "認證失敗，請重新登入",
                    details: "GitHub token 無效或已過期",
                });
            }
            if (error.message.includes("Not Found")) {
                return res.status(404).json({
                    error: "Repository 不存在或無權限存取",
                    details: error.message,
                });
            }
            if (error.message.includes("Must have admin rights")) {
                return res.status(403).json({
                    error: "您沒有管理員權限刪除此 Repository",
                    details: "只有 Repository 的擁有者或具有管理員權限的使用者才能刪除 Repository",
                    suggestion: "請確認您是此 Repository 的擁有者",
                });
            }
        }
        return res.status(500).json({
            error: "刪除 GitHub repository 失敗",
            details: error instanceof Error ? error.message : "未知錯誤",
        });
    }
});
// 健康檢查
app.get("/health", (req, res) => {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// 導出Firebase Function
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map