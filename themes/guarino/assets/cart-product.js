(function (document, window, jQuery, sellixHelper) {
  class CartProductComponent {
    constructor(selector, cart, product, redirectToCheckout, renderOptions) {
      this.cart = cart;
      this.product = product;
      this.redirectToCheckout = redirectToCheckout;
      this.renderOptions = renderOptions;

      this.$cart = jQuery(selector);
      this.$cartQuantity = this.$cart.find('.cart-product-quantity');
      this.$cartCartIcon = this.$cart.find('.cart-product-cart-icon');
      this.$cartAddBtn = this.$cart.find('.cart-product-plus-button');
      this.$cartRemoveBtn = this.$cart.find('.cart-product-minus-button');
      this.$cartQuantityBtn = this.$cart.find('.cart-product-quantity-button');

      this.$cartAddBtn.on('click', (...args) => this.add(...args));
      this.$cartRemoveBtn.on('click', (...args) => this.remove(...args));
      this.$cartQuantityBtn.on('click', (...args) => this.addFirst(...args));

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

    add() {
      let quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      let valid = sellixHelper.isValidCount({ ...this.product, count: quantity + 1 });
      if (this.product.quantity_min > 1 && (quantity === 0 || quantity === undefined)) {
        this.cart.add(this.product, this.product.quantity_min);
      } else if (valid) {
        this.cart.add(this.product);
      }

      if (this.redirectToCheckout) {
        window.location.href = '/checkout';
      }
    }

    addFirst() {
      let quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      if (!quantity) {
        this.add();
      }
    }

    remove() {
      let quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      if (quantity === this.product.quantity_min) {
        this.cart.remove(this.product.uniqid, this.product.quantity_min);
      } else {
        this.cart.remove(this.product.uniqid, this.product.quantity_min);
      }
    }

    render() {
      let quantity = (this.cart.getItemById(this.product.uniqid) || { quantity: 0 }).quantity || 0;
      this.$cart.toggleClass('empty', quantity === 0);
      this.$cartQuantity.toggleClass('hidden', quantity === 0);
      this.$cartCartIcon.toggleClass('hidden', quantity !== 0);

      if (quantity) {
        this.$cartQuantity.text(quantity);
      }
    }
  }

  window.SellixCartProductComponent = CartProductComponent;
})(document, window, jQuery, sellixHelper);
