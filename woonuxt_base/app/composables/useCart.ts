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

    // 💡 升级安全兜底：如果后端偶尔返回空状态或报错空对象，不要盲目覆盖本地
    if (cartData) cart.value = cartData;
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
    
    // 💡 核心强化：刷新页面时，用原生正则从 document.cookie 里最安全地提取出当前的 Token 
    let sessionCookie = null;
    if (import.meta.client) {
      const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
      if (match) sessionCookie = match[2];
    }
    if (!sessionCookie) {
      sessionCookie = useCookie('woocommerce-session', getCookieOptions()).value;
    }
    
    const requestHeaders: Record<string, string> = {};
    if (authToken) requestHeaders['Authorization'] = `Bearer ${authToken}`;
    
    // 强制把这个跨域暗号死死塞进标头里发出，保证刷新不掉线
    if (sessionCookie) {
      requestHeaders['woocommerce-session'] = `Session ${sessionCookie}`;
      requestHeaders['X-Woo-Session-Token'] = sessionCookie;
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
  // 3. 客户端静默保活
  // =========================================================================
  if (import.meta.client) {
    let currentToken = null;
    const match = document.cookie.match(new RegExp('(^| )woocommerce-session=([^;]+)'));
    if (match) currentToken = match[2];
    if (!currentToken) currentToken = useCookie<string | null>('woocommerce-session', getCookieOptions()).value;

    if (currentToken) {
      useGqlHeaders({ 
        'woocommerce-session': `Session ${currentToken}`,
        'X-Woo-Session-Token': currentToken
      });
      if (!cart.value) {
        fetchCartSnapshot()
          .then(payload => applyCartSnapshot(payload))
          .catch(() => console.log('Static session heartbeat paused.'));
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