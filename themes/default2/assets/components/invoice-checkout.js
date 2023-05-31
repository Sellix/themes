(function (document, window, jQuery, React, ReactDOM) {
  class InvoiceCheckoutComponent {
    constructor({ selector, config, theme, shop, invoiceId, invoice, options }) {
      this.domContainer = document.querySelector(selector);
      this.config = config;
      this.theme = theme;
      this.shop = shop;
      this.invoiceId = invoiceId;
      this.invoice = invoice;
      this.options = options;
    }

    onGetInvoice = (id) => {
      return sellixApi.getInvoice(id);
    };

    onUpdateInvoice = (data) => {
      return sellixApi.updateInvoice(data);
    };

    onGetInvoiceInfo = (id, secret) => {
      return sellixApi.getInvoiceInfo(id, secret);
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

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    render() {
      ReactDOM.render(
        React.createElement(InvoiceCheckout.InvoiceCheckout, {
          config: this.config,
          theme: this.theme,
          shop: this.shop,
          invoiceId: this.invoiceId,
          invoice: this.invoice,
          options: this.options,
          onGetInvoice: this.onGetInvoice,
          onUpdateInvoice: this.onUpdateInvoice,
          onGetInvoiceInfo: this.onGetInvoiceInfo,
          onGetFeedback: this.onGetFeedback,
          onCreateFeedback: this.onCreateFeedback,
          onPostCashAppIdentifier: this.onPostCashAppIdentifier,
          onGetStripeLink: this.onGetStripeLink,
          onGetProductStripeLink: this.onGetProductStripeLink,
          onShowMessage: this.onShowMessage,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixInvoiceCheckoutComponent = InvoiceCheckoutComponent;
})(document, window, jQuery, React, ReactDOM);
