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
  // 1. 使用标准 function 声明所有底层工具函数（完美利用 JS 原生提升，杜绝 Initialization 错误）
  // =========================================================================
  
  function getCookieOptions() {
    if (!import.meta.client) return { path: '/', secure: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7 };
    
    const hostname = window.location.hostname;
    // 🌟 如果是线上子域名环境（例如 shop.chunchitools.com），强制把 domain 挂载到主域 '.chunchitools.com'
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    return {
      domain: isLocal ? undefined : '.chunchitools.com', // 关键点：加点号，代表主域及所有子域共享 Cookie
      path: '/',
      secure: true, // 线上测试环境必须是 HTTPS 
      sameSite: 'lax' as const, // 同域环境下，用 'lax' 即可，安全且不会被浏览器拦截
      maxAge: 60 * 60 * 24 * 7
    };
  }

  function syncWooSession(token?: string | null): void {
    if (!token) return;
    
    // 同时挂载标准头和跨域自定义头，隔空投送暗号
    useGqlHeaders({ 
      'woocommerce-session': `Session ${token}`,
      'X-Woo-Session-Token': token
    });

    if (!import.meta.client) return;
    const sessionCookie = useCookie<string | null>('woocommerce-session', getCookieOptions());
    sessionCookie.value = token;
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
    
    // 解构可能存在的数据层级
    const cartData = payload.cart ?? payload.data?.cart;
    const viewerData = payload.viewer ?? payload.data?.viewer;
    const customerData = payload.customer ?? payload.data?.customer;
    const gatewaysData = payload.paymentGateways ?? payload.data?.paymentGateways;
    const loginClientsData = payload.loginClients ?? payload.data?.loginClients;

    if (cartData) cart.value = cartData;
    if (viewerData) updateViewer(viewerData);
    if (customerData) updateCustomer(customerData);
    if (gatewaysData) paymentGateways.value = gatewaysData;
    if (loginClientsData) updateLoginClients(loginClientsData.filter((c: any) => c !== null));

    // 提取会话 Token
    const token = viewerData?.wooSessionToken || customerData?.sessionToken || payload.wooSessionToken;
    if (token) {
      syncWooSession(token);
    }
  }

  async function fetchCartSnapshot() {
    const { getAuthTokenForRequest } = useAuthTokens();
    const authToken = await getAuthTokenForRequest();
    const requestHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    return await gql.getCart(undefined, requestHeaders);
  }

  // =========================================================================
  // 2. 核心异步操作函数
  // =========================================================================
  
  async function refreshCart(): Promise<boolean> {
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
    if (isAddingToCart.value) return; // 防抖，防止重复点击
    isAddingToCart.value = true;
    isUpdatingCart.value = true;

    const quantity = normalizeQuantity(input.quantity);
    
    try {
      // 执行 GraphQL 加购变更
      const response: any = await gql.addToCart({ input: { ...input, quantity } });
      
      // 精准提取返回的最新购物车快照与 Token
      const rootData = response?.data ?? response;
      const addToCartPayload = rootData?.addToCart;
      
      if (addToCartPayload) {
        applyCartSnapshot(addToCartPayload);
      }
      
      // 全局同步一次最新状态
      await refreshCart();
      
      if (storeSettings.autoOpenCart && !isShowingCart.value) {
        isShowingCart.value = true;
      }
    } catch (error: unknown) {
      console.error('加入购物车失败：', getErrorMessage(error));
      const recoveredPayload = extractCartPayloadFromError(error);
      if (recoveredPayload) {
        applyCartSnapshot(recoveredPayload);
        await refreshCart();
      }
    } finally {
      isAddingToCart.value = false;
      isUpdatingCart.value = false;
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
  // 3. 客户端静默保活（严禁在此处抛出死循环重试）
  // =========================================================================
  if (import.meta.client) {
    const initSession = useCookie<string | null>('woocommerce-session', getCookieOptions());
    if (initSession.value) {
      useGqlHeaders({ 
        'woocommerce-session': `Session ${initSession.value}`,
        'X-Woo-Session-Token': initSession.value
      });
      // 仅在本地内存完全没有购物车缓存时，才做一次平稳的静默拉取
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