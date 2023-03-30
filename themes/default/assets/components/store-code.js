(function (document, window, jQuery, sellixApi) {
  class StoreCodeComponent {
    constructor(selector, codeId, shopName) {
      this.$form = jQuery(selector);
      this.shopName = shopName;

      this.$form.submit((e) => {
        e.preventDefault();
        this.submit();
      });

      this.$code = this.$form.find(`.sellix-input-${codeId}`);
    }

    submit() {
      if (this.$code.val()) {
        sellixApi
          .checkStoreCode(this.$code.val(), this.shopName)
          .then((resp) => {
            if (resp.status === 200) {
              // jQuery(document).trigger('SellixToastify', {
              //   type: 'success',
              //   text: resp.message,
              // });

              const date = new Date();
              date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
              Cookies.set(`store-code-${resp.data.shopName}`, resp.data.code, { expires: date })

              window.location.href = '/';
            } else {
              jQuery(document).trigger('SellixToastify', {
                type: 'error',
                text: resp.error,
              });
            }
          });
      }
    }
  }

  window.SellixStoreCodeComponent = StoreCodeComponent;
})(document, window, jQuery, sellixApi);
