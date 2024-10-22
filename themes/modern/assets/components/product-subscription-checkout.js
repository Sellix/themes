(function (document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper) {
  class ProductSubscriptionCheckoutComponent {
    constructor({ selector, theme, shop, productSubscriptionId, productSubscriptionInfo, options }) {
      this.domContainer = document.querySelector(selector);
      this.theme = theme;
      this.shop = shop;
      this.productSubscriptionId = productSubscriptionId;
      this.productSubscriptionInfo = productSubscriptionInfo;
      this.options = options;

      this.selectorCaptchaV2 = '#invoice-checkout-recaptcha-v2';
    }

    onGetProductSubscription = (id) => {
      return sellixApi.getProductSubscription(id).then((response) => {
        const { status, data } = response;
        if (status === 200) {
          const { invoice } = data || {};
          const currentInvoice = this.productSubscriptionInfo?.invoice;
          if (currentInvoice?.status !== 'COMPLETED' && invoice?.status === 'COMPLETED') {
            window.SellixAnalyticsManager.sendPurchase(invoice);
          }
        }
        return response;
      });
    };

    render() {
      ReactDOM.render(
        React.createElement(InvoiceCheckout.InvoiceCheckout, {
          type: 'product-subscription',
          config: SellixContext.getConfig(),
          currencyConfig: SellixContext.getCurrencyConfig(),
          theme: this.theme,
          shop: this.shop,
          options: this.options,
          sellixI18Next: window.sellixI18Next,
          onShowMessage: this.onShowMessage,
          productSubscriptionId: this.productSubscriptionId,
          productSubscriptionInfo: this.productSubscriptionInfo,
          onGetProductSubscription: this.onGetProductSubscription,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixProductSubscriptionCheckoutComponent = ProductSubscriptionCheckoutComponent;
})(document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper);
