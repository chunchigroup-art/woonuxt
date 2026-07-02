export default defineAppConfig({

  company: {

    name: 'Chunchi Tools',

    url: 'https://chunchitools.com',

    email: 'support@chunchitools.com'

  },

  cart: {

    autoOpen: true,

    refreshAfterMutation: true

  },

  checkout: {

    external: true

  }

})