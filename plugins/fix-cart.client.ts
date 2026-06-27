import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    // 强制拦截向后台发起的请求
    if (typeof input === 'string' && input.includes('cms.chunchitools.com')) {
      init = init || {};
      init.credentials = 'include';
    }
    
    const response = await originalFetch(input, init);
    
    // 💡 暴力修复：如果发现后端返回了全小写的 session，而在某些库里读不到
    if (response.headers.get('woocommerce-session')) {
      const token = response.headers.get('woocommerce-session');
      // 如果本地有使用 localStorage 存储 session 的习惯，强行塞进去
      if (token) localStorage.setItem('woocommerce-session', token);
    }
    
    return response;
  };
})