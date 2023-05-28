(function (document, window, jQuery, SellixContext, sellixApi, sellixHelper) {
  class CartComponent {
    constructor(selector, cart, cartItemTemplateSelector, renderOptions) {
      this.cart = cart;
      this.selector = selector;
      this.renderOptions = renderOptions;

      this.$cart = jQuery(selector);
      this.$cartLength = this.$cart.find('[data-cart-icon] [data-cart-length]');
      this.$cartDropdown = this.$cart.find('[data-cart-dropdown]');
      this.$cartBody = this.$cart.find('[data-cart-dropdown-body]');

      this.itemTemplate = jQuery.templates(cartItemTemplateSelector);

      this.isOpened = false;

      this.$cart.find('[data-cart-icon]').on('click', this.open.bind(this));
      this.$cart.find('[data-cart-checkout-button]').on('click', this.checkout.bind(this));
      this.$cart.find('[data-cart-clear-button]').on('click', this.clear.bind(this));
      this.$cart.find('[data-close-icon]').on('click', this.close.bind(this));
      sellixHelper.onClickOutside(this.$cartDropdown.get(0), (...args) => this.close(...args));

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

    open(event) {
      event.stopPropagation();

      let items = this.cart.getItems();

      if (items.length) {
        // close menu if it is opened
        jQuery('.snippet-mobile-sidebar-menu').removeClass('open');
        jQuery('.sidebar-toggler').removeClass('open');
        const $burgerButton = jQuery('.snippet-burger-button__burger-button');
        $burgerButton.removeClass('toggled');
        $burgerButton.addClass('untoggled');

        this.$cart.find('[data-cart-dropdown]').addClass('open');
        this.isOpened = true;
      }
    }

    close(event) {
      if (this.isOpened) {
        this.$cart.find('[data-cart-dropdown]').removeClass('open');
        this.isOpened = false;
      }
    }

    add(event) {
      const items = this.cart.getItems();
      const productId = jQuery(event.delegateTarget).data('product-id');
      const product = items.find((item) => item.uniqid === productId);
      this.cart.add(product);
    }

    remove(event) {
      const items = this.cart.getItems();
      const productId = jQuery(event.delegateTarget).data('product-id');
      const product = items.find((item) => item.uniqid === productId);

      if (product.quantity === product.quantity_min) {
        this.cart.remove(productId, product.quantity_min);
      } else {
        this.cart.remove(productId);
      }

      this.checkItems();
    }

    removeProduct(event) {
      const productId = jQuery(event.delegateTarget).data('product-id');
      console.log('Remove Product', productId);
      this.cart.remove(productId, 0);
      this.checkItems();
    }

    checkItems() {
      const items = this.cart.getItems();
      if (!items.length) {
        this.$cartBody.html('');
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
          window.location.href = 'checkout';
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
            const price = +product.price_display;
            const inStock = product.stock === -1 ? '∞' : product.stock;
            const isValidPlus = sellixHelper.isValidCount({ ...product, count: product.quantity + 1 });
            const isFree = +product.price_display === 0 && product.pay_what_you_want !== 1;
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
                currency_title: SellixContext.getCurrencyList()[product.currency],
                price: `${price.toFixed(2)}`,
                price_with_discount: `${product.price_with_discount.toFixed(2)}`,
              },
              isValidPlus,
              equalQuantity,
              inStock,
              hasImage,
              isFree,
              isPriceDiscount: product.price_discount && !isFree,
            };
          });

          const $body = jQuery(this.itemTemplate.render(itemsForRendering));
          $body.find('[data-cart-add-button]').on('click', this.add.bind(this));
          $body.find('[data-cart-remove-button]').on('click', this.remove.bind(this));
          $body.find('[data-cart-remove-product-button]').on('click', this.removeProduct.bind(this));
          this.$cartBody.append($body);

          break;
        case 'update':
          let updatedProducts = products;
          if (productId) {
            updatedProducts = products.filter(({ uniqid }) => uniqid === productId);
          }
          updatedProducts.forEach((item) => {
            this.$cartBody.find(`#cart-product-${item.uniqid} [data-cart-product-quantity]`).text(item.quantity);

            const isValidPlus = sellixHelper.isValidCount({ ...item, count: item.quantity + 1 });
            const $plusButton = this.$cartBody.find(`#cart-product-${item.uniqid} [data-cart-add-button]`);
            if (isValidPlus) {
              $plusButton.css('visibility', 'initial');
            } else {
              $plusButton.css('visibility', 'hidden');
            }
          });
          break;
        case 'delete':
          if (productId) {
            const $cartProduct = this.$cartBody.find(`#cart-product-${productId}`);
            $cartProduct
              .find('[data-cart-add-button],[data-cart-remove-button],[data-cart-remove-product-button]')
              .off('click');
            $cartProduct.remove();
          } else {
            this.$cart
              .find('[data-cart-add-button],[data-cart-remove-button],[data-cart-remove-product-button]')
              .off('click');
            this.$cartBody.html('');
          }
          break;
      }

      this.$cartLength.text(products.length);
    }
  }

  window.SellixCartComponent = CartComponent;
})(document, window, jQuery, SellixContext, sellixApi, sellixHelper);
