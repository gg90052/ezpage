<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 導航欄 -->
    <NavBar :user="user" @login="loginWithGitHub" @logout="logout" />

    <!-- 主要內容 -->
    <main class="max-w-4xl mx-auto pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <!-- Google 廣告 -->
      <div class="w-full bg-white border-b border-gray-200 mb-2 hidden">
        <div class="max-w-6xl mx-auto py-2 px-4">
          <!-- ezpage -->
          <ins
            class="adsbygoogle"
            style="display: block"
            data-ad-client="ca-pub-2578812574511816"
            data-ad-slot="8378311131"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div>
      <!-- 登入頁面 -->
      <LoginPage v-if="!user" @login="loginWithGitHub" />

      <!-- 已登入的使用者介面 -->
      <div v-else>
        <!-- 檔案上傳區域 -->
        <FileUploader
          :is-deploying="isDeploying"
          :is-paid-user="isPaidUser"
          :repositories="repositories"
          @deploy="deployToGitHub"
          @notification="showNotification"
        />
        <!-- 部署進度說明區塊 -->
        <template v-if="deployInfoShow">
          <DeployInfoPanel />
        </template>
        <!-- Repository 列表 -->
        <RepositoryList
          :repositories="repositories"
          @delete-repo="confirmDeleteRepository"
        />
      </div>

      <!-- 刪除確認對話框 -->
      <DeleteConfirmDialog
        :show="showDeleteConfirm"
        :repository-name="deletingRepo?.name"
        @confirm="deleteRepository"
        @cancel="cancelDelete"
      />

      <!-- 通知 -->
      <Notification :message="notification" :type="notificationType" />
    </main>

    <!-- 部署Loading覆蓋層 -->
    <LoadingOverlay
      :show="isDeploying"
      title="正在部署中..."
      description="正在將您的網站部署到 GitHub Pages，請稍候"
      hint="請不要關閉此頁面..."
      :show-progress="true"
      :progress="70"
      color="green"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import NavBar from "./components/NavBar.vue";
import LoginPage from "./components/LoginPage.vue";
import FileUploader from "./components/FileUploader.vue";
import RepositoryList from "./components/RepositoryList.vue";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog.vue";
import Notification from "./components/Notification.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import DeployInfoPanel from "./components/DeployInfoPanel.vue";
import apiService from "./services/api.js";

// 響應式數據
const user = ref(null);
const isDeploying = ref(false);
const repositories = ref([]);
const notification = ref("");
const notificationType = ref("success");
const deletingRepo = ref(null);
const showDeleteConfirm = ref(false);
const isPaidUser = ref(true); // 目前設為false，之後可根據實際付費邏輯修改
const deployInfoShow = ref(false);

// 透過 provide 提供 user 值給子組件
provide("user", user);

// 初始化
onMounted(() => {
  // 檢查是否已登入
  const token = localStorage.getItem("github_token");
  const userData = localStorage.getItem("user_data");
  if (token && userData) {
    user.value = JSON.parse(userData);
    loadRepositories();
  }

  // 初始化 Google AdSense
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error("AdSense 初始化失敗:", e);
  }
});

// GitHub 登入
const loginWithGitHub = () => {
  const authUrl = apiService.getAuthUrl();

  // 開啟彈出視窗
  const popup = window.open(
    authUrl,
    "github-auth",
    "width=600,height=700,scrollbars=yes,resizable=yes"
  );

  // 監聽來自彈出視窗的訊息
  const handleMessage = (event) => {
    console.log("event:", event);

    if (event.data.type === "GITHUB_AUTH_SUCCESS") {
      const { token, user: userData } = event.data;

      // 儲存token和用戶資料
      localStorage.setItem("github_token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));

      user.value = userData;
      loadRepositories();

      // 移除事件監聽器並關閉彈出視窗
      window.removeEventListener("message", handleMessage);
      if (popup) {
        popup.close();
      }

      showNotification("已成功登入GitHub！", "success");
    }
  };

  window.addEventListener("message", handleMessage);

  // 檢查彈出視窗是否被關閉
  const checkClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkClosed);
      window.removeEventListener("message", handleMessage);
    }
  }, 1000);
};

