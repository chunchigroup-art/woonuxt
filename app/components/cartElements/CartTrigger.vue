<script setup>
import { watch, computed } from 'vue'

// 1. 引入现有的 useCart
const { cart } = useCart();

// 2. ⚡【核心修改】动态提取本地 Token 并构建安全的后台归化跳转链接
const handleCartNavigation = (event) => {
  // 阻止 <a> 标签的默认无参数跳转
  event.preventDefault();

  // 严谨地提取前端的 woocommerce-session (带横杠)
  const getWooToken = () => {
    const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
    if (match && match[2]) return match[2];
    
    // 备用兼容下划线
    const fallbackMatch = document.cookie.match(new RegExp('(^| )woocommerce_session=([^;]+)'));
    return fallbackMatch ? fallbackMatch[2] : null;
  };

  const token = getWooToken();

  if (token) {
    // 带着同域归化令牌跳往实际的 cms 后台，彻底击碎 Lax 限制！
    window.location.href = `https://cms.chunchitools.com/cart/?woo_sync_sess=${token}`;
  } else {
    // 兜底：如果没拿到 token（比如购物车本来就是空的），正常跳转到后台
    window.location.href = 'https://cms.chunchitools.com/cart/';
  }
};

// 3. 动画监听器：动态计算购物车内商品的总数量
const cartItemsCount = computed(() => {
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
    href="#"
    @click="handleCartNavigation"
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