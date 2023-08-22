(function (document, window, jQuery, React, ReactDOM, SellixStoreFactory, sellixApi, sellixHelper) {
  class PayLinkComponent {
    constructor({ selector, config, theme, shop, paymentLinkId, paymentLink, products, options, selectorCaptchaV2 }) {
      this.selectorCaptchaV2 = selectorCaptchaV2;
      this.domContainer = document.querySelector(selector);
      this.config = config;
      this.theme = theme;
      this.shop = shop;
      this.paymentLinkId = paymentLinkId;
      this.paymentLink = paymentLink;
      this.products = products;
      this.options = options;
      this.isCaptchaV2Visible = false;
      this.shopStore = SellixStoreFactory.getStore(this.shop.name);
    }

    onGetPaymentLink = (id) => {
      return sellixApi.getPaymentLink(id);
    };

    onApplyCoupon = (data) => {
      return sellixApi.checkCoupon(data);
    };

    onGetFeedback = (id) => {
      return sellixApi.getFeedback(id);
    };

    onCreateFeedback = (data) => {
      return sellixApi.leaveFeedback(data);
    };

    onCreateInvoice = (data, token) => {
      return sellixApi.createInvoice(data, {
          token: token,
          useCaptchaV2: true,
          selectorCaptchaV2: this.selectorCaptchaV2,
          theme: this.theme.isDark ? 'dark' : 'light',
          onShowCaptchaV2: (visible) => {
            this.isCaptchaV2Visible = visible;
            this.render();
          },
        })
        .then((response) => {
          const { status, data } = response;
          if (status === 200) {
            const { invoice } = data;
            if (invoice) {
              const invoices = this.shopStore.get('invoices') || {};
              invoices[invoice.uniqid] = {
                uniqid: invoice.uniqid,
                secret: invoice.secret,
              };
              this.shopStore.set('invoices', invoices);
            }
          }
          return response;
        });
    };

    onSaveInvoiceToFile = (shopName, id, productType) => {
      sellixHelper.saveInvoiceToFile(shopName, id, productType);
    };

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };
    getCalculation = (data) => {
      return sellixApi.getCalculation(data)
        .then((response) => {
          const { status, data } = response;

          if (status === 200) {
            const { invoice } = data;
            if (invoice) {
              const invoices = this.shopStore.get('invoices') || {};
              invoices[invoice.uniqid] = {
                uniqid: invoice.uniqid,
                secret: invoice.secret,
              };
              this.shopStore.set('invoices', invoices);
            }
          }
          return response;
        });
    };

    onCustomerAuthEmail = (data) => {
      return sellixApi.customerAuthEmail(data);
    };
    onCustomerAuthCode = (data) => {
      return sellixApi.customerAuthCode(data);
    };

    onSuccess = ({ type, invoice }) => {
      switch (type) {
        case 'invoice-trial':
          break;
        case 'invoice':
          window.location.href = `invoice/${invoice.uniqid}`;
          break;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFail = () => {};

    render() {
      ReactDOM.render(
        React.createElement(PayLink.PayLink, {
          config: this.config,
          theme: this.theme,
          shop: this.shop,
          paymentLinkId: this.paymentLinkId,
          paymentLink: this.paymentLink,
          products: this.products,
          options: this.options,
          sellixI18Next: window.sellixI18Next,
          onCreateInvoice: this.onCreateInvoice,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
          onCustomerAuthEmail: this.onCustomerAuthEmail,
          onCustomerAuthCode: this.onCustomerAuthCode,
          onGetPaymentLink: this.onGetPaymentLink,
          getCalculation: this.getCalculation,
          onApplyCoupon: this.onApplyCoupon,
          onGetFeedback: this.onGetFeedback,
          onCreateFeedback: this.onCreateFeedback,
          onSaveInvoiceToFile: this.onSaveInvoiceToFile,
          onShowMessage: this.onShowMessage,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixPayLinkComponent = PayLinkComponent;
})(document, window, jQuery, React, ReactDOM, SellixStoreFactory, sellixApi, sellixHelper);
