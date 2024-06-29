(function (window, jQuery, SellixStoreFactory) {
  class ProductAddonsStore {
    constructor(shop, productAddons) {
      this.shop = shop;
      this.store = SellixStoreFactory.getStore(shop);
      this.key = 'productAddons';

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
      jQuery(document).trigger('SellixProductAddonsUpdateEvent');
    }

    remove(productId, addon) {
      const addons = this.store.get(this.key, {});
      this.store.set(this.key, {
        ...addons,
        [productId]: (addons[productId] || []).filter((item) => item.uniqid !== addon.uniqid),
      });
      jQuery(document).trigger('SellixProductAddonsUpdateEvent');
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
      jQuery(document).trigger('SellixProductAddonsUpdateEvent');
    }

    completelyClear() {
      this.store.set(this.key, {});
      jQuery(document).trigger('SellixProductAddonsUpdateEvent');
    }
  }
  window.SellixProductAddonsStore = ProductAddonsStore;
})(window, jQuery, SellixStoreFactory);