(function (window, context, SellixApiClass) {
  const api = new SellixApiClass();

  class Context {
    static get CART_EFFECT_OPEN_CART_MODAL() {
      return 'open_cart_modal';
    }
    static get CART_EFFECT_QUICK_CHECKOUT_BUTTON() {
      return 'quick_checkout_button';
    }

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
      const productIds = this.getShopInfo().items;
      return this.getShopProducts(productIds);
    }

    static getGiftCardsInfo() {
      return this.getShopInfo().generatedGiftCards;
    }

    static getShopProducts(ids) {
      let products = this.getShopInfo().products || {};
      if (!ids) {
        return Object.values(products);
      }

      return ids.filter((id) => Boolean(products[id])).map((id) => products[id]);
    }

    static getShopProduct(id) {
      const products = this.getShopProducts();
      return products.find((product) => product.uniqid === id);
    }

    static updateShopProducts(updatedProducts) {
      let products = this.getShopInfo().products || {};
      products = {
        ...products,
        ...Object.fromEntries(
          updatedProducts.map((product) => [product.uniqid, { ...(products[product.uniqid] || {}), ...product }]),
        ),
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
  }

  window.SellixContext = Context;
})(window, __RENDER_CONTEXT__, SellixApiClass);
