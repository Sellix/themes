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
      this.$checkoutButton = this.$cart.find('[data-cart-checkout-button]');

      this.itemTemplate = jQuery.templates(cartItemTemplateSelector);

      this.isOpened = false;

      this.$cart.find('[data-cart-icon]').on('click', this.open.bind(this));
      this.$checkoutButton.on('click', this.checkout.bind(this));
      this.$cart.find('[data-cart-clear-button]').on('click', this.clear.bind(this));
      this.$cart.find('[data-close-icon]').on('click', this.close.bind(this));
      this.$cartDropdown.on('click', this.close.bind(this));
      this.$cart.find('[data-cart-container]').on('click', (event) => event.stopPropagation());

      jQuery(document).on('SellixOpenCheckoutModal', (event, eventInfo) => {
        this.open(event, eventInfo);
      });

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

    open(event, eventInfo) {
      event.stopPropagation();

      let items = this.cart.getItems();
      if (items.length <= 0) {
        return;
      }

      sellixHelper.disableScroll();

      // close menu if it is opened
      jQuery('.snippet-mobile-sidebar-menu').removeClass('open');
      jQuery('.sidebar-toggler').removeClass('open');
      const $burgerButton = jQuery('.snippet-burger-button__burger-button');
      $burgerButton.removeClass('toggled');
      $burgerButton.addClass('untoggled');

      const { showContinueShoppingButton = false } = eventInfo || {};
      this.$cart.find('[data-cart-continue-shopping-button]').toggleClass('d-none', !showContinueShoppingButton);

      this.$cartDropdown.addClass('open');
      this.isOpened = true;
    }

    close(event) {
      if (this.isOpened) {
        this.$cartDropdown.removeClass('open');
        setTimeout(() => {
          this.isOpened = false;
          sellixHelper.enableScroll();
        }, 500);
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
      this.$checkoutButton.find('.link-button-label').addClass('d-none');
      this.$checkoutButton.find('.link-button-loader').removeClass('d-none');

      window.location.href = `checkout${window.location.search}`;
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
            const isValidPlus = sellixHelper.isValidCount({ ...product, count: product.quantity + 1 }, true);
            const isPayWhatYouWant = Boolean(product.pay_what_you_want);
            const isFree = +product.price_display === 0 && product.pay_what_you_want !== 1;

            let price = +product.price_display,
              priceWithDiscount = product.price_with_discount;

            if (isPayWhatYouWant && typeof product.customerPrice !== 'undefined') {
              price = product.customerPrice;
              priceWithDiscount = product.price_discount ? price - (price * product.price_discount) / 100 : price;
            }

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
                price_with_discount: `${priceWithDiscount.toFixed(2)}`,
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

            const isValidPlus = sellixHelper.isValidCount({ ...item, count: item.quantity + 1 }, true);
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
