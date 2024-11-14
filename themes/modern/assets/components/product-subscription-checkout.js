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

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    onGetInvoice = (id) => {
      return sellixApi.getInvoice(id).then((response) => {
        const { status, data } = response;
        if (status === 200) {
          const { invoice } = data || {};
          if (this.invoice && invoice && this.invoice.status !== 'COMPLETED' && invoice.status === 'COMPLETED') {
            window.SellixAnalyticsManager.sendPurchase(invoice);
          }
        }
        return response;
      });
    };

    onGetInvoiceStatus = (id) => {
      return sellixApi.getInvoiceStatus(id);
    };

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

    onGetProductSubscriptionStatus = (id) => {
      return sellixApi.getProductSubscriptionStatus(id);
    };

    onUpdateProductSubscription = (data, token) => {
      return sellixApi.updateProductSubscription(data, {
        token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onGetPaymentMethods = (data, token) => {
      return sellixApi.getPaymentMethods(data, {
        token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onConfirmProductSubscriptionPayment = (data, token) => {
      return sellixApi.confirmProductSubscriptionPayment(data, {
        token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onStripeCreateSetupIntent = (data, token) => {
      return sellixApi.stripeCreateSetupIntent(data, {
        token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onStripeRefreshSetupIntent = (data, token) => {
      return sellixApi.stripeRefreshSetupIntent(data, {
        token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onGetInsightsTransaction = (data) => {
      return sellixApi.getInsightsTransaction(data);
    };

    onInsertInsights = (data) => {
      return sellixApi.insertInsights(data);
    };

    onGetEvmSpenders = () => {
      return sellixApi.getEvmSpenders();
    };

    onSaveEvm = (data) => {
      return sellixApi.saveEvm(data);
    };

    onPayEvm = (data) => {
      return sellixApi.payEvm(data);
    };

    onGetMeshNetworks = () => {
      return sellixApi.getMeshNetworks();
    };

    onGetMeshToken = (data) => {
      return sellixApi.getMeshToken(data);
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
          onGetInvoice: this.onGetInvoice,
          onGetInvoiceStatus: this.onGetInvoiceStatus,
          onGetProductSubscription: this.onGetProductSubscription,
          onGetProductSubscriptionStatus: this.onGetProductSubscriptionStatus,
          onUpdateProductSubscription: this.onUpdateProductSubscription,
          onGetPaymentMethods: this.onGetPaymentMethods,
          onConfirmProductSubscriptionPayment: this.onConfirmProductSubscriptionPayment,
          onStripeCreateSetupIntent: this.onStripeCreateSetupIntent,
          onStripeRefreshSetupIntent: this.onStripeRefreshSetupIntent,
          onGetInsightsTransaction: this.onGetInsightsTransaction,
          onInsertInsights: this.onInsertInsights,
          onGetEvmSpenders: this.onGetEvmSpenders,
          onSaveEvm: this.onSaveEvm,
          onPayEvm: this.onPayEvm,
          onGetMeshNetworks: this.onGetMeshNetworks,
          onGetMeshToken: this.onGetMeshToken,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixProductSubscriptionCheckoutComponent = ProductSubscriptionCheckoutComponent;
})(document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper);
