<template>
  <footer class="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
    <div class="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 xl:gap-10 pb-12 border-b border-slate-900">
        
        <div class="lg:col-span-2 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="text-white">
              <span class="text-xl font-extrabold tracking-tight block">CHUNCHI</span>
              <span class="text-[9px] text-slate-500 tracking-widest font-bold uppercase block -mt-1">BETTER TOOLS, BETTER LIFE</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed pr-4">
              CHUNCHI TOOLS is your one-stop strategic partner for high-performance HVAC/R solutions. We specialize in copper pipes, precision manifold gauges, vacuum pumps, and specialized maintenance tools for global wholesale and OEM/ODM projects.
            </p>
          </div>
          
          <div class="pt-2">
            <div class="relative inline-block w-36">
              <select class="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 appearance-none cursor-pointer focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                <option value="en">English us</option>
              </select>
              <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-500">▼</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-600 pl-2.5 mb-5">
            Information
          </h3>
          <ul class="space-y-3 text-xs">
            <li><NuxtLink to="/about" class="hover:text-white transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/careers" class="hover:text-white transition-colors">Careers</NuxtLink></li>
            <li><NuxtLink to="/press" class="hover:text-white transition-colors">Press</NuxtLink></li>
            <li><NuxtLink to="/faqs" class="hover:text-white transition-colors">FAQs</NuxtLink></li>
          </ul>
        </div>

        <div class="lg:col-span-1">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-600 pl-2.5 mb-5">
            Resources
          </h3>
          <ul class="space-y-3 text-xs">
            <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Our Blog</NuxtLink></li>
            <li><NuxtLink to="/blog?category=case-studies" class="hover:text-white transition-colors">Case Studies</NuxtLink></li>
            <li><NuxtLink to="/blog?category=hvac-guides" class="hover:text-white transition-colors">HVAC/R Guides</NuxtLink></li>
          </ul>
        </div>

        <div class="lg:col-span-1">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-600 pl-2.5 mb-5">
            Customer Service
          </h3>
          <ul class="space-y-3 text-xs">
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact Us</NuxtLink></li>
            <li><NuxtLink to="/shipping-returns" class="hover:text-white transition-colors">Shipping & Returns</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms-conditions" class="hover:text-white transition-colors">Terms & Conditions</NuxtLink></li>
          </ul>
        </div>

        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-600 pl-2.5 mb-5">
            Newsletter
          </h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Subscribe to get the latest innovations and factory-direct updates.
          </p>
          
          <form @submit.prevent class="mt-2 flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 focus-within:border-blue-600 transition-colors max-w-sm">
            <input 
              type="email" 
              placeholder="Your professional email..." 
              class="w-full bg-transparent text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none placeholder-slate-600"
            />
            <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-all shrink-0">
              ➔
            </button>
          </form>
        </div>

      </div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
        <p>© 2026 CHUNCHI TOOLS. All rights reserved.</p>
        <div class="flex gap-4 mt-2 sm:mt-0">
          <span class="hover:text-slate-400 cursor-pointer transition-colors">Factory Inspection</span>
          <span class="text-slate-800">|</span>
          <span class="hover:text-slate-400 cursor-pointer transition-colors">Supplier Terms</span>
        </div>
      </div>

    </div>
  </footer>
</template>