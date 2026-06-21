export default defineNuxtPlugin(() => {
  const originalFetch = globalThis.$fetch;
  
  if (originalFetch) {
    globalThis.$fetch = originalFetch.create({
      onRequest({ request, options }) {
        // 锁定往 WordPress 后台发起的请求
        if (typeof request === 'string' && request.includes('cms.chunchitools.com')) {
          options.credentials = 'include';
          
          // ⚡【核心破局点】利用纯原生 JS 手动提取本地的 woocommerce_session Token
          const match = document.cookie.match(new RegExp('(^| )woocommerce_session=([^;]+)'));
          if (match && match[2]) {
            options.headers = options.headers || {};
            // 封装进自定义 Header，Lax 策略绝对拦截不到手动 Headers 传输
            options.headers['woocommerce-session'] = `Session ${match[2]}`;
            options.headers['x-woo-session-token'] = match[2];
          }
        }
      },
      onResponse({ request, response }) {
        if (typeof request === 'string' && request.includes('cms.chunchitools.com')) {
          // 捕获后端返回回来的新 Session 令牌
          const sessionToken = response.headers.get('woocommerce-session') 
                            || response.headers.get('x-woo-session-token')
                            || response.headers.get('Woocommerce-Session');
          
          if (sessionToken) {
            const pureToken = sessionToken.replace('Session ', '');
            
            // 重新写回本地主域，供下一次请求手动提取
            const maxAge = 7 * 24 * 60 * 60;
            const isLocal = window.location.hostname === 'localhost';
            const domainSection = isLocal ? '' : '; domain=.chunchitools.com';
            
            document.cookie = `woocommerce_session=${pureToken}${domainSection}; path=/; max-age=${maxAge}; secure; samesite=lax`;
          }
        }
      }
    });
  }
});