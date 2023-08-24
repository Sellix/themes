(function (document, window, jQuery) {
  class CollapsableComponent {
    constructor(headerSelector, bodySelector, options = {}) {
      this.opened = false;
      this.$header = jQuery(headerSelector);
      this.$body = jQuery(bodySelector);
      this.$header.on('click', this.toggle.bind(this));
      this.options = options;

      this.collapsed = true;
    }

    toggle() {
      this.$header.find('.chevron').toggleClass('d-none');
      const scrollHeight = this.$body.get(0).scrollHeight;
      const setOverflow = () => this.$body.css('overflow', scrollHeight > this.options.maxHeight ? 'auto' : 'hidden');

      if (!this.collapsed) {
        this.$body.animate(
          { height: 0 },
          {
            duration: 300,
            queue: false,
            start: setOverflow,
            complete: setOverflow,
          },
        );
        this.collapsed = true;
      } else {
        this.$body.animate(
          {
            height: scrollHeight,
            maxHeight: Math.min(this.options.maxHeight, scrollHeight),
          },
          {
            duration: 300,
            queue: false,
            start: setOverflow,
            complete: setOverflow,
          },
        );
        this.collapsed = false;
      }
    }
  }
  window.SellixCollapsableComponent = CollapsableComponent;
})(document, window, jQuery);