// 登出
const logout = () => {
  localStorage.removeItem("github_token");
  localStorage.removeItem("user_data");
  user.value = null;
  repositories.value = [];
};

// 部署到 GitHub
const deployToGitHub = async (deployData, isFileUpload = false) => {
  isDeploying.value = true;

  console.log("deployData:", deployData, "isFileUpload:", isFileUpload);
  if (isFileUpload && deployData instanceof FormData) {
    console.log("file:", deployData.get("file"));
  }

  try {
    const response = await apiService.deploy(deployData, isFileUpload);

    // 重新加載 repositories 以顯示新創建的 repository
    await loadRepositories();
    deployInfoShow.value = true;

    const filesInfo = response.filesUploaded
      ? `（${response.filesUploaded} 個檔案）`
      : "";
    showNotification(
      `網站已成功部署！${filesInfo} 網址：${response.url}`,
      "success"
    );
  } catch (error) {
    console.error("部署失敗:", error);
    const errorMessage = error.response?.data?.error || "部署失敗，請稍後再試";
    showNotification(errorMessage, "error");
  } finally {
    isDeploying.value = false;
  }
};

// 加載 repositories
const loadRepositories = async () => {
  try {
    // console.log("開始載入GitHub Repositories...");
    const data = await apiService.getRepositories();
    repositories.value = data;
    // console.log("repositories:", repositories.value);
    // console.log(
    //   "GitHub Repositories已載入:",
    //   repositories.value.length,
    //   "筆記錄"
    // );
  } catch (error) {
    console.error("載入GitHub Repositories失敗:", error);
    if (error.response) {
      console.error("錯誤狀態:", error.response.status);
      console.error("錯誤資料:", error.response.data);
    }
  }
};

// 顯示通知
const showNotification = (message, type = "success") => {
  notification.value = message;
  notificationType.value = type;
  setTimeout(() => {
    notification.value = "";
  }, 5000);
};

// 確認刪除 repository
const confirmDeleteRepository = (repo) => {
  deletingRepo.value = repo;
  showDeleteConfirm.value = true;
};

// 刪除 repository
const deleteRepository = async () => {
  if (!deletingRepo.value) return;

  console.log("開始刪除 repository:", deletingRepo.value.name);

  try {
    const response = await apiService.deleteRepository(deletingRepo.value.name);
    console.log("刪除 API 回應:", response);

    // 從列表中移除已刪除的repository
    repositories.value = repositories.value.filter(
      (repo) => repo.name !== deletingRepo.value.name
    );

    showNotification(
      `Repository "${deletingRepo.value.name}" 已成功刪除`,
      "success"
    );
  } catch (error) {
    console.error("刪除repository失敗:", error);

    // 更詳細的錯誤處理
    let errorMessage = "刪除失敗，請稍後再試";

    if (error.response) {
      console.error("錯誤狀態碼:", error.response.status);
      console.error("錯誤資料:", error.response.data);

      if (error.response.status === 401) {
        errorMessage = "認證失敗，請重新登入";
      } else if (error.response.status === 404) {
        errorMessage = "Repository 不存在或無權限存取";
      } else if (error.response.status === 403) {
        errorMessage = "沒有權限刪除此 Repository";
      } else if (error.response.data?.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.request) {
      console.error("請求失敗，無回應:", error.request);
      errorMessage = "網路連接失敗，請檢查網路連接";
    } else {
      console.error("其他錯誤:", error.message);
      errorMessage = error.message || "未知錯誤";
    }

    showNotification(errorMessage, "error");
  } finally {
    deletingRepo.value = null;
    showDeleteConfirm.value = false;
  }
};

// 取消刪除
const cancelDelete = () => {
  deletingRepo.value = null;
  showDeleteConfirm.value = false;
};
</script>
