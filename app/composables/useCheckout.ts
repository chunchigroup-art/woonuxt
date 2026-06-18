const runtimeConfig = useRuntimeConfig()

/**
 * GraphQL同步前端购物车到WordPress Woo会话
 * @param cartItems cart.contents.nodes 商品数组
 */
export const syncCartToWoo = async (cartItems: any[]) => {
  const gqlApi = runtimeConfig.public.GQL_HOST || 'https://cms.chunchitools.com/graphql'

  // 👇 关键修改 1：在 mutation 的返回字段里，加上 cart { checkoutUrl }
  const syncMutation = `
    mutation SyncFrontCart($items: [CartItemInput!]!) {
      updateCartItems(input: $items) {
        cartItems {
          key
          quantity
          product { databaseId }
          variation { databaseId }
        }
        # 加上这一行，让后端在同步完商品后，顺便吐出带有临时安全 Token 的结账网址
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

  const res = await $fetch<any>(gqlApi, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: syncMutation,
      variables
    })
  })

  if (res.errors) throw new Error('购物车同步失败')
  return res.data?.updateCartItems
}

/**
 * 结账统一入口：先同步，成功跳转cms结账页
 */
export const goToBackendCheckout = async (cartItems: any[]) => {
  try {
    // 1. 接收同步返回的数据
    const syncResult = await syncCartToWoo(cartItems)
    
    // 2. 提取带有安全 Token 的桥接跳转 URL
    const secureCheckoutUrl = syncResult?.cart?.checkoutUrl

    if (secureCheckoutUrl) {
      console.log('📦 结账同步成功，正在通过安全通道跳转:', secureCheckoutUrl)
      // 👇 关键修改 2：放弃硬编码链接，使用带单次有效钥匙的专属安全链接跳转
      window.location.href = secureCheckoutUrl
    } else {
      console.warn('⚠️ 未能拿到带有 Token 的 checkoutUrl，降级使用标准链接跳转')
      // 降级容错方案
      window.location.href = 'https://cms.chunchitools.com/checkout/'
    }

  } catch (err) {
    console.error('结账同步报错：', err)
    alert('购物车同步异常，请刷新页面重试')
  }
}