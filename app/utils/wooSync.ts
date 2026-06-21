export const safeRedirectToBackendCart = () => {
  // 从本地读取带有横杠的正确 Cookie
  const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
  const token = match && match[2] ? match[2] : null;

  if (token) {
    // ⚡ 核心破局点：带上动态令牌，冲向实际的 cms 后台购物车
    window.location.href = `https://cms.chunchitools.com/cart/?woo_sync_sess=${token}`;
  } else {
    // 兜底：如果没有 Token，直接普通跳转到后台
    window.location.href = 'https://cms.chunchitools.com/cart/';
  }
};