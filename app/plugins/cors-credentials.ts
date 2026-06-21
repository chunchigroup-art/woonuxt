export default defineNuxtPlugin(() => {
  // 拦截全局的 $fetch 请求
  const originalFetch = globalThis.$fetch;
  
  if (originalFetch) {
    globalThis.$fetch = originalFetch.create({
      onRequest({ request, options }) {
        // 如果请求发往你的 WordPress 后台
        if (typeof request === 'string' && request.includes('cms.chunchitools.com')) {
          // ⚡ 核心修复：允许在纯跨域请求中携带和接收 Cookie 凭证
          options.credentials = 'include';
        }
      },
    });
  }
});