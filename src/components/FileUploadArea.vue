<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 lg:p-8 min-h-[400px] flex flex-col"
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

    <!-- 上傳區塊 -->
    <div
      v-if="!isDeploying"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8 text-center hover:border-indigo-500 transition-colors flex-grow flex flex-col justify-center min-h-[280px]"
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

      <p class="text-base lg:text-lg text-gray-600 mb-2">拖曳檔案到此處或</p>
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
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  isDeploying: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["fileSelected", "notification"]);

const isDragOver = ref(false);

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    emit("fileSelected", files[0]);
  }
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
    const fileType = validFiles[0].name.endsWith(".zip") ? "ZIP" : "HTML";
    emit("fileSelected", validFiles[0]);
    emit("notification", `已添加 ${fileType} 檔案`);
  } else {
    emit("notification", "請只上傳 HTML 檔案(.html, .htm)或 ZIP 檔案(.zip)");
  }
};
</script>
