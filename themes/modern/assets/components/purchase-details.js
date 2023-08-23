(function (
  document,
  window,
  jQuery,
  React,
  ReactDOM,
  SellixContext,
  SellixStoreFactory,
  SellixProductAddonsStore,
  SellixProductVariantsStore,
  sellixApi,
) {
  class PurchaseDetailsComponent {
    constructor({
      selector,
      selectorCaptchaV2,
      config,
      shop,
      cartEnabled,
      cartEffect,
      isCustomDomain,
      purchaseType,
      cart,
      product,
      bundles,
      theme,
      renderOptions,
      affiliateConversions,
      options,
    }) {
      this.domContainer = document.querySelector(selector);
      this.selectorCaptchaV2 = selectorCaptchaV2;
      this.config = config;
      this.shop = shop;
      this.affiliateConversions = affiliateConversions;
      this.cartEnabled = cartEnabled;
      this.cartEffect = cartEffect;
      this.isCustomDomain = isCustomDomain;
      this.purchaseType = purchaseType;
      this.cart = cart;
      this.product = product;
      this.bundles = bundles;
      this.theme = theme || {};
      this.renderOptions = renderOptions;
      this.isCaptchaV2Visible = false;
      this.shopStore = SellixStoreFactory.getStore(this.shop.name);
      this.options = options || {};

      this.productAddonsStore = new SellixProductAddonsStore(
        shop.name,
        this.purchaseType === 'checkout'
          ? Object.fromEntries(this.cart.getItems().map((p) => [p.uniqid, p.addons]))
          : { [product.uniqid]: product.addons },
      );
      this.productVariantsStore = new SellixProductVariantsStore(shop.name);

      const renderEvent = sellixHelper.getEventName({
        name: 'SellixRenderComponent',
        namespace: renderOptions.id,
      });
      jQuery(document).on(
        [
          'SellixCartUpdateEvent',
          'SellixProductAddonsUpdateEvent',
          'SellixProductVariantsUpdateEvent',
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

    onCreateInvoice = (data, token) => {
      data.clear_cart = true;
      return sellixApi
        .createInvoice(data, {
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

    getCalculation = (data) => {
      return sellixApi.getCalculation(data).then((response) => {
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

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    onShowProductTerms = () => {
      jQuery('#product-terms-modal').modal({
        modalClass: '',
        blockerClass: 'sellix-overlay',
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
      const product = this.getProduct(uniqid);
      if (!product) {
        return;
      }

      const showCheckoutModal =
        this.cartEffect === SellixContext.CART_EFFECT_OPEN_CART_MODAL && !this.cart.getItemById(product.uniqid);

      if (quantity > 0) {
        this.cart.add(product, quantity);
      } else if (quantity < 0) {
        this.cart.remove(uniqid, quantity);
      }

      if (showCheckoutModal) {
        jQuery(document).trigger('SellixOpenCheckoutModal', { showContinueShoppingButton: true });
      }
    };

    onUpdateCart = (uniqid, updateBody) => {
      const product = this.getProduct(uniqid);
      if (!product) {
        return;
      }

      const showCheckoutModal =
        this.cartEffect === SellixContext.CART_EFFECT_OPEN_CART_MODAL && !this.cart.getItemById(product.uniqid);

      this.cart.set(product, updateBody);

      if (showCheckoutModal) {
        jQuery(document).trigger('SellixOpenCheckoutModal', { showContinueShoppingButton: true });
      }
    };

    onChangeData = ({ type, value }) => {
      // console.log('Change', type, value);
    };

    onSuccess = ({ type, invoice }) => {
      switch (type) {
        case 'invoice-trial':
          break;
        case 'invoice':
          this.cart.clear(false);
          window.location.href = `invoice/${invoice.uniqid}`;
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
          addons: this.productAddonsStore.getAll(),
          bundles: this.bundles,
          affiliateConversions: this.affiliateConversions,
          priceVariants: this.productVariantsStore.getAll(),
          theme: { ...this.theme },
          sellixHelper: window.sellixHelper,
          sellixI18Next: window.sellixI18Next,
          onAddToCart: this.onAddToCart,
          onUpdateCart: this.onUpdateCart,
          onApplyCoupon: this.onApplyCoupon,
          onCreateInvoice: this.onCreateInvoice,
          getCalculation: this.getCalculation,
          onShowMessage: this.onShowMessage,
          onShowProductTerms: this.onShowProductTerms,
          onChangeProductQuantity: this.onChangeProductQuantity,
          onChangeStep: this.onChangeStep,
          onCustomerAuthEmail: this.onCustomerAuthEmail,
          onCustomerAuthCode: this.onCustomerAuthCode,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
          onChangeData: this.onChangeData,
          options: {
            ...this.options,
            isCaptchaV2Visible: this.isCaptchaV2Visible,
            showQuickCheckoutButton: this.cartEffect === SellixContext.CART_EFFECT_QUICK_CHECKOUT_BUTTON,
          },
        }),
        this.domContainer,
      );
    }

    getProduct(uniqid) {
      if (this.purchaseType === 'checkout') {
        return this.cart.getItemById(uniqid);
      } else if (this.purchaseType === 'product' && this.product.uniqid === uniqid) {
        return this.product;
      }

      return;
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
  SellixProductAddonsStore,
  SellixProductVariantsStore,
  sellixApi,
);
