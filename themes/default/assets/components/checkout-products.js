(function (document, window, jQuery, sellixApi, sellixHelper) {
  class CheckoutProductsComponent {
    constructor(selector, cart, renderOptions, properties) {
      this.cart = cart;
      this.renderOptions = renderOptions;
      this.properties = properties;

      this.$products = jQuery(selector);

      this.renderEvents = ['SellixCartUpdateEvent', 'SellixRenderComponent'].map((eventName) => {
        return sellixHelper.getEventName({
          name: eventName,
          namespace: renderOptions.id,
        });
      });
      jQuery(document).on(this.renderEvents.join(' '), (e, eventInfo) => {
        if (eventInfo && eventInfo.productId) {
          this.renderProduct(eventInfo.productId);
        }
      });
    }

    renderProduct(productId) {
      const product = this.cart.getItemById(productId);
      if (product && !this.$products.find(`#sellix-product-checkout-${productId}`).length) {
        sellixApi
          .renderComponent(
            {
              ...this.renderOptions,
              path: [this.renderOptions.path, ['snippet', 'Checkout product'].join(':')].join(';'),
            },
            { product, quantity: product.quantity, properties: this.properties },
          )
          .then((resp) => {
            const $component = $(resp.html);
            this.$products.append($component);
            setTimeout(function () {
              const eventName = sellixHelper.getEventName({
                name: 'SellixRenderComponent',
                namespace: resp.id,
              });
              $(document).trigger(eventName, { productId: product.uniqid });
            });
          })
          .catch((resp) => {
            const respJson = resp.responseJSON || {};
            jQuery(document).trigger('SellixToastify', {
              type: 'error',
              text: respJson.message || 'Internal server error',
            });
          });
      }
    }
  }
  window.SellixCheckoutProductsComponent = CheckoutProductsComponent;
})(document, window, jQuery, sellixApi, sellixHelper);
