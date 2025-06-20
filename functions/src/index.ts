import * as express from "express";
import * as cors from "cors";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import * as multer from "multer";
import * as AdmZip from "adm-zip";
import * as dotenv from "dotenv";

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS設定
app.use(
  cors({
    origin: [
      "http://localhost:3000", // 開發環境
      "https://gg90052.github.io", // GitHub Pages
      /\.github\.io$/, // 所有 github.io 子域名
      process.env.FRONTEND_URL || "http://localhost:3000", // 可設定的前端 URL
    ],
    credentials: true,
  })
);

// 只對非 deploy 路由使用 JSON 解析器
app.use((req, res, next) => {
  if (req.path === "/deploy") {
    // 跳過 deploy 路由的自動 JSON 解析
    next();
  } else {
    // 其他路由使用標準 JSON 解析器
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// 設定 multer 用於檔案上傳
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB 限制
  },
});

// GitHub OAuth設定 - 從環境變數讀取
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error(
    "錯誤：請設定 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET 環境變數"
  );
  process.exit(1);
}

// 創建 JSON 中間件實例（僅用於 deploy 路由）
const jsonParser = express.json({ limit: "50mb" });

// GitHub OAuth callback處理
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // 使用code交換access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // 獲取用戶資訊
    const userResponse = await axios.get("https://api.github.com/user", {
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
  } catch (error) {
    console.error("GitHub OAuth失敗:", error);
    return res.status(500).send("認證失敗");
  }
});

// 請求處理中間件
const requestHandler = (req: any, res: any, next: any) => {
  const contentType = req.headers["content-type"] || "";

  // 如果是 multipart/form-data，使用 multer 處理檔案上傳
  if (contentType.includes("multipart/form-data")) {
    upload.single("file")(req, res, next);
  } else {
    // 對於 JSON 請求，使用 JSON 解析器
    jsonParser(req, res, next);
  }
};

