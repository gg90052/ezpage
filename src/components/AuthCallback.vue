<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div class="text-center">
        <div v-if="isProcessing">
          <svg
            class="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            正在處理GitHub認證...
          </h2>
          <p class="text-gray-600">請稍候，我們正在處理您的登入請求</p>
        </div>

        <div v-else-if="error">
          <svg
            class="h-12 w-12 text-red-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">認證失敗</h2>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="redirectToHome"
            class="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            返回首頁
          </button>
        </div>

        <div v-else>
          <svg
            class="h-12 w-12 text-green-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">認證成功！</h2>
          <p class="text-gray-600 mb-4">正在重新導向...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "AuthCallback",
  setup() {
    const isProcessing = ref(true);
    const error = ref("");

    onMounted(async () => {
      try {
        // 從URL獲取授權碼
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const errorParam = urlParams.get("error");

        if (errorParam) {
          throw new Error("用戶取消了授權或發生錯誤");
        }

        if (!code) {
          throw new Error("未收到授權碼");
        }

        // 發送授權碼到後端
        const API_BASE_URL = "https://your-project.cloudfunctions.net/api";
        const response = await axios.get(
          `${API_BASE_URL}/auth/callback?code=${code}`
        );

        // 處理成功的回應
        // 注意：實際的token會在Firebase Function中處理並返回HTML
        // 這個組件主要用於錯誤處理和用戶體驗

        isProcessing.value = false;

        // 重新導向到主頁
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (err) {
        console.error("認證失敗:", err);
        error.value = err.message || "認證過程中發生錯誤";
        isProcessing.value = false;
      }
    });

    const redirectToHome = () => {
      window.location.href = "/";
    };

    return {
      isProcessing,
      error,
      redirectToHome,
    };
  },
};
</script>
