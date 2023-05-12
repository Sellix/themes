(function (window, context) {
  class Context {
    static get(name, defaultValue) {
      return context[name] || defaultValue;
    }

    static set(name, value) {
      context[name] = value;
    }

    static getShopInfo() {
      return this.get('common', {}).shopInfo || {};
    }

    static getShopItems() {
      const products = this.getShopProducts();
      return (this.getShopInfo().items || [])
        .filter((itemId) => Boolean(products[itemId]))
        .map((itemId) => products[itemId]);
    }

    static getShopProducts() {
      return this.getShopInfo().products || {};
    }

    static getShopCategories() {
      return this.getShopInfo().categories || {};
    }
  }

  window.SellixContext = Context;
})(window, __RENDER_CONTEXT__);
