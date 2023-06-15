(function (window, jQuery, SellixStoreFactory) {
  class ProductVariantsStore {
    constructor(shop) {
      this.shop = shop;
      this.store = SellixStoreFactory.getStore(shop);
      this.key = 'productVariants';
    }

    getAll() {
      return this.store.get(this.key, {});
    }

    get(productId, defaultValue) {
      const variants = this.store.get(this.key, {});
      return variants[productId] || defaultValue;
    }

    set(productId, variant) {
      const variants = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...variants,
        [productId]: variant,
      });
      setTimeout(function () {
        jQuery(document).trigger('SellixProductVariantsUpdateEvent', { productId: productId, variant });
      }, 0);
    }
  }
  window.SellixProductVariantsStore = ProductVariantsStore;
})(window, jQuery, SellixStoreFactory);
