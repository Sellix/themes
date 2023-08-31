(function (document, window, jQuery, Cookies, sellixApi) {
  class CustomerLoginComponent {
    constructor(selector) {
      this.selector = selector;
      this.$loginButton = jQuery(selector);

      this.$loginButton.find('[data-customer-login-icon]').on('click', this.open.bind(this));
      const token = Cookies.get('customerToken');
      console.log('Token', token);
    }

    open(event, eventInfo) {
      event.stopPropagation();

      console.log('Click Login Button');
    }
  }

  window.SellixCustomerLoginComponent = CustomerLoginComponent;
})(document, window, jQuery, Cookies, sellixApi);
