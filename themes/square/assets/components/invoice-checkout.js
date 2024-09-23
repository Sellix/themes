(function (document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper) {
  class InvoiceCheckoutComponent {
    constructor({ selector, theme, shop, invoiceId, invoice, options }) {
      this.domContainer = document.querySelector(selector);
      this.theme = theme;
      this.shop = shop;
      this.invoiceId = invoiceId;
      this.invoice = invoice;
      this.options = options;

      this.selectorCaptchaV2 = '#invoice-checkout-recaptcha-v2';
    }

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

    onGetInvoiceRewards = (id) => {
      return sellixApi.getInvoiceRewards(id);
    };

    onUpdateInvoice = (data) => {
      return sellixApi.updateInvoice(data);
    };

    onRefreshInvoice = (data) => {
      return sellixApi.refreshInvoice(data);
    };

    onGetInvoiceSecret = (shopName, id) => {
      const shopStore = SellixStoreFactory.getStore(shopName);
      const invoices = shopStore.get('invoices') || {};
      return (invoices[id] || {}).secret;
    };

    onGetInvoiceInfo = (id, secret) => {
      return sellixApi.getInvoiceInfo(id, secret);
    };

    onGetInvoiceStatus = (id) => {
      return sellixApi.getInvoiceStatus(id);
    };

    onGetInvoiceTelegramInfo = (id, secret) => {
      return sellixApi.getInvoiceTelegramInfo(id, secret);
    };

    onPostCashAppIdentifier = (data) => {
      return sellixApi.postCashAppIdentifier(data);
    };

    onPostCashAppVerifyPayment = (data) => {
      return sellixApi.postCashAppVerifyPayment(data);
    };

    onGetStripeLink = (id) => {
      return sellixApi.getStripeLink(id);
    };

    onPostProductStripeLink = (id, data) => {
      return sellixApi.postProductStripeLink(id, data, {
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onPostStripeConfirmPayment = (data) => {
      return sellixApi.postStripeConfirmPayment(data, {
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
      });
    };

    onPostSquareCreatePayment = (data) => {
      return sellixApi.postSquareCreatePayment(data);
    };

    onPostSquareRefreshPaymentStatus = (data) => {
      return sellixApi.postSquareRefreshPaymentStatus(data);
    };

    onGetFeedback = (id) => {
      return sellixApi.getFeedback(id);
    };

    onCreateFeedback = (data) => {
      return sellixApi.leaveFeedback(data);
    };

    onSaveInvoiceToFile = (shopName, id, productType) => {
      sellixHelper.saveInvoiceToFile(shopName, id, productType);
    };

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
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
          config: SellixContext.getConfig(),
          currencyConfig: SellixContext.getCurrencyConfig(),
          theme: this.theme,
          shop: this.shop,
          invoiceId: this.invoiceId,
          invoice: this.invoice,
          options: this.options,
          sellixI18Next: window.sellixI18Next,
          onGetInvoice: this.onGetInvoice,
          onGetInvoiceRewards: this.onGetInvoiceRewards,
          onUpdateInvoice: this.onUpdateInvoice,
          onRefreshInvoice: this.onRefreshInvoice,
          onGetInvoiceSecret: this.onGetInvoiceSecret,
          onGetInvoiceInfo: this.onGetInvoiceInfo,
          onGetInvoiceStatus: this.onGetInvoiceStatus,
          onGetInvoiceTelegramInfo: this.onGetInvoiceTelegramInfo,
          onGetFeedback: this.onGetFeedback,
          onCreateFeedback: this.onCreateFeedback,
          onPostCashAppIdentifier: this.onPostCashAppIdentifier,
          onPostCashAppVerifyPayment: this.onPostCashAppVerifyPayment,
          onGetStripeLink: this.onGetStripeLink,
          onPostProductStripeLink: this.onPostProductStripeLink,
          onPostStripeConfirmPayment: this.onPostStripeConfirmPayment,
          onPostSquareCreatePayment: this.onPostSquareCreatePayment,
          onPostSquareRefreshPaymentStatus: this.onPostSquareRefreshPaymentStatus,
          onSaveInvoiceToFile: this.onSaveInvoiceToFile,
          onShowMessage: this.onShowMessage,
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

  window.SellixInvoiceCheckoutComponent = InvoiceCheckoutComponent;
})(document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper);