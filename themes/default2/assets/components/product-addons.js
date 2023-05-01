(function (window, jQuery, SellixProductAddonsStore) {
  class ProductAddonsComponent {
    constructor(selector, shop, productId, addons) {
      this.$container = jQuery(selector);
      this.store = new SellixProductAddonsStore(shop, { [productId]: addons });
      this.productId = productId;
      this.addons = addons;
      this.addonsMap = Object.fromEntries(addons.map((addon) => [addon.uniqid, addon]));
      this.activeAddonId = undefined;

      this.addButtonContent = `<i class="fa-regular fa-plus"></i> <span>${window.sellixI18Next.t(
        'shop.shared.titles.add',
      )}</span>`;

      this.removeButtonContent = `<i class="fa-regular fa-xmark"></i> <span>${window.sellixI18Next.t(
        'shop.shared.titles.remove',
      )} </span>`;

      this.$container.find('[data-addon-title=1]').on('click', this.onToggleDescription.bind(this));
      this.$container.find('[data-addon-button=1]').on('click', this.onClickButton.bind(this));
    }

    onToggleDescription(event) {
      const addonId = jQuery(event.currentTarget).data('addon-id');

      if (this.activeAddonId) {
        this.$container
          .find(`[data-collapsable-wrapper]`)
          .animate({ height: '0', overflow: 'hidden' }, { duration: 300, queue: false });

        this.$container
          .find(`[data-addon-title=1] i.fa-solid`)
          .removeClass('fa-chevron-up')
          .addClass('fa-chevron-down');
      }

      if (this.activeAddonId !== addonId) {
        const $addonDescription = this.$container.find(`[data-collapsable-wrapper=1][data-addon-id=${addonId}]`);
        this.activeAddonId = addonId;
        $addonDescription.animate(
          { height: $addonDescription.get(0).scrollHeight, overflow: 'initial' },
          { duration: 300, queue: false },
        );

        this.$container.find(`[data-addon-title=1][data-addon-id=${addonId}] i.fa-solid`).addClass('fa-chevron-up');
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
          .find(`[data-addon-button=1][data-addon-id=${addon.uniqid}]`)
          .html(Boolean(addedAddonsMap[addon.uniqid]) ? this.removeButtonContent : this.addButtonContent);
      });
    }
  }
  window.SellixProductAddonsComponent = ProductAddonsComponent;
})(window, jQuery, SellixProductAddonsStore);
