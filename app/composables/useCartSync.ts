const runtimeConfig = useRuntimeConfig()

export const syncCartToWooBackend = async (cartItems: any[]) => {
  const gqlUrl = runtimeConfig.public.GQL_HOST
  const syncMutation = `
    mutation SyncFrontCart($items: [CartItemInput!]!) {
      updateCartItems(input: $items) {
        cartItems {
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

  return await $fetch(gqlUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: syncMutation, variables })
  })
}

export const jumpToWPCheckout = async (cartItems: any[]) => {
  try {
    await syncCartToWooBackend(cartItems)
    window.location.href = 'https://cms.chunchitools.com/checkout/'
  } catch (err) {
    console.error('购物车同步失败', err)
    alert('购物车同步异常，请刷新重试')
  }
}