export default defineNuxtConfig({
  // 继承 WooNuxt 的核心基础配置层
  extends: ['./woonuxt_base'],

  // 组件自动导入配置
  components: [
    { path: './components', pathPrefix: false }
  ],

  // 图像优化配置
  image: {
    ipx: { external: false },
    provider: 'none'
  },

  // 1. 扩展应用运行时配置，强制将 WooNuxt 的 GraphQL 基准请求地址改走本地同源代理
  runtimeConfig: {
    public: {
      // 核心魔改：WooNuxt 内部底层使用的是这个变量或 GQL_HOST
      // 改为相对路径后，前端的所有网络请求都会发给本地的 Nitro 服务器
      GQL_HOST: '/graphql-proxy',
      // 备用兜底：有些版本的 WooNuxt 还会读取这个变量，一并锁死
      wordpressUrl: '/graphql-proxy'
    }
  },

  // 2. 配置 Nitro 服务器规则，建立跨域中转站
  nitro: {
    // 建立反向代理规则
    routeRules: {
      '/graphql-proxy/**': { 
        // 当收到前端发往 /graphql-proxy 的请求时，Nitro 在后台悄悄代替你访问线上真实的 WPGraphQL
        proxy: 'https://chunchitools.com/graphql' 
      },
    },
    // 你原有的预渲染优化配置
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
  },
});