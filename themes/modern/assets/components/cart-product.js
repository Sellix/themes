(function (document, window, jQuery, sellixHelper, SellixContext) {
  const EFFECT_OPEN_CART_MODAL = 'open_cart_modal';
  const EFFECT_QUICK_CHECKOUT_BUTTON = 'quick_checkout_button';

  class CartProductComponent {
    constructor(selector, cart, productId, cartEffect, renderOptions) {
      this.cart = cart;
      this.productId = productId;
      this.cartEffect = cartEffect;
      this.renderOptions = renderOptions;

      this.$cart = jQuery(selector);
      this.$cartQuantity = this.$cart.find('[data-cart-product-quantity-value]');
      this.$cartCartFirstBtn = this.$cart.find('[data-cart-product-first-button]');
      this.$cartAddBtn = this.$cart.find('[data-cart-product-plus-button]');
      this.$cartRemoveBtn = this.$cart.find('[data-cart-product-minus-button]');
      this.$cartQuantityBtn = this.$cart.find('[data-cart-product-quantity-button]');
      this.$isGroup = this.$cart.find('[data-cart-product-is-group]');

      if (this.cartEffect === EFFECT_QUICK_CHECKOUT_BUTTON) {
        this.$quickCheckoutBtn = this.$cart.find('[data-quick-checkout-btn]');
        this.$quickCheckoutBtn.on('click', (event) => {
          event.stopPropagation();
          event.preventDefault();

          window.location.href = 'checkout';
        });
      } else {
        this.$quickCheckoutBtn = jQuery('<div></div>');
      }

      if (this.product.type !== 'SUBSCRIPTION' && !this.product.licensing_enabled) {
        this.$cart.on('click', (event) => {
          event.stopPropagation();
          event.preventDefault();
        });

        this.$cartAddBtn.on('click', (...args) => this.add(...args));
        this.$cartRemoveBtn.on('click', (...args) => this.remove(...args));

        this.$cartQuantityBtn.on('click', (...args) => {
          this.$cart.addClass('clicked');
          setTimeout(() => {
            this.$cart.removeClass('clicked');
          }, 1800);

          let timeout = this.$isGroup.data('cart-product-is-group') ? 0 : 1250;

          return this.addFirst(...args, timeout);
        });

        const renderEvent = sellixHelper.getEventName({
          name: 'SellixRenderComponent',
          namespace: renderOptions.id,
        });
        jQuery(document).on(`SellixCartUpdateEvent ${renderEvent}`, (_, eventInfo) => {
          if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.product.uniqid) {
            this.render();
          }
        });
      }
    }

    get product() {
      return SellixContext.getShopProduct(this.productId);
    }

    add(event, { isFirst = false } = {}) {
      event.stopPropagation();
      event.preventDefault();

      const quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;

      const isValid = sellixHelper.isValidCount(
        {
          ...this.product,
          count: quantity + 1,
        },
        true,
      );

      if (this.product.quantity_min > 1 && (quantity === 0 || quantity === undefined)) {
        this.cart.add(this.product, this.product.quantity_min);
      } else if (isValid) {
        this.cart.add(this.product);
      }

      if (isFirst && this.cartEffect === EFFECT_OPEN_CART_MODAL) {
        jQuery(document).trigger('SellixOpenCheckoutModal', { showContinueShoppingButton: true });
      }
    }

    addFirst(event, timeout) {
      event.stopPropagation();
      event.preventDefault();

      const quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      if (!quantity) {
        if (timeout) {
          setTimeout(() => this.add(event, { isFirst: true }), timeout);
        } else {
          this.add(event, { isFirst: true });
        }
      }
    }

    remove(event) {
      event.stopPropagation();
      event.preventDefault();

      const quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      if (quantity === this.product.quantity_min) {
        this.cart.remove(this.product.uniqid, this.product.quantity_min);
      } else {
        this.cart.remove(this.product.uniqid);
      }
    }

    render() {
      const quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      const isValidPlus = sellixHelper.isValidCount({ ...this.product, count: quantity + 1 }, true);
      const isValidMinus = sellixHelper.isValidCount({ ...this.product, count: quantity }, false);

      this.$cart.toggleClass('empty', quantity === 0);
      this.$cartQuantity.toggleClass('d-none', quantity === 0);
      this.$cartCartFirstBtn.toggleClass('d-none', quantity !== 0);

      this.$quickCheckoutBtn.toggleClass('d-none', quantity === 0);

      this.$cartAddBtn.toggleClass('invisible', !isValidPlus);
      this.$cartRemoveBtn.toggleClass('invisible', !isValidMinus);

      this.$cartQuantity.text(quantity);
    }
  }

  window.SellixCartProductComponent = CartProductComponent;
})(document, window, jQuery, sellixHelper, SellixContext);
