<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';

const route = useRoute();
// 精准捕获 URL 中的二级路由别名（slug）
const postSlug = computed(() => route.params.slug as string || '');

// 从 WordPress 抓取单篇文章的完整核心内容
const { data: postData, pending } = await useAsyncData(
  () => `post-detail-universal-${postSlug.value}`,
  async () => {
    if (!postSlug.value) return null;
    try {
      const response = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: `
            query GetSinglePostBySlug($id: ID!) {
              post(id: $id, idType: SLUG) {
                title
                content
                date
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                categories {
                  nodes {
                    name
                  }
                }
              }
            }
          `,
          variables: {
            id: postSlug.value
          }
        }
      });
      return response?.data?.post || null;
    } catch (error) {
      console.error('Failed to fetch post detail via GraphQL:', error);
      return null;
    }
  },
  { watch: [postSlug] }
);

// 后面保持不变 ...
// 格式化英文企业时间
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 动态注入 SEO Meta，有利于独立站的 Google 关键词收录
watch(postData, (newVal) => {
  if (newVal) {
    useSeoMeta({
      title: `${newVal.title} - CHUNCHI TOOLS`,
      description: newVal.title,
    });
  }
}, { immediate: true });
</script>

<template>
  <div class="bg-slate-50/50 min-h-screen py-12 sm:py-16">
    <div class="container max-w-4xl mx-auto px-4 sm:px-6">
      
      <NuxtLink to="/blog" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8 group">
        <span class="inline-block transition-transform group-hover:-translate-x-0.5">←</span> 
        <span>Back to Knowledge Base</span>
      </NuxtLink>

      <div v-if="pending" class="bg-white rounded-2xl p-8 sm:p-12 shadow-xs border border-slate-100 animate-pulse space-y-6">
        <div class="h-4 bg-slate-200 rounded-sm w-1/4"></div>
        <div class="h-8 bg-slate-200 rounded-sm w-3/4"></div>
        <div class="aspect-video w-full bg-slate-100 rounded-xl"></div>
      </div>

      <div v-else-if="!postData" class="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-xs max-w-md mx-auto">
        <span class="text-3xl block mb-3">🔍</span>
        <h2 class="text-base font-bold text-slate-900">Article Not Found</h2>
        <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
          The requested technical resource could not be retrieved. It may have been archived or its URL slug updated.
        </p>
        <NuxtLink to="/blog" class="mt-5 inline-block text-xs font-bold text-blue-600 hover:underline">
          Return to Blog List
        </NuxtLink>
      </div>

      <article v-else class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        
        <div v-if="postData.featuredImage?.node?.sourceUrl" class="aspect-video w-full bg-slate-100 relative border-b border-slate-50">
          <img :src="postData.featuredImage.node.sourceUrl" class="w-full h-full object-cover" alt="chunchi-post-cover" />
        </div>

        <div class="p-6 sm:p-10">
          <div class="flex items-center gap-3 text-xs font-medium text-slate-400 mb-4">
            <span v-if="postData.categories?.nodes?.length" class="bg-slate-950 text-white px-2.5 py-0.5 rounded-md font-bold text-[9px] tracking-wider uppercase">
              {{ postData.categories.nodes[0].name }}
            </span>
            <span class="text-slate-200">•</span>
            <span>Published on {{ formatDate(postData.date) }}</span>
          </div>

          <h1 class="text-xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight mb-8">
            {{ postData.title }}
          </h1>

          <div class="wp-rich-content text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-8" v-html="postData.content"></div>
        </div>

      </article>

    </div>
  </div>
</template>

<style scoped>
/* 💡 深度定制：让 WP 后台录入的 H2, H3, 段落, 强壮体在 Nuxt 前端 100% 漂亮渲染 */
.wp-rich-content :deep(h2) {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}
.wp-rich-content :deep(h3) {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.wp-rich-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}
.wp-rich-content :deep(ol), .wp-rich-content :deep(ul) {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}
.wp-rich-content :deep(li) {
  margin-bottom: 0.6rem;
  list-style-type: disc;
}
.wp-rich-content :deep(ol li) {
  list-style-type: decimal;
}
.wp-rich-content :deep(strong) {
  color: #0f172a;
  font-weight: 700;
}
</style>