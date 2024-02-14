(function (document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper) {
  class InvoiceCheckoutComponent {
    constructor({ selector, theme, shop, invoiceId, invoice, options }) {
      this.domContainer = document.querySelector(selector);
      this.theme = theme;
      this.shop = shop;
      this.invoiceId = invoiceId;
      this.invoice = invoice;
      this.options = options;
    }

    onGetInvoice = (id) => {
      return sellixApi.getInvoice(id);
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

    onGetInvoiceTelegramInfo = (id, secret) => {
      return sellixApi.getInvoiceTelegramInfo(id, secret);
    };

    onPostCashAppIdentifier = (data) => {
      return sellixApi.postCashAppIdentifier(data);
    };

    onGetStripeLink = (id) => {
      return sellixApi.getStripeLink(id);
    };

    onGetProductStripeLink = (id) => {
      return sellixApi.getProductStripeLink(id);
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
          onGetInvoiceTelegramInfo: this.onGetInvoiceTelegramInfo,
          onGetFeedback: this.onGetFeedback,
          onCreateFeedback: this.onCreateFeedback,
          onPostCashAppIdentifier: this.onPostCashAppIdentifier,
          onGetStripeLink: this.onGetStripeLink,
          onGetProductStripeLink: this.onGetProductStripeLink,
          onSaveInvoiceToFile: this.onSaveInvoiceToFile,
          onShowMessage: this.onShowMessage,
          onGetInsightsTransaction: this.onGetInsightsTransaction,
          onInsertInsights: this.onInsertInsights,
          onGetEvmSpenders: this.onGetEvmSpenders,
          onSaveEvm: this.onSaveEvm,
          onPayEvm: this.onPayEvm,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixInvoiceCheckoutComponent = InvoiceCheckoutComponent;
})(document, window, jQuery, React, ReactDOM, SellixContext, SellixStoreFactory, sellixApi, sellixHelper);
