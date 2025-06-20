<template>
  <!-- 響應式網格布局：手機版單欄，桌面版雙欄 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
    <!-- HTML 純文字輸入區塊 -->
    <div class="bg-white rounded-lg shadow-md p-6 lg:p-8">
      <h2
        class="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center"
      >
        <svg
          class="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        HTML 程式碼輸入
      </h2>

      <!-- HTML 文字區域 -->
      <div class="mb-4 lg:mb-6">
        <label
          for="htmlTextarea"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          貼上你的 HTML 程式碼
        </label>
        <textarea
          id="htmlTextarea"
          v-model="htmlTextContent"
          rows="8"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          placeholder="<!DOCTYPE html>
<html>
<head>
    <title>我的網站</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>"
        ></textarea>
        <p class="text-sm text-gray-500 mt-1">
          支援完整的 HTML 程式碼，包含 CSS 和 JavaScript
        </p>
      </div>

      <!-- Repository 設定 - HTML 純文字 -->
      <div v-if="htmlTextContent.trim()" class="mt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Repository 設定</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="textRepoName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Repository 名稱
            </label>
            <div class="relative">
              <input
                id="textRepoName"
                v-model="textRepoName"
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
              for="textRepoDescription"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              描述 (選填)
            </label>
            <input
              id="textRepoDescription"
              v-model="textRepoDescription"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="我的網站描述"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="handleTextDeploy"
            :disabled="!textRepoName || !htmlTextContent.trim() || isDeploying"
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
            {{ isDeploying ? "部署中..." : "部署 HTML 程式碼" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 檔案上傳區塊 -->
    <div class="bg-white rounded-lg shadow-md p-6 lg:p-8">
      <h2
        class="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center"
      >
        <svg
          class="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
            clip-rule="evenodd"
          />
        </svg>
        檔案上傳
      </h2>

      <!-- 上傳區塊 - 當有檔案或正在部署時隱藏 -->
      <div
        v-if="selectedFiles.length === 0 && !isDeploying"
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center hover:border-indigo-500 transition-colors"
        :class="{ 'border-indigo-500 bg-indigo-50': isDragOver }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleFileDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".html,.htm,.zip"
          @change="handleFileSelect"
          class="hidden"
        />

        <!-- 檔案上傳圖示 -->
        <svg
          class="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-gray-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p class="text-base lg:text-lg text-gray-600 mb-2">拖拽檔案到此處或</p>
        <button
          @click="$refs.fileInput.click()"
          class="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          選擇檔案
        </button>
        <p class="text-sm text-gray-500 mt-2">
          支援 <span class="font-medium">.html</span>、<span class="font-medium"
            >.htm</span
          >
          和 <span class="font-medium">.zip</span> 檔案
        </p>
        <p class="text-xs text-gray-400 mt-1">
          ZIP 檔案將自動解壓縮並部署所有內容
        </p>
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
              <!-- 檔案類型圖示 -->
              <svg
                v-if="isZipFile(file)"
                class="h-5 w-5 text-purple-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm5 2V4h4v2H8zm4 4H8v-2h4v2z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-indigo-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <div>
                <span class="text-sm text-gray-900">{{ file.name }}</span>
                <span class="text-xs text-gray-500 ml-2">
                  {{ formatFileSize(file.size) }}
                </span>
                <div v-if="isZipFile(file)" class="text-xs text-purple-600">
                  ZIP 檔案 - 將自動解壓縮
                </div>
              </div>
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

      <!-- Repository 設定 - 檔案上傳 -->
      <div v-if="selectedFiles.length > 0" class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Repository 設定</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="fileRepoName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Repository 名稱
            </label>
            <div class="relative">
              <input
                id="fileRepoName"
                v-model="fileRepoName"
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
              for="fileRepoDescription"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              描述 (選填)
            </label>
            <input
              id="fileRepoDescription"
              v-model="fileRepoDescription"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="我的網站描述"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="handleFileDeploy"
            :disabled="
              !fileRepoName || selectedFiles.length === 0 || isDeploying
            "
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
            {{ isDeploying ? "部署中..." : getDeployButtonText() }}
          </button>
        </div>
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

// HTML 純文字相關
const htmlTextContent = ref("");
const textRepoName = ref("ezpage");
const textRepoDescription = ref("");

// 檔案上傳相關
const selectedFiles = ref([]);
const fileRepoName = ref("ezpage");
const fileRepoDescription = ref("");
const isDragOver = ref(false);

// 輔助函數
const isZipFile = (file) => {
  return file.name.toLowerCase().endsWith(".zip");
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getDeployButtonText = () => {
  if (selectedFiles.value.length === 0) return "部署檔案";
  const file = selectedFiles.value[0];
  return isZipFile(file) ? "部署 ZIP 檔案" : "部署 HTML 檔案";
};

// HTML 純文字部署
const handleTextDeploy = async () => {
  if (!textRepoName.value || !htmlTextContent.value.trim()) return;

  const deployData = {
    html: htmlTextContent.value,
    siteName: textRepoName.value,
    description: textRepoDescription.value || "",
  };

  emit("deploy", deployData);

  // 清空表單
  htmlTextContent.value = "";
  textRepoName.value = "ezpage";
  textRepoDescription.value = "";
};

// 檔案處理
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
  const validFiles = files.filter(
    (file) =>
      file.type === "text/html" ||
      file.name.endsWith(".html") ||
      file.name.endsWith(".htm") ||
      file.name.endsWith(".zip")
  );

  if (validFiles.length > 0) {
    selectedFiles.value = [validFiles[0]]; // 只取第一個有效檔案
    const fileType = validFiles[0].name.endsWith(".zip") ? "ZIP" : "HTML";
    emit("notification", `已添加 ${fileType} 檔案`);
  } else {
    emit("notification", "請只上傳 HTML 檔案(.html, .htm)或 ZIP 檔案(.zip)");
  }
};

// 檔案部署
const handleFileDeploy = async () => {
  if (!fileRepoName.value || selectedFiles.value.length === 0) return;

  const file = selectedFiles.value[0];

  // 建立 FormData 來處理檔案上傳
  const formData = new FormData();
  formData.append("file", file);
  formData.append("siteName", fileRepoName.value);
  formData.append("description", fileRepoDescription.value || "");

  emit("deploy", formData, true); // 第二個參數表示這是檔案上傳

  // 清空表單
  selectedFiles.value = [];
  fileRepoName.value = "ezpage";
  fileRepoDescription.value = "";
};
</script>
