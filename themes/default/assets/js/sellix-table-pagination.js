(function (document, window, jQuery) {
  class TablePagination {
    constructor(page, pageLimit, tableLength) {
      this.page = page;
      this.paginationGroup = this.getPaginationGroup();
      this.pageLimit = pageLimit;
      this.dataLimit = 10;
      this.tableLength = tableLength;
      this.pages = Math.round(this.tableLength / this.dataLimit);
    }

    useMobile(paginationId) {
      const media = window.matchMedia('(max-width: 768px)');
      this.pageLimit = media.matches ? 5 : 10;
      media.onchange = () => {
        this.pageLimit = media.matches ? 5 : 10;
        jQuery(document).trigger('SellixTablePaginationUpdateEvent', {
          paginationId,
          redrawOnlyPagination: true,
        });
      };
    }

    getPaginationGroup() {
      let start = Math.floor((this.page - 1) / this.pageLimit) * this.pageLimit;

      if (this.pages < 10) {
        start = Math.floor((this.page - 1) / this.pages) * this.pages;
      }

      let p;

      if (this.pages > 10) {
        if (start >= 10) {
          p = this.pages - start >= 10 ? this.pageLimit : this.pages - start;
        } else {
          p = this.pageLimit;
        }
      } else {
        p = this.pages;
      }

      return new Array(p).fill().map((_, idx) => start + idx + 1);
    }

    prevPage(paginationId) {
      this.page = +this.page - 1;
      jQuery(document).trigger('SellixTablePaginationUpdateEvent', { paginationId });
    }

    nextPage(paginationId) {
      this.page = +this.page + 1;
      jQuery(document).trigger('SellixTablePaginationUpdateEvent', { paginationId });
    }

    changePage(page, paginationId) {
      this.page = page;
      jQuery(document).trigger('SellixTablePaginationUpdateEvent', { paginationId });
    }

    getPaginatedData() {
      const startIndex = this.page * this.dataLimit - this.dataLimit;
      const endIndex = startIndex + this.dataLimit;
      return { startIndex, endIndex };
    }
  }

  window.SellixTablePagination = TablePagination;
})(document, window, jQuery, sellixApi);
