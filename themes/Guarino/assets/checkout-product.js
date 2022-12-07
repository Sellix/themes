(function (document, window, jQuery, SellixCartStoreFactory, SellixPriceVariantsStore, sellixHelper) {
  class CheckoutProductComponent {
    constructor(selector, shop, productId, renderOptions) {
      this.$product = jQuery(selector);
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.priceVariantsStore = new SellixPriceVariantsStore(shop);
      this.productId = productId;
      this.isVisibleDescription = false;

      this.$product.find('.sellix-cart-description').on('click', (event) => {
        event.preventDefault();
        this.onClickDescriptionButton();
      });
      this.$product.find('.checkout-details-item-remove').on('click', this.decreaseProduct);

      this.renderEvents = ['SellixCartUpdateEvent', 'SellixRenderComponent'].map((eventName) => {
        return sellixHelper.getEventName({
          name: eventName,
          namespace: renderOptions.id,
          id: productId,
        });
      });
      this.showDescriptionEvent = sellixHelper.getEventName({
        name: 'SellixShowProductDescription',
        namespace: renderOptions.id,
        id: productId,
      });

      jQuery(document).on(this.showDescriptionEvent, (event, eventInfo) => {
        const toggledProductId = eventInfo && eventInfo.productId ? eventInfo.productId : null;
        this.onToggleDescription(toggledProductId);
      });

      jQuery(document).on(this.renderEvents.join(' '), (e, eventInfo) => {
        if (eventInfo && eventInfo.action) {
          if (eventInfo.action === 'delete') {
            if (!eventInfo.productId || eventInfo.productId === productId) {
              this.removeProduct(eventInfo.productId);
            }
          }
        }
      });

      jQuery(document).on('SellixVariantsUpdateEvent', (event, eventInfo) => {
        if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
          const activeVariant = this.priceVariantsStore.get(this.productId);
          if (activeVariant) {
            this.$product.find('.sellix-product > .checkout-details-item-title > span').text(activeVariant.title);
          }
        }
      });
    }

    toggleDescription = (show) => {
      if (show) {
        this.$product.find('.shop-product-info-collapse').css({ height: 'auto', overflow: 'initial' });
        this.$product.find('.sellix-cart-description .label-show-description').text('Hide Description');
        this.$product.find('.sellix-cart-description .label-click-for-info').hide();
      } else {
        this.$product.find('.shop-product-info-collapse').css({ height: '0px', overflow: 'hidden' });
        this.$product.find('.sellix-cart-description .label-show-description').text('Show Description');
        this.$product.find('.sellix-cart-description .label-click-for-info').show();
      }

      this.isVisibleDescription = show;
    };

    removeProduct = () => {
      jQuery(document).off(this.renderEvents.join(' '));
      jQuery(document).off(this.showDescriptionEvent);
      this.$product.find('.sellix-cart-description').off('click');
      this.$product.find('.checkout-details-item-remove').off('click');
      this.$product.remove();
    };

    decreaseProduct = () => {
      this.cart.remove(this.productId, -1);
    };

    onToggleDescription = (productId) => {
      if (productId === this.productId) {
        this.toggleDescription(!this.isVisibleDescription);
      } else if (this.isVisibleDescription) {
        this.toggleDescription(false);
      }
    };

    onClickDescriptionButton = () => {
      jQuery(document).trigger('SellixShowProductDescription', { productId: this.productId });
    };
  }
  window.SellixCheckoutProductComponent = CheckoutProductComponent;
})(document, window, jQuery, SellixCartStoreFactory, SellixPriceVariantsStore, sellixHelper);
