(function (document, window, jQuery, SellixCartStoreFactory, SellixproductVariantsStore, sellixHelper) {
  class CheckoutProductComponent {
    constructor(selector, shop, productId, renderOptions) {
      this.$product = jQuery(selector);
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.productVariantsStore = new SellixProductVariantsStore(shop);
      this.productId = productId;
      this.isVisibleDescription = false;

      this.$product.find('[data-checkout-product-toggle-description-button]').on('click', (event) => {
        event.preventDefault();
        this.onClickDescriptionButton();
      });
      this.$product.find('[data-remove-button]').on('click', this.decreaseProduct);

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

      jQuery(document).on('SellixProductVariantsUpdateEvent', (event, eventInfo) => {
        if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
          const activeVariant = this.productVariantsStore.get(this.productId);
          if (activeVariant) {
            this.$product.find('.sellix-product > .checkout-details-item-title > span').text(activeVariant.title);
          }
        }
      });
    }

    toggleDescription = (show) => {
      const $description = this.$product.find('[data-description-wrapper]');

      this.$product
        .find('[data-checkout-product-toggle-description-button] svg')
        .css({ transform: `rotate(${show ? '180' : '0'}deg)` });

      if (show) {
        $description.animate(
          { 'min-height': $description.get(0).scrollHeight },
          {
            duration: 300,
            queue: false,
            done: () => {
              $description.css({
                height: 'initial',
                overflow: 'initial',
              });
            },
          },
        );
      } else {
        $description.animate(
          { 'min-height': 0, height: 0 },
          {
            duration: 300,
            queue: false,
            done: () => {
              $description.css({
                overflow: 'hidden',
              });
            },
          },
        );
      }

      this.isVisibleDescription = show;
    };

    removeProduct = () => {
      jQuery(document).off(this.renderEvents.join(' '));
      jQuery(document).off(this.showDescriptionEvent);
      this.$product.find('[data-checkout-product-toggle-description-button]').off('click');
      this.$product.find('[data-remove-button]').off('click');
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
})(document, window, jQuery, SellixCartStoreFactory, SellixProductVariantsStore, sellixHelper);
