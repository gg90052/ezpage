<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    :class="overlayClass"
  >
    <div class="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
      <div class="text-center">
        <!-- 旋轉Loading圖標 -->
        <div class="mb-4">
          <svg
            class="animate-spin h-12 w-12 mx-auto"
            :class="iconColorClass"
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
        </div>

        <!-- Loading文字 -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          {{ description }}
        </p>

        <!-- 進度條 (可選) -->
        <div
          v-if="showProgress"
          class="w-full bg-gray-200 rounded-full h-2 mb-4"
        >
          <div
            class="h-2 rounded-full animate-pulse"
            :class="progressBarClass"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <!-- 提示文字 -->
        <p v-if="hint" class="text-xs text-gray-500">
          {{ hint }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingOverlay",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "載入中...",
    },
    description: {
      type: String,
      default: "請稍候",
    },
    hint: {
      type: String,
      default: null,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 70,
      validator: (value) => value >= 0 && value <= 100,
    },
    color: {
      type: String,
      default: "indigo",
      validator: (value) =>
        ["indigo", "blue", "green", "red", "yellow", "purple"].includes(value),
    },
    overlayClass: {
      type: String,
      default: "",
    },
  },
  computed: {
    progressPercent() {
      return Math.min(Math.max(this.progress, 0), 100);
    },
    iconColorClass() {
      const colorMap = {
        indigo: "text-indigo-600",
        blue: "text-blue-600",
        green: "text-green-600",
        red: "text-red-600",
        yellow: "text-yellow-600",
        purple: "text-purple-600",
      };
      return colorMap[this.color] || "text-indigo-600";
    },
    progressBarClass() {
      const colorMap = {
        indigo: "bg-indigo-600",
        blue: "bg-blue-600",
        green: "bg-green-600",
        red: "bg-red-600",
        yellow: "bg-yellow-600",
        purple: "bg-purple-600",
      };
      return colorMap[this.color] || "bg-indigo-600";
    },
  },
};
</script>
