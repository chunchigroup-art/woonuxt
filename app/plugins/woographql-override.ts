export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gqlProxyUrl = config.public.GQL_HOST

  // 重写useWooGraphQL底层请求地址，全部走本地代理
  nuxtApp.hook('woonuxt:graphql:config', (gqlConfig) => {
    gqlConfig.uri = gqlProxyUrl
  })
})