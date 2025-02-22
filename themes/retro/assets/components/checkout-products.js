(function (document, window, jQuery, sellixApi, sellixHelper) {
  class CheckoutProductsComponent {
    constructor(selector, cart, renderOptions, properties) {
      this.cart = cart;
      this.renderOptions = renderOptions;
      this.properties = properties;

      this.$products = jQuery(selector);
      this.$placeholder = this.$products.find('[data-product-placeholder] .snippet-checkout-product');

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
      if (product && !this.$products.find(`[data-checkout-product='${productId}']`).length) {
        const $placeholder = this.$placeholder.clone().removeClass('d-none');
        this.$products.append($placeholder);

        sellixApi
          .renderComponent(
            {
              ...this.renderOptions,
              path: [this.renderOptions.path, ['snippet', 'Checkout: Product'].join(':')].join(';'),
            },
            SellixContext.get('request'),
            {
              dependencies: [{ type: 'product', productId }],
              quantity: product.quantity,
              properties: this.properties,
            },
          )
          .then((resp) => {
            let $component = $(resp.html);
            $placeholder.replaceWith($component);
            setTimeout(function () {
              const eventName = sellixHelper.getEventName({
                name: 'SellixRenderComponent',
                namespace: resp.id,
              });
              $(document).trigger(eventName, { productId: product.uniqid });
            });
          })
          .catch((resp) => {
            $placeholder.remove();

            console.log(resp);
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