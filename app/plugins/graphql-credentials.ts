export default defineNuxtPlugin((nuxtApp) => {
  // 拦截全局的 $fetch 请求（Nuxt 3 官方推荐的网络请求方式）
  const originalFetch = globalThis.$fetch;
  
  if (originalFetch) {
    globalThis.$fetch = originalFetch.create({
      onRequest({ request, options }) {
        // 如果请求路径指向了我们的 Nitro 代理
        if (typeof request === 'string' && request.includes('/api/graphql-proxy')) {
          // 强制注入凭证，允许携带和接收 Cookie
          options.credentials = 'include';
        }
      },
    });
  }
});