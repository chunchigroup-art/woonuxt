<template>
  <MainLayout>
    <!-- 页面头部 -->
    <header class="py-12 bg-gray-50 border-b">
      <div class="container">
        <!-- 面包屑导航 -->
        <div class="text-sm text-gray-500 mb-4">
          <NuxtLink to="/" class="hover:text-primary">Home</NuxtLink>
          <span class="mx-2">/</span>
          <!-- 这里改成可点击跳转到 FAQ 页面 -->
          <NuxtLink to="/faq" class="text-gray-900 hover:text-primary">FAQ</NuxtLink>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
          Frequently Asked Questions
        </h1>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <section class="py-16">
      <div class="container max-w-4xl">
        
        <!-- 问答列表 -->
        <div class="space-y-6">
          
          <!-- Q1 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How long is the delivery time?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Warehouse processing time 1-2 business days, delivery time is 2-10 business days for general products.</p>
            </div>
          </details>

          <!-- Q2 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>Can I cancel my order?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>If your order has not shipped, you can cancel it under "My Orders". Or you can also contact us for assistance.</p>
              <p class="mt-2 text-sm italic">*Please note that we cannot cancel orders that have already been shipped.</p>
            </div>
          </details>

          <!-- Q3 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How to check order status?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Your current order status is displayed on the My Orders and Tracking page.</p>
            </div>
          </details>

          <!-- Q4 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How do I write a review?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Once you receive your package, please click the "Write a Review" button on the "My Reviews" page to write a review.</p>
            </div>
          </details>

          <!-- Q5 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>Can I change the delivery address after payment?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Please contact us to change your address before your item ships.</p>
            </div>
          </details>

          <!-- Q6 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How to get tracking information?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Tracking information will be updated on the "My Orders" page at the same time after the package is shipped.</p>
            </div>
          </details>

          <!-- Q7 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>What should I do if the delivery fails?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Please contact the local carrier and re-schedule the delivery.</p>
            </div>
          </details>

          <!-- Q8 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How long is the warranty period?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>We provide a one-year warranty for products sold on the official CHUNCHI website.</p>
            </div>
          </details>

          <!-- Q9 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>Can I return my product?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Yes, please read our Returns Policy carefully before returning your product. If you have further questions, please contact the customer service team.</p>
            </div>
          </details>

          <!-- Q10 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>How do I return my product?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>If the product can be returned for free, please contact customer service within 30 days of receiving the product for a return label/return address. Please contact us again for a refund after signing for the returned package at our warehouse.</p>
            </div>
          </details>

          <!-- Q11 -->
          <details class="group border border-gray-200 rounded-lg bg-white">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-900 hover:bg-gray-50 rounded-lg">
              <span>When will my refund be processed?</span>
              <span class="transition group-open:rotate-180">
                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div class="text-gray-600 px-4 pb-4 leading-relaxed">
              <p>Once we receive and inspect your returned item, your refund will be processed within 3-5 business days. The refund will be credited back to your original payment method.</p>
            </div>
          </details>

        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
</script>

<style scoped>
</style>