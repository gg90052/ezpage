<template>
  <div class="mb-2 bg-white rounded-lg shadow-md border border-blue-200">
    <div
      class="p-4 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
      @click="toggleShow"
    >
      <div class="flex items-center justify-between">
        <span class="text-gray-700">
          部署上去的網頁大約要30秒~1分鐘才會生效。
          <span class="text-blue-600 hover:text-blue-800 font-medium"
            >如何看進度？</span
          >
        </span>
        <svg
          :class="[
            'w-5 h-5 text-gray-500 transition-transform duration-200',
            isExpanded ? 'rotate-180' : '',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>

    <div
      v-if="isExpanded"
      class="px-4 pb-4 border-t border-gray-100 bg-blue-50"
    >
      <div class="pt-4 space-y-4 text-sm text-gray-700">
        <div class="font-medium text-gray-800 mb-4">📋 查看部署進度步驟：</div>

        <!-- 步驟 1 -->
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
              >1</span
            >
            <div class="flex-1">
              <div class="mb-2">
                在下方的 Repository 列表中，找到您剛才部署的專案，點擊右側的
                <strong>「查看原始碼」</strong> 按鈕
              </div>
              <div class="bg-white p-2 rounded border">
                <img
                  :src="deployInfo1"
                  alt="步驟1：點擊查看代碼按鈕"
                  class="w-full max-w-md mx-auto rounded shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- 步驟 2 -->
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
              >2</span
            >
            <div class="flex-1">
              <div class="mb-2">
                進入 GitHub
                頁面後，在上面可以看到目前部署的進度，如果有土黃色圈圈代表正在進行中。
              </div>
              <div class="bg-white p-2 rounded border">
                <img
                  :src="deployInfo2"
                  alt="步驟2：點擊 Actions 標籤"
                  class="w-full max-w-lg mx-auto rounded shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- 步驟 3 -->
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
              >3</span
            >
            <div class="flex-1">
              <div class="mb-2">
                點擊土黃色圈圈會告訴你他目前正在執行哪個動作，如果完成會變成綠色勾勾。
              </div>
              <div class="bg-white p-2 rounded border">
                <img
                  :src="deployInfo3"
                  alt="步驟3：查看部署工作流程"
                  class="w-full max-w-md mx-auto rounded shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- 步驟 4 -->
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
              >4</span
            >
            <div class="flex-1">
              <div class="mb-2">
                當全部動作都完成時外面就會變成綠勾勾，這時候代表已經部署完成，可以回到EZPage點擊「查看網站」按鈕看上傳上去的網頁囉。
              </div>
              <div class="bg-white p-2 rounded border">
                <img
                  :src="deployInfo4"
                  alt="步驟4：查看詳細執行狀態"
                  class="w-full max-w-lg mx-auto rounded shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div class="flex items-start space-x-2">
            <span class="text-yellow-600 text-lg">💡</span>
            <div class="text-yellow-800">
              <strong>小提示：</strong>
              <ul class="mt-1 space-y-1 text-sm">
                <li>• 部署通常需要 30 秒到 1 分鐘的時間</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 引入圖片
import deployInfo1 from "../assets/deployInfo1.png";
import deployInfo2 from "../assets/deployInfo2.png";
import deployInfo3 from "../assets/deployInfo3.png";
import deployInfo4 from "../assets/deployInfo4.png";

const isExpanded = ref(false);

const toggleShow = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
