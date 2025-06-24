<template>
  <!-- 聯絡作者資訊欄 -->
  <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="h-5 w-5 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-blue-700">
          <span class="font-medium">需要協助或有建議？</span>
          歡迎透過
          <a
            href="mailto:icimcse100@gmail.com"
            class="underline hover:text-blue-800 transition-colors"
            >email</a
          >
          或
          <a
            href="https://github.com/gg90052/ezpage/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:text-blue-800 transition-colors"
            >GitHub Issues</a
          >
          聯絡我，也歡迎賞賜分享圖片(og:image)
        </p>
      </div>
    </div>
  </div>

  <!-- 響應式網格布局：當兩個區塊都顯示時為雙欄，否則單欄佔滿寬度 -->
  <div
    :class="[
      'gap-6 lg:gap-8 mb-8',
      selectedFiles.length === 0 && !htmlTextContent.trim()
        ? 'grid grid-cols-1 lg:grid-cols-2'
        : 'flex justify-center',
    ]"
  >
    <!-- HTML 純文字輸入區塊 - 只在沒有選擇檔案時顯示 -->
    <div
      v-if="selectedFiles.length === 0"
      :class="[htmlTextContent.trim() ? 'w-full max-w-4xl' : '']"
    >
      <HtmlTextInput
        v-model="htmlTextContent"
        @validation-change="handleHtmlValidationChange"
      >
        <RepositorySettings
          v-if="htmlTextContent.trim()"
          v-model:repo-name="textRepoName"
          v-model:description="textRepoDescription"
          :repositories="repositories"
          :is-paid-user="isPaidUser"
          :is-deploying="isDeploying"
          :can-deploy="!!htmlTextContent.trim() && isHtmlValid"
          deploy-button-text="部署 HTML 程式碼"
          placeholder="請輸入網站名稱"
          @deploy="handleTextDeploy"
        />
      </HtmlTextInput>

      <!-- Repository 設定 - HTML 純文字 -->
    </div>

    <!-- 檔案上傳區塊 - 只在HTML文字內容為空時顯示 -->
    <div
      v-if="!htmlTextContent.trim()"
      :class="[selectedFiles.length > 0 ? 'w-full max-w-4xl' : '']"
    >
      <!-- 檔案上傳區域 - 當有檔案時隱藏 -->
      <FileUploadArea
        v-if="selectedFiles.length === 0"
        :is-deploying="isDeploying"
        @file-selected="handleFileSelected"
        @notification="handleNotification"
      />

      <!-- 檔案列表 -->
      <div
        v-if="selectedFiles.length > 0"
        class="bg-white rounded-lg shadow-md p-6 lg:p-8"
      >
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

        <FileList
          :files="selectedFiles"
          :is-deploying="isDeploying"
          @remove-file="removeFile"
        />

        <!-- Repository 設定 - 檔案上傳 -->
        <RepositorySettings
          v-model:repo-name="fileRepoName"
          v-model:description="fileRepoDescription"
          :repositories="repositories"
          :is-paid-user="isPaidUser"
          :is-deploying="isDeploying"
          :can-deploy="selectedFiles.length > 0"
          :deploy-button-text="getDeployButtonText()"
          placeholder="請輸入網站名稱"
          @deploy="handleFileDeploy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HtmlTextInput from "./HtmlTextInput.vue";
import FileUploadArea from "./FileUploadArea.vue";
import FileList from "./FileList.vue";
import RepositorySettings from "./RepositorySettings.vue";

defineProps({
  isDeploying: {
    type: Boolean,
    default: false,
  },
  isPaidUser: {
    type: Boolean,
    default: false,
  },
  repositories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["deploy", "notification"]);

// HTML 純文字相關
const htmlTextContent = ref("");
const textRepoName = ref("");
const textRepoDescription = ref("");

// HTML 驗證狀態
const isHtmlValid = ref(true);
const htmlValidationError = ref("");

// 檔案上傳相關
const selectedFiles = ref([]);
const fileRepoName = ref("");
const fileRepoDescription = ref("");

// 輔助函數
const isZipFile = (file) => {
  return file.name.toLowerCase().endsWith(".zip");
};

const getDeployButtonText = () => {
  if (selectedFiles.value.length === 0) return "部署檔案";
  const file = selectedFiles.value[0];
  return isZipFile(file) ? "部署 ZIP 檔案" : "部署 HTML 檔案";
};

// HTML 驗證狀態變更處理
const handleHtmlValidationChange = (validation) => {
  isHtmlValid.value = validation.isValid;
  htmlValidationError.value = validation.errorMessage || "";
};

// HTML 純文字部署
const handleTextDeploy = async () => {
  // 檢查 HTML 是否有效
  if (!isHtmlValid.value) {
    emit("notification", "請修正 HTML 格式錯誤後再進行部署");
    return;
  }

  if (!textRepoName.value || !htmlTextContent.value.trim()) return;

  const deployData = {
    html: htmlTextContent.value,
    siteName: textRepoName.value,
    description: textRepoDescription.value || "",
  };

  emit("deploy", deployData);

  // 清空表單
  htmlTextContent.value = "";
  textRepoName.value = "";
  textRepoDescription.value = "";
  isHtmlValid.value = true;
  htmlValidationError.value = "";
};

// 檔案處理
const handleFileSelected = (file) => {
  selectedFiles.value = [file]; // 只取一個檔案
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const handleNotification = (message) => {
  emit("notification", message);
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
  fileRepoName.value = "";
  fileRepoDescription.value = "";
};
</script>
