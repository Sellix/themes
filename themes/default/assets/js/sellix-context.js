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

    static getCurrencyList() {
      return this.get('config', {}).CURRENCY_LIST || {};
    }

    static getTheme() {
      return this.get('theme', {});
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
