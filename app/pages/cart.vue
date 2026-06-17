<script lang="ts" setup>
// 使用 Woonuxt 自带的购物车组合式函数
const { cart, toggleCart, isUpdatingCart } = useCart()

// 核心拦截点：当用户点击结算时，直接一脚油门送去 WordPress 后端
const proceedToCheckout = () => {
  if (import.meta.client) {
    window.location.href = 'https://cms.chunchitools.com/checkout/'
  }
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl my-8">
    <h1 class="text-3xl font-bold mb-8">Order Summary</h1>

    <div v-if="cart && cart.contents && cart.contents.nodes.length > 0" class="flex flex-col lg:flex-row gap-8">
      
      <div class="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div v-for="item in cart.contents.nodes" :key="item.key" class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-none">
          <NuxtImg 
            v-if="item.product?.node?.image?.sourceUrl" 
            :src="item.product.node.image.sourceUrl" 
            class="w-20 h-20 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ item.product?.node?.name }}</h3>
            <p class="text-sm text-gray-400 mt-1" v-html="item.variation?.node?.name || ''"></p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm text-gray-500">Qty: {{ item.quantity }}</span>
              <span class="font-bold text-gray-900" v-html="item.total"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-96 bg-gray-50 p-6 rounded-xl border border-gray-200/60 h-fit">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        <div class="flex justify-between py-2 text-gray-600">
          <span>Subtotal</span>
          <span class="font-semibold text-gray-900" v-html="cart.subtotal"></span>
        </div>
        <div class="flex justify-between py-2 text-gray-600 border-b border-gray-200 pb-4">
          <span>Shipping</span>
          <span class="text-green-600">Calculated at next step</span>
        </div>
        <div class="flex justify-between py-4 text-lg font-bold text-gray-900">
          <span>Total</span>
          <span v-html="cart.total"></span>
        </div>

        <button 
          @click="proceedToCheckout"
          :disabled="isUpdatingCart"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 text-center block shadow-md shadow-blue-200"
        >
          {{ isUpdatingCart ? 'Updating...' : 'Proceed to Checkout' }}
        </button>
      </div>

    </div>

    <div v-else class="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
      <div class="text-4xl mb-4">🛒</div>
      <p class="text-gray-500 mb-6">Your cart is currently empty.</p>
      <NuxtLink to="/" class="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition">
        Go Shopping
      </NuxtLink>
    </div>
  </div>
</template>