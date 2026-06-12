<template>
  <!-- 1. 背景微调为与前序组件一致的优雅浅灰，加大上下间距 -->
  <section class="text-slate-800 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    
    <!-- 2. 头部标题区：已移除More Client Reviews跳转链接 -->
    <div class="mb-12 border-b border-slate-100 pb-4">
      <div>
        <span class="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">Global Trust</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Global Client Testimonials</h2>
        <p class="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed">
          Real feedback from worldwide HVAC/R distributors & project partners after long-term cooperation.
        </p>
      </div>
    </div>

    <!-- 3. 四宫格评价卡片：升级圆角(rounded-xl)，加入轻量质感边框 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- 卡片 1 -->
      <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="text-amber-400 mb-3 text-sm">★★★★★</div>
          <p class="text-slate-600 text-sm italic leading-relaxed mb-6">
            "Stable full-category QC performance, fast spot delivery helps us reduce local inventory pressure greatly."
          </p>
        </div>
        <div class="border-t border-slate-200 pt-3">
          <h4 class="font-bold text-sm text-slate-800">USA HVAC Distributor</h4>
          <span class="text-xs text-slate-400">Cooperated since 2021</span>
        </div>
      </div>

      <!-- 卡片 2 -->
      <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="text-amber-400 mb-3 text-sm">★★★★★</div>
          <p class="text-slate-600 text-sm italic leading-relaxed mb-6">
            "Custom specification service is flexible, all products pass EU certification smoothly for customs clearance."
          </p>
        </div>
        <div class="border-t border-slate-200 pt-3">
          <h4 class="font-bold text-sm text-slate-800">Germany Wholesale Supplier</h4>
          <span class="text-xs text-slate-400">Cooperated since 2020</span>
        </div>
      </div>

      <!-- 卡片 3 -->
      <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="text-amber-400 mb-3 text-sm">★★★★★</div>
          <p class="text-slate-600 text-sm italic leading-relaxed mb-6">
            "Perfect technical matching for refrigeration projects, bulk order arrangement always on schedule."
          </p>
        </div>
        <div class="border-t border-slate-200 pt-3">
          <h4 class="font-bold text-sm text-slate-800">Thailand Refrigeration Contractor</h4>
          <span class="text-xs text-slate-400">Cooperated since 2015</span>
        </div>
      </div>

      <!-- 卡片 4 -->
      <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="text-amber-400 mb-3 text-sm">★★★★★</div>
          <p class="text-slate-600 text-sm italic leading-relaxed mb-6">
            "Continuous repeat orders for years, centralized stock shortens our whole procurement cycle."
          </p>
        </div>
        <div class="border-t border-slate-200 pt-3">
          <h4 class="font-bold text-sm text-slate-800">Qatar HVAC Chain Buyer</h4>
          <span class="text-xs text-slate-400">Long-term Annual Partner</span>
        </div>
      </div>
      
    </div>

    <!-- 4. 底部按钮 -->
    <div class="mt-12 text-center">
      <NuxtLink 
        to="#rfq-section" 
        class="inline-flex items-center justify-center px-8 py-3 text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10 cursor-pointer"
      >
        Become Our Partner
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
</script>