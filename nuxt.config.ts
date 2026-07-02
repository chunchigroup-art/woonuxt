export default defineNuxtConfig({

  future: {

    compatibilityVersion: 4

  },

  extends: ['./woonuxt_base'],

  devtools: {

    enabled: true

  },

  modules: [

    '@pinia/nuxt',

    '@nuxt/image'

  ],

  runtimeConfig: {

    public: {

      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,

      wordpressUrl: process.env.NUXT_PUBLIC_WORDPRESS_URL,

      shopUrl: process.env.NUXT_PUBLIC_SHOP_URL,

      apiUrl: process.env.NUXT_PUBLIC_API_URL,

      currency: process.env.NUXT_PUBLIC_CURRENCY,

      locale: process.env.NUXT_PUBLIC_LOCALE

    }

  },

  routeRules: {

    '/': {

      isr: 3600

    },

    '/product/**': {

      isr: 3600

    },

    '/product-category/**': {

      isr: 3600

    },

    '/blog/**': {

      isr: 86400

    },

    '/cart': {

      ssr: false

    },

    '/checkout': {

      ssr: false

    },

    '/my-account/**': {

      ssr: false

    }

  }

})