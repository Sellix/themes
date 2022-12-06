(function (document, window, jQuery, SellixContext, sellixApi, sellixHelper) {
  class CartComponent {
    constructor(selector, cart, cartItemTemplateSelector, renderOptions) {
      this.cart = cart;
      this.selector = selector;
      this.renderOptions = renderOptions;

      this.$cart = jQuery(selector);
      this.$cartLength = this.$cart.find('.cart-icon .cart-length');
      this.$cartBody = this.$cart.find('.cart-dropdown-body');

      this.itemTemplate = jQuery.templates(cartItemTemplateSelector);

      sellixHelper.onClickOutside(this.$cart.get(0), (...args) => this.close(...args));

      this.$cart.find('.cart-icon').on('click', (...args) => this.toggle(...args));
      this.$cart.find('.sellix-cart-checkout-button').on('click', (...args) => this.checkout(...args));
      this.$cart.find('.sellix-cart-clear-button').on('click', (...args) => this.clear(...args));

      const renderEvent = sellixHelper.getEventName({
        name: 'SellixRenderComponent',
        namespace: renderOptions.id,
      });
      jQuery(document).on(`SellixCartUpdateEvent ${renderEvent}`, (_, eventInfo) => {
        const productId = eventInfo && eventInfo.productId;
        const action = (eventInfo && eventInfo.action) || 'update';
        this.render({ action, productId });
      });
    }

    toggle() {
      let items = this.cart.getItems();

      if (items.length) {
        this.$cart.find('.cart-dropdown').toggleClass('open');
      }
    }

    close() {
      this.$cart.find('.cart-dropdown').removeClass('open');
    }

    add(event) {
      let items = this.cart.getItems();
      let data = jQuery(event.delegateTarget).data();
      let productId = data.productId;
      let product = items.find((item) => item.uniqid === productId);
      this.cart.add(product);
    }

    remove(event) {
      let items = this.cart.getItems();
      let data = jQuery(event.delegateTarget).data();
      let productId = data.productId;
      let product = items.find((item) => item.uniqid === productId);

      if (product.quantity === product.quantity_min) {
        this.cart.remove(productId, product.quantity_min);
      } else {
        this.cart.remove(productId);
      }

      items = this.cart.getItems();
      if (!items.length) {
        this.close();
      }
    }

    clear() {
      this.cart.clear();
      this.close();
    }

    checkout() {
      const products = this.cart.getItems().map(({ uniqid, quantity }) => ({ uniqid, quantity }));
      sellixApi
        .updateCart(products)
        .then(() => {
          window.location.href = '/checkout';
        })
        .catch((resp) => {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        });
    }

    render({ action, productId } = { action: 'insert' }) {
      let products = this.cart.getItems();

      switch (action) {
        case 'insert':
          let newProducts = products;
          if (productId) {
            newProducts = products.filter(({ uniqid }) => uniqid === productId);
          }

          let itemsForRendering = newProducts.map((product, key) => {
            const hasImage = !!product.cloudflare_image_id;
            const equalQuantity = product.quantity_min === product.quantity_max;
            const inStock = product.stock === -1 ? '∞' : product.stock;
            const isValidPlus = sellixHelper.isValidCount({ ...product, count: product.quantity + 1 });
            return {
              id: this.selector,
              key,
              product: {
                ...product,
                cdn_image_url: sellixHelper.getImageUrl(
                  product.cloudflare_image_id,
                  'productImageCart',
                  SellixContext.get('theme', {}).isDark,
                ),
              },
              isValidPlus,
              equalQuantity,
              inStock,
              hasImage,
            };
          });

          const $body = jQuery(this.itemTemplate.render(itemsForRendering));
          $body.find('.sellix-cart-add-button').on('click', (...args) => this.add(...args));
          $body.find('.sellix-cart-remove-button').on('click', (...args) => this.remove(...args));
          this.$cartBody.append($body);

          break;
        case 'update':
          let updatedProducts = products;
          if (productId) {
            updatedProducts = products.filter(({ uniqid }) => uniqid === productId);
          }
          updatedProducts.forEach((item) => {
            this.$cartBody.find(`#cart-product-${item.uniqid} .cart-product-quantity`).text(item.quantity);
          });
          break;
        case 'delete':
          if (productId) {
            const $cartProduct = this.$cartBody.find(`#cart-product-${productId}`);
            $cartProduct.find('.sellix-cart-add-button,.sellix-cart-remove-button').off('click');
            $cartProduct.remove();
          } else {
            this.$cart.find('.sellix-cart-add-button,.sellix-cart-remove-button').off('click');
            this.$cartBody.html('');
          }
          break;
      }

      if (products.length) {
        this.$cartLength.text(products.length);
        this.$cartLength.show();
      } else {
        this.$cartLength.hide();
        this.$cartLength.text('');
      }
    }
  }

  window.SellixCartComponent = CartComponent;
})(document, window, jQuery, SellixContext, sellixApi, sellixHelper);
