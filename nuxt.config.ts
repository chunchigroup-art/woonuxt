export default defineNuxtConfig({
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

  // ⚡ 恢复最纯粹的绝对路径模式：确保两端数据100%能抓到
  runtimeConfig: {
    public: {
      GQL_HOST: 'https://cms.chunchitools.com/graphql',
      wordpressUrl: 'https://cms.chunchitools.com/graphql'
    }
  }
});