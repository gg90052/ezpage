<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 lg:p-8 min-h-[400px] flex flex-col"
  >
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
    <div class="mb-4 lg:mb-6 flex-grow flex flex-col">
      <label
        for="htmlTextarea"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        貼上你的 HTML 程式碼
      </label>
      <textarea
        id="htmlTextarea"
        :value="modelValue"
        @input="handleInput"
        @blur="validateHtml"
        rows="8"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none font-mono text-sm flex-grow min-h-[200px]',
          hasError
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
        ]"
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

      <!-- 錯誤訊息顯示區域 -->
      <div
        v-if="hasError && errorMessage"
        class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <div class="flex items-start">
          <svg
            class="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <p class="text-sm font-medium text-red-800">HTML 格式錯誤</p>
            <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <p v-else class="text-sm text-gray-500 mt-1">
        支援完整的 HTML 程式碼，包含 CSS 和 JavaScript
      </p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "validationChange"]);

// 驗證狀態
const hasError = ref(false);
const errorMessage = ref("");

// 處理輸入事件
const handleInput = (event) => {
  const value = event.target.value;
  emit("update:modelValue", value);

  // 清除錯誤狀態（在用戶輸入時）
  if (hasError.value) {
    hasError.value = false;
    errorMessage.value = "";
    emit("validationChange", { isValid: true, errorMessage: "" });
  }
};

// HTML 驗證函數
const validateHtml = () => {
  const content = props.modelValue?.trim();

  // 如果內容為空，不進行驗證
  if (!content) {
    hasError.value = false;
    errorMessage.value = "";
    emit("validationChange", { isValid: true, errorMessage: "" });
    return true;
  }

  try {
    // 首先檢查是否包含 HTML 標籤
    const hasHtmlTags = /<[^>]+>/g.test(content);
    if (!hasHtmlTags) {
      hasError.value = true;
      errorMessage.value = "請提供有效的 HTML 內容，不能只輸入純文字";
      emit("validationChange", {
        isValid: false,
        errorMessage: errorMessage.value,
      });
      return false;
    }

    // 創建一個臨時的 DOM 解析器來驗證 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // 檢查是否有解析錯誤
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      hasError.value = true;
      errorMessage.value = "HTML 語法不正確，請檢查標籤是否正確閉合";
      emit("validationChange", {
        isValid: false,
        errorMessage: errorMessage.value,
      });
      return false;
    }

    // 檢查是否輸入的純文字被自動包裝（這表示原始內容不是有效的 HTML）
    const bodyText = doc.body.textContent || "";
    const bodyHTML = doc.body.innerHTML || "";

    // 如果 body 的文字內容等於原始輸入內容，且沒有實際的 HTML 標籤，則為純文字
    if (bodyText.trim() === content.trim() && !bodyHTML.includes("<")) {
      hasError.value = true;
      errorMessage.value = "請提供有效的 HTML 內容，不能只輸入純文字";
      emit("validationChange", {
        isValid: false,
        errorMessage: errorMessage.value,
      });
      return false;
    }

    // 檢查是否有不匹配的標籤
    const openTags = content.match(/<[^\/][^>]*[^\/]>/g) || [];
    const closeTags = content.match(/<\/[^>]+>/g) || [];
    const selfClosingTags = content.match(/<[^>]+\/>/g) || [];

    // 基本的標籤平衡檢查（簡化版）
    const commonTags = [
      "html",
      "head",
      "body",
      "div",
      "span",
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "table",
      "tr",
      "td",
      "th",
    ];

    for (const tag of commonTags) {
      // 更簡單的方法：匹配所有開始標籤，然後減去自閉合標籤
      const allOpenTags =
        content.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, "gi")) || [];
      const selfClosingTags =
        content.match(new RegExp(`<${tag}(?:\\s[^>]*)?\\/>`, "gi")) || [];
      const openCount = allOpenTags.length - selfClosingTags.length;

      const closeCount = (content.match(new RegExp(`<\\/${tag}>`, "gi")) || [])
        .length;

      if (openCount !== closeCount) {
        hasError.value = true;
        errorMessage.value = `標籤 <${tag}> 沒有正確閉合（開始：${openCount}個，結束：${closeCount}個）`;
        emit("validationChange", {
          isValid: false,
          errorMessage: errorMessage.value,
        });
        return false;
      }
    }

    // 如果所有檢查都通過
    hasError.value = false;
    errorMessage.value = "";
    emit("validationChange", { isValid: true, errorMessage: "" });
    return true;
  } catch (error) {
    hasError.value = true;
    errorMessage.value = "HTML 內容解析失敗，請檢查格式是否正確";
    emit("validationChange", {
      isValid: false,
      errorMessage: errorMessage.value,
    });
    return false;
  }
};

// 監聽 modelValue 變化，在內容變化時進行驗證
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue?.trim()) {
      // 延遲驗證，避免在用戶輸入時立即顯示錯誤
      setTimeout(() => {
        validateHtml();
      }, 500);
    }
  },
  { immediate: true }
);

// 暴露驗證方法給父組件
defineExpose({
  validateHtml,
  hasError: () => hasError.value,
  getErrorMessage: () => errorMessage.value,
});
</script>
