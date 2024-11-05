(function (window, jQuery, SellixCartStoreFactory, SellixProductPlansStore) {
  class ProductPlansComponent {
    constructor(selector, shop, productId, plans, isCart) {
      this.selector = selector;
      this.store = new SellixProductPlansStore(shop);
      this.cart = SellixCartStoreFactory.getCart(shop);
      this.productId = productId;
      this.plans = plans;
      this.isCart = isCart;
      this.activeDescriptionId = undefined;

      this.$container = jQuery(this.selector);

      jQuery(document).on('SellixProductPlansUpdateEvent', this.onUpdate);
      this.$container.find('[data-plan]').on('click', this.onClick);
      this.$container
        .find('[data-toggle-product-plan-description-button=1]')
        .on('click', this.onClickToggleDescription);
    }

    onClick = (event) => {
      const clickedUniqid = jQuery(event.currentTarget).data('plan');
      const plan = this.plans.find(({ uniqid }) => uniqid === `${clickedUniqid}`);
      if (plan) {
        this.store.set(this.productId, plan);
      }
    };

    onClickToggleDescription = (event) => {
      // event.stopPropagation();

      const $this = jQuery(event.target);
      const $parent = $this.parents('[data-plan]');
      if ($parent) {
        const descriptionId = $parent.data('plan');
        if (this.activeDescriptionId) {
          this.$container
            .find(`[data-plan-description]`)
            .animate({ height: '0', overflow: 'hidden' }, { duration: 300, queue: false });

          this.$container.find('[data-toggle-product-plan-description-button]').removeClass('fa-chevron-up');
          this.$container.find('[data-toggle-product-plan-description-button]').addClass('fa-chevron-down');
        }

        if (this.activeDescriptionId !== descriptionId) {
          const $description = $parent.find(`[data-plan-description]`);
          $description.animate(
            { height: $description.get(0).scrollHeight, overflow: 'initial' },
            { duration: 300, queue: false },
          );

          this.activeDescriptionId = descriptionId;
          $parent.find('[data-toggle-product-plan-description-button]').removeClass('fa-chevron-down');
          $parent.find('[data-toggle-product-plan-description-button]').addClass('fa-chevron-up');
        } else {
          this.activeDescriptionId = undefined;
        }
      }
    };

    onUpdate = (event, eventInfo) => {
      if (!eventInfo || !eventInfo.productId || eventInfo.productId === this.productId) {
        this.setActivePlan();
      }
    };

    setActivePlan = () => {
      const activePlan = this.store.get(this.productId);
      if (activePlan) {
        this.$container.find('[data-plan]').removeClass('active');
        this.$container.find('[data-active-checkbox] input').prop('checked', false);

        const $activePlan = this.$container.find('[data-plan]').filter(function () {
          return $(this).data('plan') === activePlan.uniqid;
        });
        $activePlan.addClass('active');
        $activePlan.find('[data-active-checkbox] input').prop('checked', true);
      }
    };

    render = () => {
      if (this.plans.length) {
        const firstAvailable = this.plans.find(({ stock }) => stock !== 0);
        let activePlan;
        if (firstAvailable) {
          const productPlan = this.store.get(this.productId, firstAvailable);
          activePlan = this.plans.find(
            ({ uniqid, stock }) => uniqid === `${productPlan.uniqid}` && stock >= productPlan.stock,
          );
        }

        if (activePlan) {
          this.store.set(this.productId, activePlan);
        } else {
          if (this.isCart) {
            this.store.set(this.productId, undefined);
            this.cart.remove(this.productId, 0);
          } else {
            this.store.set(this.productId, firstAvailable);
          }
        }
      }
    };
  }
  window.SellixProductPlansComponent = ProductPlansComponent;
})(window, jQuery, SellixCartStoreFactory, SellixProductPlansStore);
