export default defineNuxtPlugin(() => {
  // 强制覆盖 GraphQL 请求地址为本地代理
  const runtimeConfig = useRuntimeConfig()
  runtimeConfig.public.wpGqlUrl = '/api/graphql'
})