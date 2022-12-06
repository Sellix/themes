(function (document, window, jQuery, React, ReactDOM, SellixAddonsStore, SellixPriceVariantsStore, sellixApi) {
  class PurchaseDetailsComponent {
    constructor({
      selector,
      config,
      shop,
      cartEnabled,
      isCustomDomain,
      purchaseType,
      cart,
      product,
      bundles,
      theme,
      renderOptions,
    }) {
      this.domContainer = document.querySelector(selector);
      this.config = config;
      this.shop = shop;
      this.cartEnabled = cartEnabled;
      this.isCustomDomain = isCustomDomain;
      this.purchaseType = purchaseType;
      this.cart = cart;
      this.product = product;
      this.bundles = bundles;
      this.theme = theme;
      this.renderOptions = renderOptions;

      this.addonsStore = new SellixAddonsStore(shop.name);
      this.priceVariantsStore = new SellixPriceVariantsStore(shop.name);

      const renderEvent = sellixHelper.getEventName({
        name: 'SellixRenderComponent',
        namespace: renderOptions.id,
      });
      jQuery(document).on(
        ['SellixCartUpdateEvent', 'SellixAddonsUpdateEvent', 'SellixVariantsUpdateEvent', renderEvent].join(' '),
        () => {
          this.render();
        },
      );
    }

    onApplyCoupon = (data) => {
      return sellixApi.checkCoupon(data);
    };

    onCreateInvoice = (data) => {
      return sellixApi.createInvoice(data);
    };

    onCreateInvoiceTrial = (data) => {
      return sellixApi.createInvoiceTrial(data);
    };

    onCustomerAuthEmail = (data) => {
      return sellixApi.customerAuthEmail(data);
    };

    onCustomerAuthCode = (data) => {
      return sellixApi.customerAuthCode(data);
    };

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    onShowProductTerms = () => {
      jQuery('#product-terms-modal').modal({
        modalClass: '',
        blockerClass: '',
        showClose: false,
      });
    };

    onChangeProductQuantity = (uniqid, quantity) => {
      let changed = false;
      if (this.purchaseType === 'checkout') {
        const cartProduct = this.cart.getItemById(uniqid);
        if (quantity > cartProduct.quantity) {
          this.cart.add({ uniqid }, quantity - cartProduct.quantity);
          changed = true;
        } else if (quantity < cartProduct.quantity) {
          this.cart.remove(uniqid, cartProduct.quantity - quantity);
          changed = true;
        }
      } else {
        if (this.product.quantity !== quantity) {
          this.product = {
            ...this.product,
            quantity,
          };
          changed = true;
        }
      }

      if (changed) {
        this.render();
      }
    };

    onChangeStep = (step) => {
      jQuery(document).trigger('SellixPurchaseDetailsChangeStep', { step });
    };

    onAddToCart = (uniqid, quantity) => {
      let cartProduct;
      if (this.purchaseType === 'checkout') {
        cartProduct = this.cart.getItemById(uniqid);
      } else if (this.purchaseType === 'product' && this.product.uniqid === uniqid) {
        cartProduct = this.product;
      }

      if (!cartProduct) {
        return;
      }

      if (quantity > 0) {
        this.cart.add(cartProduct, quantity);
      } else if (quantity < 0) {
        this.cart.remove(uniqid, quantity);
      }
    };

    onSuccess = ({ type, invoice }) => {
      switch (type) {
        case 'invoice-trial':
          break;
        case 'invoice':
          this.cart.clear().then(() => {
            window.location.href = `/invoice/${invoice.uniqid}`;
          });
          break;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFail = () => {};

    render() {
      const cartProducts = this.cart.getItems();

      ReactDOM.render(
        React.createElement(Purchase.PurchaseDetails, {
          type: this.purchaseType,
          config: this.config,
          isCartEnabled: this.cartEnabled,
          isCustomDomain: this.isCustomDomain,
          shopInfo: this.shop,
          productInfo: this.product || {},
          cartProducts: cartProducts,
          addons: this.addonsStore.getAll(),
          bundles: this.bundles,
          priceVariants: this.priceVariantsStore.getAll(),
          theme: { isDark: this.theme.isDark },
          sellixHelper: window.sellixHelper,
          onAddToCart: this.onAddToCart,
          onApplyCoupon: this.onApplyCoupon,
          onCreateInvoice: this.onCreateInvoice,
          onCreateInvoiceTrial: this.onCreateInvoiceTrial,
          onShowMessage: this.onShowMessage,
          onShowProductTerms: this.onShowProductTerms,
          onChangeProductQuantity: this.onChangeProductQuantity,
          onChangeStep: this.onChangeStep,
          onCustomerAuthEmail: this.onCustomerAuthEmail,
          onCustomerAuthCode: this.onCustomerAuthCode,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
        }),
        this.domContainer,
      );
    }
  }

  window.SellixPurchaseDetailsComponent = PurchaseDetailsComponent;
})(document, window, jQuery, React, ReactDOM, SellixAddonsStore, SellixPriceVariantsStore, sellixApi);
