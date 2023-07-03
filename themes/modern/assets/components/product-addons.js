(function (window, jQuery, SellixProductAddonsStore) {
  class ProductAddonsComponent {
    constructor(selector, shop, productId, addons, hideUnderCheckbox) {
      this.$container = jQuery(selector);
      this.store = new SellixProductAddonsStore(shop, { [productId]: addons });
      this.productId = productId;
      this.addons = addons;
      this.addonsMap = Object.fromEntries(addons.map((addon) => [addon.uniqid, addon]));
      this.activeAddonId = undefined;
      this.hideUnderCheckbox = hideUnderCheckbox;

      this.addButtonContent = `<i class="fa-regular fa-plus"></i> <span>${window.sellixI18Next.t(
        'shop.shared.titles.add',
      )}</span>`;

      this.removeButtonContent = `<i class="fa-regular fa-xmark"></i> <span>${window.sellixI18Next.t(
        'shop.shared.titles.remove',
      )} </span>`;

      this.$container.find('[data-addon-title=1]').on('click', this.onToggleDescription.bind(this));
      this.$container.find('[data-addon-button=1]').on('click', this.onClickButton.bind(this));
      this.$container.find('[data-checkbox-input=1]').on('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.onToggleAddons();
      });
      this.$container.find('[data-checkbox-header=1]').on('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.$container.find('[data-checkbox-input=1]').click();
      });

      const addedAddons = this.store.get(this.productId, []);
      if (addedAddons.length) {
        this.$container.find('[data-checkbox-input=1]').prop('checked', true);
      }
    }

    onToggleAddons(event) {
      const addedAddons = this.store.get(this.productId, []);
      if (addedAddons.length) {
        this.$container.find('[data-checkbox-input=1]').prop('checked', true);
      }
      this.render();
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

      if (this.hideUnderCheckbox) {
        const $addonsContainer = this.$container.find('[data-addons-container=1]');
        if (this.$container.find('[data-checkbox-input=1]').prop('checked')) {
          this.$container.addClass('opened');
          $addonsContainer
            .css({
              height: 'initial',
              overflow: 'initial',
            })
            .animate({ 'min-height': $addonsContainer.get(0).scrollHeight }, { duration: 300, queue: false });
        } else {
          this.$container.removeClass('opened');
          $addonsContainer
            .css({
              overflow: 'hidden',
            })
            .animate({ height: '0', 'min-height': '0' }, { duration: 300, queue: false });
        }
      }
    }
  }
  window.SellixProductAddonsComponent = ProductAddonsComponent;
})(window, jQuery, SellixProductAddonsStore);
