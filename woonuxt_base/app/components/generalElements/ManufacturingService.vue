<template>
  <section class="text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center mb-16">
        <span class="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
          Why Partner With Us?
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Your Trusted One-Stop OEM/ODM Strategic Partner
        </h2>
        <div class="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div 
          v-for="(stat, index) in factoryStats" 
          :key="index"
          class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300"
        >
          <div class="text-4xl sm:text-5xl font-black text-blue-600 mb-2 font-mono">
            {{ stat.number }}
          </div>
          <div class="text-lg font-bold text-slate-800 mb-1">
            {{ stat.title }}
          </div>
          <p class="text-sm text-slate-600 max-w-xs mx-auto">
            {{ stat.description }}
          </p>
        </div>
      </div>

      <div class="border-t border-slate-200 my-12"></div>

      <div class="mb-10 text-center md:text-left md:flex md:items-end md:justify-between">
        <div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900">
            4-Step Seamless Customization Process
          </h3>
          <p class="text-sm text-slate-600 mt-1">
            Flexible branding solutions with low MOQ requirements.
          </p>
        </div>
        <NuxtLink 
          to="#rfq-section"
          class="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mt-4 md:mt-0 shadow-md shadow-blue-600/10"
        >
          Start Your Project
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(step, index) in customSteps" 
          :key="index"
          class="relative bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-white hover:border-blue-500 hover:shadow-md transition-all duration-300 group"
        >
          <div class="absolute top-4 right-4 text-xs font-bold text-slate-300 group-hover:text-blue-500/30 font-mono transition-colors">
            0{{ index + 1 }}
          </div>
          
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" v-html="step.iconSvg"></svg>
          </div>

          <h4 class="text-lg font-bold text-slate-800 mb-2">
            {{ step.title }}
          </h4>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const factoryStats = [
  {
    number: '20+ Years',
    title: 'HVAC/R Tooling Expertise',
    description: 'Professional HVAC/R technical support with thousands of global project & distribution cooperation cases.'
  },
  {
    number: '5,000+ ㎡',
    title: 'Modern Warehouse & Storage Area',
    description: 'Large-scale centralized warehouse with systematic inventory management & fast global order preparation.'
  },
  {
    number: '100% QC',
    title: 'Inspection & Quality Guarantee',
    description: 'Full-category strict inspection before packing and delivery.'
  }
]

const customSteps = [
  {
    title: 'Demand & Spec Confirmation',
    description: 'Collect client requirements, parameters and application conditions for customized technical scheme.',
    // 💡 纯 SVG 代码：对齐需求的放大镜/文档图标
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-2H6"></path>'
  },
  {
    title: 'Solution & Drawing Review',
    description: 'Propose matching specification plan, confirm technical details before sample development.',
    // 💡 纯 SVG 代码：严谨的图纸/标尺图标
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
  },
  {
    title: 'Pre-production Sample Approval',
    description: 'Make inspection sample, pass full QC test and get customer confirmation formally.',
    // 💡 🛠️ 彻底修复了第三个标签图标！纯 SVG 代码：通过验证的徽章/证书图标
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>'
  },
  {
    title: 'Bulk Stock & Shipment Arrangement',
    description: 'Arrange centralized warehouse stocking and arrange delivery after finished full-category inspection.',
    // 💡 🛠️ 修复了重复单词！纯 SVG 代码：大货出运的集装箱卡车图标
    iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>'
  }
]
</script>