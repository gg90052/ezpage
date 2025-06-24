<template>
  <div v-if="files.length > 0" class="mt-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">已選擇的檔案</h3>
    <div class="space-y-2">
      <div
        v-for="(file, index) in files"
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
          @click="$emit('removeFile', index)"
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
</template>

<script setup>
defineProps({
  files: {
    type: Array,
    default: () => [],
  },
  isDeploying: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["removeFile"]);

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
</script>
