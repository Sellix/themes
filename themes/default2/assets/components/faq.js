(function (document, window, jQuery) {
  class FaqComponent {
    constructor(selector) {
      this.$faq = jQuery(selector);
      this.activeItemId = undefined;
      this.activeNestedItemId = undefined;

      this.$faq.find('[data-faq-item]').on('click', (event) => this.onClickItem(jQuery(event.currentTarget)));
    }

    onClickItem($item) {
      const itemId = $item.data('faq-item-id');

      if (this.activeItemId) {
        const $itemToHide = $(`[data-faq-item-id='${this.activeItemId}']`);
        const nestedItemIdToHide = $itemToHide.find('[data-faq-item-id]').data('faq-item-id');
        if (nestedItemIdToHide === this.activeNestedItemId) {
          $itemToHide
            .find('[data-faq-item-answer]')
            .animate({ height: '0px', overflow: 'hidden' }, { duration: 300, queue: false });
          $itemToHide.find('[data-faq-item-chevron]').toggleClass('d-none');
        } else {
          this.activeItemId = undefined;
          this.activeNestedItemId = undefined;
        }
      }

      if (itemId !== this.activeItemId) {
        this.activeItemId = itemId;
        this.activeNestedItemId = $item.find('[data-faq-item-id]').data('faq-item-id');
        const $itemContent = $item.find('[data-faq-item-answer]');
        $itemContent.animate(
          { height: $itemContent.get(0).scrollHeight, overflow: 'initial' },
          { duration: 300, queue: false },
        );
        $item.find('[data-faq-item-chevron]').toggleClass('d-none');
      } else {
        this.activeItemId = undefined;
      }
    }
  }
  window.SellixFAQComponent = FaqComponent;
})(document, window, jQuery);
