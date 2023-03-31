(function (window, context) {
  class Context {
    static get(name, defaultValue) {
      return context[name] || defaultValue;
    }

    static set(name, value) {
      context[name] = value;
    }
  }

  window.SellixContext = Context;
})(window, __RENDER_CONTEXT__);
