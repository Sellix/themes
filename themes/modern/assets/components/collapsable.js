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
      // if (this.opened) {
      //   this.$body.animate({ height: '0', overflow: 'hidden' }, { duration: 300, queue: false });
      // } else {
      //   this.$body.animate(
      //     { height: this.$body.get(0).scrollHeight, overflow: 'initial' },
      //     {
      //       duration: 300,
      //       queue: false,
      //       done: () => {
      //         console.log(this.$body.css('min-height'));
      //         this.$body.css({
      //           overflow: 'scroll',
      //         });
      //       },
      //     },
      //   );
      // }
      // this.opened = !this.opened;
    }
  }
  window.SellixCollapsableComponent = CollapsableComponent;
})(document, window, jQuery);