// 部署到GitHub Pages
// 支援三種部署模式：
// 1. HTML 代碼部署：傳送 JSON 格式 { html: string, siteName: string, description: string }
// 2. HTML 檔案上傳：傳送 FormData 包含 .html/.htm 檔案
// 3. ZIP 檔案上傳：傳送 FormData 包含 .zip 檔案，會自動解壓縮並部署所有內容
//
// 前端使用方式：
// - 純文字模式：axios.post('/deploy', { html, siteName, description })
// - 檔案模式：axios.post('/deploy', formData) // formData 包含 file, siteName, description
app.post("/deploy", requestHandler, async (req, res) => {
  try {
    // 驗證認證
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "未提供有效的認證" });
    }

    const token = authHeader.split(" ")[1];

    // 初始化 Octokit
    const octokit = new Octokit({
      auth: token,
    });

    // 獲取用戶資訊
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const userData = userResponse.data;
    const userId = userData.login;

    let siteName: string;
    let description: string;
    let files: { [path: string]: string } = {};
    let filesUploaded = 0;

    // 判斷是檔案上傳還是 HTML 代碼部署
    if (req.file) {
      // 檔案上傳模式
      siteName = req.body.siteName || "ezpage";
      description = req.body.description || "";

      const fileName = req.file.originalname.toLowerCase();

      if (fileName.endsWith(".zip")) {
        // ZIP 檔案處理
        try {
          const zip = new AdmZip(req.file.buffer);
          const zipEntries = zip.getEntries();

          zipEntries.forEach((entry) => {
            if (!entry.isDirectory) {
              const entryName = entry.entryName;
              const content = entry.getData().toString("utf8");

              // 跳過隱藏檔案和系統檔案
              if (
                !entryName.startsWith(".") &&
                !entryName.includes("__MACOSX")
              ) {
                files[entryName] = content;
                filesUploaded++;
              }
            }
          });

          if (filesUploaded === 0) {
            throw new Error("ZIP 檔案中沒有找到有效的檔案");
          }

          // 確保有 index.html
          if (!files["index.html"] && !files["index.htm"]) {
            const htmlFiles = Object.keys(files).filter(
              (name) => name.endsWith(".html") || name.endsWith(".htm")
            );

            if (htmlFiles.length > 0) {
              // 將第一個 HTML 檔案重命名為 index.html
              const firstHtmlFile = htmlFiles[0];
              files["index.html"] = files[firstHtmlFile];
              if (firstHtmlFile !== "index.html") {
                delete files[firstHtmlFile];
              }
            }
          }
        } catch (error) {
          return res.status(400).json({
            error: "ZIP 檔案處理失敗",
            details: error instanceof Error ? error.message : "未知錯誤",
          });
        }
      } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
        // HTML 檔案處理
        const content = req.file.buffer.toString("utf8");
        files["index.html"] = content;
        filesUploaded = 1;
      } else {
        return res.status(400).json({
          error: "不支援的檔案類型",
          details: "只支援 .html、.htm 和 .zip 檔案",
        });
      }
    } else {
      // HTML 代碼模式
      const {
        html,
        siteName: reqSiteName,
        description: reqDescription,
      } = req.body;

      if (!html || !html.trim()) {
        return res.status(400).json({ error: "請提供 HTML 代碼" });
      }

      siteName = reqSiteName || "ezpage";
      description = reqDescription || "";
      files["index.html"] = html;
      filesUploaded = 1;
    }

    // 檢查 repository 是否已存在
    let repoExists = false;
    try {
      await octokit.repos.get({
        owner: userId,
        repo: siteName,
      });
      repoExists = true;
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // 建立或更新 repository
    if (!repoExists) {
      // 確保描述末尾有 EZPage 標識
      const finalDescription = description
        ? `${description} - Deployed by EZPage`
        : `由 EZPage 建立的網站 - Deployed by EZPage`;

      await octokit.repos.createForAuthenticatedUser({
        name: siteName,
        description: finalDescription,
        public: true,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: true,
      });
    } else {
      // 如果 repository 已存在，更新其描述以包含 EZPage 標識
      try {
        const currentRepo = await octokit.repos.get({
          owner: userId,
          repo: siteName,
        });

        const currentDescription = currentRepo.data.description || "";
        const finalDescription = currentDescription.includes(
          "Deployed by EZPage"
        )
          ? currentDescription
          : description
          ? `${description} - Deployed by EZPage`
          : `${currentDescription} - Deployed by EZPage`.replace(/^[\s-]*/, "");

        await octokit.repos.update({
          owner: userId,
          repo: siteName,
          description: finalDescription,
        });
      } catch (error: any) {
        console.warn("更新 repository description 失敗:", error.message);
        // 不阻止部署流程，只記錄警告
      }
    }

    // 上傳檔案到 repository

    for (const [filePath, content] of Object.entries(files)) {
      try {
        // 檢查檔案是否已存在
        let sha: string | undefined;
        try {
          const existingFile = await octokit.repos.getContent({
            owner: userId,
            repo: siteName,
            path: filePath,
          });

          if (
            !Array.isArray(existingFile.data) &&
            existingFile.data.type === "file"
          ) {
            sha = existingFile.data.sha;
          }
        } catch (error: any) {
          // 檔案不存在，將建立新檔案
        }

        // 上傳檔案
        await octokit.repos.createOrUpdateFileContents({
          owner: userId,
          repo: siteName,
          path: filePath,
          message: `更新 ${filePath} via EZPage`,
          content: Buffer.from(content, "utf8").toString("base64"),
          sha: sha,
        });
      } catch (error) {
        throw error;
      }
    }

    // 啟用 GitHub Pages
    try {
      await octokit.repos.createPagesSite({
        owner: userId,
        repo: siteName,
        source: {
          branch: "main",
          path: "/",
        },
      });
    } catch (error: any) {
      // GitHub Pages 可能已經啟用，不拋出錯誤
    }

    const siteUrl = `https://${userId}.github.io/${siteName}`;

    // 更新 repository 的 homepage 為 GitHub Pages URL
    try {
      await octokit.repos.update({
        owner: userId,
        repo: siteName,
        homepage: siteUrl,
      });
    } catch (error: any) {
      console.warn("更新 repository homepage 失敗:", error.message);
      // 不阻止部署流程，只記錄警告
    }

    return res.json({
      success: true,
      message: "網站部署成功！",
      url: siteUrl,
      repository: `https://github.com/${userId}/${siteName}`,
      filesUploaded: filesUploaded,
      deployedAt: new Date().toISOString(),
    });
  } catch (error) {
    // 處理不同類型的錯誤
    if (error instanceof Error) {
      if (error.message.includes("Bad credentials")) {
        return res.status(401).json({
          error: "認證失敗，請重新登入",
          details: "GitHub token 無效或已過期",
        });
      }

      if (error.message.includes("Repository creation failed")) {
        return res.status(400).json({
          error: "Repository 建立失敗",
          details: "可能是名稱已被使用或包含無效字元",
        });
      }
    }

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
    const octokit = new Octokit({
      auth: token,
    });

    // 獲取用戶的 repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: 50,
    });

    console.log("獲取到 repositories 數量:", repos.length);

    // 只保留透過 EZPage 部署的 repositories
    const ezpageRepos = repos.filter(
      (repo) =>
        repo.description && repo.description.includes("Deployed by EZPage")
    );

    console.log("EZPage 部署的 repositories 數量:", ezpageRepos.length);

    // 格式化 repositories 資料
    const repositories = ezpageRepos.map((repo) => ({
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

    console.log("最終回傳資料:", repositories.length, "個 EZPage repositories");
    return res.json(repositories);
  } catch (error) {
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
    const octokit = new Octokit({
      auth: token,
    });

    // 獲取用戶資訊
    const userResponse = await axios.get("https://api.github.com/user", {
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
    } catch (error: any) {
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
  } catch (error) {
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
          details:
            "只有 Repository 的擁有者或具有管理員權限的使用者才能刪除 Repository",
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

// 基本路由
app.get("/", (req, res) => {
  res.json({
    message: "EZPage API Server",
    version: "1.0.0",
    status: "running",
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 EZPage API Server 正在運行在 http://localhost:${PORT}`);
  console.log(`📋 健康檢查: http://localhost:${PORT}/health`);
  console.log(`🔧 環境: ${process.env.NODE_ENV || "development"}`);
});

// 優雅關閉
process.on("SIGTERM", () => {
  console.log("收到 SIGTERM，正在關閉伺服器...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("收到 SIGINT，正在關閉伺服器...");
  process.exit(0);
});
