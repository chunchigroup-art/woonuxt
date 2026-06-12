<script setup>
import { watch, computed } from 'vue'

// 1. 引入现有的 useCart
const { cart } = useCart();

// 2. 动态计算跳转链接：抛弃传参，回归干干净净的纯净链接
const cartUrl = computed(() => {
  // 基础跳转域名（直接跳转到原生购物车页面 /cart/）
  // 此时无需在后面拼接任何参数，因为 Cookie 已经由 useCart.ts 提前写入浏览器底层
  return 'https://chunchitools.com/cart/';
});

// 3. 动画监听器：动态计算购物车内商品的总数量
const cartItemsCount = computed(() => {
  // 如果你的 GraphQL 返回了 itemCount 就用它，没有就用 nodes 的总长度兜底
  return cart.value?.contents?.itemCount ?? cart.value?.contents?.nodes?.length ?? 0;
});

watch(
  () => cartItemsCount.value,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      const trigger = document.querySelector('.cart-trigger');
      const badge = trigger?.querySelector('.cart-badge');
      if (badge) {
        badge.classList.add('animate-popIn');
        // 动画结束后移除类名，方便下一次加购时再次触发
        setTimeout(() => badge.classList.remove('animate-popIn'), 300);
      }
    }
  },
);
</script>

<template>
  <a 
    :href="cartUrl" 
    class="cart-trigger relative cursor-pointer inline-flex items-center" 
    title="Cart"
  >
    <Icon name="ion:cart-outline" size="22" class="mr-1 md:mr-0" />
    
    <ClientOnly>
      <Transition name="popIn" mode="out-in">
        <span
          v-if="cartItemsCount > 0"
          class="cart-badge bg-primary rounded-full text-white leading-none min-w-4 p-0.75 -top-1 -right-1 md:-right-2 text-[10px] absolute inline-flex justify-center items-center tabular-nums"
        >
          {{ cartItemsCount }}
        </span>
      </Transition>
    </ClientOnly>
  </a>
</template>

<style>
/* 数量红点缩放动画 */
.popIn-enter-active, 
.popIn-leave-active { 
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61); 
}
.popIn-enter-from, 
.popIn-leave-to { 
  transform: scale(0); 
}

/* 抛物或弹跳追加类名动画 */
.cart-badge.animate-popIn { 
  animation: cartPop 250ms cubic-bezier(0.2, 0.9, 0.3, 1.3); 
}

@keyframes cartPop { 
  50% { transform: scale(1.25); } 
  100% { background-color: var(--color-primary-dark); } 
}
</style>