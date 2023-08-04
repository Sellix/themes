(function (document, window, jQuery, SellixCartStoreFactory, SellixproductVariantsStore, sellixHelper) {
  class ProductCountComponent {
    constructor(selector, shop, product, renderOptions, hideStockCounter) {
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.productVariantsStore = new SellixProductVariantsStore(shop);
      this.product = product;
      this.productId = product.uniqid;
      this.renderOptions = renderOptions;
      this.activeProductVariant = null;
      this.hideStockCounter = hideStockCounter;

      this.$container = jQuery(selector);

      this.$container.find('[data-stock-count-picker].real').on('click', this.onClick);
      this.$container.find('[data-input-wrapper] input').on('keyup', this.onKeyUp);
      this.$container.find('[data-input-wrapper] input').on('paste', this.onPaste);

      const eventNames = ['SellixCartUpdateEvent', 'SellixRenderComponent']
        .map((eventName) => {
          return sellixHelper.getEventName({
            name: eventName,
            namespace: renderOptions.id,
          });
        })
        .join(' ');

      jQuery(document).on(eventNames, this.onComponentUpdate);
      jQuery(document).on('SellixProductVariantsUpdateEvent', this.onChangeActiveVariant);
    }

    get stock() {
      return this.activeProductVariant ? this.activeProductVariant.stock : this.product.stock;
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
    };

    onChangeActiveVariant = (event, eventInfo) => {
      if (this.product.type !== 'SERIALS') {
        return;
      }

      if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
        const product = this.cart.getItemById(this.productId);
        if (product) {
          const newProductVariant = this.productVariantsStore.get(this.productId);
          if (
            newProductVariant &&
            this.activeProductVariant &&
            newProductVariant.title !== this.activeProductVariant.title
          ) {
            this.activeProductVariant = newProductVariant;
            if (product.quantity > 1) {
              this.cart.remove(product.uniqid, product.quantity - 1);
            } else {
              this.render(product);
            }
          }
        }
      }
    };

    onComponentUpdate = (event, eventInfo) => {
      if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
        const product = this.cart.getItemById(this.productId);
        if (product) {
          this.activeProductVariant = this.productVariantsStore.get(this.productId);
          this.render(product);
        }
      }
    };

    showHideButton(buttonType, isVisible) {
      const realSelector = this.$container.find(`[data-stock-count-picker].${buttonType}.real`);

      if (isVisible) {
        jQuery(realSelector).css({ opacity: 100, pointerEvents: 'initial' });
      } else {
        jQuery(realSelector).css({ opacity: 0, pointerEvents: 'none' });
      }
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

      const stock = this.stock === -1 ? Infinity : +this.stock;
      const quantityMax = this.product.quantity_max === -1 ? Infinity : +this.product.quantity_max;
      validatedQuantity = Math.min(stock, quantityMax, validatedQuantity);

      const quantityMin = +this.product.quantity_min;
      validatedQuantity = Math.max(quantityMin, validatedQuantity);

      const product = this.cart.getItemById(this.productId);
      this.cart.add({ uniqid: this.productId }, validatedQuantity - product.quantity);
    }

    render({ quantity }) {
      const staticProps = {
        stock: this.stock,
        quantity_max: this.product.quantity_max,
        quantity_min: this.product.quantity_min,
      };

      const isValidPlus = sellixHelper.isValidCount({ ...staticProps, count: quantity + 1 }, true);
      const isValidMinus = sellixHelper.isValidCount({ ...staticProps, count: quantity - 1 }, false);

      this.showHideButton('plus', isValidPlus);
      this.showHideButton('minus', isValidMinus);

      this.$container.find('[data-input-wrapper] input').val(quantity);

      const isInfinity = this.stock === -1;
      const isLast = this.stock === 1;
      const isEmpty = this.stock - quantity < 0;
      const inStock = isInfinity ? '∞' : sellixHelper.getStock(this.stock - quantity);

      let inStockTitle;
      if (isLast) {
        inStockTitle = window.sellixI18Next.t('shop.shared.titles.lastProduct');
      } else if (!isInfinity && isEmpty) {
        inStockTitle = '';
      } else if (this.hideStockCounter) {
        inStockTitle = `${window.sellixI18Next.t('shop.shared.titles.inStock')}`;
      } else {
        inStockTitle = `${window.sellixI18Next.t('shop.shared.titles.stock')} <div class="ml-2">${inStock}</div>`;
      }

      this.$container.find('[data-total-value]').html(inStockTitle);
    }
  }

  window.SellixProductCountComponent = ProductCountComponent;
})(document, window, jQuery, SellixCartStoreFactory, SellixProductVariantsStore, sellixHelper);
