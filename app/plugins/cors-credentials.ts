export default defineNuxtPlugin(() => {
  const originalFetch = globalThis.$fetch;
  
  if (originalFetch) {
    globalThis.$fetch = originalFetch.create({
      onRequest({ request, options }) {
        if (typeof request === 'string' && request.includes('cms.chunchitools.com')) {
          options.credentials = 'include';
          
          // ⚡ 原生 JS 读取 Cookie：寻找名为 woocommerce_session 的值
          const match = document.cookie.match(new RegExp('(^| )woocommerce_session=([^;]+)'));
          if (match && match[2]) {
            options.headers = options.headers || {};
            // @ts-ignore
            options.headers['Woocommerce-Session'] = `Session ${match[2]}`;
          }
        }
      },
      onResponse({ request, response }) {
        if (typeof request === 'string' && request.includes('cms.chunchitools.com')) {
          const sessionToken = response.headers.get('woocommerce-session') || response.headers.get('x-woo-session-token');
          
          if (sessionToken) {
            const pureToken = sessionToken.replace('Session ', '');
            
            // ⚡ 原生 JS 写入主域共享 Cookie（效果和 js-cookie 完全一致）
            // 设置 7 天过期，开启 Secure 和 SameSite=None
            const maxAge = 7 * 24 * 60 * 60;
            document.cookie = `woocommerce_session=${pureToken}; domain=.chunchitools.com; path=/; max-index=${maxAge}; secure; samesite=none`;
          }
        }
      }
    });
  }
});