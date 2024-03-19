(function (window, document) {
  class AnalyticsManager {
    static get manager() {
      return window.analyticsManager;
    }

    static sendViewItem(uniqid = null) {
      if (!this.manager) {
        return;
      }

      const product = !uniqid
        ? window.SellixContext.getProductInfo().product
        : window.SellixContext.getShopProduct(uniqid);
      if (!product) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const currencyConfig = window.SellixContext.getCurrencyConfig();
      const item = this._prepareProduct(shop.name, product);
      const items = [item];
      const price = item.price * item.quantity;
      this.manager.sendViewItem(currencyConfig.default, price, items);
    }

    static sendViewCart() {
      if (!this.manager) {
        return;
      }

      const shop = window.SellixContext.getShopInfo().shop;
      if (!shop) {
        return;
      }

      const cart = window.SellixCartStoreFactory.getCart(shop.name);
      const cartProducts = cart.getItems();

      const currencyConfig = window.SellixContext.getCurrencyConfig();

      const cartItems = cartProducts.map((product) => this._prepareProduct(shop.name, product));
      const cartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      this.manager.sendViewCart(currencyConfig.default, cartPrice, cartItems);
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
      const price = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
      const price = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

      const payload = this._prepareInvoicePayload(invoice);
      payload.content_name = type === 'invoice-trial' ? 'Trial' : 'Invoice';
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

      const payload = this._prepareInvoicePayload(invoice);
      payload.content_name = 'Purchase';
      this.manager.sendPurchase(payload);
    }

    static _prepareInvoicePayload(invoice) {
      const shop = window.SellixContext.getShopInfo().shop;
      const discountBreakdown = invoice.discount_breakdown || {};
      const priceDiscount = discountBreakdown.price_discount || {};
      const volumeDiscount = discountBreakdown.volume_discounts || {};
      const productVariants = invoice.product_variants || {};

      const invoiceItems = invoice.products.map((product) => {
        const item = this._prepareProduct(shop.name, product);

        item.quantity = product.unit_quantity || 1;
        item.price = product.unit_price_display || product.price_display;

        item.discount = 0;
        if (priceDiscount[item.uniqid]) {
          item.discount += priceDiscount[item.uniqid].amount_display;
        }
        if (volumeDiscount[item.uniqid]) {
          item.discount += volumeDiscount[item.uniqid].amount_display;
        }

        if (productVariants[item.uniqid]) {
          item.variant = productVariants[item.uniqid].title;
        }

        return item;
      });

      const payload = {
        type: invoice.type,
        uniqid: invoice.uniqid,
        currency: invoice.currency,
        gateway: invoice.gateway,
        content_name: 'Invoice',
        price: invoice.total_display,
        items: invoiceItems,
      };

      const couponInfo = discountBreakdown.coupon;
      if (couponInfo) {
        payload.coupon = couponInfo.amount_display;
      }

      const affiliateRevenueInfo = discountBreakdown.affiliate_revenue;
      if (affiliateRevenueInfo) {
        payload.affiliate_revenue = affiliateRevenueInfo.total_display;
        payload.affiliate_revenue_currency = invoice.currency;
      }

      const taxInfo = discountBreakdown.tax;
      if (taxInfo) {
        payload.tax = taxInfo.percentage;
      }

      return payload;
    }

    static _prepareProduct(shopName, product) {
      const priceVariants = product.price_variants || [];
      let priceVariant = undefined;
      if (priceVariants.length) {
        const variantsStore = new window.SellixPriceVariantsStore(shopName);
        priceVariant = variantsStore.get(product.uniqid, priceVariants[0]);
      }

      const price = +(priceVariant ? priceVariant.price : product.min_price);
      const priceWithDiscount = price * (1 - (product.price_discount || 0) / 100);
      const discount = price - priceWithDiscount;

      return {
        uniqid: product.uniqid,
        type: product.item_type,
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
