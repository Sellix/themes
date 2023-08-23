(function (document, window, jQuery, sellixApi) {
  class CartStore {
    state = [];

    constructor(shop) {
      this.shop = shop;
      this.storageName = `cart-${shop}`;
      this.debounceUpdate = null;

      this.isInited = false;
      this.defferedActions = [];
      this.init();
    }

    init() {
      sellixApi
        .getCart()
        .then((resp) => {
          this.state = resp.products || [];
          this.isInited = true;

          for (let action of this.defferedActions) {
            switch (action.type) {
              case 'remove':
                this.remove(action.id, action.quantity);
                break;
            }
          }

          jQuery(document).trigger('SellixCartInitEvent');
          jQuery(document).trigger('SellixCartUpdateEvent', { action: 'insert' });
        })
        .catch((resp) => {
          console.log(resp);
          if (resp.responseJSON) {
            const respJson = resp.responseJSON;
            jQuery(document).trigger('SellixToastify', {
              type: 'error',
              text: respJson.message || 'Internal server error',
            });
          } else {
            console.log(resp);
            throw resp;
          }
        });
    }

    update() {
      const products = this.getItems().map(({ uniqid, quantity, customerPrice }) => ({
        uniqid,
        quantity,
        customerPrice,
      }));
      return sellixApi.updateCart(products).catch((resp) => {
        console.log(resp);
        if (resp.responseJSON) {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        } else {
          throw resp;
        }
      });
    }

    getItems() {
      return this.state;
    }

    getItemById(id) {
      return this.state.find((item) => item.uniqid === id);
    }

    add(product, quantity = 1, updateBackend = true) {
      let isNew = true;
      let updatedState = this.state.map((item) => {
        if (item.uniqid === product.uniqid) {
          item = {
            ...item,
            quantity: item.quantity + quantity,
          };
          isNew = false;
        }
        return item;
      });

      if (isNew) {
        updatedState = [...updatedState, { ...product, quantity }];
      }

      this.state = updatedState;

      const action = isNew ? 'insert' : 'update';
      if (updateBackend) {
        this.updateBackend([{ action, productId: product.uniqid }]);
      }

      return { product, quantity, action };
    }

    set(product, { quantity, customerPrice }) {
      let action;
      if (typeof quantity !== 'undefined') {
        const item = this.getItemById(product.uniqid);
        if (item) {
          if (quantity <= 0) {
            this.remove(product.id, item.quantity, false);
            action = 'delete';
          } else {
            const { action: newAction } = this.add(product, quantity - item.quantity, false);
            action = newAction;
          }
        } else if (quantity >= 1) {
          const { action: newAction } = this.add(product, quantity, false);
          action = newAction;
        }
      }

      if (typeof customerPrice !== 'undefined') {
        // temporarly commented
        // const item = this.getItemById(product.uniqid);
        // if (item) {
        //   this.state = this.state.map((item) => (item.uniqid === product.uniqid ? { ...item, customerPrice } : item));
        //   action = action || 'update';
        // }
      }

      this.updateBackend([{ action, productId: product.uniqid }]);
    }

    addMany(products) {
      const updatedProducts = products.map(({ product, quantity }) => this.add(product, quantity, false));
      return this.updateBackend(updatedProducts.map(({ product, action }) => ({ action, productId: product.uniqid })));
    }

    remove(id, quantity = 1, updateBackend = true) {
      if (!this.isInited) {
        this.defferedActions.push({ type: 'remove', id, quantity });
        return;
      }

      let isDeleted = false;
      this.state = this.state
        .map((item) => {
          let newQuantity = quantity > 0 ? item.quantity - quantity : 0;
          if (newQuantity < 0) {
            newQuantity = 0;
          }
          if (item.uniqid === id) {
            item = {
              ...item,
              quantity: newQuantity,
            };
            isDeleted = newQuantity === 0;
          }

          return item;
        })
        .filter((item) => item.quantity > 0);

      if (updateBackend) {
        this.updateBackend([{ action: isDeleted ? 'delete' : 'update', productId: id }]);
      }
    }

    clear(updateBackend = true) {
      this.state = [];
      if (updateBackend) {
        this.updateBackend().then(() => this.triggerEvents([{ action: 'delete' }]));
      }
    }

    updateBackend(events) {
      // send events without waiting BE response
      this.triggerEvents(events || []);

      return new Promise((resolve, reject) => {
        if (this.debounceUpdate) {
          clearInterval(this.debounceUpdate);
          resolve('debounce');
        }
        this.debounceUpdate = setTimeout(() => {
          this.debounceUpdate = undefined;
          this.update()
            .then((resp) => resolve(resp))
            .catch((error) => reject(error));
        }, 250);
      });
    }

    triggerEvents(events) {
      let eventBody;
      for (const { productId, action } of events) {
        eventBody = { action };
        if (productId) {
          eventBody.productId = productId;
        }
        jQuery(document).trigger('SellixCartUpdateEvent', eventBody);
      }
    }
  }

  class CartStoreFactory {
    static sellixCarts = {};

    static getCart(shop) {
      if (!(shop in window.SellixCartStoreFactory.sellixCarts)) {
        window.SellixCartStoreFactory.sellixCarts[shop] = new CartStore(shop);
      }

      return window.SellixCartStoreFactory.sellixCarts[shop];
    }
  }

  window.SellixCartStoreFactory = CartStoreFactory;
})(document, window, jQuery, sellixApi);
