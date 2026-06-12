<script setup lang="ts">
const { FALLBACK_IMG } = useHelpers();
defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
});

const imgWidth = 220;
const imgHeight = Math.round(imgWidth * 1.125);
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/product-category/${decodeURIComponent(node.slug)}`"
    class="group relative flex flex-col justify-end overflow-hidden border border-slate-200/10 rounded-xl item snap-mandatory snap-x transition-all duration-300 hover:shadow-lg"
  >
    <NuxtImg
      :width="imgWidth"
      :height="imgHeight"
      class="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
      :src="node.image?.sourceUrl || FALLBACK_IMG"
      :alt="node.image?.altText || node.name"
      :title="node.image?.title || node.name"
      :loading="imageLoading"
      :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
      placeholder
      placeholder-class="blur-xl" 
    />
    
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-2/3 z-10 pointer-events-none"></div>
    
    <div class="relative z-20 w-full text-center px-3 mb-4 md:mb-5 mt-auto">
      <span 
        class="inline-block w-full text-sm font-bold text-white capitalize md:text-base tracking-wide leading-tight drop-shadow-md" 
        v-html="node.name"
      ></span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  aspect-ratio: 4 / 5;
}
</style>
