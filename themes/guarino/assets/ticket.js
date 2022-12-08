(function (document, window, jQuery, sellixApi) {
  class TicketComponent {
    constructor(selector, messageId, submitId, uniqId, renderOptions) {
      this.$form = jQuery(selector);
      this.$messageContainer = this.$form.find('.reply-screen-message-container');
      this.$submitButton = this.$form.find(`#ticket-submit-${submitId}`);
      this.uniqId = uniqId;
      this.renderOptions = renderOptions;

      this.$submitButton.on('click', (e) => {
        e.preventDefault();
        this.submit();
      });

      this.$message = this.$form.find(`.sellix-input-${messageId}`);

      window.addEventListener('focus', () => this.getTicket());
    }

    renderTicket(message, role, date) {
      return sellixApi
        .renderComponent(
          {
            ...this.renderOptions,
            path: [this.renderOptions.path, ['snippet', 'Ticket Message'].join(':')].join(';'),
          },
          { role, created_at: date, message },
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
            for (let newMessage of resp.data.query.messages) {
              if ($(`[data-id="${newMessage.role}-${newMessage.created_at}"]`).length === 0) {
                await this.renderTicket(newMessage.message, newMessage.role, newMessage.created_at);
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
