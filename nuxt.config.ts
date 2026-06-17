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
      // 改用本地代理路径，不再直接请求外部域名，解决浏览器跨域
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
      // 配置GraphQL反向代理，转发至cms子域名，允许跨域携带Cookie
      '/api/graphql-proxy/**': {
        proxy: {
          // ⚡ 优化：将代理目标精简到主域名，防止通配符拼接导致后端路径重叠
          to: 'https://cms.chunchitools.com',
          // 透传浏览器Cookie给WordPress，关键用于同步购物车Session
          forwardHost: true,
          // ⚡ 修复：显式指定源域名，确保后端下发的 Cookie 域名范围被精准重写，扩大到整个主域
          cookieDomainRewrite: {
            'cms.chunchitools.com': '.chunchitools.com',
            'chunchitools.com': '.chunchitools.com'
          }
        },
        headers: {
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    }
  },
});