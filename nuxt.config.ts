import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
  ssr: false, 

  future: {
    compatibilityVersion: 4,
  },

  extends: ['./woonuxt_base'],

  components: [
    { path: './components', pathPrefix: false }
  ],

  image: {
    ipx: { external: false },
    provider: 'none'
  },

  // ⚡ 全网直连：把所有可能被底层读取的端点统统锁死为绝对路径
  runtimeConfig: {
    public: {
      GQL_HOST: 'https://cms.chunchitools.com/graphql',
      graphqlUrl: 'https://cms.chunchitools.com/graphql',
      wordpressUrl: 'https://cms.chunchitools.com', // 满足产品组件拼接要求
      wooCheckoutUrl: 'https://cms.chunchitools.com/checkout'
    }
  },

  // 强控 graphql-client 插件直连
  graphql: {
    clients: {
      default: {
        host: 'https://cms.chunchitools.com/graphql',
        options: {
          credentials: 'include'
        }
      }
    }
  },

  // 本地开发 Vite 配置
  vite: {
    server: {
      fs: {
        allow: ['..', path.resolve(__dirname, './woonuxt_base')]
      }
    }
  }
});