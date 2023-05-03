(function (window, jQuery, SellixCartStoreFactory, SellixProductVariantsStore) {
  class ProductVariantsComponent {
    constructor(selector, shop, productId, variants, isCart) {
      this.selector = selector;
      this.store = new SellixProductVariantsStore(shop);
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.productId = productId;
      this.variants = variants;
      this.isCart = isCart;

      this.$container = jQuery(this.selector);

      jQuery(document).on('SellixProductVariantsUpdateEvent', this.onUpdate);
      this.$container.find('[data-variant]').on('click', this.onClick);
      this.$container.find('[data-toggle-description-button=1]').on('click', this.onClickToggleDescription);
    }

    onClick = (event) => {
      const clickedTitle = jQuery(event.currentTarget).data('variant');
      const variant = this.variants.find(({ title }) => title === clickedTitle);
      if (variant) {
        this.store.set(this.productId, variant);
      }
    };

    onClickToggleDescription = (event) => {
      event.stopPropagation();

      const $this = jQuery(event.target);
      const $parent = $this.parents('[data-variant]');
      if ($parent) {
        $parent.find(`[data-toggle-description-button=1]`).toggleClass('d-none');
        $parent.find(`[data-variant-description=1]`).toggleClass('d-none');
      }
    };

    onUpdate = (event, eventInfo) => {
      if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
        this.setActiveVariant();
      }
    };

    setActiveVariant = () => {
      const activeVariant = this.store.get(this.productId);
      if (activeVariant) {
        this.$container.find('[data-variant]').removeClass('active');
        this.$container.find(`[data-variant='${activeVariant.title}']`).addClass('active');
      }
    };

    render() {
      if (this.variants.length) {
        const firstActive = this.variants.find(({ stock }) => stock !== 0);

        if (firstActive) {
          this.store.set(this.productId, firstActive);
        } else {
          if (this.isCart) {
            this.cart.remove(this.productId, 0);
          } else {
            this.store.set(this.productId, this.variants[0]);
          }
        }
      }
    }
  }
  window.SellixProductVariantsComponent = ProductVariantsComponent;
})(window, jQuery, SellixCartStoreFactory, SellixProductVariantsStore);
