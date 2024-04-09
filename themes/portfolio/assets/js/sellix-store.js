(function (window) {
  class Store {
    constructor(shop) {
      this.shop = shop;
      this.storageName = `store-${shop}`;

      this.state = JSON.parse(window.localStorage.getItem(this.storageName)) || {};
    }

    get(name, defaultValue) {
      return this.state[name] || defaultValue;
    }

    set(name, value) {
      this.state[name] = value;
      window.localStorage.setItem(this.storageName, JSON.stringify(this.state));
    }
  }

  class StoreFactory {
    static sellixStores = {};

    static getStore(shop) {
      if (!(shop in window.SellixStoreFactory.sellixStores)) {
        window.SellixStoreFactory.sellixStores[shop] = new Store(shop);
      }

      return window.SellixStoreFactory.sellixStores[shop];
    }
  }

  window.SellixStoreFactory = StoreFactory;
})(window);
