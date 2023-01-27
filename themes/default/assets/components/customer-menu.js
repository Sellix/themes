(function (document, window, jQuery, sellixApi) {
  class CustomerMenuComponent {
    constructor(selector, mobileSelector) {
      this.$menu = jQuery(selector);
      this.$mobileMenu = jQuery(mobileSelector);

      window.sellixHelper.onClickOutside(this.$menu.get(0), (...args) => this.close(...args));
      window.sellixHelper.onClickOutside(this.$mobileMenu.get(0), (...args) => this.closeMobileMenu(...args));

      this.$mobileMenu.find('.sellix-header-mobile-menu-icon').on('click', (...args) => this.toggleMobileMenu(...args));
      this.$mobileMenu.find('.sellix-header-mobile-menu-logout').on('click', (...args) => this.logout(...args));

      this.$menu.find('.sellix-header-user-info').on('click', (...args) => this.toggle(...args));
      this.$menu.find('.sellix-header-user-info-menu-logout').on('click', (...args) => this.logout(...args));
    }

    toggleMobileMenu() {
      this.$mobileMenu.find('.mobile-menu-dropdown').toggleClass('open');
    }

    closeMobileMenu() {
      this.$mobileMenu.find('.mobile-menu-dropdown').removeClass('open');
    }

    toggle() {
      this.$menu.find('.menu-dropdown').toggleClass('open');
    }

    close() {
      this.$menu.find('.menu-dropdown').removeClass('open');
    }

    logout() {

      let topDomain = 'local-test-sellix.com';

      if (window.location.hostname.includes('sellix-staing.gg')) {
        topDomain = 'sellix-staing.gg';
      } else if (window.location.hostname.includes('mysellix.io')) {
        topDomain = 'mysellix.io';
      }

      document.cookie = `customerToken=""; path=/; sameSite=lax; domain=.customer-portal.${topDomain}; Expires=${new Date(2000, 1, 1, 1, 1, 1, 0)};`;
      document.cookie = `customerToken=""; path=/; sameSite=lax; domain=.${window.location.hostname}; Expires=${new Date(2000, 1, 1, 1, 1, 1, 0)};`;
      window.location.href = '/';
    }
  }

  window.SellixCustomerMenuComponent = CustomerMenuComponent;
})(document, window, jQuery, sellixApi);
