<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. 调用 WooNuxt 的 getProductCategories 并传递变量参数
// 这里可以通过传入 first 参数，控制下拉菜单展示的分类数量（默认20，这里可根据UI自由修改）
const { data, status, error } = await useAsyncGql('getProductCategories', { first: 15 })

// 2. 提取分类节点
const categories = computed(() => data.value?.productCategories?.nodes ?? [])

// 3. 统一生命周期状态控制
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
const hasError = computed(() => Boolean(error.value))

// 4. 下拉状态控制
const isDropdownOpen = ref(false)
</script>

<template>
  <nav class="main-menu">
    <ul class="menu-list">
      <li class="menu-item">
        <NuxtLink to="/" class="menu-link">Home</NuxtLink>
      </li>

      <li 
        class="menu-item dropdown"
        @mouseenter="isDropdownOpen = true"
        @mouseleave="isDropdownOpen = false"
      >
        <button class="menu-link dropdown-trigger" :class="{ 'active': isDropdownOpen }">
          Categories 
          <span class="arrow-icon" :class="{ 'rotate': isDropdownOpen }">▼</span>
        </button>

        <Transition name="slide-down">
          <ul v-if="isDropdownOpen" class="dropdown-menu">
            
            <template v-if="!isLoading && !hasError && categories.length > 0">
              <li v-for="category in categories" :key="category.id" class="dropdown-item">
                <NuxtLink 
                  :to="`/product-category/${category.slug}`" 
                  class="dropdown-link"
                  @click="isDropdownOpen = false"
                >
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">({{ category.count }})</span>
                </NuxtLink>
              </li>
            </template>

            <li v-else-if="isLoading" class="dropdown-status">
              <div class="spinner"></div>
              <span>Loading categories...</span>
            </li>

            <li v-else class="dropdown-status error">
              <span>Failed to load categories.</span>
            </li>
          </ul>
        </Transition>
      </li>

      <li class="menu-item">
        <NuxtLink to="/products" class="menu-link">Products</NuxtLink>
      </li>

      <!-- 新增 Online Shop 外部商城跳转，放在Products与Contact中间 -->
      <li class="menu-item">
        <a 
          href="https://shop.chunchitools.com" 
          target="_blank" 
          rel="noopener noreferrer"
          class="menu-link"
        >
          Online Shop
        </a>
      </li>

      <li class="menu-item">
        <NuxtLink to="/contact" class="menu-link">Contact</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* 导航栏样式保持一致 */
.main-menu {
  display: flex;
  align-items: center;
}

.menu-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
}

.menu-item {
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  padding: 10px 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.25s ease;
}

.menu-link:hover, .menu-link.router-link-active, .menu-link.active {
  color: #002FA7; /* 五金/工具独立站经典的工业蓝 */
}

.arrow-icon {
  font-size: 10px;
  margin-left: 6px;
  transition: transform 0.25s ease;
  color: #999;
}
.arrow-icon.rotate {
  transform: rotate(180deg);
  color: #002FA7;
}

/* 下拉框浮层 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  min-width: 240px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 8px 0;
  margin: 0;
  list-style: none;
  z-index: 1000;
}

.dropdown-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #444;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-link:hover {
  background-color: #f7f9fa;
  color: #002FA7;
  font-weight: 600;
}

.category-count {
  font-size: 12px;
  color: #999;
}

.dropdown-status {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #777;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #002FA7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>