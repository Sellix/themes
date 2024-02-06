(function (document, window, jQuery, Cookies, sellixApi, sellixHelper) {
  class CustomerLoginComponent {
    constructor(selector, renderCodeInputCallback, shop) {
      this.selector = selector;
      this.renderCodeInputCallback = renderCodeInputCallback;
      this.shop = shop;
      this.$container = jQuery(selector);
      this.$loginBtn = this.$container.find('[data-icon]');
      this.$logoutBtn = this.$container.find('[data-logout]');
      this.$gotoDashboardBtn = this.$container.find('[data-goto-dashboard]');
      this.$dropDown = this.$container.find('[data-dropdown]');
      this.$modal = this.$container.find('[data-modal]');
      this.$modalCloseBtn = this.$container.find('[data-modal-close-icon]');
      this.$sendEmailBtn = this.$modal.find('.send-email-button');
      this.$verifyCodeBtn = this.$modal.find('.verify-code-button');

      this.$inputEmail = this.$modal.find('#email');

      this.isDropdownOpened = false;
      this.currentStep = 1;
      this.codeValue = '';

      this.$gotoDashboardBtn.on('click', this.gotoDashboard.bind(this));
      this.$loginBtn.on('click', this.toggle.bind(this));
      jQuery(document).on('SellixLoginButtonClick', this.toggle.bind(this));
      this.$logoutBtn.on('click', this.logout.bind(this));
      this.$modalCloseBtn.on('click', this.closeModal.bind(this));
      this.$sendEmailBtn.on('click', this.sendEmail.bind(this));
      this.$verifyCodeBtn.on('click', this.verifyCode.bind(this));
      this.$inputEmail.on('keyup', this._onEmailKeyUp.bind(this));
      sellixHelper.onClickOutside(this.$container.get(0), this.close.bind(this));

      this.cookieName = 'customerToken';
    }

    toggle(event, eventInfo) {
      if (this.isLoggedIn()) {
        this.isDropdownOpened = !this.isDropdownOpened;
        this.$dropDown.toggleClass('open animated flipIn', this.isDropdownOpened);
      } else {
        this.$inputEmail.val('');
        this.$inputEmail.trigger('keyup');
        this.$sendEmailBtn.find('.ripple-button-label').removeClass('d-none');
        this.$sendEmailBtn.find('.ripple-button-loader').addClass('d-none');
        this._gotoStep(1);

        this.$modal.modal({
          modalClass: '',
          blockerClass: 'sellix-overlay',
          showClose: false,
        });
      }
    }

    close(event, eventInfo) {
      this.isDropdownOpened = false;
      this.$dropDown.removeClass('open animated flipIn');
    }

    closeModal() {
      $.modal.close();
    }

    sendEmail() {
      this.$sendEmailBtn.find('.ripple-button-label').addClass('d-none');
      this.$sendEmailBtn.find('.ripple-button-loader').removeClass('d-none');
      this.$sendEmailBtn.prop('disabled', true);

      sellixApi
        .customerAuthEmail({ email: this.$inputEmail.val(), shop_id: this.shop.id })
        .then((resp) => {
          const { status, error } = resp;
          if (status >= 200 && status < 300) {
            this.$verifyCodeBtn.find('.ripple-button-label').removeClass('d-none');
            this.$verifyCodeBtn.find('.ripple-button-loader').addClass('d-none');
            this.onCodeChange('');
            this.renderCodeInputCallback('');
            this._gotoStep(2);
          } else {
            throw { responseJSON: resp };
          }
        })
        .catch((resp) => {
          this.$sendEmailBtn.find('.ripple-button-label').removeClass('d-none');
          this.$sendEmailBtn.find('.ripple-button-loader').addClass('d-none');
          this.$sendEmailBtn.prop('disabled', false);

          const respJson = resp.responseJSON || {};
          console.log(resp);
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || respJson.error || 'Internal server error',
          });
        });
    }

    verifyCode() {
      this.$verifyCodeBtn.find('.ripple-button-label').addClass('d-none');
      this.$verifyCodeBtn.find('.ripple-button-loader').removeClass('d-none');
      this.$verifyCodeBtn.prop('disabled', true);

      sellixApi
        .customerAuthCode({ email: this.$inputEmail.val(), code: this.codeValue, shop_id: this.shop.id })
        .then((resp) => {
          const { status, error, data } = resp;
          if (status >= 200 && status < 300) {
            this.setAuthCookie(data.token);
            this.closeModal();
          } else {
            throw { responseJSON: resp };
          }
        })
        .catch((resp) => {
          this.$verifyCodeBtn.find('.ripple-button-label').removeClass('d-none');
          this.$verifyCodeBtn.find('.ripple-button-loader').addClass('d-none');
          this.$verifyCodeBtn.prop('disabled', false);

          const respJson = resp.responseJSON || {};
          console.log(resp);
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || respJson.error || 'Internal server error',
          });
        });
    }

    logout() {
      this.removeAuthCookie();
      this.close();
    }

    gotoDashboard() {
      window.location.href = 'customer';
      this.close();
    }

    onCodeChange(val) {
      this.codeValue = val;
      this.$verifyCodeBtn.prop('disabled', !val || val.length < 6);
    }

    _onEmailKeyUp() {
      this.$sendEmailBtn.prop('disabled', !this.$inputEmail.val());
    }

    _gotoStep(step) {
      this.$modal.find('[data-modal-step]').addClass('d-none');
      this.$modal.find(`[data-modal-step=${step}]`).removeClass('d-none');
    }

    _getCookieOptions() {
      return {
        path: '/',
        expires: new Date(new Date().getFullYear() + 1, 1, 1, 1, 1, 1, 0),
        sameSite: 'lax',
        secure: !window.location.hostname.includes('local-test-sellix.com'),
      };
    }

    removeAuthCookie() {
      let options = this._getCookieOptions();
      const topDomain = sellixHelper.getTopDomain();
      const domains = [`.customer-portal.${topDomain}`, window.location.hostname];

      domains.forEach((domain) => {
        Cookies.remove(this.cookieName, { domain, ...options });
      });
    }

    setAuthCookie(token) {
      let options = this._getCookieOptions();
      const topDomain = sellixHelper.getTopDomain();
      const domains = [`.customer-portal.${topDomain}`, window.location.hostname];

      domains.forEach((domain) => {
        Cookies.set(this.cookieName, token, { domain, ...options });
      });
    }

    isLoggedIn() {
      const token = Cookies.get(this.cookieName);

      if (!token) {
        return false;
      }

      try {
        const parts = token.split('.');
        const decoded = JSON.parse(atob(parts[1]));
        const expirationTime = +decoded.exp;

        return expirationTime - Math.floor(+new Date() / 1000) > 0;
      } catch (e) {
        console.log('CustomerToken is invalid', e);
      }

      return false;
    }
  }

  window.SellixCustomerLoginComponent = CustomerLoginComponent;
})(document, window, jQuery, Cookies, sellixApi, sellixHelper);
