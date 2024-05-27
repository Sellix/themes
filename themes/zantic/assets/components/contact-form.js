(function (document, window, jQuery, sellixApi) {
  class FormComponent {
    constructor(selector, titleId, emailId, messageId, invoiceId, shopName) {
      this.$form = jQuery(selector);
      this.shopName = shopName;

      this.$form.submit((e) => {
        e.preventDefault();
        this.submit();
      });

      this.$title = this.$form.find(`.${titleId}__input`);
      this.$email = this.$form.find(`.${emailId}__input`);
      this.$message = this.$form.find(`.${messageId}__input`);
      this.$invoice = this.$form.find(`.${invoiceId}__input`);
    }

    submit() {
      if (this.$title.val() && this.$email.val() && this.$message.val()) {
        sellixApi
          .createTicket({
            title: this.$title.val(),
            email: this.$email.val(),
            invoice_id: this.$invoice.val(),
            message: this.$message.val(),
            name: this.shopName,
          })
          .then((resp) => {
            if (resp.status === 200) {
              jQuery(document).trigger('SellixToastify', {
                type: 'success',
                text: resp.message,
              });
              window.location.href = 'ticket/' + resp.data.uniqid;
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

  window.SellixFormComponent = FormComponent;
})(document, window, jQuery, sellixApi);
