(function (window, document) {
  class AnalyticsManager {
    //   sendSelectItem(listId: string, listName: string, items: Item[]): void
    //   sendShare(method: string, content_type: string, item_id: string): void

    //   sendPurchase(invoice: Invoice): void

    static get manager() {
      return window.analyticsManager;
    }

    static sendViewItem() {
      if (!this.manager) {
        return;
      }

      const product = window.SellixContext.getProductInfo().product;
      if (!product) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const currencyConfig = window.SellixContext.getCurrencyConfig();
      const item = this._prepareProduct(shop.name, product);
      this.manager.sendViewItem(currencyConfig.default, item.price, [item]);
    }

    static sendViewCart() {
      if (!this.manager) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      $(document).on('SellixCartInitEvent', () => {
        const cart = window.SellixCartStoreFactory.getCart(shop.name);
        const cartProducts = cart.getItems();

        const currencyConfig = window.SellixContext.getCurrencyConfig();

        const cartItems = cartProducts.map((product) => this._prepareProduct(shop.name, product));
        const cartPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
        this.manager.sendViewCart(currencyConfig.default, cartPrice, cartItems);
      });
    }

    static sendAddToCart(products) {
      if (!this.manager) {
        return;
      }

      products = products || [];
      if (!products.length) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const currencyConfig = window.SellixContext.getCurrencyConfig();
      const items = products.map((product) => this._prepareProduct(shop.name, product));
      const price = items.reduce((acc, item) => acc + item.price, 0);
      this.manager.sendAddToCart(currencyConfig.default, price, items);
    }

    static sendRemoveFromCart(products) {
      if (!this.manager) {
        return;
      }

      products = products || [];
      if (!products.length) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const currencyConfig = window.SellixContext.getCurrencyConfig();
      const items = products.map((product) => this._prepareProduct(shop.name, product));
      const price = items.reduce((acc, item) => acc + item.price, 0);
      this.manager.sendRemoveFromCart(currencyConfig.default, price, items);
    }

    static sendBeginCheckout(type, invoice) {
      if (!this.manager) {
        return;
      }

      if (!invoice) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const invoiceItems = invoice.products.map((product) => this._prepareProduct(shop.name, product));
      const invoicePrice = invoiceItems.reduce((acc, item) => acc + item.price, 0);

      const payload = {
        type: invoice.type,
        uniqid: invoice.uniqid,
        currency: invoice.currency,
        gateway: invoice.gateway,
        content_name: type === 'invoice-trial' ? 'Trial' : 'Invoice',
        price: invoicePrice,
        items: invoiceItems,
      };

      const couponInfo = invoice.discount_breakdown.coupon;
      if (couponInfo) {
        payload.coupon = couponInfo.amount_display;
      }

      const affiliateRevenueInfo = invoice.discount_breakdown.affiliate_revenue;
      if (affiliateRevenueInfo) {
        payload.affiliate_revenue = affiliateRevenueInfo.total_display;
        payload.affiliate_revenue_currency = invoice.currency;
      }

      const taxInfo = invoice.discount_breakdown.tax;
      if (taxInfo) {
        payload.tax = taxInfo.percentage;
      }

      this.manager.sendBeginCheckout(payload);
    }

    static sendPurchase(invoice) {
      if (!this.manager) {
        return;
      }

      if (!invoice || invoice.status !== 'COMPLETED') {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const invoiceItems = invoice.products.map((product) => this._prepareProduct(shop.name, product));
      const invoicePrice = invoiceItems.reduce((acc, item) => acc + item.price, 0);

      const payload = {
        type: invoice.type,
        uniqid: invoice.uniqid,
        currency: invoice.currency,
        gateway: invoice.gateway,
        content_name: `Purchase`,
        price: invoicePrice,
        items: invoiceItems,
      };

      const couponInfo = invoice.discount_breakdown.coupon;
      if (couponInfo) {
        payload.coupon = couponInfo.amount_display;
      }

      const affiliateRevenueInfo = invoice.discount_breakdown.affiliate_revenue;
      if (affiliateRevenueInfo) {
        payload.affiliate_revenue = affiliateRevenueInfo.total_display;
        payload.affiliate_revenue_currency = invoice.currency;
      }

      const taxInfo = invoice.discount_breakdown.tax;
      if (taxInfo) {
        payload.tax = taxInfo.percentage;
      }

      this.manager.sendPurchase(payload);
    }

    static _prepareProduct(shopName, product) {
      const priceVariants = product.price_variants || [];
      let priceVariant = undefined;
      if (priceVariants.length) {
        const variantsStore = new window.SellixProductVariantsStore(shopName);
        priceVariant = variantsStore.get(product.uniqid, priceVariants[0]);
      }

      const price = +(priceVariant ? priceVariant.price : product.min_price);
      const priceWithDiscount = price * (1 - (product.price_discount || 0) / 100);
      const discount = price - priceWithDiscount;

      return {
        uniqid: product.uniqid,
        type: product.type,
        title: product.title,
        price: price,
        quantity: product.quantity || product.unit_quantity || 1,
        currency: product.currency,
        variant: priceVariant ? priceVariant.title : undefined,
        discount: discount,
        // coupon?: string
      };
    }
  }

  window.SellixAnalyticsManager = AnalyticsManager;
})(window, document);
