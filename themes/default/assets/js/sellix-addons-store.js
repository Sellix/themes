(function (window, jQuery, SellixStoreFactory) {
  class AddonsStore {
    constructor(shop, productAddons) {
      this.shop = shop;
      this.store = SellixStoreFactory.getStore(shop);
      this.key = 'addons';

      if (productAddons) {
        for (const productId in productAddons) {
          this.sync(productId, productAddons[productId]);
        }
      }
    }

    getAll() {
      return this.store.get(this.key, {});
    }

    get(productId, defaultValue) {
      const addons = this.store.get(this.key, {});
      return addons[productId] || defaultValue;
    }

    add(productId, addon) {
      const addons = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...addons,
        [productId]: [...(addons[productId] || []), addon],
      });
      jQuery(document).trigger('SellixAddonsUpdateEvent');
    }

    remove(productId, addon) {
      const addons = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...addons,
        [productId]: (addons[productId] || []).filter((item) => item.uniqid !== addon.uniqid),
      });
      jQuery(document).trigger('SellixAddonsUpdateEvent');
    }

    sync(productId, addons) {
      const addedIds = new Set(this.get(productId, []).map((a) => a.uniqid));
      this.clear(productId);
      for (const addon of addons) {
        if (addedIds.has(addon.uniqid)) {
          this.add(productId, addon);
        }
      }
    }

    clear(productId) {
      const addons = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...addons,
        [productId]: [],
      });
      jQuery(document).trigger('SellixAddonsUpdateEvent');
    }

    completelyClear() {
      this.store.set(this.key, {});
      jQuery(document).trigger('SellixAddonsUpdateEvent');
    }
  }
  window.SellixAddonsStore = AddonsStore;
})(window, jQuery, SellixStoreFactory);
