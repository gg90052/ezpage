<template>
  <div class="bg-white rounded-lg shadow-md p-8 mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">上傳HTML檔案</h2>

    <!-- 上傳區塊 - 當有檔案或正在部署時隱藏 -->
    <div
      v-if="selectedFiles.length === 0 && !isDeploying"
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
      :class="{ 'border-indigo-500 bg-indigo-50': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleFileDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".html,.htm"
        @change="handleFileSelect"
        class="hidden"
      />

      <!-- GitHub Octocat 上傳圖示 -->
      <svg
        class="mx-auto h-16 w-16 text-gray-500 mb-4"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
          clip-rule="evenodd"
        />
      </svg>

      <p class="text-lg text-gray-600 mb-2">拖拽HTML檔案到此處或</p>
      <button
        @click="$refs.fileInput.click()"
        class="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        選擇檔案
      </button>
      <p class="text-sm text-gray-500 mt-2">支援 .html 和 .htm 檔案</p>
    </div>

    <!-- 檔案列表 -->
    <div v-if="selectedFiles.length > 0" class="mt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">已選擇的檔案</h3>
      <div class="space-y-2">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="flex items-center justify-between bg-gray-50 p-3 rounded-md"
        >
          <div class="flex items-center">
            <!-- GitHub Octocat 檔案圖示 -->
            <svg
              class="h-5 w-5 text-indigo-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-sm text-gray-900">{{ file.name }}</span>
          </div>
          <button
            @click="removeFile(index)"
            class="text-red-500 hover:text-red-700"
            :disabled="isDeploying"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Repository 設定 -->
    <div v-if="selectedFiles.length > 0" class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Repository 設定</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="repoName"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Repository 名稱</label
          >
          <div class="relative">
            <input
              id="repoName"
              v-model="repoName"
              type="text"
              :disabled="!isPaidUser"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'bg-gray-100 cursor-not-allowed': !isPaidUser }"
              placeholder="ezpage"
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
          <p v-if="!isPaidUser" class="text-xs text-amber-600 mt-1">
            🔒 自定義Repository名稱需要付費會員
          </p>
        </div>
        <div>
          <label
            for="repoDescription"
            class="block text-sm font-medium text-gray-700 mb-2"
            >描述 (選填)</label
          >
          <input
            id="repoDescription"
            v-model="repoDescription"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="我的網站描述"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="handleDeploy"
          :disabled="!repoName || isDeploying"
          class="bg-green-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {{ isDeploying ? "部署中..." : "部署到GitHub Pages" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  isDeploying: {
    type: Boolean,
    default: false,
  },
  isPaidUser: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["deploy", "notification"]);

const selectedFiles = ref([]);
const repoName = ref("ezpage");
const repoDescription = ref("");
const isDragOver = ref(false);

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    selectedFiles.value = [files[0]]; // 只取第一個檔案
  }
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleFileDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = Array.from(event.dataTransfer.files);
  const htmlFiles = files.filter(
    (file) =>
      file.type === "text/html" ||
      file.name.endsWith(".html") ||
      file.name.endsWith(".htm")
  );

  if (htmlFiles.length > 0) {
    selectedFiles.value = [htmlFiles[0]]; // 只取第一個HTML檔案
    emit("notification", "已添加HTML檔案");
  } else {
    emit("notification", "請只上傳HTML檔案(.html, .htm)");
  }
};

const handleDeploy = async () => {
  if (!repoName.value || selectedFiles.value.length === 0) return;

  // 讀取第一個HTML檔案的內容
  const file = selectedFiles.value[0];
  const htmlContent = await file.text();

  const deployData = {
    html: htmlContent,
    siteName: repoName.value,
    description: repoDescription.value || "",
  };

  emit("deploy", deployData);

  // 清空表單
  selectedFiles.value = [];
  repoName.value = "ezpage";
  repoDescription.value = "";
};
</script>
