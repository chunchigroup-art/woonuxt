<script setup lang="ts">
import { useCookie } from 'nuxt/app'
const { cart } = useCart()

const WC_URL = 'https://chunchitools.com'
let cartToken = useCookie('wc_cart_token').value || ''

// 带Cart-Token请求封装
const apiFetch = async (path: string, opts: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>)
  }
  if (cartToken) headers['Cart-Token'] = cartToken

  const res = await fetch(`${WC_URL}/wp-json/wc/store/v1${path}`, {
    credentials: 'include',
    ...opts,
    headers
  })

  const newToken = res.headers.get('Cart-Token')
  if (newToken) {
    cartToken = newToken
    useCookie('wc_cart_token').value = newToken
  }
  return res
}

// 点击：同步购物车 + 跳转WC购物车页
const goToWooCart = async (e: Event) => {
  e.stopPropagation()
  e.preventDefault()

  try {
    // 清空远端购物车，防止重复商品
    await apiFetch('/cart/items', { method: 'DELETE' })
    // 同步当前商品
    if (cart?.contents?.nodes?.length) {
      for (const item of cart.contents.nodes) {
        await apiFetch('/cart/items', {
          method: 'POST',
          body: JSON.stringify({
            id: item.productId,
            quantity: item.quantity
          })
        })
      }
    }
  } catch (err) {
    console.error('购物车同步失败：', err)
  }

  // 携带Token跳转
  window.location.href = `${WC_URL}/cart/?cart_token=${encodeURIComponent(cartToken)}`
}
</script>

<template>
  <!-- 仅保留购物车图标，删除所有侧边面板DOM -->
  <div class="cart-icon" @click="goToWooCart">
    <Icon name="ion:cart-outline" size="24" />
    <span v-if="cart?.contents?.productCount" class="cart-count">
      {{ cart.contents.productCount }}
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