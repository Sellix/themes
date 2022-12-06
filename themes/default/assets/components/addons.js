(function (window, jQuery, SellixAddonsStore) {
  class AddonsComponent {
    constructor(selector, shop, productId, addons) {
      this.$container = jQuery(selector);
      this.store = new SellixAddonsStore(shop);
      this.productId = productId;
      this.addons = addons;
      this.addonsMap = Object.fromEntries(addons.map((addon) => [addon.uniqid, addon]));
      this.activeAddonId = undefined;

      this.addButtonContent = '<span>Add <i class="fa-regular fa-plus"></i></span>';
      this.removeButtonContent = '<span>Remove <i class="fa-regular fa-xmark"></i></span>';

      this.$container.find('.shop-product-info-addon-title').on('click', this.onToggleDescription.bind(this));
      this.$container.find('.shop-product-info-addon-button').on('click', this.onClickButton.bind(this));
    }

    onToggleDescription(event) {
      const addonId = jQuery(event.currentTarget).data('addon-id');
      this.$container.find('.shop-product-info-addon-description-collapse').css({ height: '0', overflow: 'hidden' });

      this.$container
        .find(`.shop-product-info-addon-title i.fa-solid`)
        .removeClass('fa-chevron-up')
        .addClass('fa-chevron-down');

      if (this.activeAddonId !== addonId) {
        this.activeAddonId = addonId;
        this.$container
          .find(`.shop-product-info-addon-description-collapse[data-addon-id=${addonId}]`)
          .css({ height: 'auto', overflow: 'initial' });

        this.$container
          .find(`.shop-product-info-addon-title[data-addon-id=${addonId}] i.fa-solid`)
          .addClass('fa-chevron-up');
      } else {
        this.activeAddonId = undefined;
      }
    }

    onClickButton(event) {
      const $button = jQuery(event.currentTarget);
      const addonId = $button.data('addon-id');
      const addedAddons = this.store.get(this.productId, []);
      const isExist = addedAddons.find(({ uniqid }) => uniqid === addonId);

      if (isExist) {
        this.store.remove(this.productId, this.addonsMap[addonId]);
        $button.html(this.addButtonContent);
      } else {
        this.store.add(this.productId, this.addonsMap[addonId]);
        $button.html(this.removeButtonContent);
      }
    }

    render() {
      const addedAddons = this.store.get(this.productId, []);
      const addedAddonsMap = Object.fromEntries(addedAddons.map((addon) => [addon.uniqid, addon]));
      this.addons.forEach((addon) => {
        this.$container
          .find(`.shop-product-info-addon-button[data-addon-id=${addon.uniqid}]`)
          .html(Boolean(addedAddonsMap[addon.uniqid]) ? this.removeButtonContent : this.addButtonContent);
      });
    }
  }
  window.SellixAddonsComponent = AddonsComponent;
})(window, jQuery, SellixAddonsStore);
