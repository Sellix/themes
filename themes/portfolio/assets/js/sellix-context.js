(function (window, context) {
  class Context {
    static get(name, defaultValue) {
      return context[name] || defaultValue;
    }

    static set(name, value) {
      context[name] = value;
    }

    static getConfig() {
      return this.get('config', {});
    }

    static getCurrencyConfig() {
      return this.get('currencyConfig', {});
    }

    static getCurrencyOptions(currency) {
      return (this.getCurrencyConfig().allCurrencies || {})[currency];
    }

    static getShopInfo() {
      return this.get('common', {}).shopInfo || {};
    }

    static getShopItems() {
      return this.getShopInfo().items;
    }

    static getShopProducts(ids) {
      let products = this.getShopItems();
      if (!ids) {
        return products;
      }
      return products.filter((product) => ids.includes(product.uniqid));
    }

    static getShopProduct(id) {
      const products = this.getShopProducts();
      return products.find((product) => product.uniqid === id);
    }

    static getShopCategories() {
      return this.getShopInfo().categories || {};
    }

    static getTheme() {
      return this.get('theme', {});
    }

    static getProductInfo() {
      return this.get('common', {}).productInfo || {};
    }

    static getInvoiceInfo() {
      return this.get('common', {}).invoiceInfo || {};
    }

    static getPayLinkInfo() {
      return this.get('common', {}).payLinkInfo || {};
    }
  }

  window.SellixContext = Context;
})(window, __RENDER_CONTEXT__);
