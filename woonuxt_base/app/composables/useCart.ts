// composables/useCart.ts
import type { AddToCartInput, ApiResponse, Cart, Customer, PaymentGateways, ProductDetail, SimpleProduct, Variation } from '#types/gql';
import type { GetCartQuery } from '#gql/default';

export function useCart() {
  const { storeSettings } = useAppConfig();
  const isOptimisticCartMode = computed(() => false);

  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const isAddingToCart = useState<boolean>('isAddingToCart', () => false);
  const isUpdatingCoupon = useState<boolean>('isUpdatingCoupon', () => false);
  const optimisticPendingMutations = useState<number>('optimisticPendingMutations', () => 0);
  const paymentGateways = useState<PaymentGateways | null>('paymentGateways', () => null);
  
  const { getDomain, getErrorContext, getErrorMessage } = useHelpers();
  const gql = useWooGraphQL();

  // =========================================================================
  // 1. 底层工具函数（全原生强制改写，攻克刷新变空核心）
  // =========================================================================
  
  function getCookieOptions() {
    if (!import.meta.client) return { path: '/', secure: true, sameSite: 'none' as const, maxAge: 60 * 60 * 24 * 7 };
    
    const hostname = window.location.hostname;
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    return {
      domain: isLocal ? undefined : '.chunchitools.com',
      path: '/',
      secure: true, 
      sameSite: 'none' as const, // 强制 none
      maxAge: 60 * 60 * 24 * 7
    };
  }

  function syncWooSession(token?: string | null): void {
    if (!token) return;
    
    useGqlHeaders({ 
      'woocommerce-session': `Session ${token}`,
      'X-Woo-Session-Token': token
    });

    if (!import.meta.client) return;
    
    // A. 框架标准写入
    const sessionCookie = useCookie<string | null>('woocommerce-session', getCookieOptions());
    sessionCookie.value = token;

    // B. 💡 原生 JS 暴力双轨写入：确保 Application Cookie 列表里绝对能抓到它！
    const hostname = window.location.hostname;
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const domainStr = isLocal ? '' : '; domain=.chunchitools.com';
    document.cookie = `woocommerce-session=${token}${domainStr}; path=/; max-age=604800; Secure; SameSite=None`;
  }

  function extractCartPayloadFromError(error: unknown) {
    const candidate = (error as any)?.response?.data?.data ?? (error as any)?.response?.data ?? (error as any)?.data?.data ?? (error as any)?.data ?? null;
    return (candidate && typeof candidate === 'object') ? candidate : null;
  }

  function normalizeQuantity(value?: number | string | null, fallback = 1): number {
    const qty = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(qty) && qty > 0 ? qty : fallback;
  }

  function getCurrentProductTotalQty(productId: number | string, variationId?: number | null): number {
    if (!cart.value?.contents?.nodes) return 0;
    let total = 0;
    cart.value.contents.nodes.forEach(node => {
      const pId = node.product?.node?.databaseId;
      const vId = node.variation?.node?.databaseId ?? null;
      if (pId === productId) {
        if ((variationId && vId === variationId) || (!variationId && !vId)) {
          total += normalizeQuantity(node.quantity);
        }
      }
    });
    return total;
  }

  function applyCartSnapshot(payload: any): void {
    if (!payload) return;
    const { updateCustomer, updateViewer, updateLoginClients } = useAuth();
    
    const cartData = payload.cart ?? payload.data?.cart;
    const viewerData = payload.viewer ?? payload.data?.viewer;
    const customerData = payload.customer ?? payload.data?.customer;
    const gatewaysData = payload.paymentGateways ?? payload.data?.paymentGateways;
    const loginClientsData = payload.loginClients ?? payload.data?.loginClients;

    // 💡 终极防御：如果后端返回的 cart 节点里没有商品（空车），
    // 且本地通过 Cookie 或 localStorage 明明能证明曾经加过购（即有凭证），
    // 绝对不允许用空状态洗掉前端内存！直接拦截！
    let hasLocalToken = false;
    if (import.meta.client) {
      hasLocalToken = document.cookie.includes('woocommerce-session') || !!localStorage.getItem('woocommerce-session');
    }
    
    if (cartData) {
      const hasItems = cartData.contents?.nodes?.length > 0;
      if (!hasItems && hasLocalToken && cart.value !== null) {
        console.warn('⚠️ 拦截到一次异常的洗车行为（后端返回空，但本地存有凭证），已保护前端状态。');
        return; // 🛑 拒绝用空状态覆盖
      }
      cart.value = cartData;
    }
    
    if (viewerData) updateViewer(viewerData);
    if (customerData) updateCustomer(customerData);
    if (gatewaysData) paymentGateways.value = gatewaysData;
    if (loginClientsData) updateLoginClients(loginClientsData.filter((c: any) => c !== null));

    const token = viewerData?.wooSessionToken || customerData?.sessionToken || payload.wooSessionToken;
    if (token) {
      syncWooSession(token);
    }
  }

  async function fetchCartSnapshot() {
    const { getAuthTokenForRequest } = useAuthTokens();
    const authToken = await getAuthTokenForRequest();
    
    let sessionCookie = null;
    
    if (import.meta.client) {
      // 客户端：从 document 捞取
      const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
      if (match) sessionCookie = match[2];
    } else {
      // 💡 服务端（SSR）：必须从 Nuxt SSR 上下文中强制强捞浏览器的 Cookie
      const ssrCookie = useCookie('woocommerce-session', getCookieOptions());
      sessionCookie = ssrCookie.value;
    }

    const requestHeaders: Record<string, string> = {};
    if (authToken) requestHeaders['Authorization'] = `Bearer ${authToken}`;
    
    if (sessionCookie) {
      requestHeaders['woocommerce-session'] = `Session ${sessionCookie}`;
      requestHeaders['X-Woo-Session-Token'] = sessionCookie;
      // 💡 绝杀：强制把整串 Cookie 塞进 Header，防止代理服务器拦截自定义 Header
      requestHeaders['Cookie'] = `woocommerce-session=${sessionCookie}`;
    }
    
    return await gql.getCart(undefined, requestHeaders);
  }

  // =========================================================================
  // 2. 核心异步操作函数
  // =========================================================================
  
  async function refreshCart(): Promise<boolean> {
    if (isUpdatingCart.value) return false; 
    isUpdatingCart.value = true;

    try {
      const payload = await fetchCartSnapshot();
      applyCartSnapshot(payload);
      return true;
    } catch (error: unknown) {
      const recoveredPayload = extractCartPayloadFromError(error);
      if (recoveredPayload) {
        applyCartSnapshot(recoveredPayload);
        return true;
      }
      return false;
    } finally {
      isUpdatingCart.value = false;
    }
  }

  async function addToCart(input: AddToCartInput, optimistic?: any): Promise<void> {
    if (isAddingToCart.value || isUpdatingCart.value) return; 
    isAddingToCart.value = true;
    isUpdatingCart.value = true; 

    const quantity = normalizeQuantity(input.quantity);
    
    try {
      const response: any = await gql.addToCart({ input: { ...input, quantity } });
      const rootData = response?.data ?? response;
      const addToCartPayload = rootData?.addToCart;
      
      if (addToCartPayload) {
        applyCartSnapshot(addToCartPayload);
      }
      
      if (storeSettings.autoOpenCart && !isShowingCart.value) {
        isShowingCart.value = true;
      }
    } catch (error: unknown) {
      console.error('加入购物车失败：', getErrorMessage(error));
      const recoveredPayload = extractCartPayloadFromError(error);
      if (recoveredPayload) {
        applyCartSnapshot(recoveredPayload);
      }
    } finally {
      setTimeout(() => {
        isAddingToCart.value = false;
        isUpdatingCart.value = false;
      }, 300);
    }
  }

  function toggleCart(state: boolean | undefined = undefined): void {
    isShowingCart.value = state ?? !isShowingCart.value;
  }

  async function removeItem(key: string): Promise<void> {
    await updateItemQuantity(key, 0);
  }

  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
    isUpdatingCart.value = true;
    try {
      await gql.UpDateCartQuantity({ key, quantity: normalizeQuantity(quantity, 0) });
      await refreshCart();
    } catch (error: unknown) {
      console.error('更新数量失败：', getErrorMessage(error));
    } finally {
      isUpdatingCart.value = false;
    }
  }

  async function emptyCart(): Promise<void> {
    isUpdatingCart.value = true;
    try {
      await gql.EmptyCart();
      await refreshCart();
    } catch (error: unknown) {
      console.error('清空购物车失败：', getErrorMessage(error));
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // =========================================================================
  // 3. 客户端静默保活（终极安全改良版：杜绝初始化洗白空车）
  // =========================================================================
  if (import.meta.client) {
    let currentToken = null;
    const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
    if (match) currentToken = match[2];
    if (!currentToken) currentToken = useCookie<string | null>('woocommerce-session', getCookieOptions()).value;

    if (currentToken) {
      // 1. 强行在全局标头锁死，确保后续所有组件发出的请求全部带凭证
      useGqlHeaders({ 
        'woocommerce-session': `Session ${currentToken}`,
        'X-Woo-Session-Token': currentToken
      });
      
      // 2. 💡 绝杀改动：由于刚刷新时 cart.value 必然是 null，
      // 我们加一层严密的锁：只有当正在更新锁 isUpdatingCart 为 false 时，才允许平稳拉取。
      // 并且拉取失败或返回空时，绝对不允许直接把 cart.value 抹成 null。
      if (!cart.value && !isUpdatingCart.value) {
        isUpdatingCart.value = true; // 提前上锁，不给其他组件并发作乱的机会
        
        fetchCartSnapshot()
          .then(payload => {
            const remoteCart = payload?.cart ?? payload?.data?.cart;
            // 只有当后台确实返回了有意义的购物车内容（比如里面有商品节点），才去更新
            if (remoteCart && remoteCart.contents?.nodes?.length > 0) {
              applyCartSnapshot(payload);
            } else {
              console.log('Backend returned empty snapshot, frontend layout retained.');
            }
          })
          .catch(() => console.log('Static session heartbeat paused.'))
          .finally(() => {
            isUpdatingCart.value = false; // 释放锁
          });
      }
    }
  }

  const isCartMutating = computed(() => isUpdatingCart.value || optimisticPendingMutations.value > 0);

  return {
    cart,
    isShowingCart,
    isUpdatingCart,
    isCartMutating,
    isAddingToCart,
    isUpdatingCoupon,
    paymentGateways,
    isOptimisticCartMode,
    refreshCart,
    toggleCart,
    addToCart,
    removeItem,
    updateItemQuantity,
    emptyCart,
  };
}