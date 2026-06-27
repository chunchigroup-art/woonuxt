import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  // 1. 强行重写全局原生 fetch 行为，强控请求凭证
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    if (typeof input === 'string' && input.includes('cms.chunchitools.com')) {
      init = init || {};
      init.credentials = 'include'; // 确保每次异步请求、刷新都死死带上凭证
    }
    
    const response = await originalFetch(input, init);
    
    // 2. 💡 核心暴力修复：拦截加购响应，直接用原生 JS 强写主域 Cookie
    // 这样能确保无论 Nuxt 的 useCookie 怎么失效，浏览器底层都能 100% 存下这个 Session！
    const wooSession = response.headers.get('woocommerce-session');
    if (wooSession) {
      const hostname = window.location.hostname;
      const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      const domainStr = isLocal ? '' : '; domain=.chunchitools.com';
      
      // 强行用最高权限写入：跨域共享 + None + Secure
      document.cookie = `woocommerce-session=${wooSession}${domainStr}; path=/; max-age=604800; Secure; SameSite=None`;
      
      // 同时在本地存一份双保险
      localStorage.setItem('woo-session-token-backup', wooSession);
    }
    
    return response;
  };

  // 3. 刷新页面初始化时，如果内存或 Cookie 被短暂卡住，强行从本地备份中提取并注入到 GraphQL Header
  const backupToken = localStorage.getItem('woo-session-token-backup');
  if (backupToken) {
    useGqlHeaders({
      'woocommerce-session': `Session ${backupToken}`,
      'X-Woo-Session-Token': backupToken
    });
  }
})