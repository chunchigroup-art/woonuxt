export default defineNuxtConfig({
  extends: ['./woonuxt_base'],

  components: [
    { path: './components', pathPrefix: false }
  ],

  image: {
    ipx: { external: false },
    provider: 'none'
  },

  runtimeConfig: {
    public: {
<<<<<<< HEAD
      // 改用本地代理路径，不再直接请求外部域名，解决浏览器跨域
=======
      // 改为本地代理路径，不走浏览器跨域
>>>>>>> b0be416 (修复GraphQL跨域代理，兼容WooNuxt购物车请求)
      GQL_HOST: '/api/graphql-proxy',
      wordpressUrl: 'https://cms.chunchitools.com/graphql'
    }
  },

  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    routeRules: {
<<<<<<< HEAD
      // 配置GraphQL反向代理，转发至cms子域名，允许跨域携带Cookie
      '/api/graphql-proxy/**': {
        proxy: {
          to: 'https://cms.chunchitools.com/graphql',
          // 透传浏览器Cookie给WordPress，关键用于同步购物车Session
          forwardHost: true,
          cookieDomainRewrite: {
            '': '.chunchitools.com'
=======
      // GraphQL反向代理
      '/api/graphql-proxy/**': {
        proxy: {
          to: 'https://cms.chunchitools.com/graphql',
          forwardHost: true,
          cookieDomainRewrite: {
            "": ".chunchitools.com"
>>>>>>> b0be416 (修复GraphQL跨域代理，兼容WooNuxt购物车请求)
          }
        },
        headers: {
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    }
  },
});