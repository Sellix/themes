(function (window, jQuery, SellixContext) {
    class ProductFilterStore {
    constructor(shop, name, value) {
      this.shop = shop;
      this.store = SellixStoreFactory.getStore(shop);
      this.key = 'productFilter';
      this.filterName = name || 'default-filter';

      this.set(value);
    }

    get() {
      const filters = this.store.get(this.key, {});
      return filters[this.filterName] || {};
    }

    set({ search, category, sort }) {
      let filters = this.store.get(this.key, {});

      if (category) {
        const categories = SellixContext.getShopCategories();
        const categoryObj = categories.find(
          (cat) => cat.uniqid === category || (cat.title || '').toLowerCase() === category.toLowerCase(),
        );
        category = categoryObj ? categoryObj.uniqid : category;
      }

      const currentFilter = filters[this.filterName] || {};
      const oldCategory = currentFilter.category;

      currentFilter.search = typeof search !== 'undefined' ? search : currentFilter.search;
      currentFilter.category = typeof category !== 'undefined' ? category : currentFilter.category;
      currentFilter.sort = typeof sort !== 'undefined' ? sort : currentFilter.sort;

      filters = { ...filters, [this.filterName]: { ...currentFilter } };
      this.store.set(this.key, filters);

      if (oldCategory !== currentFilter.category) {
        for (const requestType of ['shop', 'category']) {
          if (!window.location.pathname.startsWith(`/${requestType}`)) {
            continue;
          }
          if (currentFilter.category === 'all' || !currentFilter.category) {
            window.history.pushState({ category: currentFilter.category }, '', `/${requestType}`);
          } else {
            window.history.pushState(
              { category: currentFilter.category },
              '',
              `/${requestType}/${currentFilter.category}`,
            );
          }
          break;
        }
      }
    }
  }

  window.SellixProductFilterStore = ProductFilterStore;
})(window, jQuery, SellixContext);
