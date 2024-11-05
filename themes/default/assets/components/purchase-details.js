(function (
  document,
  window,
  jQuery,
  React,
  ReactDOM,
  SellixContext,
  SellixStoreFactory,
  SellixAddonsStore,
  SellixPriceVariantsStore,
  SellixProductPlansStore,
  sellixApi,
) {
  class PurchaseDetailsComponent {
    constructor({
      selector,
      selectorCaptchaV2,
      shop,
      cartEnabled,
      isCustomDomain,
      purchaseType,
      cart,
      product,
      bundles,
      theme,
      renderOptions,
      affiliateConversions,
    }) {
      this.domContainer = document.querySelector(selector);
      this.selectorCaptchaV2 = selectorCaptchaV2;
      this.shop = shop;
      this.affiliateConversions = affiliateConversions;
      this.cartEnabled = cartEnabled;
      this.isCustomDomain = isCustomDomain;
      this.purchaseType = purchaseType;
      this.cart = cart;
      this.product = product;
      this.bundles = bundles;
      this.theme = theme || {};
      this.renderOptions = renderOptions;
      this.isCaptchaV2Visible = false;
      this.shopStore = SellixStoreFactory.getStore(this.shop.name);

      this.addonsStore = new SellixAddonsStore(
        shop.name,
        this.purchaseType === 'checkout'
          ? Object.fromEntries(this.cart.getItems().map((p) => [p.uniqid, p.addons]))
          : { [product.uniqid]: product.addons },
      );
      this.priceVariantsStore = new SellixPriceVariantsStore(shop.name);
      this.productPlansStore = new SellixProductPlansStore(shop.name);

      const renderEvent = sellixHelper.getEventName({
        name: 'SellixRenderComponent',
        namespace: renderOptions.id,
      });
      jQuery(document).on(
        [
          'SellixCartUpdateEvent',
          'SellixAddonsUpdateEvent',
          'SellixVariantsUpdateEvent',
          'SellixProductPlansUpdateEvent',
          renderEvent,
        ].join(' '),
        () => {
          this.render();
        },
      );
    }

    onApplyCoupon = (data) => {
      return sellixApi.checkCoupon(data);
    };

    onCreateInvoiceOrSubscription = (type, data, token) => {
      data.clear_cart = true;
      const action = type === 'invoice' ? sellixApi.createInvoice : sellixApi.createProductSubscription;

      return action(data, {
        token: token,
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
        theme: this.theme.isDark ? 'dark' : 'light',
        onShowCaptchaV2: (visible) => {
          this.isCaptchaV2Visible = visible;
          this.render();
        },
      }).then((response) => {
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

    onGetCalculation = (data) => {
      return sellixApi.getCalculation(data);
    };

    onCustomerAuthEmail = (data) => {
      return sellixApi.customerAuthEmail({ shop_id: this.shop.id, ...data });
    };

    onCustomerAuthCode = (data) => {
      return sellixApi.customerAuthCode({ shop_id: this.shop.id, ...data });
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

    onChangeData = ({ type, value }) => {
      // console.log('Change', type, value);
    };

    onShowLogin = () => {
      jQuery(document).trigger('SellixLoginButtonClick');
    };

    onSuccess = ({ type, invoice, product_subscription }) => {
      switch (type) {
        case 'invoice-trial':
          break;
        case 'invoice':
          window.SellixAnalyticsManager.sendBeginCheckout(type, invoice);
          this.cart.clear(false, false);
          window.location.href = `invoice/${invoice.uniqid}`;
          break;
        case 'subscription':
          if (invoice) {
            window.SellixAnalyticsManager.sendBeginCheckout(type, invoice);
            this.cart.clear(false, false);
          }
          window.location.href = `product-subscription/${product_subscription.uniqid}`;
          break;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFail = () => {};

    onInsertInsights = (data) => {
      return sellixApi.insertInsights(data);
    };

    render() {
      const cartProducts = this.cart.getItems();

      ReactDOM.render(
        React.createElement(Purchase.PurchaseDetails, {
          type: this.purchaseType,
          config: SellixContext.getConfig(),
          currencyConfig: SellixContext.getCurrencyConfig(),
          isCartEnabled: this.cartEnabled,
          isCustomDomain: this.isCustomDomain,
          shopInfo: this.shop,
          productInfo: this.product || {},
          cartProducts: cartProducts,
          addons: this.addonsStore.getAll(),
          bundles: this.bundles,
          affiliateConversions: this.affiliateConversions,
          priceVariants: this.priceVariantsStore.getAll(),
          productPlans: this.productPlansStore.getAll(),
          theme: this.theme,
          sellixHelper: window.sellixHelper,
          sellixI18Next: window.sellixI18Next,
          onAddToCart: this.onAddToCart,
          onApplyCoupon: this.onApplyCoupon,
          onCreateInvoice: (data, token) => this.onCreateInvoiceOrSubscription('invoice', data, token),
          onCreateSubscription: (data, token) => this.onCreateInvoiceOrSubscription('subscription', data, token),
          onGetCalculation: this.onGetCalculation,
          onShowMessage: this.onShowMessage,
          onShowProductTerms: this.onShowProductTerms,
          onChangeProductQuantity: this.onChangeProductQuantity,
          onChangeStep: this.onChangeStep,
          onCustomerAuthEmail: this.onCustomerAuthEmail,
          onCustomerAuthCode: this.onCustomerAuthCode,
          onInsertInsights: this.onInsertInsights,
          onShowLogin: this.onShowLogin,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
          onChangeData: this.onChangeData,
          options: {
            customerLoginAvailable: false,
            isCaptchaV2Visible: this.isCaptchaV2Visible,
          },
        }),
        this.domContainer,
      );
    }
  }

  window.SellixPurchaseDetailsComponent = PurchaseDetailsComponent;
})(
  document,
  window,
  jQuery,
  React,
  ReactDOM,
  SellixContext,
  SellixStoreFactory,
  SellixAddonsStore,
  SellixPriceVariantsStore,
  SellixProductPlansStore,
  sellixApi,
);
