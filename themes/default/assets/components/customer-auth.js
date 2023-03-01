(function (document, window, jQuery, React, ReactDOM, sellixApi) {
  class CustomerAuthComponent {
    constructor({ selector, config, selectorCaptchaV2, theme, shop }) {
      this.config = config;
      this.shop = shop;
      this.theme = theme || {};
      this.domContainer = document.querySelector(selector);
      this.selectorCaptchaV2 = selectorCaptchaV2;
      this.isCaptchaV2Visible = false;
    }

    onCustomerAuthEmail = (data) => {
      return sellixApi.customerAuthEmail(data, {
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
        theme: this.theme.isDark ? 'dark' : 'light',
        removeAfterComplete: true,
        onShowCaptchaV2: (visible) => {
          this.isCaptchaV2Visible = visible;
          this.render();
        },
      });
    };

    onCustomerAuthCode = (data) => {
      return sellixApi.customerAuthCode(data, {
        useCaptchaV2: true,
        selectorCaptchaV2: this.selectorCaptchaV2,
        theme: this.theme.isDark ? 'dark' : 'light',
        onShowCaptchaV2: (visible) => {
          this.isCaptchaV2Visible = visible;
          this.render();
        },
      });
    };

    onShowMessage = ({ type, text }) => {
      jQuery(document).trigger('SellixToastify', { type, text });
    };

    onCompleteAuth = () => {
      window.location.href = 'customer/dashboard';
    };

    render() {
      ReactDOM.render(
        React.createElement(window.CustomerAuth.CustomerAuth, {
          config: this.config,
          theme: { isDark: this.theme.isDark },
          shopId: this.shop?.id,
          sellixI18Next: window.sellixI18Next,
          onShowMessage: this.onShowMessage,
          onCustomerAuthEmail: this.onCustomerAuthEmail,
          onCustomerAuthCode: this.onCustomerAuthCode,
          onCompleteAuth: this.onCompleteAuth,
          options: {
            isCaptchaV2Visible: this.isCaptchaV2Visible,
          },
        }),
        this.domContainer,
      );
    }
  }

  window.SellixCustomerAuthComponent = CustomerAuthComponent;
})(document, window, jQuery, React, ReactDOM, sellixApi);
