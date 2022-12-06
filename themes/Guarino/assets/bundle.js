(function (document, window, jQuery, sellixHelper) {
  class BundleComponent {
    constructor(selector, cart, bundle, isProduct, renderOptions) {
      this.cart = cart;
      this.bundle = bundle;
      this.isProduct = isProduct;
      this.renderOptions = renderOptions;

      this.$bundle = jQuery(selector);
      this.$addAllButton = this.$bundle.find('.add-all-button');

      this.$addAllButton.on('click', () => this.addAllProducts());

      this.renderEvents = ['SellixCartUpdateEvent', 'SellixRenderComponent'].map((eventName) => {
        return sellixHelper.getEventName({
          name: eventName,
          namespace: renderOptions.id,
          id: bundle.id,
        });
      });
      jQuery(document).on(this.renderEvents.join(' '), () => this.render());
    }

    addAllProducts() {
      const productIds = this.cart.getItems().map(({ uniqid }) => uniqid);
      const productsLeft = this.bundle.products_bound.filter(({ uniqid }) => !productIds.includes(uniqid));

      const productsToAdd = productsLeft
        .map((product) => {
          const { uniqid, quantity_min, on_hold, stock } = product;

          const quantity = (this.cart.getItemById(product.uniqid) || {}).quantity || 0;
          const valid = sellixHelper.isValidCount({ ...product, count: parseInt(quantity) + 1 });

          if (+stock === 0 || !!+on_hold) {
            return null;
          }

          if (quantity_min > 1 && (quantity === 0 || quantity === undefined)) {
            return { product, quantity: quantity_min };
          }

          if (valid) {
            return { product, quantity: 1 };
          }

          return null;
        })
        .filter((data) => Boolean(data));

      this.cart.addMany(productsToAdd);

      if (this.isProduct) {
        location.href = '/checkout';
      }
    }

    render() {
      const productIds = this.cart.getItems().map(({ uniqid }) => uniqid);
      const productsLeft = this.bundle.products_bound.filter(({ uniqid }) => !productIds.includes(uniqid));
      const productIdsLeft = productsLeft.map(({ uniqid }) => uniqid);

      if (!productsLeft.length) {
        this.$bundle.hide();
      } else {
        this.$bundle.show();
      }

      const $products = this.$bundle.find('.sellix-bundle-product');
      jQuery.each($products, (idx, product) => {
        const $product = jQuery(product);
        if (productIdsLeft.includes($product.data('productId'))) {
          $product.show();
        } else {
          $product.hide();
        }
      });
    }
  }
  window.SellixBundleComponent = BundleComponent;
})(document, window, jQuery, sellixHelper);
