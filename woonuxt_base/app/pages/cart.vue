<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue';

const { cart, isCartMutating, refreshCart } = useCart();

definePageMeta({
  title: 'Cart',
});

useSeoMeta({
  title: 'Shopping Cart',
  description: 'View and manage items in your shopping cart',
});

// 💡 引入一个“只允许执行一次”的开关锁，防止死循环轰炸服务器
const hasInitialRefreshed = ref(false);

onMounted(async () => {
  if (typeof window !== 'undefined' && !hasInitialRefreshed.value) {
    hasInitialRefreshed.value = true; // 立刻上锁
    if (refreshCart) {
      try {
        await refreshCart();
      } catch (err) {
        console.error('Initial cart sync blocked:', err);
      }
    }
  }
});

// 💡 仅做状态记录，绝不在里面调用任何会触发重新请求的逻辑，防止请求套娃
watch(() => cart.value?.isEmpty, (isEmpty) => {
  if (isEmpty && isCartMutating?.value === false) {
    console.log('Cart synchronized and identified as empty.');
  }
});

// 🌟 核心：动态拼接 URL 序列，完美绕过任何跨域限制直接塞满后台结算台
const checkoutUrl = computed(() => {
  if (!cart.value || cart.value.isEmpty || !cart.value.contents?.nodes) {
    return 'https://shop.chunchitools.com/checkout/';
  }

  // 1. 提取商品 ID 或变体 ID 数组
  const productIds = cart.value.contents.nodes
    .map((item: any) => item.variation?.node?.databaseId || item.product?.node?.databaseId || item.databaseId)
    .filter(Boolean)
    .join(',');

  // 2. 提取对应商品的数量数组
  const quantities = cart.value.contents.nodes
    .map((item: any) => item.quantity)
    .filter((q: any) => q !== undefined)
    .join(',');

  // 3. 完美封装：直接跳转到 shop 独立域名
  const backendBaseUrl = 'https://shop.chunchitools.com/checkout/';
  
  return `${backendBaseUrl}?add-to-cart=${productIds}&quantity=${quantities}`;
});

// 🚀 强力执行一次性全量出海结算（已正确提取到 Computed 外部）
const handleProceedToCheckout = (e: Event) => {
  e.preventDefault(); // 拦截 a 标签默认行为
  e.stopPropagation(); // 🌟 新增：严格阻止事件冒泡，防止被 Nuxt 框架内部的路由拦截器抓取
  if (isCartMutating.value) return;

  if (checkoutUrl.value) {
    // 干净利落地一键甩到真实的 shop. 子域结算页
    window.location.href = checkoutUrl.value;
  }
};
</script>

<template>
  <main class="container my-16 min-h-150 items-center flex flex-col px-4 sm:px-6 lg:px-8">
    <ClientOnly>
      <div v-if="cart && !cart.isEmpty" class="grid lg:grid-cols-3 gap-8 lg:gap-12 w-full">
        <div class="lg:col-span-2">
          <ul class="flex flex-col gap-4">
            <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item="item" />
          </ul>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 bg-white rounded-xl shadow-xs p-6 border border-slate-100">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <h2 class="text-lg font-bold text-slate-900">{{ $t('shop.orderSummary') }}</h2>
              <button 
                @click="() => refreshCart?.()" 
                class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                title="Sync from server"
              >
                <span>🔄</span> Sync
              </button>
            </div>

            <div class="space-y-3 mb-6 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>{{ $t('shop.subtotal') }}</span>
                <span class="font-semibold text-slate-900 tabular-nums" v-html="cart.subtotal"></span>
              </div>

              <div v-if="cart.shippingTotal" class="flex justify-between text-slate-600">
                <span>{{ $t('general.shipping') }}</span>
                <span class="font-medium text-slate-900 tabular-nums"> 
                  {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} <span v-html="cart.shippingTotal"></span> 
                </span>
              </div>

              <div v-if="cart.discountTotal && parseFloat(cart.rawDiscountTotal || '0') > 0" class="flex justify-between text-emerald-600">
                <span>{{ $t('shop.discount') }}</span>
                <span class="font-semibold tabular-nums">- <span v-html="cart.discountTotal"></span></span>
              </div>

              <div class="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span class="text-base font-bold text-slate-900">{{ $t('shop.total') }}</span>
                <span class="text-xl font-extrabold text-blue-600 tabular-nums" v-html="cart.total"></span>
              </div>
            </div>

            <a
              href="#"
              @click="handleProceedToCheckout"
              :class="[
                'w-full flex items-center justify-center py-3 text-white rounded-lg font-bold transition-all text-center cursor-pointer',
                isCartMutating ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              <span v-if="isCartMutating" class="flex items-center gap-2">
                <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ $t('general.updating') }}
              </span>
              <span v-else class="mx-2">{{ $t('shop.checkout') }}</span>
            </a>
          </div>
        </div>
      </div>

      <EmptyCartMessage v-else-if="cart && cart.isEmpty" />

      <div v-else class="flex flex-col items-center justify-center min-h-100 space-y-3">
        <LoadingIcon class="animate-spin text-blue-600 w-8 h-8" />
        <p class="text-xs text-slate-400">Loading your strategic sourcing cart...</p>
      </div>
    </ClientOnly>
  </main>
</template>