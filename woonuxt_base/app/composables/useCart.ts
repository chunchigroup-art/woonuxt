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
  // 1. 底层工具函数（切换为本地物理存储驱动）
  // =========================================================================

  function syncWooSession(token?: string | null): void {
    if (!token) return;
    
    // 强制锁死全局 GraphQL 请求标头
    useGqlHeaders({ 
      'woocommerce-session': `Session ${token}`,
      'X-Woo-Session-Token': token
    });

    if (!import.meta.client) return;
    
    // 💡 核心外挂：死死写入 localStorage，绕过浏览器的 Cookie 跨域拦截大山
    localStorage.setItem('woocommerce-session', token);
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

    if (cartData) {
      // 如果后端返回空，但本地明明存有 Token，说明请求还没对齐，拦截洗车
      let hasLocalToken = false;
      if (import.meta.client) {
        hasLocalToken = !!localStorage.getItem('woocommerce-session');
      }
      const hasItems = cartData.contents?.nodes?.length > 0;
      if (!hasItems && hasLocalToken && cart.value !== null) {
        console.warn('⚠️ 拦截到一次异常的洗车行为（后端返回空，本地存有凭证），已保护前端状态。');
        return;
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
    
    let sessionToken = null;
    if (import.meta.client) {
      // 优先从本地物理存储读取
      sessionToken = localStorage.getItem('woocommerce-session');
    }

    const requestHeaders: Record<string, string> = {};
    if (authToken) requestHeaders['Authorization'] = `Bearer ${authToken}`;
    
    if (sessionToken) {
      requestHeaders['woocommerce-session'] = `Session ${sessionToken}`;
      requestHeaders['X-Woo-Session-Token'] = sessionToken;
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
  // 3. 客户端静默保活（本地物理存储持久化版）
  // =========================================================================
  if (import.meta.client) {
    const localToken = localStorage.getItem('woocommerce-session');

    if (localToken) {
      useGqlHeaders({ 
        'woocommerce-session': `Session ${localToken}`,
        'X-Woo-Session-Token': localToken
      });
      
      if (!cart.value && !isUpdatingCart.value) {
        isUpdatingCart.value = true;
        
        fetchCartSnapshot()
          .then(payload => {
            const remoteCart = payload?.cart ?? payload?.data?.cart;
            if (remoteCart && remoteCart.contents?.nodes?.length > 0) {
              applyCartSnapshot(payload);
            }
          })
          .catch(() => console.log('Static session heartbeat paused.'))
          .finally(() => {
            isUpdatingCart.value = false;
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