(function (document, window, jQuery, SellixCartStoreFactory, SellixPriceVariantsStore, sellixHelper) {
  class ProductCountComponent {
    constructor(selector, shop, product, renderOptions) {
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.priceVariantsStore = new SellixPriceVariantsStore(shop);
      this.product = product;
      this.productId = product.uniqid;
      this.renderOptions = renderOptions;
      this.activePriceVariant = null;

      this.$root = jQuery(selector);

      this.$root.find('.sellix-stock-count-picker.real').on('click', this.onClick);
      this.$root.find('.sellix-cart-count-quantity input').on('keyup', this.onKeyUp);
      this.$root.find('.sellix-cart-count-quantity input').on('paste', this.onPaste);

      const eventNames = ['SellixCartUpdateEvent', 'SellixRenderComponent']
        .map((eventName) => {
          return sellixHelper.getEventName({
            name: eventName,
            namespace: renderOptions.id,
          });
        })
        .join(' ');

      jQuery(document).on(eventNames, (e, eventInfo) => {
        if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
          const product = this.cart.getItemById(this.productId);
          if (product) {
            this.activePriceVariant = this.priceVariantsStore.get(this.productId);
            this.render(product);
          }
        }
      });

      jQuery(document).on('SellixVariantsUpdateEvent', (event, eventInfo) => {
        if (product.type !== 'SERIALS') {
          return;
        }

        if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
          const product = this.cart.getItemById(this.productId);
          if (product) {
            const newPriceVariant = this.priceVariantsStore.get(this.productId);
            if (newPriceVariant && newPriceVariant.title !== this.activePriceVariant.title) {
              this.activePriceVariant = newPriceVariant;
              if (product.quantity > 1) {
                this.cart.remove(product.uniqid, product.quantity - 1);
              } else {
                this.render(product);
              }
            }
          }
        }
      });
    }

    showHideButton(buttonType, isVisible) {
      const realSelector = this.$root.find(`.sellix-stock-count-picker.${buttonType}.real`);

      if (isVisible) {
        jQuery(realSelector).css({ opacity: 100, pointerEvents: 'initial' });
      } else {
        jQuery(realSelector).css({ opacity: 0, pointerEvents: 'none' });
      }
    }

    onClick = (event) => {
      event.preventDefault();

      const modifier = jQuery(event.currentTarget).data('modifier');

      if (modifier > 0) {
        this.cart.add({ uniqid: this.productId }, modifier);
      } else {
        this.cart.remove(this.productId, Math.abs(modifier));
      }
    };

    onKeyUp = (event) => {
      event.preventDefault();
      this.changeProductQuantity(event.target.value);
    };

    onPaste = (event) => {
      event.preventDefault();
      return false;
    }

    changeProductQuantity(newQuantity) {
      if (isNaN(newQuantity)) {
        this.cart.add({ uniqid: this.productId }, 0);
        return;
      }

      let validatedQuantity = Number(newQuantity);

      if (!Number.isInteger(validatedQuantity)) {
        validatedQuantity = Math.floor(validatedQuantity);
      }

      if (this.stock === -1) {
        if (this.product.quantity_max !== -1) {
          if (validatedQuantity >= this.product.quantity_max) {
            validatedQuantity = +this.product.quantity_max;
          }
        }
      } else {
        if (this.product.quantity_max === -1) {
          if (validatedQuantity >= this.stock) {
            validatedQuantity = +this.stock;
          }
        } else {
          if (validatedQuantity >= this.product.quantity_max) {
            validatedQuantity = +this.product.quantity_max;
          }
        }
      }

      const product = this.cart.getItemById(this.productId);
      this.cart.add({ uniqid: this.productId }, validatedQuantity - product.quantity);
    }

    render({ quantity }) {
      const staticProps = {
        stock: this.stock,
        quantity_max: this.product.quantity_max,
        quantity_min: this.product.quantity_min,
      };

      const isValidPlus = sellixHelper.isValidCount({ ...staticProps, count: quantity + 1 });
      const isValidMinus = sellixHelper.isValidCount({ ...staticProps, count: quantity - 1 });

      this.showHideButton('plus', isValidPlus);
      this.showHideButton('minus', isValidMinus);

      this.$root.find('.sellix-cart-count-quantity input').val(quantity);

      const isInfinity = this.stock === -1;
      const isLast = this.stock === 1;
      const isEmpty = this.stock - quantity < 0;
      const inStock = isInfinity ? '∞' : sellixHelper.getStock(this.stock - quantity);

      let inStockTitle;
      if (isLast) {
        inStockTitle = 'Last Product';
      } else if (!isInfinity && isEmpty) {
        inStockTitle = '';
      } else {
        inStockTitle = `Stock <div style='margin-left: 0.5rem'>${inStock}</div>`;
      }

      this.$root.find('.sellix-stock-total').html(inStockTitle);
    }

    get stock() {
      return this.activePriceVariant ? this.activePriceVariant.stock : this.product.stock;
    }
  }

  window.SellixProductCountComponent = ProductCountComponent;
})(document, window, jQuery, SellixCartStoreFactory, SellixPriceVariantsStore, sellixHelper);
