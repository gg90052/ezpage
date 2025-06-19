<template>
  <div v-if="repositories.length > 0" class="bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      我的 GitHub Repositories
    </h2>
    <div class="space-y-4">
      <div
        v-for="repo in repositories"
        :key="repo.id"
        class="border rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-medium text-gray-900 mr-3">
                {{ repo.name }}
              </h3>
              <span
                v-if="repo.isPrivate"
                class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2"
              >
                私有
              </span>
              <span
                v-if="repo.hasPages"
                class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2"
              >
                GitHub Pages
              </span>
              <span
                v-if="repo.language"
                class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {{ repo.language }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              {{ repo.description }}
            </p>
            <div class="flex items-center text-xs text-gray-500 space-x-4">
              <span v-if="repo.stars > 0" class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                {{ repo.stars }}
              </span>
              <span v-if="repo.forks > 0" class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ repo.forks }}
              </span>
              <span>{{ formatDate(repo.updatedAt) }}</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <a
              :href="repo.url"
              target="_blank"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
            >
              查看代碼
            </a>
            <a
              v-if="repo.homepage"
              :href="repo.homepage"
              target="_blank"
              class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm hover:bg-indigo-200"
            >
              查看網站
            </a>
            <button
              @click="$emit('delete-repo', repo)"
              class="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
              title="刪除此repository"
            >
              <svg
                class="w-4 h-4 inline mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RepositoryList",
  props: {
    repositories: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["delete-repo"],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};
</script>
