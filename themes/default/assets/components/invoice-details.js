(function (document, window, jQuery, React, ReactDOM, sellixApi) {
  class InvoiceDetailsComponent {
    constructor({ selector, config, shop, invoiceId, invoice, theme, settings = {} }) {
      this.domContainer = document.querySelector(selector);
      this.config = config;
      this.settings = settings;
      this.shop = shop;
      this.invoiceId = invoiceId;
      this.invoice = invoice;
      this.theme = theme;
      this.isVisibleProductDescription = false;
    }

    onGetInvoice = (id) => {
      return sellixApi.getInvoice(id);
    };

    onUpdateInvoice = (data) => {
      return sellixApi.updateInvoice(data);
    };

    onCompleteInvoice = ({ type, invoiceId }) => {
      if (type === 'subscription') {
        window.location.href = `/subscription/delivery/${invoiceId}`;
      } else {
        window.location.href = `/delivery/${invoiceId}`;
      }
    };

    onToggleShowProductInfo = () => {
      this.isVisibleProductDescription = !this.isVisibleProductDescription;
      jQuery(document).trigger('SellixInvoiceShowProductDescription', { visible: this.isVisibleProductDescription });
    };

    onValidateRecaptcha = (data) => {
      return sellixApi.validateCaptcha(data);
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

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSuccess = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFail = () => {};

    render() {
      ReactDOM.render(
        React.createElement(window.Invoice.InvoiceDetails, {
          config: this.config,
          settings: this.settings,
          theme: this.theme,
          invoiceId: this.invoiceId,
          invoiceInfo: this.invoice,
          onGetInvoice: this.onGetInvoice,
          onUpdateInvoice: this.onUpdateInvoice,
          onCompleteInvoice: this.onCompleteInvoice,
          onToggleShowProductInfo: this.onToggleShowProductInfo,
          onValidateRecaptcha: this.onValidateRecaptcha,
          onPostCashAppIdentifier: this.onPostCashAppIdentifier,
          onGetStripeLink: this.onGetStripeLink,
          onGetProductStripeLink: this.onGetProductStripeLink,
          onShowMessage: this.onShowMessage,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixInvoiceDetailsComponent = InvoiceDetailsComponent;
})(document, window, jQuery, React, ReactDOM, sellixApi);
