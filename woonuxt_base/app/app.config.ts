/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'CHUNCHI',
  shortDescription: 'Leading B2B Supplier of Professional HVAC/R Tools & Refrigeration Equipment.',
  description: `CHUNCHI TOOLS is your one-stop strategic partner for high-performance HVAC/R solutions. We specialize in copper pipes, precision manifold gauges, vacuum pumps, and specialized maintenance tools for global wholesale and OEM/ODM projects.`,
  baseUrl: 'https://chunchitools.com',
  siteImage: 'https://chunchitools.com/og-image.jpg',
  storeSettings: {
    autoOpenCart: false,
    // cartMode: 'optimistic' updates UI immediately; 'safe' waits for the server response.
    cartMode: 'optimistic',
    showReviews: true,
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: true,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: false,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});
