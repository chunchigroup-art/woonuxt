<script lang="ts" setup>
// 从 useCart 中解构出底层所需方法，保持原本的响应式状态
const { cart, toggleCart, isUpdatingCart, updateItemQuantity } = useCart()

// ⚡ 修复：使用从 GraphQL 提取出的带 Token 安全跳转链接，100% 同步购物车数据
const proceedToCheckout = async () => {
  if (!cart.value?.contents?.nodes?.length) return
  
  // 打印调试，确保能拿到带 Token 的长链接
  console.log('正在从购物车主页安全跳转至后端结账台:', cart.value?.checkoutUrl)
  
  if (cart.value?.checkoutUrl) {
    // 核心：使用后端返回的带单次有效钥匙的专属安全链接跳转，打通会话
    window.location.href = cart.value.checkoutUrl
  } else {
    // 降级容错方案：万一没有拿到链接，直接外链到后端默认结账页
    window.location.href = 'https://cms.chunchitools.com/checkout/'
  }
}

// 数量调节方法
const changeQuantity = async (item: any, newQty: number) => {
  if (newQty < 0 || isUpdatingCart.value) return
  await updateItemQuantity(item.key, newQty)
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
            
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-4">
                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button 
                    @click="changeQuantity(item, item.quantity - 1)"
                    :disabled="isUpdatingCart || item.quantity <= 1"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <span class="px-3 py-1 text-sm font-medium text-gray-800 min-w-[24px] text-center">
                    {{ item.quantity }}
                  </span>
                  <button 
                    @click="changeQuantity(item, item.quantity + 1)"
                    :disabled="isUpdatingCart"
                    class="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>

                <button 
                  @click="changeQuantity(item, 0)"
                  :disabled="isUpdatingCart"
                  class="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                >
                  Delete
                </button>
              </div>

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