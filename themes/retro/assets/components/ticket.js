(function (document, window, jQuery, sellixApi) {
  class TicketComponent {
    constructor(selector, messageId, submitId, uniqId, renderOptions) {
      this.$form = jQuery(selector);
      this.$messageContainer = this.$form.find('.message-container');
      this.$submitButton = this.$form.find(`#ticket-submit-${submitId}`);
      this.uniqId = uniqId;
      this.renderOptions = renderOptions;

      this.$submitButton.on('click', (e) => {
        e.preventDefault();
        this.submit();
      });

      this.$message = this.$form.find(`#message`);

      window.addEventListener('focus', () => this.getTicket());
    }

    renderTicket(customerEmail, message, role, date) {
      return sellixApi
        .renderComponent(
          {
            ...this.renderOptions,
            path: [this.renderOptions.path, ['snippet', 'Ticket Message'].join(':')].join(';'),
          },
          SellixContext.get('request'),
          { customer_email: customerEmail, role, created_at: date, message },
        )
        .then((resp) => {
          const $component = $(resp.html);
          this.$messageContainer.append($component);
        })
        .catch((resp) => {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        });
    }

    getTicket() {
      sellixApi
        .getTicket(this.uniqId)
        .then(async (resp) => {
          if (resp.status === 200) {
            const ticket = resp.data.query;
            for (let newMessage of ticket.messages) {
              if ($(`[data-id="${newMessage.role}-${newMessage.created_at}"]`).length === 0) {
                await this.renderTicket(
                  ticket.customer_email, newMessage.message, newMessage.role, newMessage.created_at
                );
              }
            }
          } else {
            jQuery(document).trigger('SellixToastify', {
              type: 'error',
              text: resp.error,
            });
          }
        })
        .catch((resp) => {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        });
    }

    submit() {
      if (!this.$message.val()) {
        return;
      }

      sellixApi
        .replyTicket({
          message: this.$message.val(),
          uniqid: this.uniqId,
        })
        .then((resp) => {
          if (resp.status === 200) {
            jQuery(document).trigger('SellixToastify', {
              type: 'success',
              text: resp.message,
            });
            this.getTicket(this.$message.val());
            this.$message.val('');
          } else {
            jQuery(document).trigger('SellixToastify', {
              type: 'error',
              text: resp.error,
            });
          }
        })
        .catch((resp) => {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        });
    }
  }

  window.SellixTicketComponent = TicketComponent;
})(document, window, jQuery, sellixApi);