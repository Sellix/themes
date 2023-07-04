(function (document, window, jQuery) {
  class CollapsableComponent {
    constructor(headerSelector, bodySelector) {
      this.opened = false;
      this.$header = jQuery(headerSelector);
      this.$body = jQuery(bodySelector);
      this.$header.on('click', this.toggle.bind(this));
    }

    toggle() {
      this.$header.find('.chevron').toggleClass('d-none');
      this.$body.toggleClass('visible');
    }
  }
  window.SellixCollapsableComponent = CollapsableComponent;
})(document, window, jQuery);
