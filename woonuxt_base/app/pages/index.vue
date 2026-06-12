<script lang="ts" setup>
import { ProductsOrderByEnum } from '#gql/default';
const { siteName, description, shortDescription, siteImage } = useAppConfig();

// 获取分类数据
const { data } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value?.productCategories?.nodes || [];

// 获取热门商品数据
const { data: productData } = await useAsyncGql('getProducts', { first: 5, orderby: ProductsOrderByEnum.Popularity });
const popularProducts = productData.value?.products?.nodes || [];

// ✨新品：按上架日期倒序拿新品
const { data: newArrivalsData } = await useAsyncGql('getProducts', { 
  first: 5, 
  orderby: ProductsOrderByEnum.Date 
});
const newArrivalsProducts = newArrivalsData.value?.products?.nodes || [];

// SEO 配置（移入script内部）
useSeoMeta({
  title: `Home`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});

// B2B优势卡片数组
const b2bFeatures = [
  { 
    title: 'Global Logistics', 
    desc: 'Flexible shipping from express to full containers, perfectly optimized for your specific order size.', 
    icon: '/icons/box.svg' 
  },
  { 
    title: 'Expert HVAC Support', 
    desc: 'Deep technical expertise in refrigeration tools, providing professional engineering guidance for projects.', 
    icon: '/icons/moneyback.svg' 
  },
  { 
    title: 'One-Stop Sourcing', 
    desc: 'Comprehensive range from manifolds to vacuum pumps, simplifying your entire B2B procurement.', 
    icon: '/icons/secure.svg' 
  },
  { 
    title: 'Wholesale Pricing', 
    desc: 'Competitive factory-direct rates and bulk discounts, designed to maximize margins for wholesalers.', 
    icon: '/icons/support.svg' 
  }
];
</script>

<template>
  <main>
    <!-- 1. Hero Banner 区域 -->
    <HeroBanner />

    <!-- 2. B2B 优势板块 (取代了旧的 ReasonsToShop) -->
    <section class="container grid gap-6 my-16 md:my-24 md:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="item in b2bFeatures" 
        :key="item.title" 
        class="flex flex-col p-8 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full"
      >
        <!-- 图标与标题行 -->
        <div class="flex items-center gap-4 mb-4">
          <img :src="item.icon" width="48" height="48" :alt="item.title" class="flex-shrink-0" loading="lazy" />
          <!-- 通过 min-h-[3rem] 强制标题占位，解决 1 行与 2 行标题导致的不对齐问题 -->
          <h3 class="text-lg font-bold leading-tight text-slate-900 min-h-[3rem] flex items-center">
            {{ item.title }}
          </h3>
        </div>

        <!-- 描述文字 -->
        <p class="text-sm text-slate-500 leading-relaxed">
          {{ item.desc }}
        </p>
      </div>
    </section>

    <!-- 3. 产品分类区域 -->
    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('shop.shopByCategory') }}</h2>
        <NuxtLink class="text-primary-dark font-medium" to="/categories">{{ $t('general.viewAll') }}</NuxtLink>
      </div>
      <div class="grid justify-center grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-6">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
    </section>

    <!-- ✨ 4. 热门商品区域 (Popular Products) -->
    <section v-if="popularProducts && popularProducts.length" class="container my-16 md:my-24">
      <div class="flex items-end justify-between border-b border-slate-100 pb-4">
        <h2 class="text-lg font-bold md:text-2xl text-slate-900">Popular Products</h2>
        <NuxtLink class="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors" to="/products">
          View All →
        </NuxtLink>
      </div>
      <!-- 渲染热门商品数据 -->
      <ProductRow :products="popularProducts" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8 gap-6" />
    </section>

    <!-- ✨ 4.5 New Arrivals 新品速递板块 -->
    <section v-if="newArrivalsProducts && newArrivalsProducts.length" class="container my-16 md:my-24">
      <div class="flex items-end justify-between border-b border-slate-100 pb-4">
        <div>
          <span class="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-1">Latest Innovations</span>
          <h2 class="text-lg font-bold md:text-2xl text-slate-900">New Arrivals</h2>
        </div>
        <NuxtLink class="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center group" to="/products">
          View All New Tools 
          <span class="transform group-hover:translate-x-1 transition-transform ml-1">→</span>
        </NuxtLink>
      </div>

      <!-- 💡 核心修复：只绑定专属于新品的变量 newArrivalsProducts -->
      <ProductRow 
        :products="newArrivalsProducts" 
        class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8 gap-6" 
      />
    </section>

    <!-- ✨ 5. 工厂实力与 OEM/ODM 定制服务区域 -->
    <ClientOnly>
      <div class="w-full bg-white transition-colors duration-300 py-4">
        <ManufacturingService class="container" />
      </div>
    </ClientOnly>

    <!-- ✨ 6. [新增] 全球客户评价信任区（放在询盘表单前，完美建立临门一脚的信任） -->
    <ClientOnly>
      <div class="w-full bg-white transition-colors duration-300 py-2">
        <Testimonials class="container" />
      </div>
    </ClientOnly>

    <!-- ✨ 7. 大宗采购询盘表单入口 -->
    <ClientOnly>
      <div id="rfq-section" class="w-full bg-white transition-colors duration-300 py-2">
        <InquiryForm class="container" />
      </div>
    </ClientOnly>

  </main>
</template>

<style scoped>
/* 针对 B2B 风格的微调 */
.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>