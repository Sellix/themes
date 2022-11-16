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

    async checkCoupon(data) {
      return jQuery.ajax({
        method: 'POST',
        url: `${this.apiUrl}/api/shop/coupons/check`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
      });
    }

    async getCart() {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/cart`,
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

    async renderComponent(renderOptions, args) {
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
          theme_id: renderOptions.themeId,
          layout_name: renderOptions.layoutName,
          template_name: renderOptions.templateName,
          path: renderOptions.path,
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

    async createInvoice(data) {
      const onSuccess = (captcha) => {
        data.captcha = captcha;
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/invoices`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(data),
        });
      };
      return this.requestWithCaptcha('createInvoice', onSuccess);
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
      return this.requestWithCaptcha('createInvoice', onSuccess);
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

    async downloadInvoice(id, productType) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/invoices/download/${id}/${productType || 'undefined'}`,
        // xhr: function () {
        //   const xhr = new XMLHttpRequest();
        //   xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 2) {
        //       if (xhr.status === 200) {
        //         xhr.responseType = 'blob';
        //       } else {
        //         xhr.responseType = 'text';
        //       }
        //     }
        //   };
        //   return xhr;
        // },
        // xhrFields: {
        //   responseType: 'blob',
        // },
      });
    }

    async customerAuthEmail(data) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/customer/auth/email`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptcha('createInvoice', onSuccess);
    }

    async customerAuthCode(data) {
      const onSuccess = (captcha) => {
        return jQuery.ajax({
          method: 'POST',
          url: `${this.apiUrl}/api/shop/customer/auth/code`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ ...data, captcha }),
        });
      };
      return this.requestWithCaptcha('createInvoice', onSuccess);
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
        return this.requestWithCaptcha('createStripePayment', onSuccess);
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
        url: `${this.apiUrl}/api/shop/stripe/subscriptions/checkout_link/${id}`,
        contentType: 'application/json; charset=utf-8',
      });
    }

    async getProductStripeLink(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/stripe/product_subscriptions/checkout_link/${id}`,
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
      return this.requestWithCaptcha('createTicket', onSuccess);
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
      return this.requestWithCaptcha('replyTicket', onSuccess);
    }

    async getTicket(id) {
      return jQuery.ajax({
        method: 'GET',
        url: `${this.apiUrl}/api/shop/ticket/${id}`,
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

    async requestWithCaptcha(action, onSuccess, onError) {
      if (!onError) {
        onError = (message) => message;
      }

      return new Promise((resolve, reject) => {
        if (window.grecaptcha) {
          return window.grecaptcha.ready(function () {
            try {
              const captchaRequest = window.grecaptcha.execute(window.RECAPTCHA_PUBLIC_KEY, { action });
              if (onSuccess) {
                captchaRequest.then(onSuccess).then(resolve).catch(reject);
              }
            } catch (e) {
              const message = (e && e.message) || 'Captcha request error.';
              reject(onError(message));
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
