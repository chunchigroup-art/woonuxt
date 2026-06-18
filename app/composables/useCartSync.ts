const runtimeConfig = useRuntimeConfig()

export const syncCartToWooBackend = async (cartItems: any[]) => {
  const gqlUrl = runtimeConfig.public.GQL_HOST || 'https://cms.chunchitools.com/graphql'
  
  // 👇 关键修改 1：在 mutation 返回的末尾，把安全同步所需的 checkoutUrl 查出来
  const syncMutation = `
    mutation SyncFrontCart($items: [CartItemInput!]!) {
      updateCartItems(input: $items) {
        cartItems {
          quantity
          product { databaseId }
          variation { databaseId }
        }
        # 加上这一行，让后端执行完同步后，顺便吐出带临时安全 Token 的结账长链接
        cart {
          checkoutUrl
        }
      }
    }
  `
  
  const variables = {
    items: cartItems.map(item => ({
      productId: item.product.node.databaseId,
      variationId: item.variation?.node?.databaseId ?? null,
      quantity: item.quantity
    }))
  }

  return await $fetch<any>(gqlUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: syncMutation, variables })
  })
}

export const jumpToWPCheckout = async (cartItems: any[]) => {
  try {
    // 1. 执行同步并拿到后端的响应数据
    const response = await syncCartToWooBackend(cartItems)
    
    // 2. 尝试从响应中提取带有安全 Token 的结账网址
    const secureCheckoutUrl = response?.data?.updateCartItems?.cart?.checkoutUrl
    
    if (secureCheckoutUrl) {
      console.log('📦 购物车同步成功，正在带 Token 安全跳转到结账台:', secureCheckoutUrl)
      // 👇 关键修改 2：使用带 Token 的专属桥接链接进行跨域跳转
      window.location.href = secureCheckoutUrl
    } else {
      console.warn('⚠️ 未能提取到 checkoutUrl，降级使用传统链接跳转')
      // 容错降级方案
      window.location.href = 'https://cms.chunchitools.com/checkout/'
    }
    
  } catch (err) {
    console.error('购物车同步失败', err)
    alert('购物车同步异常，请刷新重试')
  }
}