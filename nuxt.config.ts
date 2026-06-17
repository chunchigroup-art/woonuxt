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
      // 保持合法的绝对 URL，彻底消灭所有编译时的 URL 解析错误
      GQL_HOST: 'https://cms.chunchitools.com/graphql',
      wordpressUrl: 'https://cms.chunchitools.com/graphql'
    }
  },

  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
  },
});