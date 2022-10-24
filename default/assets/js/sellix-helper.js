(function (document, window, jQuery, SellixContext) {
  class Helper {
    scrollTo(offset, callback) {
      const fixedOffset = offset.toFixed();

      const onScroll = function () {
        if (window.pageYOffset.toFixed() === fixedOffset) {
          setTimeout(() => {
            window.removeEventListener('scroll', onScroll);
            callback();
          }, 30);
        }
      };

      window.addEventListener('scroll', onScroll);

      onScroll();

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }

    onClickOutside(ref, handler) {
      const listener = (event) => {
        if (!ref || jQuery.contains(ref, event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }

    getEventName({ name, namespace, id } = {}) {
      return [name, namespace, id].filter((item) => Boolean(item)).join('.');
    }

    isValidCount({ stock, count, quantity_max, quantity_min }) {
      if (isNaN(count)) {
        return false;
      }

      if (count <= 0) {
        return false;
      }

      if ((quantity_max !== -1 && count > quantity_max) || (quantity_min !== -1 && count < quantity_min)) {
        return false;
      }

      return !(stock !== -1 && count > stock);
    }

    getStock(stock) {
      if (stock === -1) {
        return '∞';
      } else {
        if (stock < 100) {
          return stock;
        } else if (stock >= 100 && stock < 1000) {
          return '99+';
        } else if (stock >= 1000 && stock < 5000) {
          return '1K+';
        } else if (stock >= 5000 && stock < 10000) {
          return '5K+';
        } else if (stock >= 10000 && stock < 50000) {
          return '10K+';
        } else if (stock >= 50000 && stock < 100000) {
          return '50K+';
        } else if (stock >= 100000 && stock < 200000) {
          return '100K+';
        } else {
          return '200K+';
        }
      }
    }

    getImageUrl(id, type, isDark) {
      type = type ? type.toLowerCase() : 'default';
      if (id && `${id}`.toLowerCase() !== 'null') {
        return `https://imagedelivery.net/${SellixContext.get('config', {})['CLOUDFLARE_FOLDER_ID']}/${id}/${type}`;
      }

      const defaultAsset = isDark ? 'loader-logo-light.svg' : 'loaded-logo-dark.svg';
      return SellixContext.get('assets')[defaultAsset];
    }
  }
  window.sellixHelper = new Helper();
})(document, window, jQuery, SellixContext);
