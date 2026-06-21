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
  
  const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
  const token = match && match[2] ? match[2] : '';

  if (token) {
    window.location.href = `https://cms.chunchitools.com/cart/?woo_sync_sess=${encodeURIComponent(token)}`
  } else {
    window.location.href = 'https://cms.chunchitools.com/cart/'
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