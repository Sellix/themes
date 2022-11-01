(function (document, window, jQuery) {
    class CheckoutDetailsComponent {
      constructor(shopInfo, cart, bundles, config) {
        this.shopInfo = shopInfo;
        this.cart = cart;
        this.bundles = bundles;
        this.config = config;
  
        const renderEvent = sellixHelper.getEventName({
          name: 'SellixRenderComponent',
          namespace: renderOptions.id,
        });
        jQuery(document).on(`SellixCartUpdateEvent SellixPurchaseApplyCouponEvent ${renderEvent}`, () => this.render());
      }
  
      getIncludedBundles() {
        const productIds = this.cart.getItems().map(({ uniqid }) => uniqid);
  
        return (this.bundles || []).filter((bundle) => {
          const productsLeft = bundle.products_bound.filter(({ uniqid }) => !productIds.includes(uniqid));
          return !productsLeft.length;
        });
      }
  
      getDiscounts({ bundles, appliedCoupon }) {
        const cartProducts = this.cart.getItems();
        const currencySymbol = this.config.CURRENCY_LIST[this.shopInfo.currency];
  
        const productDiscounts = cartProducts.map((product) => {
          let price = product.price_conversions ? product.price_conversions[this.shopInfo.currency] : 0;
  
          let productAmount = product.price_discount ? `${product.price_discount}%` : '';
          let productDiscount = (x) => (product.price_discount ? x - (x * product.price_discount) / 100 : x);
  
          let discountList = [];
          let volumeAmount = '';
          let volumeDiscount = (x) => x;
  
          if (product.volume_discounts) {
            discountList = JSON.parse(product.volume_discounts).volume_discounts;
  
            discountList.map((discount, key) => {
              let currentQuantity = +product.quantity;
              let discountQuantity = +discount.quantity;
              let value = +discount.value;
              let type = discount.type;
  
              if (discountList.length === 1) {
                if (currentQuantity >= discountQuantity) {
                  volumeDiscount = (x) => (type === 'FIXED' ? x - value : x - (x * value) / 100);
                  volumeAmount = type === 'FIXED' ? `${currencySymbol}${value}` : `${value}%`;
                }
              } else {
                if (discountList[key + 1]) {
                  let nextDiscount = discountList[key + 1].quantity;
  
                  if (currentQuantity >= discountQuantity && currentQuantity < nextDiscount) {
                    volumeDiscount = (x) => (type === 'FIXED' ? x - value : x - (x * value) / 100);
                    volumeAmount = type === 'FIXED' ? `${currencySymbol}${value}` : `${value}%`;
                  }
                } else {
                  if (currentQuantity >= discountQuantity && (product.stock === -1 || currentQuantity <= product.stock)) {
                    volumeDiscount = (x) => (type === 'FIXED' ? x - value : x - (x * value) / 100);
                    volumeAmount = type === 'FIXED' ? `${currencySymbol}${value}` : `${value}%`;
                  }
                }
              }
            });
          }
  
          let bundleAmount = '';
          let bundleDiscount = (x) => x;
          let isBundle = '';
          let bundleTitle = '';
  
          if (bundles.length) {
            bundles.map((b) => {
              if (b.products.includes(product.uniqid)) {
                isBundle = b.uniqid;
                bundleTitle = b.title;
  
                let type = b.discount_type;
                let value = +(+b.discount_amount / (type === 'FIXED' ? b.products_bound.length : 1));
  
                bundleDiscount = (x) => (type === 'FIXED' ? x - value : x - (x * value) / 100);
                bundleAmount =
                  type === 'FIXED' ? `${currency}${parseFloat(value.toFixed(2))}` : `${parseFloat(value.toFixed(2))}%`;
              }
            });
          }
  
          let couponAmount = 0;
          let couponDiscount = (x) => x;
  
          if (
            appliedCoupon &&
            (!appliedCoupon.disabled_with_volume_discounts ||
              (appliedCoupon.disabled_with_volume_discounts && !volumeAmount))
          ) {
            let type = appliedCoupon.discount_type;
            let value = +(+appliedCoupon.discount / (type === 'FIXED' ? cart.length : 1));
            couponDiscount = (x) => (type === 'FIXED' ? x - value : x - (x * value) / 100);
            couponAmount =
              type === 'FIXED' ? `${currency}${parseFloat(value.toFixed(2))}` : `${parseFloat(value.toFixed(2))}%`;
          }
  
          let taxAmount = +this.shopInfo.vat_percentage ? `${+this.shopInfo.vat_percentage}%` : '';
          let taxDiscount = (x) => {
            return +this.shopInfo.vat_percentage ? x + (x * this.shopInfo.vat_percentage) / 100 : x;
          };
  
          return {
            price: price,
            quantity: product.quantity,
            title: product.title,
            uniqid: product.uniqid,
            bundleTitle: bundleTitle,
            isBundle: isBundle,
  
            productDiscount: productDiscount,
            productAmount: productAmount,
  
            volumeDiscount: volumeDiscount,
            volumeAmount: volumeAmount,
  
            bundleDiscount: bundleDiscount,
            bundleAmount: bundleAmount,
  
            couponDiscount: couponDiscount,
            couponAmount: couponAmount,
  
            taxDiscount: taxDiscount,
            taxAmount: taxAmount,
          };
        });
  
        return productDiscounts.sort((a, b) => (a.isBundle === b.isBundle ? 1 : -1));
      }
  
      getPaymentOptions() {
        const cartProducts = this.cart.getItems();
  
        let payment = cart.reduce((acc, product) => {
          let gateway = (product.gateways || '').split(',').filter((opt) => opt !== '') || [];
  
          if (gateway.length && gateway.includes('PAYPAL') && +product.shop_paypal_credit_card) {
            gateway.push('PAYPAL_CREDIT_CARD');
          }
  
          if (gateway.includes('STRIPE')) {
            gateway = gateway.filter((option) => option !== 'PAYPAL_CREDIT_CARD');
          }
  
          return [...acc, ...gateway];
        }, []);
  
        let uniqueChars = [];
  
        payment.forEach((c) => {
          if (!uniqueChars.includes(c)) {
            uniqueChars.push(c);
          }
        });
  
        setPaymentOptions(uniqueChars);
      }
  
      render({ appliedCoupon }) {
        const bundles = this.getIncludedBundles();
        const discounts = this.getDiscounts(bundles, appliedCoupon);
      }
    }
  })(document, window, jQuery);