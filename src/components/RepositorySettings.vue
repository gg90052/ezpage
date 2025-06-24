<template>
  <div class="mt-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">
      網站 (Repository) 設定
    </h3>

    <!-- 網站 (Repository) 名稱設定 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        網站 (Repository) 名稱
      </label>

      <!-- 提示文字：當沒有選擇現有網站也沒有輸入網站名稱時顯示 -->
      <div class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p class="text-sm text-blue-700" v-if="!repoName">
          請選擇一個現有網站或輸入新的網站名稱以開始部署
        </p>
        <p class="text-sm text-blue-700" v-if="repoName">
          部署後的網址為：https://{{ user.login }}.github.io/{{ repoName }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <!-- 選擇現有網站 (30% 寬度) -->
        <div class="w-full sm:w-3/10">
          <select
            v-if="repositories.length > 0"
            @change="handleRepoSelect($event.target.value)"
            class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
          >
            <option value="">新網站 (Repo)</option>
            <option
              v-for="repo in repositories"
              :key="repo.name"
              :value="repo.name"
            >
              {{ repo.name }}
            </option>
          </select>
          <div
            v-else
            class="w-full h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-400 text-sm flex items-center"
          >
            暫無現有網站 (Repo)
          </div>
        </div>

        <!-- 新增網站輸入框 (70% 寬度) -->
        <div class="w-full sm:w-7/10 relative">
          <input
            :value="repoName"
            @input="$emit('update:repoName', $event.target.value)"
            type="text"
            :disabled="!isPaidUser"
            class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            :class="{ 'bg-gray-100 cursor-not-allowed': !isPaidUser }"
            :placeholder="placeholder"
          />
          <div
            v-if="!isPaidUser"
            class="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg
              class="h-5 w-5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <p v-if="!isPaidUser" class="text-xs text-amber-600 mt-1">
        🔒 自定義網站名稱需要付費會員 (Repository)
      </p>
    </div>

    <!-- 描述和部署按鈕在同一行 -->
    <div class="flex flex-col sm:flex-row sm:items-end gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          描述 (選填)
        </label>
        <input
          :value="description"
          @input="$emit('update:description', $event.target.value)"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="我的網站描述"
        />
      </div>

      <div class="sm:ml-4">
        <button
          @click="$emit('deploy')"
          :disabled="!repoName || isDeploying || !canDeploy"
          class="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <svg
            v-if="isDeploying"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
          {{ isDeploying ? "部署中..." : deployButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";

// 透過 inject 注入 user 值
const user = inject("user");

defineProps({
  repoName: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  repositories: {
    type: Array,
    default: () => [],
  },
  isPaidUser: {
    type: Boolean,
    default: false,
  },
  isDeploying: {
    type: Boolean,
    default: false,
  },
  canDeploy: {
    type: Boolean,
    default: true,
  },
  deployButtonText: {
    type: String,
    default: "部署",
  },
  placeholder: {
    type: String,
    default: "ezpage",
  },
});

const emit = defineEmits(["update:repoName", "update:description", "deploy"]);

const handleRepoSelect = (repoName) => {
  emit("update:repoName", repoName);
};
</script>
