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
      GQL_HOST: '/api/graphql-proxy/graphql', // ⚡ 优化：将路径直接对准后端 /graphql 节点
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
      // 配置GraphQL反向代理，转发至cms子域名
      '/api/graphql-proxy/**': {
        proxy: {
          // ⚡ 优化：代理目标直接指向真正的 GraphQL 接收端（防止 Nitro 路径拼接导致的多重斜杠）
          to: 'https://cms.chunchitools.com/**',
          
          // 透传原始 Host 和 Headers
          forwardHost: false, // 💡 注意：无头多域名架构下，设为 false 通常更稳定，让 WordPress 识别自己的真实 cms 域名

          // ⚡ 核心修复 1：重写 Cookie 的域名范围，确保主域与子域通配
          cookieDomainRewrite: {
            'cms.chunchitools.com': '.chunchitools.com',
            'chunchitools.com': '.chunchitools.com'
          },

          // ⚡ 核心修复 2：强制 Nitro 在转发和接收时，锁定 SameSite 属性为 None
          // 这样哪怕经过代理中转，写入浏览器的依然是解除跨域限制的特权 Cookie
          cookieSameSiteRewrite: {
            'cms.chunchitools.com': 'None',
            'chunchitools.com': 'None'
          }
        },
        // 允许跨域带凭证
        headers: {
          'Access-Control-Allow-Origin': 'https://chunchitools.com',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    }
  },
});