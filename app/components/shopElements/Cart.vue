<script setup lang="ts">
import { useCookie } from 'nuxt/app'
const { cart } = useCart()

// ⚡【修正核心域名】统一指向 cms. 实际后台购物车
const WC_URL = 'https://cms.chunchitools.com'

// ⚡【修正 Cookie 键名】我们要提取的是后端 Lax 策略里那个 EYJ... 长 Token 令牌
const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
let cartToken = match && match[2] ? match[2] : '';

// ⚡【核心修改】放弃apiFetch全量同步，改为带 Token 直接降临后台
const goToWooCart = (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  
  console.log('正在执行工业工具同域归化安全跳转...');

  // 如果本地没拿到 token，普通跳转。拿到了，拼在 woo_sync_sess 后面带过去让后台强刷
  if (cartToken) {
    // 使用我们在 functions.php 第 8 部分里定义好的 woo_sync_sess 参数
    window.location.href = `${WC_URL}/cart/?woo_sync_sess=${encodeURIComponent(cartToken)}`
  } else {
    // 兜底：如果检测不到会话（比如从未加购过），直接跳往后台购物车
    window.location.href = `${WC_URL}/cart/`
  }
}
</script>

<template>
  <div class="cart-icon" @click="goToWooCart">
    <Icon name="ion:cart-outline" size="24" />
    <span v-if="cart?.contents?.nodes?.length" class="cart-count">
      {{ cart.contents.nodes.length }}
    </span>
  </div>
</template>

<style scoped>
.cart-icon {
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background: red;
  border-radius: 50%;
  padding: 0 4px;
}
</style>