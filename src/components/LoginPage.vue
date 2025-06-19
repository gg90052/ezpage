<template>
  <div class="text-center">
    <div class="max-w-md mx-auto">
      <svg
        class="mx-auto h-24 w-24 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        歡迎使用 EZPage
      </h2>
      <p class="mt-4 text-lg text-gray-600">
        輕鬆上傳HTML檔案並自動部署到GitHub Pages
      </p>
      <p class="mt-2 text-sm text-gray-500 mb-8">
        請先使用GitHub帳號登入以開始使用服務
      </p>

      <!-- 主要登入按鈕 -->
      <button
        @click="$emit('login')"
        class="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-gray-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <svg
          class="w-6 h-6 mr-3 inline"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
        使用GitHub登入
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  emits: ["login"],
};
</script>
