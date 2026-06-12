<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 1. 捕获底栏筛选分类别名
const activeCategorySlug = computed(() => route.query.category as string || '');

// 2. 动态检测当前网站语言
const { locale } = useI18n?.() || { locale: ref('en') };
const currentLanguageCode = computed(() => locale.value.toUpperCase());

// 3. 全量抓取，100% 免疫多语言插件拦截
const { data: rawPosts, pending, refresh } = await useAsyncData(
  'blog-posts-universal-safe',
  async () => {
    try {
      const response = await $fetch('/api/graphql', {
        method: 'POST',
        body: {
          query: `
            query GetUniversalPosts {
              posts(first: 100) {
                nodes {
                  id
                  title
                  slug
                  date
                  excerpt
                  categories {
                    nodes {
                      name
                      slug
                    }
                  }
                  featuredImage {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          `
        }
      });
      return response?.data?.posts?.nodes || [];
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
  }
);

// 4. 前端过滤兼容逻辑
const filteredPosts = computed(() => {
  if (!rawPosts.value) return [];
  if (!activeCategorySlug.value) return rawPosts.value;
  
  return rawPosts.value.filter((post: any) => {
    const postCategories = post.categories?.nodes || [];
    return postCategories.some((cat: any) => {
      const cleanSlug = cat.slug.toLowerCase();
      const targetSlug = activeCategorySlug.value.toLowerCase();
      return cleanSlug === targetSlug || cleanSlug.startsWith(`${targetSlug}-`);
    });
  });
});

// 英文时间格式化
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

useSeoMeta({
  title: activeCategorySlug.value ? `Resources - ${activeCategorySlug.value.toUpperCase()}` : 'Our Blog & Case Studies',
});
</script>

<template>
  <div class="bg-slate-50/50 min-h-screen">
    <div class="bg-white border-b border-slate-100 py-14">
      <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              <span>Knowledge Center</span>
              <span class="text-slate-300">/</span>
              <span class="text-slate-500">{{ activeCategorySlug ? activeCategorySlug.replace('-', ' ') : 'All Resources' }}</span>
            </div>
            
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight capitalize">
              {{ activeCategorySlug ? activeCategorySlug.replace('-', ' ') : 'Our Blog & Knowledge Base' }}
            </h1>
            <p class="text-sm sm:text-base text-slate-500 mt-2.5 leading-relaxed">
              Explore professional HVAC/R tool applications, technical guides, and real-world factory production success cases.
            </p>
          </div>
          
          <button 
            @click="() => refresh()" 
            class="self-start md:self-center inline-flex items-center gap-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs px-4 py-2 rounded-lg transition-all duration-200 hover:border-slate-300 active:scale-98"
          >
            <span class="inline-block transition-transform" :class="{ 'animate-spin': pending }">🔄</span>
            <span>Sync Content</span>
          </button>
        </div>
      </div>
    </div>

    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse">
          <div class="aspect-video w-full bg-slate-200 rounded-xl"></div>
          <div class="h-4 bg-slate-200 rounded-sm w-1/3"></div>
          <div class="h-6 bg-slate-200 rounded-sm w-3/4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-slate-100 rounded-sm w-full"></div>
            <div class="h-3 bg-slate-100 rounded-sm w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else-if="!filteredPosts || filteredPosts.length === 0" class="max-w-md mx-auto text-center py-20 px-6 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <span class="text-2xl">📄</span>
        </div>
        <h3 class="text-base font-bold text-slate-900">No Articles Found</h3>
        <p class="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
          There are currently no published updates under this specific catalog filter.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
          <div class="aspect-video w-full bg-slate-100 overflow-hidden relative border-b border-slate-50 shrink-0">
            <img 
              v-if="post.featuredImage?.node?.sourceUrl" 
              :src="post.featuredImage.node.sourceUrl" 
              class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
              alt="chunchi-resources-thumb"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 gap-1.5">
              <span class="text-xl group-hover:rotate-12 transition-transform">🔧</span>
              <span class="text-[10px] uppercase tracking-widest font-semibold text-slate-400">CHUNCHI TOOLS</span>
            </div>
            
            <div v-if="post.categories?.nodes?.length" class="absolute top-3 left-3 z-10">
              <span class="text-[10px] font-bold bg-slate-950/80 text-white px-2.5 py-1 rounded-md backdrop-blur-xs tracking-wider uppercase">
                {{ post.categories.nodes[0].name }}
              </span>
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <span>📅</span>
                <span>{{ formatDate(post.date) }}</span>
              </div>
              
              <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                {{ post.title }}
              </h2>
              
              <p class="text-xs sm:text-sm text-slate-500 mt-3 line-clamp-3 leading-relaxed" v-html="post.excerpt"></p>
            </div>

            <NuxtLink 
              :to="'/blog/' + post.slug" 
              class="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
            >
              <span>Read Full Article</span>
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                <span class="transform group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </NuxtLink>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<style scoped>
:deep(p) {
  margin: 0;
  color: inherit;
}
</style>