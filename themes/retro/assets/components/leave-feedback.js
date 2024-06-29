(function (document, window, jQuery, sellixApi) {
  class LeaveFeedbackComponent {
    constructor(selector, messageId, uniqid, score) {
      this.$form = jQuery(selector);
      this.uniqid = uniqid;
      this.score = score;

      this.$form.submit((e) => {
        e.preventDefault();
        this.submit();
      });

      this.$message = this.$form.find(`#message`);
    }

    setScore(score) {
      this.score = score;
    }

    submit() {
      if (this.$message.val().length <= 256) {
        sellixApi
          .leaveFeedback({
            message: this.$message.val(),
            score: this.score,
            uniqid: this.uniqid,
            feedback: {
              1: 'negative',
              2: 'negative',
              3: 'neutral',
              4: 'positive',
              5: 'positive',
            }[this.score],
          })
          .then((resp) => {
            if (resp.status === 200) {
              jQuery(document).trigger('SellixToastify', {
                type: 'success',
                text: resp.message,
              });
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

  window.SellixLeaveFeedbackComponent = LeaveFeedbackComponent;
})(document, window, jQuery, sellixApi);