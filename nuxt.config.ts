export default defineNuxtConfig({
  // 继承 WooNuxt 的核心基础配置层
  extends: ['./woonuxt_base'],

  // 组件自动导入配置
  components: [
    { path: './components', pathPrefix: false }
  ],

  // =========================================================================
  // 图像优化配置：强制 Vercel 生成下一代高效 WebP/AVIF 格式，体积暴减 70%
  // =========================================================================
  image: {
    domains: ['cms.chunchitools.com'], // 允许 Nuxt 优化和裁剪来自 cms. 子域的商品图片
    format: ['webp', 'avif'],          // 优先压缩为 WebP 和 AVIF 现代格式
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
    ipx: { external: false },
    provider: 'none'
  },

  // =========================================================================
  // 1. 扩展应用运行时配置，管理全站环境变量与本地同源代理基准
  // =========================================================================
  runtimeConfig: {
    public: {
      // 核心魔改：WooNuxt 底层 GraphQL 请求改走本地同源 Nitro 代理
      GQL_HOST: '/graphql-proxy',
      
      // 备用兜底：有些版本的 WooNuxt 还会读取这个变量，一并锁死为代理路径
      wordpressUrl: '/graphql-proxy',
      
      // ✨ 新增：专门给自定义的 useFetch 捞普通文章、分类或页面用的 REST API 代理基准
      wpRestUrl: '/wp-api',

      // 保持你系统可能需要的原始变量映射（从 .env 读取，作为服务端 SSR 备用或组件内引用）
      WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
      NUXT_PUBLIC_WP_URL: process.env.NUXT_PUBLIC_WP_URL
    }
  },

  // =========================================================================
  // 2. 配置 Nitro 服务器规则，建立前后端分离的跨域中转站与边缘网络缓存（ISR）
  // =========================================================================
  nitro: {
    // 建立反向代理规则，由 Vercel Node.js 服务端代替浏览器发起请求，完美规避 CORS 限制
    routeRules: {
      // ---------------------------------------------------------------------
      // ⚡ A. 动态中转代理通道（严格不加缓存，保持订单、购物车、会话的实时安全通信）
      // ---------------------------------------------------------------------
      // 核心：GraphQL 接口中转
      '/graphql-proxy/**': { 
        proxy: 'https://cms.chunchitools.com/graphql' 
      },
      
      // WordPress 常规 REST API 中转
      '/wp-api/**': { 
        proxy: 'https://cms.chunchitools.com/wp-json/**' 
      },

      // 1. 拦截前端发出的所有 WP 标准 API 请求（包含 PayPal 动态订单创建与状态同步）
      '/wp-json/**': { 
        proxy: 'https://cms.chunchitools.com/wp-json/**' 
      },

      // 2. 拦截旧版或特定第三方网关必备的 wc-api 回调/同步路径
      '/wc-api/**': { 
        proxy: 'https://cms.chunchitools.com/wc-api/**' 
      },

      // ---------------------------------------------------------------------
      // 🚀 B. Vercel 生产环境速度优化（ISR/SWR 边缘网络缓存，海外买家 0 毫秒秒开）
      // ---------------------------------------------------------------------
      '/': { isr: 3600 },                       // 独立站首页缓存 1 小时
      '/products/**': { isr: 3600 },             // 所有的商品详情、规格参数页缓存 1 小时
      '/resources/**': { isr: 3600 },            // 你的 Guides/Blog 等三个文章列表页缓存 1 小时
      '/blog/**': { isr: 3600 },                 // 技术文章、应用案例详情页缓存 1 小时
    },
  },

  // =========================================================================
  // 3. 构建与打包深度优化（移除非必要调试信息，压缩生产包体积）
  // =========================================================================
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 线上自动剥离所有 console.log，防止后台 API 泄露并提速
        }
      }
    }
  },

  // 你原有的预渲染静态化优化配置
  prerender: {
    concurrency: 10,
    interval: 1000,
    failOnError: false,
  },
});