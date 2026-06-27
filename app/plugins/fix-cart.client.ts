import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  // 1. 强行重写全局原生 fetch 行为
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    // 只要是向 WordPress 后端发起的请求，全量、强制注入凭证
    if (typeof input === 'string' && input.includes('cms.chunchitools.com')) {
      init = init || {};
      init.credentials = 'include'; // ⚡ 强制所有 Query/Mutation 请求全部携带凭证
    }
    
    const response = await originalFetch(input, init);
    
    // 2. 自动捕获后端返回的全局会话，在本地作一次深层兜底备份
    if (response.headers.get('woocommerce-session')) {
      const token = response.headers.get('woocommerce-session');
      if (token) {
        localStorage.setItem('woocommerce-session-backup', token);
      }
    }
    
    return response;
  };

  // 3. 页面刷新初始化时，强行把暗号写进头信息中
  const backupToken = localStorage.getItem('woocommerce-session-backup');
  if (backupToken) {
    useGqlHeaders({
      'woocommerce-session': `Session ${backupToken}`,
      'X-Woo-Session-Token': backupToken
    });
  }
})