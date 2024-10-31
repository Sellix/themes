(function (window, jQuery, SellixStoreFactory) {
  class ProductPlansStore {
    constructor(shop) {
      this.shop = shop;
      this.store = SellixStoreFactory.getStore(shop);
      this.key = 'productPlans';
    }

    getAll() {
      return this.store.get(this.key, {});
    }

    get(productId, defaultValue) {
      const plans = this.store.get(this.key, {});
      return plans[productId] || defaultValue;
    }

    set(productId, plan) {
      const plans = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...plans,
        [productId]: plan,
      });
      setTimeout(function () {
        jQuery(document).trigger('SellixProductPlansUpdateEvent', { productId: productId, plan });
      }, 0);
    }
  }
  window.SellixProductPlansStore = ProductPlansStore;
})(window, jQuery, SellixStoreFactory);
