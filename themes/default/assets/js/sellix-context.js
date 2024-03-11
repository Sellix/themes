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

    static async getShopItems() {
      const productIds = this.getShopInfo().items;
      return await this.getShopProducts(productIds);
    }

    static async getShopProducts(ids) {
      let products = this.getShopInfo().products || {};
      if (!ids) {
        return products;
      }

      const missedIds = ids.filter((id) => !Boolean(products[id]));
      if (missedIds.length) {
        const { products: missedProducts } = (await api.getProducts(missedIds)) || [];
        products = this.updateShopProducts(missedProducts);
      }

      return ids.filter((id) => Boolean(products[id])).map((id) => products[id]);
    }

    static async getShopProduct(id) {
      const products = await this.getShopProducts([id]);
      return products.find((product) => product.uniqid === id);
    }

    static updateShopProducts(updatedProducts) {
      let products = this.getShopInfo().products || {};
      products = {
        ...products,
        ...Object.fromEntries(updatedProducts.map((product) => [product.uniqid, product])),
      };
      this.getShopInfo().products = products;

      return products;
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
