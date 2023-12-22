(function (document, window, jQuery) {
  class Api {
    constructor(apiUrl) {
      this.apiUrl = apiUrl || location.origin;
    }

    async ping(name) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/ping`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ name, referer: document.referrer }),
      });
    }

    async getCart() {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/cart`,
      });
    }

    async getProducts(ids) {
      return jQuery
        .ajax({
          method: 'GET',
          url: `${this.apiUrl}/api/shop/products/${ids.join(',')}`,
        })
        .then((response) => {
          const { status, error } = response;
          if (status !== 200) {
            throw new Error(error);
          }
          return response;
        });
    }

    async checkCoupon(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/coupons/check`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async checkStoreCode(code, shopName) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/store/code/check`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ code, shopName, store_domain: `${shopName}.mysellix.io` }),
      });
    }

    async updateCart(products) {
      return jQuery.ajax({
        method: 'PUT',
        url: `${this.apiUrl}/api/shop/cart`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          products,
        }),
      });
    }

    async renderComponent(renderOptions, mainRequest, args) {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

      let url;
      if (params.builder) {
        url = `${this.apiUrl}/api/builder/${params.builder}/render`;
      } else {
        url = `${this.apiUrl}/api/render`;
      }

      return jQuery.ajax({
        method: 'POST',
        url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          shop_id: renderOptions.shopId,
          theme_id: renderOptions.themeId,
          layout_name: renderOptions.layoutName,
          template_name: renderOptions.templateName,
          path: renderOptions.path,
          mainRequest: mainRequest,
          args,
        }),
      });
    }

    async getInvoice(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/invoices/${id}`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async createInvoice(data, options) {
      let headers = {};
      if (options.token) {
        headers = {
          Authorization: 'Bearer ' + options.token,
        };
      }
      const onSuccess = (captcha) => {
        data.captcha = captcha;
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/invoices`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(data),
          headers,
        });
      };
      return this.requestWithCaptchaV3('createInvoice', onSuccess, null, options);
    }

    async getCalculation(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/invoices/calculation`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        headers: {},
      });
    }

    async createInvoiceTrial(data) {
      const onSuccess = (captcha) => {
        data.captcha = captcha;
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/invoices/trial`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(data),
        });
      };
      return this.requestWithCaptchaV3('createInvoiceTrial', onSuccess);
    }

    async updateInvoice(data) {
      return jQuery.ajax({
        method: 'PATCH',
        url: `${this.apiUrl}/api/shop/invoices`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async getInvoiceInfo(id, secret) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/invoices/info/${id}/${secret}`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async getInvoiceTelegramInfo(id, secret) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/invoices/telegram-info/${id}/${secret}`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async customerAuthEmail(data, options) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/customer/auth/email`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptchaV3('createCustomerCode', onSuccess, null, options);
    }

    async customerAuthCode(data, options) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/customer/auth/code`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptchaV3('createCustomerToken', onSuccess, null, options);
    }

    async validateCaptcha(data) {
      const { version } = data;

      const sendRequest = (requestData) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/validate-recaptcha`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(requestData),
        });
      };

      if (version === 'v3') {
        const onSuccess = (captcha) => {
          return sendRequest({ ...data, captcha });
        };
        return this.requestWithCaptchaV3('createStripePayment', onSuccess);
      }

      return sendRequest(data);
    }

    async postCashAppIdentifier(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/cashapp/identifier`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async getStripeLink(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/stripe/subscriptions/checkout_link/${id}?ui_elements=true`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async getProductStripeLink(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/stripe/product_subscriptions/checkout_link/${id}?ui_elements=true`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async createTicket(data) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/queries/create`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptchaV3('createTicket', onSuccess);
    }

    async replyTicket(data) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/queries/reply`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptchaV3('replyTicket', onSuccess);
    }

    async getTicket(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/ticket/${id}`,
      });
    }

    async getFeedback(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/feedback/${id}`,
      });
    }

    async leaveFeedback(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/feedback/reply`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async getInsightsTransaction(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/insights/transaction`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async insertInsights(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/insights/insert`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async getEvmSpenders() {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/evm/spenders`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async saveEvm(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/evm/save`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async payEvm(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/evm/pay`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async requestWithCaptchaV2(action, onSuccess, onError, options) {
      options ??= options;

      return new Promise((resolve, reject) => {
        try {
          if (!options.useCaptchaV2 || !options.selectorCaptchaV2) {
            reject({ message: 'ReCaptchaV2 required params are not initialized' });
          }

          const captchaId = `${options.selectorCaptchaV2}_recaptchaV2`;
          const $recaptchaV2 = jQuery(`<div id='${captchaId}'></div>`);
          jQuery(options.selectorCaptchaV2).append($recaptchaV2);
          options.onShowCaptchaV2 && options.onShowCaptchaV2(true);
          window.grecaptcha.render(captchaId, {
            sitekey: window.RECAPTCHA_PUBLIC_KEY_V2,
            size: 'normal',
            theme: options.theme || 'light',
            callback: (captcha) => {
              onSuccess(captcha).then((data) => {
                resolve(data);
                if (options.removeAfterComplete) {
                  $recaptchaV2.remove();
                }
              });
            },
            'expired-callback': () => {
              $recaptchaV2.remove();
              options.onShowCaptchaV2 && options.onShowCaptchaV2(false);
              reject({ message: 'reCAPTCHA v2 expired' });
            },
            'error-callback': () => {
              $recaptchaV2.remove({ message: 'reCAPTCHA v2 failed' });
              options.onShowCaptchaV2 && options.onShowCaptchaV2(false);
              reject();
            },
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    async requestWithCaptchaV3(action, onSuccess, onError, options) {
      options ??= {};
      onError ??= (message) => message;

      return new Promise((resolve, reject) => {
        if (window.grecaptcha) {
          return window.grecaptcha.ready(() => {
            try {
              const captchaRequest = window.grecaptcha.execute(window.RECAPTCHA_PUBLIC_KEY, { action });
              if (onSuccess) {
                captchaRequest
                  .then(onSuccess)
                  .then((resp) => {
                    const { status } = resp;
                    if (status === 403) {
                      throw new Error('Captcha V3 back end request error.');
                    }
                    return resp;
                  })
                  .then(resolve)
                  .catch((e) => {
                    console.log('CaptchaV3', e);
                    this.requestWithCaptchaV2(action, onSuccess, onError, options)
                      .then(resolve)
                      .catch((e) => {
                        console.log('CaptchaV2', e);
                        const message = (e && e.message) || 'Captcha request error.';
                        reject(onError(message));
                      });
                  });
              }
            } catch (e) {
              console.log('CaptchaV3', e);
              this.requestWithCaptchaV2(action, onSuccess, onError, options)
                .then(resolve)
                .catch((e) => {
                  console.log('CaptchaV2', e);
                  const message = (e && e.message) || 'Captcha request error.';
                  reject(onError(message));
                });
            }
          });
        } else {
          reject(onError('reCAPTCHA v3 is not loaded correctly.'));
        }
      });
    }
  }
  window.SellixApiClass = Api;
  window.sellixApi = new Api();
})(document, window, jQuery);
