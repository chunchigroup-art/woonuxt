<script setup lang="ts">
const { isShowingSearch } = useSearching();
const { cart, toggleCart, isUpdatingCart } = useCart();

// 引入控制鼠标悬浮下拉菜单的状态
const isHoveringCart = ref(false);
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-md shadow-gray-200 border-b border-transparent outline-gray-950/10 outline">
    <div class="container flex items-center justify-between h-16">
      <div class="flex items-center">
        <MenuTrigger class="lg:hidden" />
        <Logo />
      </div>
      <MainMenu class="items-center hidden gap-6 text-sm text-gray-500 lg:flex lg:px-4" />
      
      <div class="flex justify-end items-center w-40 flex-1 ml-auto gap-4 md:gap-6">
        <ProductSearch class="hidden sm:inline-flex max-w-80 w-[60%]" />
        <SearchTrigger />
        
        <div class="flex gap-4 items-center">
          <SignInLink />
          
          <div 
            class="relative py-2"
            @mouseenter="isHoveringCart = true"
            @mouseleave="isHoveringCart = false"
          >
            <CartTrigger @click.capture.stop.prevent class="pointer-events-none select-none" />

            <Transition name="fade-slide">
              <div 
                v-if="isHoveringCart" 
                class="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 transform origin-top-right"
              >
                <h3 class="font-bold text-gray-800 text-sm border-b border-gray-100 pb-2 mb-2 flex justify-between items-center">
                  <span>Cart Items</span>
                  <span class="text-xs text-blue-600 font-normal">Qty: {{ cart?.contents?.nodes?.length || 0 }}</span>
                </h3>

                <div v-if="cart && cart.contents && cart.contents.nodes.length > 0">
                  <div class="max-h-60 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    <div v-for="item in cart.contents.nodes" :key="item.key" class="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-none">
                      <img 
                        v-if="item.product?.node?.image?.sourceUrl" 
                        :src="item.product.node.image.sourceUrl" 
                        class="w-12 h-12 object-cover rounded-md border border-gray-100 flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-medium text-gray-800 truncate" :title="item.product?.node?.name">{{ item.product?.node?.name }}</h4>
                        <p class="text-[10px] text-gray-400 mt-0.5 truncate" v-html="item.variation?.node?.name || ''"></p>
                        <div class="flex justify-between items-center mt-1">
                          <span class="text-[11px] text-gray-500">x{{ item.quantity }}</span>
                          <span class="text-xs font-semibold text-gray-900" v-html="item.total"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-gray-100">
                    <div class="flex justify-between items-center text-sm mb-3">
                      <span class="text-gray-500 font-medium">Subtotal:</span>
                      <span class="font-bold text-gray-900" v-html="cart.subtotal"></span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <NuxtLink to="/cart" class="text-center bg-gray-100 text-gray-700 font-semibold text-xs py-2 rounded-lg hover:bg-gray-200 transition">
                        View Cart
                      </NuxtLink>
                      <a href="https://cms.chunchitools.com/checkout/" class="text-center bg-blue-600 text-white font-semibold text-xs py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        Checkout
                      </a>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-6 text-gray-400 text-xs">
                  <p class="mb-1 text-lg">🛒</p>
                  <p>Your cart is empty</p>
                </div>
              </div>
            </Transition>

          </div>
        </div>
      </div>
    </div>
    
    <Transition name="scale-y" mode="out-in">
      <div v-if="isShowingSearch" class="container mb-3 -mt-1 sm:hidden">
        <ProductSearch class="flex w-full" />
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* 丝滑下拉过度动画 */
.fade-slide-enter-active {
  transition: all 0.2s ease-out;
}
.fade-slide-leave-active {
  transition: all 0.15s ease-in;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

/* 微型滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>