<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md">
      <div class="flex items-center mb-4">
        <svg
          class="w-6 h-6 text-red-600 mr-3"
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
        <h3 class="text-lg font-semibold text-gray-900">確認刪除</h3>
      </div>
      <p class="text-gray-600 mb-6">
        您確定要刪除 repository
        <span class="font-semibold text-gray-900">{{ repositoryName }}</span>
        嗎？
        <br />
        <span class="text-sm text-red-600">此操作無法復原。</span>
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          取消
        </button>
        <button
          @click="$emit('confirm')"
          class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          確認刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteConfirmDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    repositoryName: {
      type: String,
      default: "",
    },
  },
  emits: ["confirm", "cancel"],
};
</script>
