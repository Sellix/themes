(function (document, window, jQuery, sellixApi) {
  class FeedbackPaginationComponent {
    constructor(selector, pagination, id, renderOptions) {
      this.id = id;
      this.renderOptions = renderOptions;
      this.pagination = pagination;
      this.$pagination = jQuery(selector);
      this.$paginationPrevButton = this.$pagination.find('.prev');
      this.$paginationNextButton = this.$pagination.find('.next');

      this.$paginationPrevButton.on('click', () => this.prevPage());
      this.$paginationNextButton.on('click', () => this.nextPage());
      this.pagination.useMobile(this.id);

      jQuery(document).on('SellixFeedbackPaginationUpdateEvent', (e, eventInfo) => {
        if (!eventInfo || !eventInfo.paginationId || eventInfo.paginationId === this.id) {
          this.render(eventInfo.redrawOnlyPagination || false);
        }
      });
      this.init();
    }

    init() {
      jQuery(document).trigger('SellixFeedbackPaginationUpdateEvent', { paginationId: this.id });
    }

    renderProduct(startIndex, endIndex) {
      sellixApi
        .renderComponent(
          {
            ...this.renderOptions,
            path: [this.renderOptions.path, ['block', 'Feedback items'].join(':')].join(';'),
          },
          { offset: startIndex, limit: endIndex },
        )
        .then((resp) => {
          // $(document).find('.sellix-feedback-wrapper').remove();
          const $component = $(resp.html);
          // $component.insertBefore(this.$pagination);
          $('.sellix-block.feedback_items').replaceWith($component);
          setTimeout(function () {
            $(document).trigger('SellixFeedbackPaginationUpdateEvent', { paginationId: this.id });
          });
        })
        .catch((resp) => {
          const respJson = resp.responseJSON || {};
          jQuery(document).trigger('SellixToastify', {
            type: 'error',
            text: respJson.message || 'Internal server error',
          });
        });
    }

    prevPage() {
      this.pagination.prevPage(this.id);
    }

    nextPage() {
      this.pagination.nextPage(this.id);
    }

    render(redrawOnlyPagination) {
      const page = this.pagination.page || 0;
      const pages = this.pagination.pages || 0;
      const pageLimit = this.pagination.pageLimit || 0;

      if (pages > 10 && page > 10) {
        this.$paginationPrevButton.show();
      } else {
        this.$paginationPrevButton.hide();
      }

      if (Math.floor((page - 1) / pageLimit) * pageLimit + 10 < pages) {
        this.$paginationNextButton.show();
      } else {
        this.$paginationNextButton.hide();
      }

      if (page === 1) {
        this.$paginationPrevButton.toggleClass('disabled', true);
        this.$paginationPrevButton.prop('disabled', true);
      } else {
        this.$paginationPrevButton.toggleClass('disabled', false);
        this.$paginationPrevButton.prop('disabled', false);
      }
      if (page === pages) {
        this.$paginationNextButton.toggleClass('disabled', true);
        this.$paginationNextButton.prop('disabled', true);
      } else {
        this.$paginationNextButton.toggleClass('disabled', false);
        this.$paginationNextButton.prop('disabled', false);
      }

      const frag = $(document.createDocumentFragment());
      const paginationGroup = this.pagination.getPaginationGroup();
      this.$pagination.find('.item').remove();
      for (let item of paginationGroup) {
        const button = $('<button></button>').addClass('item');
        button.toggleClass('active', page === item);
        button.prop('disabled', page === item);
        button.on('click', () => {
          this.pagination.changePage(item, this.id);
          const itemsToShow = this.pagination.getPaginatedData();
          !redrawOnlyPagination && this.renderProduct(itemsToShow.startIndex, itemsToShow.endIndex);
        });
        const buttonValue = $('<span></span>').text(item);
        button.append(buttonValue);
        frag.append(button);
      }
      this.$paginationPrevButton.after(frag);
    }
  }

  window.SellixFeedbackPaginationComponent = FeedbackPaginationComponent;
})(document, window, jQuery, sellixApi);
