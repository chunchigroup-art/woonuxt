<script setup lang="ts">
const { siteName } = useAppConfig()
</script>

<template>
  <!-- mr-6：右侧外边距，控制和Home间隔大小 -->
  <NuxtLink to="/" class="inline-flex items-center shrink-0 mr-6">
    <div class="leading-none">
      <div class="text-[2rem] font-black">CHUNCHI</div>
      <div class="text-xs text-slate-700">BETTER TOOLS,BETTER LIFE</div>
    </div>
  </NuxtLink>
</template>