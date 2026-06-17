<template>
  <div class="max-w-xl mx-auto text-center py-20 px-4">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
    <p class="text-gray-600 mb-6">Your order <span class="font-semibold text-blue-600">#{{ orderId }}</span> has been placed successfully.</p>
    <p class="text-sm text-gray-500 mb-8">Our HVAC engineering team will review your business request and contact you via email shortly.</p>
    <NuxtLink to="/" class="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition">
      Back to Homepage
    </NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute();
// 从 URL 中安全获取后端带过来的 order_id 变量
const orderId = computed(() => route.query.order_id || '');

// TODO: 这里可以非常方便地触发 Facebook Lead / Purchase Ads 像素追踪
onMounted(() => {
  if (orderId.value && window.fbq) {
    // fbq('track', 'Purchase', { value: 0.00, currency: 'USD' });
  }
});
</script>