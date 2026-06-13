<template>
  <div class="resources-container max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-slate-800 capitalize">
      {{ categoryTitle }}
    </h1>
    
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded">
      Failed to load resources. Please try again later.
    </div>
    
    <div v-else-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article v-for="post in posts" :key="post.id" class="border rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden flex flex-column justify-between">
        <div class="p-5">
          <h3 class="text-xl font-semibold text-slate-900 mb-3 hover:text-blue-600">
            <NuxtLink :to="`/blog/${post.slug}`" v-html="post.title?.rendered"></NuxtLink>
          </h3>
          <div class="text-gray-600 text-sm line-clamp-3 mb-4" v-html="post.excerpt?.rendered"></div>
        </div>
        
        <div class="px-5 pb-5 mt-auto border-t pt-3 flex justify-between items-center text-xs text-gray-400">
          <span>{{ new Date(post.date).toLocaleDateString() }}</span>
          <NuxtLink :to="`/blog/${post.slug}`" class="text-blue-500 font-medium hover:underline">Read More →</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="text-gray-500 py-12 text-center">
      No articles found in this category.
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

// 1. 获取当前 URL 里的参数（例如：blog, case-studies, hvac-r-guides）
const currentCategory = route.params.category 

// 2. 映射页面大标题
const categoryTitle = computed(() => {
  if (currentCategory === 'blog') return 'Our Blog'
  if (currentCategory === 'case-studies') return 'Case Studies'
  if (currentCategory === 'hvac-r-guides') return 'HVAC/R Guides'
  return 'Resources'
})

// 3. 映射 WordPress 后台对应的分类 ID (⚠️ 请根据你 WP 后台->文章->分类目录里的实际 ID 修改下面数字)
const categoryIdMap = {
  'blog': 2,           // 假设 WP 中 Blog 分类 ID 为 2
  'case-studies': 5,   // 假设 WP 中 案例 分类 ID 为 5
  'hvac-r-guides': 8   // 假设 WP 中 指南 分类 ID 为 8
}

const targetId = categoryIdMap[currentCategory] || 0

// 4. 动态发起网络请求，只抓取当前分类下的文章
const { data: posts, pending, error } = await useFetch(`${config.public.wpRestUrl}/wp/v2/posts`, {
  params: {
    categories: targetId, // 过滤分类
    per_page: 9,          // 每页显示数
  },
  credentials: 'include',
  pick: ['id', 'title', 'excerpt', 'slug', 'date']
})
</script>