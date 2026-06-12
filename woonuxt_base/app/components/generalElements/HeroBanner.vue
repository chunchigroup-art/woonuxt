<template>
  <section class="relative bg-slate-950 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-900">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none"></div>
    
    <div class="max-w-7xl w-full mx-auto px-4 md:px-8 relative z-10">
      
      <div class="max-w-3xl mb-12 md:mb-16 text-left">
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-none">
          Industrial Tooling <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400">
            One-Stop Supply Chain.
          </span>
        </h1>
        <p class="text-base md:text-lg text-slate-400 font-medium max-w-2xl leading-relaxed">
          Empowering global wholesalers and procurement professionals with seamless manufacturing integration, comprehensive sourcing, and end-to-end infrastructure.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          v-for="(card, index) in bannerCards" 
          :key="index"
          class="group relative overflow-hidden rounded-xl bg-slate-900 h-[400px] md:h-[450px] shadow-2xl border border-slate-800/80 hover:border-blue-500/50 transition-all duration-500 ease-out flex flex-col justify-end p-8"
        >
          <img 
            :src="card.image" 
            :alt="card.seoAlt"
            loading="eager" 
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover brightness-[0.25] contrast-125 saturate-75 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.45]" 
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>

          <div class="relative z-20 flex flex-col justify-end">
            
            <div class="flex items-center gap-2 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400/90">
                {{ card.tag }}
              </span>
            </div>
            
            <div class="min-h-[4.5rem] flex items-start">
              <h2 
                class="text-xl md:text-2xl font-extrabold tracking-tight leading-tight text-white antialiased"
                v-html="card.title"
              </h2>
            </div>
            
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
const bannerCards = ref([
  {
    tag: 'Global Supply',
    title: 'One Supplier.<br>Endless Solutions.',
    seoAlt: 'One supplier endless solutions tooling supply chain',
    image: '/images/hero-1.jpg' 
  },
  {
    tag: 'Smart Procurement',
    title: 'Streamlined Sourcing.<br>One-Stop Platform.',
    seoAlt: 'Streamlined sourcing one stop platform',
    image: '/images/hero-2.jpg' 
  },
  {
    tag: 'B2B Partnership',
    title: 'Engineered for Pros.<br>Built for Wholesalers.',
    seoAlt: 'Engineered for pros built for wholesalers',
    image: '/images/hero-3.jpg' 
  }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap');
section {
  font-family: 'Inter', sans-serif;
}
</style>