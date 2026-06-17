const runtimeConfig = useRuntimeConfig()

/**
 * GraphQL同步前端购物车到WordPress Woo会话
 * @param cartItems cart.contents.nodes 商品数组
 */
export const syncCartToWoo = async (cartItems: any[]) => {
  const gqlApi = runtimeConfig.public.GQL_HOST

  const syncMutation = `
    mutation SyncFrontCart($items: [CartItemInput!]!) {
      updateCartItems(input: $items) {
        cartItems {
          key
          quantity
          product { databaseId }
          variation { databaseId }
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

  const res = await $fetch(gqlApi, {
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
  return res.data.updateCartItems
}

/**
 * 结账统一入口：先同步，成功跳转cms结账页
 */
export const goToBackendCheckout = async (cartItems: any[]) => {
  try {
    await syncCartToWoo(cartItems)
    window.location.href = 'https://cms.chunchitools.com/checkout/'
  } catch (err) {
    console.error('结账同步报错：', err)
    alert('购物车同步异常，请刷新页面重试')
  }
}