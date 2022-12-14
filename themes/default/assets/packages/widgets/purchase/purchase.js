var Purchase = (function (exports, React, PropTypes, ReactDOM) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  function useIncludedBundles(bundles, products) {
    return React.useMemo(() => {
      return (bundles || []).filter(bundle => {
        const ids = products.map(({
          uniqid
        }) => uniqid);
        const productLeft = bundle.products_bound.filter(({
          uniqid
        }) => !ids.includes(uniqid));
        return !productLeft.length;
      });
    }, [bundles, products]);
  }

  function useProductDiscounts(config, currency, shop, products, addons, bundles, coupon) {
    const includedBundles = useIncludedBundles(bundles, products);
    return React.useMemo(() => {
      const currencyTitle = config.CURRENCY_LIST[currency];
      let list = products.map(product => {
        let price;
        if (product.priceVariant) {
          price = product.priceVariant.price_conversions ? product.priceVariant.price_conversions[currency] : product.price_conversions ? product.price_conversions[currency] : 0;
        } else {
          price = product.price_conversions ? product.price_conversions[currency] : 0;
        }
        let productAmount = product.price_discount ? `${product.price_discount}%` : '';
        let productDiscount = x => product.price_discount ? x - x * product.price_discount / 100 : x;
        let addonsList = addons && (addons[product.uniqid] || []);
        let addonsDiscount = x => {
          if (addonsList.length) {
            return addonsList.reduce((acc, i) => acc + i.price_conversions[currency], 0) + x;
          } else {
            return x;
          }
        };
        let discountList = [];
        let volumeAmount = '';
        let volumeDiscount = x => x;
        if (product.volume_discounts) {
          discountList = JSON.parse(product.volume_discounts).volume_discounts;
          discountList.map((discount, key) => {
            let currentQuantity = +product.quantity;
            let discountQuantity = +discount.quantity;
            let value = +discount.value;
            let type = discount.type;
            if (discountList.length === 1) {
              if (currentQuantity >= discountQuantity) {
                volumeDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
                volumeAmount = type === 'FIXED' ? `${currencyTitle}${value}` : `${value}%`;
              }
            } else {
              if (discountList[key + 1]) {
                let nextDiscount = discountList[key + 1].quantity;
                if (currentQuantity >= discountQuantity && currentQuantity < nextDiscount) {
                  volumeDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
                  volumeAmount = type === 'FIXED' ? `${currencyTitle}${value}` : `${value}%`;
                }
              } else {
                if (currentQuantity >= discountQuantity && (product.stock === -1 || currentQuantity <= product.stock)) {
                  volumeDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
                  volumeAmount = type === 'FIXED' ? `${currencyTitle}${value}` : `${value}%`;
                }
              }
            }
          });
        }
        let bundleAmount = '';
        let bundleDiscount = x => x;
        let isBundle = '';
        let bundleTitle = '';
        if (includedBundles.length) {
          includedBundles.map(b => {
            if (b.products.includes(product.uniqid)) {
              isBundle = b.uniqid;
              bundleTitle = b.title;
              let type = b.discount_type;
              let value = +(+b.discount_amount / (type === 'FIXED' ? b.products_bound.length : 1));
              bundleDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
              bundleAmount = type === 'FIXED' ? `${currencyTitle}${parseFloat(value.toFixed(2))}` : `${parseFloat(value.toFixed(2))}%`;
            }
          });
        }
        let couponAmount = 0;
        let couponDiscount = x => x;
        if (coupon && (!coupon.disabled_with_volume_discounts || coupon.disabled_with_volume_discounts && !volumeAmount)) {
          let type = coupon.discount_type;
          let value = +(+coupon.discount / (type === 'FIXED' ? products.length : 1));
          couponDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
          couponAmount = type === 'FIXED' ? `${currencyTitle}${parseFloat(value.toFixed(2))}` : `${parseFloat(value.toFixed(2))}%`;
        }
        let taxAmount = +shop.vat_percentage ? `${+shop.vat_percentage}%` : '';
        let taxDiscount = x => +shop.vat_percentage ? x + x * shop.vat_percentage / 100 : x;
        return {
          price: price,
          product: product,
          bundleTitle: bundleTitle,
          isBundle: isBundle,
          productDiscount: productDiscount,
          productAmount: productAmount,
          volumeDiscount: volumeDiscount,
          volumeAmount: volumeAmount,
          addonsList: addonsList,
          addonsDiscount: addonsDiscount,
          bundleDiscount: bundleDiscount,
          bundleAmount: bundleAmount,
          couponDiscount: couponDiscount,
          couponAmount: couponAmount,
          taxDiscount: taxDiscount,
          taxAmount: taxAmount
        };
      });
      return list.sort((a, b) => a.isBundle === b.isBundle ? 1 : -1);
    }, [config.CURRENCY_LIST, currency, products, addons, includedBundles, coupon, shop.vat_percentage]);
  }

  function useBundleDiscounts(config, currency, shop, bundles, products) {
    const includedBundles = useIncludedBundles(bundles, products);
    return React.useMemo(() => {
      const currencyTitle = config.CURRENCY_LIST[currency];
      return includedBundles.map(bundle => {
        const value = +bundle.discount_amount;
        const type = bundle.discount_type;
        return {
          bundle,
          discountTitle: type === 'FIXED' ? `${currencyTitle}${value}` : `${value}%`
        };
      });
    }, [config.CURRENCY_LIST, currency, includedBundles]);
  }

  function useTotalQuantity(products) {
    return React.useMemo(() => products.reduce((acc, {
      quantity
    }) => acc + quantity, 0), [products]);
  }

  function useProductPayments(products) {
    const totalQuantity = useTotalQuantity(products);
    return React.useMemo(() => {
      let payment = products.reduce((acc, product) => {
        let gateway = (product.gateways || '').split(',').filter(opt => opt !== '') || [];
        if (gateway.length && gateway.includes('PAYPAL') && +product.shop_paypal_credit_card) {
          gateway.push('PAYPAL_CREDIT_CARD');
        }
        if (gateway.includes('STRIPE')) {
          gateway = gateway.filter(option => option !== 'PAYPAL_CREDIT_CARD');
        }
        return [...acc, ...gateway];
      }, []);
      let uniqueChars = [];
      payment.forEach(c => {
        if (!uniqueChars.includes(c)) {
          uniqueChars.push(c);
        }
      });
      return uniqueChars;
    }, [totalQuantity, products]);
  }

  function useCouponDiscount(config, currency, appliedCoupon, hasDiscount) {
    return React.useMemo(() => {
      const currencyTitle = config.CURRENCY_LIST[currency];
      let couponAmount = '',
        couponDiscount = x => x;
      if (appliedCoupon && !(appliedCoupon.disabled_with_volume_discounts && hasDiscount)) {
        let value = +appliedCoupon.discount;
        let type = appliedCoupon.discount_type;
        couponAmount = type === 'FIXED' ? `${currencyTitle}${value}` : `${value}%`;
        couponDiscount = x => type === 'FIXED' ? x - value : x - x * value / 100;
      }
      return [couponDiscount, couponAmount];
    }, [appliedCoupon, config.CURRENCY_LIST, currency, hasDiscount]);
  }

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
  // find the complete implementation of crypto (msCrypto) on IE11.
  var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  function rng() {
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }

    return getRandomValues(rnds8);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

    return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
  }

  function uuidToBytes(uuid) {
    // Note: We assume we're being passed a valid uuid string
    var bytes = [];
    uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
      bytes.push(parseInt(hex, 16));
    });
    return bytes;
  }

  function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape

    var bytes = new Array(str.length);

    for (var i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }

    return bytes;
  }

  var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
  function v35 (name, version, hashfunc) {
    var generateUUID = function generateUUID(value, namespace, buf, offset) {
      var off = buf && offset || 0;
      if (typeof value == 'string') value = stringToBytes(value);
      if (typeof namespace == 'string') namespace = uuidToBytes(namespace);
      if (!Array.isArray(value)) throw TypeError('value must be an array of bytes');
      if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError('namespace must be uuid string or an Array of 16 byte values'); // Per 4.3

      var bytes = hashfunc(namespace.concat(value));
      bytes[6] = bytes[6] & 0x0f | version;
      bytes[8] = bytes[8] & 0x3f | 0x80;

      if (buf) {
        for (var idx = 0; idx < 16; ++idx) {
          buf[off + idx] = bytes[idx];
        }
      }

      return buf || bytesToUuid(bytes);
    }; // Function#name is not settable on some platforms (#270)


    try {
      generateUUID.name = name;
    } catch (err) {} // For CommonJS default export support


    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
  }

  /*
   * Browser-compatible JavaScript MD5
   *
   * Modification of JavaScript MD5
   * https://github.com/blueimp/JavaScript-MD5
   *
   * Copyright 2011, Sebastian Tschan
   * https://blueimp.net
   *
   * Licensed under the MIT license:
   * https://opensource.org/licenses/MIT
   *
   * Based on
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */
  function md5(bytes) {
    if (typeof bytes == 'string') {
      var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

      bytes = new Array(msg.length);

      for (var i = 0; i < msg.length; i++) {
        bytes[i] = msg.charCodeAt(i);
      }
    }

    return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
  }
  /*
   * Convert an array of little-endian words to an array of bytes
   */


  function md5ToHexEncodedArray(input) {
    var i;
    var x;
    var output = [];
    var length32 = input.length * 32;
    var hexTab = '0123456789abcdef';
    var hex;

    for (i = 0; i < length32; i += 8) {
      x = input[i >> 5] >>> i % 32 & 0xff;
      hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
      output.push(hex);
    }

    return output;
  }
  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */


  function wordsToMd5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }

    return [a, b, c, d];
  }
  /*
   * Convert an array bytes to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */


  function bytesToWords(input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = undefined;

    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }

    var length8 = input.length * 8;

    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
    }

    return output;
  }
  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */


  function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xffff;
  }
  /*
   * Bitwise rotate a 32-bit number to the left.
   */


  function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }
  /*
   * These functions implement the four basic operations the algorithm uses.
   */


  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
  }

  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
  }

  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  v35('v3', 0x30, md5);

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof options == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }

    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid(rnds);
  }

  // Adapted from Chris Veness' SHA1 code at
  // http://www.movable-type.co.uk/scripts/sha1.html
  function f(s, x, y, z) {
    switch (s) {
      case 0:
        return x & y ^ ~x & z;

      case 1:
        return x ^ y ^ z;

      case 2:
        return x & y ^ x & z ^ y & z;

      case 3:
        return x ^ y ^ z;
    }
  }

  function ROTL(x, n) {
    return x << n | x >>> 32 - n;
  }

  function sha1(bytes) {
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

    if (typeof bytes == 'string') {
      var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

      bytes = new Array(msg.length);

      for (var i = 0; i < msg.length; i++) {
        bytes[i] = msg.charCodeAt(i);
      }
    }

    bytes.push(0x80);
    var l = bytes.length / 4 + 2;
    var N = Math.ceil(l / 16);
    var M = new Array(N);

    for (var i = 0; i < N; i++) {
      M[i] = new Array(16);

      for (var j = 0; j < 16; j++) {
        M[i][j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
      }
    }

    M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

    for (var i = 0; i < N; i++) {
      var W = new Array(80);

      for (var t = 0; t < 16; t++) {
        W[t] = M[i][t];
      }

      for (var t = 16; t < 80; t++) {
        W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }

      var a = H[0];
      var b = H[1];
      var c = H[2];
      var d = H[3];
      var e = H[4];

      for (var t = 0; t < 80; t++) {
        var s = Math.floor(t / 20);
        var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
        e = d;
        d = c;
        c = ROTL(b, 30) >>> 0;
        b = a;
        a = T;
      }

      H[0] = H[0] + a >>> 0;
      H[1] = H[1] + b >>> 0;
      H[2] = H[2] + c >>> 0;
      H[3] = H[3] + d >>> 0;
      H[4] = H[4] + e >>> 0;
    }

    return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
  }

  v35('v5', 0x50, sha1);

  function ownKeys$2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _extends$1() {
    _extends$1 = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends$1.apply(this, arguments);
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$a =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$9 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$8 = fails$9;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$8(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var fails$7 = fails$9;

  var functionBindNative = !fails$7(function () {
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    var test = (function () { /* empty */ }).bind();
    // eslint-disable-next-line no-prototype-builtins -- safe
    return typeof test != 'function' || test.hasOwnProperty('prototype');
  });

  var NATIVE_BIND$2 = functionBindNative;

  var call$4 = Function.prototype.call;

  var functionCall = NATIVE_BIND$2 ? call$4.bind(call$4) : function () {
    return call$4.apply(call$4, arguments);
  };

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$2 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var NATIVE_BIND$1 = functionBindNative;

  var FunctionPrototype$1 = Function.prototype;
  var call$3 = FunctionPrototype$1.call;
  var uncurryThisWithBind = NATIVE_BIND$1 && FunctionPrototype$1.bind.bind(call$3, call$3);

  var functionUncurryThisRaw = function (fn) {
    return NATIVE_BIND$1 ? uncurryThisWithBind(fn) : function () {
      return call$3.apply(fn, arguments);
    };
  };

  var uncurryThisRaw$1 = functionUncurryThisRaw;

  var toString$1 = uncurryThisRaw$1({}.toString);
  var stringSlice = uncurryThisRaw$1(''.slice);

  var classofRaw$2 = function (it) {
    return stringSlice(toString$1(it), 8, -1);
  };

  var classofRaw$1 = classofRaw$2;
  var uncurryThisRaw = functionUncurryThisRaw;

  var functionUncurryThis = function (fn) {
    // Nashorn bug:
    //   https://github.com/zloirock/core-js/issues/1128
    //   https://github.com/zloirock/core-js/issues/1130
    if (classofRaw$1(fn) === 'Function') return uncurryThisRaw(fn);
  };

  var uncurryThis$9 = functionUncurryThis;
  var fails$6 = fails$9;
  var classof$3 = classofRaw$2;

  var $Object$3 = Object;
  var split = uncurryThis$9(''.split);

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$6(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !$Object$3('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$3(it) == 'String' ? split(it, '') : $Object$3(it);
  } : $Object$3;

  // we can't use just `it == null` since of `document.all` special case
  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
  var isNullOrUndefined$2 = function (it) {
    return it === null || it === undefined;
  };

  var isNullOrUndefined$1 = isNullOrUndefined$2;

  var $TypeError$5 = TypeError;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$2 = function (it) {
    if (isNullOrUndefined$1(it)) throw $TypeError$5("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$1 = indexedObject;
  var requireObjectCoercible$1 = requireObjectCoercible$2;

  var toIndexedObject$4 = function (it) {
    return IndexedObject$1(requireObjectCoercible$1(it));
  };

  var documentAll$2 = typeof document == 'object' && document.all;

  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
  var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

  var documentAll_1 = {
    all: documentAll$2,
    IS_HTMLDDA: IS_HTMLDDA
  };

  var $documentAll$1 = documentAll_1;

  var documentAll$1 = $documentAll$1.all;

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$c = $documentAll$1.IS_HTMLDDA ? function (argument) {
    return typeof argument == 'function' || argument === documentAll$1;
  } : function (argument) {
    return typeof argument == 'function';
  };

  var isCallable$b = isCallable$c;
  var $documentAll = documentAll_1;

  var documentAll = $documentAll.all;

  var isObject$6 = $documentAll.IS_HTMLDDA ? function (it) {
    return typeof it == 'object' ? it !== null : isCallable$b(it) || it === documentAll;
  } : function (it) {
    return typeof it == 'object' ? it !== null : isCallable$b(it);
  };

  var global$9 = global$a;
  var isCallable$a = isCallable$c;

  var aFunction = function (argument) {
    return isCallable$a(argument) ? argument : undefined;
  };

  var getBuiltIn$5 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$9[namespace]) : global$9[namespace] && global$9[namespace][method];
  };

  var uncurryThis$8 = functionUncurryThis;

  var objectIsPrototypeOf = uncurryThis$8({}.isPrototypeOf);

  var getBuiltIn$4 = getBuiltIn$5;

  var engineUserAgent = getBuiltIn$4('navigator', 'userAgent') || '';

  var global$8 = global$a;
  var userAgent = engineUserAgent;

  var process = global$8.process;
  var Deno = global$8.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }

  // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0
  if (!version && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }

  var engineV8Version = version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION = engineV8Version;
  var fails$5 = fails$9;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$5(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$1 = symbolConstructorDetection;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var getBuiltIn$3 = getBuiltIn$5;
  var isCallable$9 = isCallable$c;
  var isPrototypeOf = objectIsPrototypeOf;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var $Object$2 = Object;

  var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$3('Symbol');
    return isCallable$9($Symbol) && isPrototypeOf($Symbol.prototype, $Object$2(it));
  };

  var $String$1 = String;

  var tryToString$1 = function (argument) {
    try {
      return $String$1(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$8 = isCallable$c;
  var tryToString = tryToString$1;

  var $TypeError$4 = TypeError;

  // `Assert: IsCallable(argument) is true`
  var aCallable$2 = function (argument) {
    if (isCallable$8(argument)) return argument;
    throw $TypeError$4(tryToString(argument) + ' is not a function');
  };

  var aCallable$1 = aCallable$2;
  var isNullOrUndefined = isNullOrUndefined$2;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$1 = function (V, P) {
    var func = V[P];
    return isNullOrUndefined(func) ? undefined : aCallable$1(func);
  };

  var call$2 = functionCall;
  var isCallable$7 = isCallable$c;
  var isObject$5 = isObject$6;

  var $TypeError$3 = TypeError;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$7(fn = input.toString) && !isObject$5(val = call$2(fn, input))) return val;
    if (isCallable$7(fn = input.valueOf) && !isObject$5(val = call$2(fn, input))) return val;
    if (pref !== 'string' && isCallable$7(fn = input.toString) && !isObject$5(val = call$2(fn, input))) return val;
    throw $TypeError$3("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var global$7 = global$a;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$2 = Object.defineProperty;

  var defineGlobalProperty$3 = function (key, value) {
    try {
      defineProperty$2(global$7, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$7[key] = value;
    } return value;
  };

  var global$6 = global$a;
  var defineGlobalProperty$2 = defineGlobalProperty$3;

  var SHARED = '__core-js_shared__';
  var store$3 = global$6[SHARED] || defineGlobalProperty$2(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.25.5',
    mode: 'global',
    copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.25.5/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });

  var requireObjectCoercible = requireObjectCoercible$2;

  var $Object$1 = Object;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$2 = function (argument) {
    return $Object$1(requireObjectCoercible(argument));
  };

  var uncurryThis$7 = functionUncurryThis;
  var toObject$1 = toObject$2;

  var hasOwnProperty = uncurryThis$7({}.hasOwnProperty);

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  // eslint-disable-next-line es/no-object-hasown -- safe
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject$1(it), key);
  };

  var uncurryThis$6 = functionUncurryThis;

  var id = 0;
  var postfix = Math.random();
  var toString = uncurryThis$6(1.0.toString);

  var uid$2 = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
  };

  var global$5 = global$a;
  var shared$2 = shared$3.exports;
  var hasOwn$6 = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = symbolConstructorDetection;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore = shared$2('wks');
  var Symbol$1 = global$5.Symbol;
  var symbolFor = Symbol$1 && Symbol$1['for'];
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$5 = function (name) {
    if (!hasOwn$6(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      var description = 'Symbol.' + name;
      if (NATIVE_SYMBOL && hasOwn$6(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else if (USE_SYMBOL_AS_UID && symbolFor) {
        WellKnownSymbolsStore[name] = symbolFor(description);
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
      }
    } return WellKnownSymbolsStore[name];
  };

  var call$1 = functionCall;
  var isObject$4 = isObject$6;
  var isSymbol$1 = isSymbol$2;
  var getMethod = getMethod$1;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$4 = wellKnownSymbol$5;

  var $TypeError$2 = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol$4('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$4(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = call$1(exoticToPrim, input, pref);
      if (!isObject$4(result) || isSymbol$1(result)) return result;
      throw $TypeError$2("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = isSymbol$2;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$2 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : key + '';
  };

  var global$4 = global$a;
  var isObject$3 = isObject$6;

  var document$1 = global$4.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$3(document$1) && isObject$3(document$1.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$7 = descriptors;
  var fails$4 = fails$9;
  var createElement = documentCreateElement$1;

  // Thanks to IE8 for its funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$7 && !fails$4(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$6 = descriptors;
  var call = functionCall;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var createPropertyDescriptor$1 = createPropertyDescriptor$2;
  var toIndexedObject$3 = toIndexedObject$4;
  var toPropertyKey$1 = toPropertyKey$2;
  var hasOwn$5 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$6 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$3(O);
    P = toPropertyKey$1(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$5(O, P)) return createPropertyDescriptor$1(!call(propertyIsEnumerableModule.f, O, P), O[P]);
  };

  var objectDefineProperty = {};

  var DESCRIPTORS$5 = descriptors;
  var fails$3 = fails$9;

  // V8 ~ Chrome 36-
  // https://bugs.chromium.org/p/v8/issues/detail?id=3334
  var v8PrototypeDefineBug = DESCRIPTORS$5 && fails$3(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(function () { /* empty */ }, 'prototype', {
      value: 42,
      writable: false
    }).prototype != 42;
  });

  var isObject$2 = isObject$6;

  var $String = String;
  var $TypeError$1 = TypeError;

  // `Assert: Type(argument) is Object`
  var anObject$4 = function (argument) {
    if (isObject$2(argument)) return argument;
    throw $TypeError$1($String(argument) + ' is not an object');
  };

  var DESCRIPTORS$4 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
  var anObject$3 = anObject$4;
  var toPropertyKey = toPropertyKey$2;

  var $TypeError = TypeError;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE$1 = 'configurable';
  var WRITABLE = 'writable';

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$4 ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
    anObject$3(O);
    P = toPropertyKey(P);
    anObject$3(Attributes);
    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    } return $defineProperty(O, P, Attributes);
  } : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$3(O);
    P = toPropertyKey(P);
    anObject$3(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$3 = descriptors;
  var definePropertyModule$3 = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$2;

  var createNonEnumerableProperty$2 = DESCRIPTORS$3 ? function (object, key, value) {
    return definePropertyModule$3.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var makeBuiltIn$2 = {exports: {}};

  var DESCRIPTORS$2 = descriptors;
  var hasOwn$4 = hasOwnProperty_1;

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$2 && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$4(FunctionPrototype, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$2 || (DESCRIPTORS$2 && getDescriptor(FunctionPrototype, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var uncurryThis$5 = functionUncurryThis;
  var isCallable$6 = isCallable$c;
  var store$1 = sharedStore;

  var functionToString = uncurryThis$5(Function.toString);

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$6(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString(it);
    };
  }

  var inspectSource$2 = store$1.inspectSource;

  var global$3 = global$a;
  var isCallable$5 = isCallable$c;

  var WeakMap$1 = global$3.WeakMap;

  var weakMapBasicDetection = isCallable$5(WeakMap$1) && /native code/.test(String(WeakMap$1));

  var shared$1 = shared$3.exports;
  var uid = uid$2;

  var keys = shared$1('keys');

  var sharedKey$2 = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$4 = {};

  var NATIVE_WEAK_MAP = weakMapBasicDetection;
  var global$2 = global$a;
  var isObject$1 = isObject$6;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$2;
  var hasOwn$3 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey$1 = sharedKey$2;
  var hiddenKeys$3 = hiddenKeys$4;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$1 = global$2.TypeError;
  var WeakMap = global$2.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject$1(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    /* eslint-disable no-self-assign -- prototype methods protection */
    store.get = store.get;
    store.has = store.has;
    store.set = store.set;
    /* eslint-enable no-self-assign -- prototype methods protection */
    set = function (it, metadata) {
      if (store.has(it)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      store.set(it, metadata);
      return metadata;
    };
    get = function (it) {
      return store.get(it) || {};
    };
    has = function (it) {
      return store.has(it);
    };
  } else {
    var STATE = sharedKey$1('state');
    hiddenKeys$3[STATE] = true;
    set = function (it, metadata) {
      if (hasOwn$3(it, STATE)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$1(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwn$3(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$3(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var fails$2 = fails$9;
  var isCallable$4 = isCallable$c;
  var hasOwn$2 = hasOwnProperty_1;
  var DESCRIPTORS$1 = descriptors;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
  var inspectSource$1 = inspectSource$2;
  var InternalStateModule = internalState;

  var enforceInternalState = InternalStateModule.enforce;
  var getInternalState = InternalStateModule.get;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$1 = Object.defineProperty;

  var CONFIGURABLE_LENGTH = DESCRIPTORS$1 && !fails$2(function () {
    return defineProperty$1(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
  });

  var TEMPLATE = String(String).split('String');

  var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (options && options.getter) name = 'get ' + name;
    if (options && options.setter) name = 'set ' + name;
    if (!hasOwn$2(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      if (DESCRIPTORS$1) defineProperty$1(value, 'name', { value: name, configurable: true });
      else value.name = name;
    }
    if (CONFIGURABLE_LENGTH && options && hasOwn$2(options, 'arity') && value.length !== options.arity) {
      defineProperty$1(value, 'length', { value: options.arity });
    }
    try {
      if (options && hasOwn$2(options, 'constructor') && options.constructor) {
        if (DESCRIPTORS$1) defineProperty$1(value, 'prototype', { writable: false });
      // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
      } else if (value.prototype) value.prototype = undefined;
    } catch (error) { /* empty */ }
    var state = enforceInternalState(value);
    if (!hasOwn$2(state, 'source')) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    } return value;
  };

  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  // eslint-disable-next-line no-extend-native -- required
  Function.prototype.toString = makeBuiltIn$1(function toString() {
    return isCallable$4(this) && getInternalState(this).source || inspectSource$1(this);
  }, 'toString');

  var isCallable$3 = isCallable$c;
  var definePropertyModule$2 = objectDefineProperty;
  var makeBuiltIn = makeBuiltIn$2.exports;
  var defineGlobalProperty$1 = defineGlobalProperty$3;

  var defineBuiltIn$1 = function (O, key, value, options) {
    if (!options) options = {};
    var simple = options.enumerable;
    var name = options.name !== undefined ? options.name : key;
    if (isCallable$3(value)) makeBuiltIn(value, name, options);
    if (options.global) {
      if (simple) O[key] = value;
      else defineGlobalProperty$1(key, value);
    } else {
      try {
        if (!options.unsafe) delete O[key];
        else if (O[key]) simple = true;
      } catch (error) { /* empty */ }
      if (simple) O[key] = value;
      else definePropertyModule$2.f(O, key, {
        value: value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
    } return O;
  };

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `Math.trunc` method
  // https://tc39.es/ecma262/#sec-math.trunc
  // eslint-disable-next-line es/no-math-trunc -- safe
  var mathTrunc = Math.trunc || function trunc(x) {
    var n = +x;
    return (n > 0 ? floor : ceil)(n);
  };

  var trunc = mathTrunc;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$2 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- NaN check
    return number !== number || number === 0 ? 0 : trunc(number);
  };

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toIntegerOrInfinity$1(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var toIntegerOrInfinity = toIntegerOrInfinity$2;

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$2 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$2 = toIndexedObject$4;
  var toAbsoluteIndex = toAbsoluteIndex$1;
  var lengthOfArrayLike$1 = lengthOfArrayLike$2;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$1 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$2($this);
      var length = lengthOfArrayLike$1(O);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod$1(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$1(false)
  };

  var uncurryThis$4 = functionUncurryThis;
  var hasOwn$1 = hasOwnProperty_1;
  var toIndexedObject$1 = toIndexedObject$4;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys$2 = hiddenKeys$4;

  var push$1 = uncurryThis$4([].push);

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject$1(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$1(hiddenKeys$2, key) && hasOwn$1(O, key) && push$1(result, key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$1(O, key = names[i++])) {
      ~indexOf(result, key) || push$1(result, key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$1);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$2 = getBuiltIn$5;
  var uncurryThis$3 = functionUncurryThis;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var anObject$2 = anObject$4;

  var concat = uncurryThis$3([].concat);

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$2('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$2(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$1 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source, exceptions) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$1.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };

  var fails$1 = fails$9;
  var isCallable$2 = isCallable$c;

  var replacement = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$2(detection) ? fails$1(detection)
      : !!detection;
  };

  var normalize = isForced$1.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$1.data = {};
  var NATIVE = isForced$1.NATIVE = 'N';
  var POLYFILL = isForced$1.POLYFILL = 'P';

  var isForced_1 = isForced$1;

  var global$1 = global$a;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty = createNonEnumerableProperty$2;
  var defineBuiltIn = defineBuiltIn$1;
  var defineGlobalProperty = defineGlobalProperty$3;
  var copyConstructorProperties = copyConstructorProperties$1;
  var isForced = isForced_1;

  /*
    options.target         - name of the target object
    options.global         - target is the global object
    options.stat           - export as static methods of target
    options.proto          - export as prototype methods of target
    options.real           - real prototype method for the `pure` version
    options.forced         - export even if the native feature is available
    options.bind           - bind methods to the target, required for the `pure` version
    options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe         - use the simple assignment of property instead of delete + defineProperty
    options.sham           - add a flag to not completely full polyfills
    options.enumerable     - export as enumerable property
    options.dontCallGetSet - prevent calling a getter on target
    options.name           - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$1;
    } else if (STATIC) {
      target = global$1[TARGET] || defineGlobalProperty(TARGET, {});
    } else {
      target = (global$1[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty == typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      defineBuiltIn(target, key, sourceProperty, options);
    }
  };

  var uncurryThis$2 = functionUncurryThis;
  var aCallable = aCallable$2;
  var NATIVE_BIND = functionBindNative;

  var bind$1 = uncurryThis$2(uncurryThis$2.bind);

  // optional / simple context binding
  var functionBindContext = function (fn, that) {
    aCallable(fn);
    return that === undefined ? fn : NATIVE_BIND ? bind$1(fn, that) : function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var classof$2 = classofRaw$2;

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray$1 = Array.isArray || function isArray(argument) {
    return classof$2(argument) == 'Array';
  };

  var wellKnownSymbol$3 = wellKnownSymbol$5;

  var TO_STRING_TAG$1 = wellKnownSymbol$3('toStringTag');
  var test = {};

  test[TO_STRING_TAG$1] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var isCallable$1 = isCallable$c;
  var classofRaw = classofRaw$2;
  var wellKnownSymbol$2 = wellKnownSymbol$5;

  var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
  var $Object = Object;

  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$1 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && isCallable$1(O.callee) ? 'Arguments' : result;
  };

  var uncurryThis$1 = functionUncurryThis;
  var fails = fails$9;
  var isCallable = isCallable$c;
  var classof = classof$1;
  var getBuiltIn$1 = getBuiltIn$5;
  var inspectSource = inspectSource$2;

  var noop = function () { /* empty */ };
  var empty = [];
  var construct = getBuiltIn$1('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = uncurryThis$1(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

  var isConstructorModern = function isConstructor(argument) {
    if (!isCallable(argument)) return false;
    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };

  var isConstructorLegacy = function isConstructor(argument) {
    if (!isCallable(argument)) return false;
    switch (classof(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction': return false;
    }
    try {
      // we can't check .prototype since constructors produced by .bind haven't it
      // `Function#toString` throws on some built-it function in some legacy engines
      // (for example, `DOMQuad` and similar in FF41-)
      return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
    } catch (error) {
      return true;
    }
  };

  isConstructorLegacy.sham = true;

  // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor
  var isConstructor$1 = !construct || fails(function () {
    var called;
    return isConstructorModern(isConstructorModern.call)
      || !isConstructorModern(Object)
      || !isConstructorModern(function () { called = true; })
      || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var isArray = isArray$1;
  var isConstructor = isConstructor$1;
  var isObject = isObject$6;
  var wellKnownSymbol$1 = wellKnownSymbol$5;

  var SPECIES = wellKnownSymbol$1('species');
  var $Array = Array;

  // a part of `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesConstructor$1 = function (originalArray) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    } return C === undefined ? $Array : C;
  };

  var arraySpeciesConstructor = arraySpeciesConstructor$1;

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate$1 = function (originalArray, length) {
    return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
  };

  var bind = functionBindContext;
  var uncurryThis = functionUncurryThis;
  var IndexedObject = indexedObject;
  var toObject = toObject$2;
  var lengthOfArrayLike = lengthOfArrayLike$2;
  var arraySpeciesCreate = arraySpeciesCreate$1;

  var push = uncurryThis([].push);

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
  var createMethod = function (TYPE) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var IS_FILTER_REJECT = TYPE == 7;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    return function ($this, callbackfn, that, specificCreate) {
      var O = toObject($this);
      var self = IndexedObject(O);
      var boundFunction = bind(callbackfn, that);
      var length = lengthOfArrayLike(self);
      var index = 0;
      var create = specificCreate || arraySpeciesCreate;
      var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
      var value, result;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        value = self[index];
        result = boundFunction(value, index, O);
        if (TYPE) {
          if (IS_MAP) target[index] = result; // map
          else if (result) switch (TYPE) {
            case 3: return true;              // some
            case 5: return value;             // find
            case 6: return index;             // findIndex
            case 2: push(target, value);      // filter
          } else switch (TYPE) {
            case 4: return false;             // every
            case 7: push(target, value);      // filterReject
          }
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
    };
  };

  var arrayIteration = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: createMethod(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: createMethod(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: createMethod(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: createMethod(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: createMethod(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: createMethod(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: createMethod(7)
  };

  var objectDefineProperties = {};

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$1 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS = descriptors;
  var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
  var definePropertyModule = objectDefineProperty;
  var anObject$1 = anObject$4;
  var toIndexedObject = toIndexedObject$4;
  var objectKeys = objectKeys$1;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$1(O);
    var props = toIndexedObject(Properties);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
    return O;
  };

  var getBuiltIn = getBuiltIn$5;

  var html$1 = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

  var anObject = anObject$4;
  var definePropertiesModule = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys = hiddenKeys$4;
  var html = html$1;
  var documentCreateElement = documentCreateElement$1;
  var sharedKey = sharedKey$2;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  // eslint-disable-next-line es/no-object-create -- safe
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
  };

  var wellKnownSymbol = wellKnownSymbol$5;
  var create = objectCreate;
  var defineProperty = objectDefineProperty.f;

  var UNSCOPABLES = wellKnownSymbol('unscopables');
  var ArrayPrototype = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype[UNSCOPABLES] == undefined) {
    defineProperty(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: create(null)
    });
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables$1 = function (key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };

  var $ = _export;
  var $find = arrayIteration.find;
  var addToUnscopables = addToUnscopables$1;

  var FIND = 'find';
  var SKIPS_HOLES = true;

  // Shouldn't skip holes
  if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  $({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
    find: function find(callbackfn /* , that = undefined */) {
      return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables(FIND);

  var CONSTANT = {
    GLOBAL: {
      HIDE: '__react_tooltip_hide_event',
      REBUILD: '__react_tooltip_rebuild_event',
      SHOW: '__react_tooltip_show_event'
    }
  };

  /**
   * Static methods for react-tooltip
   */
  var dispatchGlobalEvent = function dispatchGlobalEvent(eventName, opts) {
    // Compatible with IE
    // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
    // @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    var event;
    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, {
        detail: opts
      });
    } else {
      event = document.createEvent('Event');
      event.initEvent(eventName, false, true, opts);
    }
    window.dispatchEvent(event);
  };
  function staticMethods (target) {
    /**
     * Hide all tooltip
     * @trigger ReactTooltip.hide()
     */
    target.hide = function (target) {
      dispatchGlobalEvent(CONSTANT.GLOBAL.HIDE, {
        target: target
      });
    };

    /**
     * Rebuild all tooltip
     * @trigger ReactTooltip.rebuild()
     */
    target.rebuild = function () {
      dispatchGlobalEvent(CONSTANT.GLOBAL.REBUILD);
    };

    /**
     * Show specific tooltip
     * @trigger ReactTooltip.show()
     */
    target.show = function (target) {
      dispatchGlobalEvent(CONSTANT.GLOBAL.SHOW, {
        target: target
      });
    };
    target.prototype.globalRebuild = function () {
      if (this.mount) {
        this.unbindListener();
        this.bindListener();
      }
    };
    target.prototype.globalShow = function (event) {
      if (this.mount) {
        var hasTarget = event && event.detail && event.detail.target && true || false;
        // Create a fake event, specific show will limit the type to `solid`
        // only `float` type cares e.clientX e.clientY
        this.showTooltip({
          currentTarget: hasTarget && event.detail.target
        }, true);
      }
    };
    target.prototype.globalHide = function (event) {
      if (this.mount) {
        var hasTarget = event && event.detail && event.detail.target && true || false;
        this.hideTooltip({
          currentTarget: hasTarget && event.detail.target
        }, hasTarget);
      }
    };
  }

  /**
   * Events that should be bound to the window
   */
  function windowListener (target) {
    target.prototype.bindWindowEvents = function (resizeHide) {
      // ReactTooltip.hide
      window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide);
      window.addEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide, false);

      // ReactTooltip.rebuild
      window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild);
      window.addEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild, false);

      // ReactTooltip.show
      window.removeEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow);
      window.addEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow, false);

      // Resize
      if (resizeHide) {
        window.removeEventListener('resize', this.onWindowResize);
        window.addEventListener('resize', this.onWindowResize, false);
      }
    };
    target.prototype.unbindWindowEvents = function () {
      window.removeEventListener(CONSTANT.GLOBAL.HIDE, this.globalHide);
      window.removeEventListener(CONSTANT.GLOBAL.REBUILD, this.globalRebuild);
      window.removeEventListener(CONSTANT.GLOBAL.SHOW, this.globalShow);
      window.removeEventListener('resize', this.onWindowResize);
    };

    /**
     * invoked by resize event of window
     */
    target.prototype.onWindowResize = function () {
      if (!this.mount) return;
      this.hideTooltip();
    };
  }

  /**
   * Custom events to control showing and hiding of tooltip
   *
   * @attributes
   * - `event` {String}
   * - `eventOff` {String}
   */

  var checkStatus = function checkStatus(dataEventOff, e) {
    var show = this.state.show;
    var id = this.props.id;
    var isCapture = this.isCapture(e.currentTarget);
    var currentItem = e.currentTarget.getAttribute('currentItem');
    if (!isCapture) e.stopPropagation();
    if (show && currentItem === 'true') {
      if (!dataEventOff) this.hideTooltip(e);
    } else {
      e.currentTarget.setAttribute('currentItem', 'true');
      setUntargetItems(e.currentTarget, this.getTargetArray(id));
      this.showTooltip(e);
    }
  };
  var setUntargetItems = function setUntargetItems(currentTarget, targetArray) {
    for (var i = 0; i < targetArray.length; i++) {
      if (currentTarget !== targetArray[i]) {
        targetArray[i].setAttribute('currentItem', 'false');
      } else {
        targetArray[i].setAttribute('currentItem', 'true');
      }
    }
  };
  var customListeners = {
    id: '9b69f92e-d3fe-498b-b1b4-c5e63a51b0cf',
    set: function set(target, event, listener) {
      if (this.id in target) {
        var map = target[this.id];
        map[event] = listener;
      } else {
        // this is workaround for WeakMap, which is not supported in older browsers, such as IE
        Object.defineProperty(target, this.id, {
          configurable: true,
          value: _defineProperty({}, event, listener)
        });
      }
    },
    get: function get(target, event) {
      var map = target[this.id];
      if (map !== undefined) {
        return map[event];
      }
    }
  };
  function customEvent (target) {
    target.prototype.isCustomEvent = function (ele) {
      var event = this.state.event;
      return event || !!ele.getAttribute('data-event');
    };

    /* Bind listener for custom event */
    target.prototype.customBindListener = function (ele) {
      var _this = this;
      var _this$state = this.state,
        event = _this$state.event,
        eventOff = _this$state.eventOff;
      var dataEvent = ele.getAttribute('data-event') || event;
      var dataEventOff = ele.getAttribute('data-event-off') || eventOff;
      dataEvent.split(' ').forEach(function (event) {
        ele.removeEventListener(event, customListeners.get(ele, event));
        var customListener = checkStatus.bind(_this, dataEventOff);
        customListeners.set(ele, event, customListener);
        ele.addEventListener(event, customListener, false);
      });
      if (dataEventOff) {
        dataEventOff.split(' ').forEach(function (event) {
          ele.removeEventListener(event, _this.hideTooltip);
          ele.addEventListener(event, _this.hideTooltip, false);
        });
      }
    };

    /* Unbind listener for custom event */
    target.prototype.customUnbindListener = function (ele) {
      var _this$state2 = this.state,
        event = _this$state2.event,
        eventOff = _this$state2.eventOff;
      var dataEvent = event || ele.getAttribute('data-event');
      var dataEventOff = eventOff || ele.getAttribute('data-event-off');
      ele.removeEventListener(dataEvent, customListeners.get(ele, event));
      if (dataEventOff) ele.removeEventListener(dataEventOff, this.hideTooltip);
    };
  }

  /**
   * Util method to judge if it should follow capture model
   */

  function isCapture (target) {
    target.prototype.isCapture = function (currentTarget) {
      return currentTarget && currentTarget.getAttribute('data-iscapture') === 'true' || this.props.isCapture || false;
    };
  }

  /**
   * Util method to get effect
   */

  function getEffect (target) {
    target.prototype.getEffect = function (currentTarget) {
      var dataEffect = currentTarget.getAttribute('data-effect');
      return dataEffect || this.props.effect || 'float';
    };
  }

  /**
   * Util method to get effect
   */
  var makeProxy = function makeProxy(e) {
    var proxy = {};
    for (var key in e) {
      if (typeof e[key] === 'function') {
        proxy[key] = e[key].bind(e);
      } else {
        proxy[key] = e[key];
      }
    }
    return proxy;
  };
  var bodyListener = function bodyListener(callback, options, e) {
    var _options$respectEffec = options.respectEffect,
      respectEffect = _options$respectEffec === void 0 ? false : _options$respectEffec,
      _options$customEvent = options.customEvent,
      customEvent = _options$customEvent === void 0 ? false : _options$customEvent;
    var id = this.props.id;
    var tip = null;
    var forId;
    var target = e.target;
    var lastTarget;
    // walk up parent chain until tip is found
    // there is no match if parent visible area is matched by mouse position, so some corner cases might not work as expected
    while (tip === null && target !== null) {
      lastTarget = target;
      tip = target.getAttribute('data-tip') || null;
      forId = target.getAttribute('data-for') || null;
      target = target.parentElement;
    }
    target = lastTarget || e.target;
    if (this.isCustomEvent(target) && !customEvent) {
      return;
    }
    var isTargetBelongsToTooltip = id == null && forId == null || forId === id;
    if (tip != null && (!respectEffect || this.getEffect(target) === 'float') && isTargetBelongsToTooltip) {
      var proxy = makeProxy(e);
      proxy.currentTarget = target;
      callback(proxy);
    }
  };
  var findCustomEvents = function findCustomEvents(targetArray, dataAttribute) {
    var events = {};
    targetArray.forEach(function (target) {
      var event = target.getAttribute(dataAttribute);
      if (event) event.split(' ').forEach(function (event) {
        return events[event] = true;
      });
    });
    return events;
  };
  var getBody = function getBody() {
    return document.getElementsByTagName('body')[0];
  };
  function bodyMode (target) {
    target.prototype.isBodyMode = function () {
      return !!this.props.bodyMode;
    };
    target.prototype.bindBodyListener = function (targetArray) {
      var _this = this;
      var _this$state = this.state,
        event = _this$state.event,
        eventOff = _this$state.eventOff,
        possibleCustomEvents = _this$state.possibleCustomEvents,
        possibleCustomEventsOff = _this$state.possibleCustomEventsOff;
      var body = getBody();
      var customEvents = findCustomEvents(targetArray, 'data-event');
      var customEventsOff = findCustomEvents(targetArray, 'data-event-off');
      if (event != null) customEvents[event] = true;
      if (eventOff != null) customEventsOff[eventOff] = true;
      possibleCustomEvents.split(' ').forEach(function (event) {
        return customEvents[event] = true;
      });
      possibleCustomEventsOff.split(' ').forEach(function (event) {
        return customEventsOff[event] = true;
      });
      this.unbindBodyListener(body);
      var listeners = this.bodyModeListeners = {};
      if (event == null) {
        listeners.mouseover = bodyListener.bind(this, this.showTooltip, {});
        listeners.mousemove = bodyListener.bind(this, this.updateTooltip, {
          respectEffect: true
        });
        listeners.mouseout = bodyListener.bind(this, this.hideTooltip, {});
      }
      for (var _event in customEvents) {
        listeners[_event] = bodyListener.bind(this, function (e) {
          var targetEventOff = e.currentTarget.getAttribute('data-event-off') || eventOff;
          checkStatus.call(_this, targetEventOff, e);
        }, {
          customEvent: true
        });
      }
      for (var _event2 in customEventsOff) {
        listeners[_event2] = bodyListener.bind(this, this.hideTooltip, {
          customEvent: true
        });
      }
      for (var _event3 in listeners) {
        body.addEventListener(_event3, listeners[_event3]);
      }
    };
    target.prototype.unbindBodyListener = function (body) {
      body = body || getBody();
      var listeners = this.bodyModeListeners;
      for (var event in listeners) {
        body.removeEventListener(event, listeners[event]);
      }
    };
  }

  /**
   * Tracking target removing from DOM.
   * It's necessary to hide tooltip when it's target disappears.
   * Otherwise, the tooltip would be shown forever until another target
   * is triggered.
   *
   * If MutationObserver is not available, this feature just doesn't work.
   */

  // https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
  var getMutationObserverClass = function getMutationObserverClass() {
    return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  };
  function trackRemoval (target) {
    target.prototype.bindRemovalTracker = function () {
      var _this = this;
      var MutationObserver = getMutationObserverClass();
      if (MutationObserver == null) return;
      var observer = new MutationObserver(function (mutations) {
        for (var m1 = 0; m1 < mutations.length; m1++) {
          var mutation = mutations[m1];
          for (var m2 = 0; m2 < mutation.removedNodes.length; m2++) {
            var element = mutation.removedNodes[m2];
            if (element === _this.state.currentTarget) {
              _this.hideTooltip();
              return;
            }
          }
        }
      });
      observer.observe(window.document, {
        childList: true,
        subtree: true
      });
      this.removalTracker = observer;
    };
    target.prototype.unbindRemovalTracker = function () {
      if (this.removalTracker) {
        this.removalTracker.disconnect();
        this.removalTracker = null;
      }
    };
  }

  /**
   * Calculate the position of tooltip
   *
   * @params
   * - `e` {Event} the event of current mouse
   * - `target` {Element} the currentTarget of the event
   * - `node` {DOM} the react-tooltip object
   * - `place` {String} top / right / bottom / left
   * - `effect` {String} float / solid
   * - `offset` {Object} the offset to default position
   *
   * @return {Object}
   * - `isNewState` {Bool} required
   * - `newState` {Object}
   * - `position` {Object} {left: {Number}, top: {Number}}
   */
  function getPosition (e, target, node, place, desiredPlace, effect, offset) {
    var _getDimensions = getDimensions(node),
      tipWidth = _getDimensions.width,
      tipHeight = _getDimensions.height;
    var _getDimensions2 = getDimensions(target),
      targetWidth = _getDimensions2.width,
      targetHeight = _getDimensions2.height;
    var _getCurrentOffset = getCurrentOffset(e, target, effect),
      mouseX = _getCurrentOffset.mouseX,
      mouseY = _getCurrentOffset.mouseY;
    var defaultOffset = getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight);
    var _calculateOffset = calculateOffset(offset),
      extraOffsetX = _calculateOffset.extraOffsetX,
      extraOffsetY = _calculateOffset.extraOffsetY;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var _getParent = getParent(node),
      parentTop = _getParent.parentTop,
      parentLeft = _getParent.parentLeft;

    // Get the edge offset of the tooltip
    var getTipOffsetLeft = function getTipOffsetLeft(place) {
      var offsetX = defaultOffset[place].l;
      return mouseX + offsetX + extraOffsetX;
    };
    var getTipOffsetRight = function getTipOffsetRight(place) {
      var offsetX = defaultOffset[place].r;
      return mouseX + offsetX + extraOffsetX;
    };
    var getTipOffsetTop = function getTipOffsetTop(place) {
      var offsetY = defaultOffset[place].t;
      return mouseY + offsetY + extraOffsetY;
    };
    var getTipOffsetBottom = function getTipOffsetBottom(place) {
      var offsetY = defaultOffset[place].b;
      return mouseY + offsetY + extraOffsetY;
    };

    //
    // Functions to test whether the tooltip's sides are inside
    // the client window for a given orientation p
    //
    //  _____________
    // |             | <-- Right side
    // | p = 'left'  |\
    // |             |/  |\
    // |_____________|   |_\  <-- Mouse
    //      / \           |
    //       |
    //       |
    //  Bottom side
    //
    var outsideLeft = function outsideLeft(p) {
      return getTipOffsetLeft(p) < 0;
    };
    var outsideRight = function outsideRight(p) {
      return getTipOffsetRight(p) > windowWidth;
    };
    var outsideTop = function outsideTop(p) {
      return getTipOffsetTop(p) < 0;
    };
    var outsideBottom = function outsideBottom(p) {
      return getTipOffsetBottom(p) > windowHeight;
    };

    // Check whether the tooltip with orientation p is completely inside the client window
    var outside = function outside(p) {
      return outsideLeft(p) || outsideRight(p) || outsideTop(p) || outsideBottom(p);
    };
    var inside = function inside(p) {
      return !outside(p);
    };
    var placeIsInside = {
      top: inside('top'),
      bottom: inside('bottom'),
      left: inside('left'),
      right: inside('right')
    };
    function choose() {
      var allPlaces = desiredPlace.split(',').concat(place, ['top', 'bottom', 'left', 'right']);
      var _iterator = _createForOfIteratorHelper(allPlaces),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var d = _step.value;
          if (placeIsInside[d]) return d;
        }
        // if nothing is inside, just use the old place.
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return place;
    }
    var chosen = choose();
    var isNewState = false;
    var newPlace;
    if (chosen && chosen !== place) {
      isNewState = true;
      newPlace = chosen;
    }
    if (isNewState) {
      return {
        isNewState: true,
        newState: {
          place: newPlace
        }
      };
    }
    return {
      isNewState: false,
      position: {
        left: parseInt(getTipOffsetLeft(place) - parentLeft, 10),
        top: parseInt(getTipOffsetTop(place) - parentTop, 10)
      }
    };
  }
  var getDimensions = function getDimensions(node) {
    var _node$getBoundingClie = node.getBoundingClientRect(),
      height = _node$getBoundingClie.height,
      width = _node$getBoundingClie.width;
    return {
      height: parseInt(height, 10),
      width: parseInt(width, 10)
    };
  };

  // Get current mouse offset
  var getCurrentOffset = function getCurrentOffset(e, currentTarget, effect) {
    var boundingClientRect = currentTarget.getBoundingClientRect();
    var targetTop = boundingClientRect.top;
    var targetLeft = boundingClientRect.left;
    var _getDimensions3 = getDimensions(currentTarget),
      targetWidth = _getDimensions3.width,
      targetHeight = _getDimensions3.height;
    if (effect === 'float') {
      return {
        mouseX: e.clientX,
        mouseY: e.clientY
      };
    }
    return {
      mouseX: targetLeft + targetWidth / 2,
      mouseY: targetTop + targetHeight / 2
    };
  };

  // List all possibility of tooltip final offset
  // This is useful in judging if it is necessary for tooltip to switch position when out of window
  var getDefaultPosition = function getDefaultPosition(effect, targetWidth, targetHeight, tipWidth, tipHeight) {
    var top;
    var right;
    var bottom;
    var left;
    var disToMouse = 3;
    var triangleHeight = 2;
    var cursorHeight = 12; // Optimize for float bottom only, cause the cursor will hide the tooltip

    if (effect === 'float') {
      top = {
        l: -(tipWidth / 2),
        r: tipWidth / 2,
        t: -(tipHeight + disToMouse + triangleHeight),
        b: -disToMouse
      };
      bottom = {
        l: -(tipWidth / 2),
        r: tipWidth / 2,
        t: disToMouse + cursorHeight,
        b: tipHeight + disToMouse + triangleHeight + cursorHeight
      };
      left = {
        l: -(tipWidth + disToMouse + triangleHeight),
        r: -disToMouse,
        t: -(tipHeight / 2),
        b: tipHeight / 2
      };
      right = {
        l: disToMouse,
        r: tipWidth + disToMouse + triangleHeight,
        t: -(tipHeight / 2),
        b: tipHeight / 2
      };
    } else if (effect === 'solid') {
      top = {
        l: -(tipWidth / 2),
        r: tipWidth / 2,
        t: -(targetHeight / 2 + tipHeight + triangleHeight),
        b: -(targetHeight / 2)
      };
      bottom = {
        l: -(tipWidth / 2),
        r: tipWidth / 2,
        t: targetHeight / 2,
        b: targetHeight / 2 + tipHeight + triangleHeight
      };
      left = {
        l: -(tipWidth + targetWidth / 2 + triangleHeight),
        r: -(targetWidth / 2),
        t: -(tipHeight / 2),
        b: tipHeight / 2
      };
      right = {
        l: targetWidth / 2,
        r: tipWidth + targetWidth / 2 + triangleHeight,
        t: -(tipHeight / 2),
        b: tipHeight / 2
      };
    }
    return {
      top: top,
      bottom: bottom,
      left: left,
      right: right
    };
  };

  // Consider additional offset into position calculation
  var calculateOffset = function calculateOffset(offset) {
    var extraOffsetX = 0;
    var extraOffsetY = 0;
    if (Object.prototype.toString.apply(offset) === '[object String]') {
      offset = JSON.parse(offset.toString().replace(/'/g, '"'));
    }
    for (var key in offset) {
      if (key === 'top') {
        extraOffsetY -= parseInt(offset[key], 10);
      } else if (key === 'bottom') {
        extraOffsetY += parseInt(offset[key], 10);
      } else if (key === 'left') {
        extraOffsetX -= parseInt(offset[key], 10);
      } else if (key === 'right') {
        extraOffsetX += parseInt(offset[key], 10);
      }
    }
    return {
      extraOffsetX: extraOffsetX,
      extraOffsetY: extraOffsetY
    };
  };

  // Get the offset of the parent elements
  var getParent = function getParent(currentTarget) {
    var currentParent = currentTarget;
    while (currentParent) {
      var computedStyle = window.getComputedStyle(currentParent);
      // transform and will-change: transform change the containing block
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block
      if (computedStyle.getPropertyValue('transform') !== 'none' || computedStyle.getPropertyValue('will-change') === 'transform') break;
      currentParent = currentParent.parentElement;
    }
    var parentTop = currentParent && currentParent.getBoundingClientRect().top || 0;
    var parentLeft = currentParent && currentParent.getBoundingClientRect().left || 0;
    return {
      parentTop: parentTop,
      parentLeft: parentLeft
    };
  };

  /**
   * To get the tooltip content
   * it may comes from data-tip or this.props.children
   * it should support multiline
   *
   * @params
   * - `tip` {String} value of data-tip
   * - `children` {ReactElement} this.props.children
   * - `multiline` {Any} could be Bool(true/false) or String('true'/'false')
   *
   * @return
   * - String or react component
   */
  function TipContent(tip, children, getContent, multiline) {
    if (children) return children;
    if (getContent !== undefined && getContent !== null) return getContent; // getContent can be 0, '', etc.
    if (getContent === null) return null; // Tip not exist and children is null or undefined

    var regexp = /<br\s*\/?>/;
    if (!multiline || multiline === 'false' || !regexp.test(tip)) {
      // No trim(), so that user can keep their input
      return tip;
    }

    // Multiline tooltip content
    return tip.split(regexp).map(function (d, i) {
      return /*#__PURE__*/React__default["default"].createElement("span", {
        key: i,
        className: "multi-line"
      }, d);
    });
  }

  /**
   * Support aria- and role in ReactTooltip
   *
   * @params props {Object}
   * @return {Object}
   */
  function parseAria(props) {
    var ariaObj = {};
    Object.keys(props).filter(function (prop) {
      // aria-xxx and role is acceptable
      return /(^aria-\w+$|^role$)/.test(prop);
    }).forEach(function (prop) {
      ariaObj[prop] = props[prop];
    });
    return ariaObj;
  }

  /**
   * Convert nodelist to array
   * @see https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/core/createArrayFromMixed.js#L24
   * NodeLists are functions in Safari
   */

  function nodeListToArray (nodeList) {
    var length = nodeList.length;
    if (nodeList.hasOwnProperty) {
      return Array.prototype.slice.call(nodeList);
    }
    return new Array(length).fill().map(function (index) {
      return nodeList[index];
    });
  }

  function generateUUID() {
    return 't' + v4();
  }

  var baseCss = ".__react_component_tooltip {\n  border-radius: 3px;\n  display: inline-block;\n  font-size: 13px;\n  left: -999em;\n  opacity: 0;\n  position: fixed;\n  pointer-events: none;\n  transition: opacity 0.3s ease-out;\n  top: -999em;\n  visibility: hidden;\n  z-index: 999;\n}\n.__react_component_tooltip.allow_hover, .__react_component_tooltip.allow_click {\n  pointer-events: auto;\n}\n.__react_component_tooltip::before, .__react_component_tooltip::after {\n  content: \"\";\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.__react_component_tooltip.show {\n  opacity: 0.9;\n  margin-top: 0;\n  margin-left: 0;\n  visibility: visible;\n}\n.__react_component_tooltip.place-top::before {\n  bottom: 0;\n  left: 50%;\n  margin-left: -11px;\n}\n.__react_component_tooltip.place-bottom::before {\n  top: 0;\n  left: 50%;\n  margin-left: -11px;\n}\n.__react_component_tooltip.place-left::before {\n  right: 0;\n  top: 50%;\n  margin-top: -9px;\n}\n.__react_component_tooltip.place-right::before {\n  left: 0;\n  top: 50%;\n  margin-top: -9px;\n}\n.__react_component_tooltip .multi-line {\n  display: block;\n  padding: 2px 0;\n  text-align: center;\n}";

  /**
   * Default pop-up style values (text color, background color).
   */
  var defaultColors = {
    dark: {
      text: '#fff',
      background: '#222',
      border: 'transparent',
      arrow: '#222'
    },
    success: {
      text: '#fff',
      background: '#8DC572',
      border: 'transparent',
      arrow: '#8DC572'
    },
    warning: {
      text: '#fff',
      background: '#F0AD4E',
      border: 'transparent',
      arrow: '#F0AD4E'
    },
    error: {
      text: '#fff',
      background: '#BE6464',
      border: 'transparent',
      arrow: '#BE6464'
    },
    info: {
      text: '#fff',
      background: '#337AB7',
      border: 'transparent',
      arrow: '#337AB7'
    },
    light: {
      text: '#222',
      background: '#fff',
      border: 'transparent',
      arrow: '#fff'
    }
  };
  function getDefaultPopupColors(type) {
    return defaultColors[type] ? _objectSpread2({}, defaultColors[type]) : undefined;
  }
  var DEFAULT_PADDING = '8px 21px';
  var DEFAULT_RADIUS = {
    tooltip: 3,
    arrow: 0
  };

  /**
   * Generates the specific tooltip style for use on render.
   */
  function generateTooltipStyle(uuid, customColors, type, hasBorder, padding, radius) {
    return generateStyle(uuid, getPopupColors(customColors, type, hasBorder), padding, radius);
  }

  /**
   * Generates the tooltip style rules based on the element-specified "data-type" property.
   */
  function generateStyle(uuid, colors) {
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_PADDING;
    var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_RADIUS;
    var textColor = colors.text;
    var backgroundColor = colors.background;
    var borderColor = colors.border;
    var arrowColor = colors.arrow;
    var arrowRadius = radius.arrow;
    var tooltipRadius = radius.tooltip;
    return "\n  \t.".concat(uuid, " {\n\t    color: ").concat(textColor, ";\n\t    background: ").concat(backgroundColor, ";\n\t    border: 1px solid ").concat(borderColor, ";\n\t    border-radius: ").concat(tooltipRadius, "px;\n\t    padding: ").concat(padding, ";\n  \t}\n\n  \t.").concat(uuid, ".place-top {\n        margin-top: -10px;\n    }\n    .").concat(uuid, ".place-top::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: 2;\n        width: 20px;\n        height: 12px;\n    }\n    .").concat(uuid, ".place-top::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        bottom: -6px;\n        left: 50%;\n        margin-left: -6px;\n        transform: rotate(135deg);\n    }\n\n    .").concat(uuid, ".place-bottom {\n        margin-top: 10px;\n    }\n    .").concat(uuid, ".place-bottom::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 18px;\n        height: 10px;\n    }\n    .").concat(uuid, ".place-bottom::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        top: -6px;\n        left: 50%;\n        margin-left: -6px;\n        transform: rotate(45deg);\n    }\n\n    .").concat(uuid, ".place-left {\n        margin-left: -10px;\n    }\n    .").concat(uuid, ".place-left::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 10px;\n        height: 18px;\n    }\n    .").concat(uuid, ".place-left::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        right: -6px;\n        top: 50%;\n        margin-top: -6px;\n        transform: rotate(45deg);\n    }\n\n    .").concat(uuid, ".place-right {\n        margin-left: 10px;\n    }\n    .").concat(uuid, ".place-right::before {\n        content: \"\";\n        background-color: inherit;\n        position: absolute;\n        z-index: -1;\n        width: 10px;\n        height: 18px;\n    }\n    .").concat(uuid, ".place-right::after {\n        content: \"\";\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        border-top-right-radius: ").concat(arrowRadius, "px;\n        border: 1px solid ").concat(borderColor, ";\n        background-color: ").concat(arrowColor, ";\n        z-index: -2;\n        left: -6px;\n        top: 50%;\n        margin-top: -6px;\n        transform: rotate(-135deg);\n    }\n  ");
  }
  function getPopupColors(customColors, type, hasBorder) {
    var textColor = customColors.text;
    var backgroundColor = customColors.background;
    var borderColor = customColors.border;
    var arrowColor = customColors.arrow ? customColors.arrow : customColors.background;
    var colors = getDefaultPopupColors(type);
    if (textColor) {
      colors.text = textColor;
    }
    if (backgroundColor) {
      colors.background = backgroundColor;
    }
    if (hasBorder) {
      if (borderColor) {
        colors.border = borderColor;
      } else {
        colors.border = type === 'light' ? 'black' : 'white';
      }
    }
    if (arrowColor) {
      colors.arrow = arrowColor;
    }
    return colors;
  }

  var _class, _class2;

  /* Polyfill */
  var ReactTooltip = staticMethods(_class = windowListener(_class = customEvent(_class = isCapture(_class = getEffect(_class = bodyMode(_class = trackRemoval(_class = (_class2 = /*#__PURE__*/function (_React$Component) {
    _inherits(ReactTooltip, _React$Component);
    var _super = _createSuper(ReactTooltip);
    function ReactTooltip(props) {
      var _this;
      _classCallCheck(this, ReactTooltip);
      _this = _super.call(this, props);
      _this.state = {
        uuid: props.uuid || generateUUID(),
        place: props.place || 'top',
        // Direction of tooltip
        desiredPlace: props.place || 'top',
        type: props.type || 'dark',
        // Color theme of tooltip
        effect: props.effect || 'float',
        // float or fixed
        show: false,
        border: false,
        borderClass: 'border',
        customColors: {},
        customRadius: {},
        offset: {},
        padding: props.padding,
        extraClass: '',
        html: false,
        delayHide: 0,
        delayShow: 0,
        event: props.event || null,
        eventOff: props.eventOff || null,
        currentEvent: null,
        // Current mouse event
        currentTarget: null,
        // Current target of mouse event
        ariaProps: parseAria(props),
        // aria- and role attributes
        isEmptyTip: false,
        disable: false,
        possibleCustomEvents: props.possibleCustomEvents || '',
        possibleCustomEventsOff: props.possibleCustomEventsOff || '',
        originTooltip: null,
        isMultiline: false
      };
      _this.bind(['showTooltip', 'updateTooltip', 'hideTooltip', 'hideTooltipOnScroll', 'getTooltipContent', 'globalRebuild', 'globalShow', 'globalHide', 'onWindowResize', 'mouseOnToolTip']);
      _this.mount = true;
      _this.delayShowLoop = null;
      _this.delayHideLoop = null;
      _this.delayReshow = null;
      _this.intervalUpdateContent = null;
      return _this;
    }

    /**
     * For unify the bind and unbind listener
     */
    _createClass(ReactTooltip, [{
      key: "bind",
      value: function bind(methodArray) {
        var _this2 = this;
        methodArray.forEach(function (method) {
          _this2[method] = _this2[method].bind(_this2);
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this$props = this.props;
          _this$props.insecure;
          var resizeHide = _this$props.resizeHide,
          disableInternalStyle = _this$props.disableInternalStyle;
        this.mount = true;
        this.bindListener(); // Bind listener for tooltip
        this.bindWindowEvents(resizeHide); // Bind global event for static method

        if (!disableInternalStyle) {
          this.injectStyles(); // Inject styles for each DOM root having tooltip.
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mount = false;
        this.clearTimer();
        this.unbindListener();
        this.removeScrollListener(this.state.currentTarget);
        this.unbindWindowEvents();
      }

      /* Look for the closest DOM root having tooltip and inject styles. */
    }, {
      key: "injectStyles",
      value: function injectStyles() {
        var tooltipRef = this.tooltipRef;
        if (!tooltipRef) {
          return;
        }
        var parentNode = tooltipRef.parentNode;
        while (parentNode.parentNode) {
          parentNode = parentNode.parentNode;
        }
        var domRoot;
        switch (parentNode.constructor.name) {
          case 'Document':
          case 'HTMLDocument':
          case undefined:
            domRoot = parentNode.head;
            break;
          case 'ShadowRoot':
          default:
            domRoot = parentNode;
            break;
        }

        // Prevent styles duplication.
        if (!domRoot.querySelector('style[data-react-tooltip]')) {
          var style = document.createElement('style');
          style.textContent = baseCss;
          style.setAttribute('data-react-tooltip', 'true');
          domRoot.appendChild(style);
        }
      }

      /**
       * Return if the mouse is on the tooltip.
       * @returns {boolean} true - mouse is on the tooltip
       */
    }, {
      key: "mouseOnToolTip",
      value: function mouseOnToolTip() {
        var show = this.state.show;
        if (show && this.tooltipRef) {
          /* old IE or Firefox work around */
          if (!this.tooltipRef.matches) {
            /* old IE work around */
            if (this.tooltipRef.msMatchesSelector) {
              this.tooltipRef.matches = this.tooltipRef.msMatchesSelector;
            } else {
              /* old Firefox work around */
              this.tooltipRef.matches = this.tooltipRef.mozMatchesSelector;
            }
          }
          return this.tooltipRef.matches(':hover');
        }
        return false;
      }

      /**
       * Pick out corresponded target elements
       */
    }, {
      key: "getTargetArray",
      value: function getTargetArray(id) {
        var targetArray = [];
        var selector;
        if (!id) {
          selector = '[data-tip]:not([data-for])';
        } else {
          var escaped = id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          selector = "[data-tip][data-for=\"".concat(escaped, "\"]");
        }

        // Scan document for shadow DOM elements
        nodeListToArray(document.getElementsByTagName('*')).filter(function (element) {
          return element.shadowRoot;
        }).forEach(function (element) {
          targetArray = targetArray.concat(nodeListToArray(element.shadowRoot.querySelectorAll(selector)));
        });
        return targetArray.concat(nodeListToArray(document.querySelectorAll(selector)));
      }

      /**
       * Bind listener to the target elements
       * These listeners used to trigger showing or hiding the tooltip
       */
    }, {
      key: "bindListener",
      value: function bindListener() {
        var _this3 = this;
        var _this$props2 = this.props,
          id = _this$props2.id,
          globalEventOff = _this$props2.globalEventOff,
          isCapture = _this$props2.isCapture;
        var targetArray = this.getTargetArray(id);
        targetArray.forEach(function (target) {
          if (target.getAttribute('currentItem') === null) {
            target.setAttribute('currentItem', 'false');
          }
          _this3.unbindBasicListener(target);
          if (_this3.isCustomEvent(target)) {
            _this3.customUnbindListener(target);
          }
        });
        if (this.isBodyMode()) {
          this.bindBodyListener(targetArray);
        } else {
          targetArray.forEach(function (target) {
            var isCaptureMode = _this3.isCapture(target);
            var effect = _this3.getEffect(target);
            if (_this3.isCustomEvent(target)) {
              _this3.customBindListener(target);
              return;
            }
            target.addEventListener('mouseenter', _this3.showTooltip, isCaptureMode);
            target.addEventListener('focus', _this3.showTooltip, isCaptureMode);
            if (effect === 'float') {
              target.addEventListener('mousemove', _this3.updateTooltip, isCaptureMode);
            }
            target.addEventListener('mouseleave', _this3.hideTooltip, isCaptureMode);
            target.addEventListener('blur', _this3.hideTooltip, isCaptureMode);
          });
        }

        // Global event to hide tooltip
        if (globalEventOff) {
          window.removeEventListener(globalEventOff, this.hideTooltip);
          window.addEventListener(globalEventOff, this.hideTooltip, isCapture);
        }

        // Track removal of targetArray elements from DOM
        this.bindRemovalTracker();
      }

      /**
       * Unbind listeners on target elements
       */
    }, {
      key: "unbindListener",
      value: function unbindListener() {
        var _this4 = this;
        var _this$props3 = this.props,
          id = _this$props3.id,
          globalEventOff = _this$props3.globalEventOff;
        if (this.isBodyMode()) {
          this.unbindBodyListener();
        } else {
          var targetArray = this.getTargetArray(id);
          targetArray.forEach(function (target) {
            _this4.unbindBasicListener(target);
            if (_this4.isCustomEvent(target)) _this4.customUnbindListener(target);
          });
        }
        if (globalEventOff) window.removeEventListener(globalEventOff, this.hideTooltip);
        this.unbindRemovalTracker();
      }

      /**
       * Invoke this before bind listener and unmount the component
       * it is necessary to invoke this even when binding custom event
       * so that the tooltip can switch between custom and default listener
       */
    }, {
      key: "unbindBasicListener",
      value: function unbindBasicListener(target) {
        var isCaptureMode = this.isCapture(target);
        target.removeEventListener('mouseenter', this.showTooltip, isCaptureMode);
        target.removeEventListener('mousemove', this.updateTooltip, isCaptureMode);
        target.removeEventListener('mouseleave', this.hideTooltip, isCaptureMode);
      }
    }, {
      key: "getTooltipContent",
      value: function getTooltipContent() {
        var _this$props4 = this.props,
          getContent = _this$props4.getContent,
          children = _this$props4.children;

        // Generate tooltip content
        var content;
        if (getContent) {
          if (Array.isArray(getContent)) {
            content = getContent[0] && getContent[0](this.state.originTooltip);
          } else {
            content = getContent(this.state.originTooltip);
          }
        }
        return TipContent(this.state.originTooltip, children, content, this.state.isMultiline);
      }
    }, {
      key: "isEmptyTip",
      value: function isEmptyTip(placeholder) {
        return typeof placeholder === 'string' && placeholder === '' || placeholder === null;
      }

      /**
       * When mouse enter, show the tooltip
       */
    }, {
      key: "showTooltip",
      value: function showTooltip(e, isGlobalCall) {
        if (!this.tooltipRef) {
          return;
        }
        if (isGlobalCall) {
          // Don't trigger other elements belongs to other ReactTooltip
          var targetArray = this.getTargetArray(this.props.id);
          var isMyElement = targetArray.some(function (ele) {
            return ele === e.currentTarget;
          });
          if (!isMyElement) return;
        }
        // Get the tooltip content
        // calculate in this phrase so that tip width height can be detected
        var _this$props5 = this.props,
          multiline = _this$props5.multiline,
          getContent = _this$props5.getContent;
        var originTooltip = e.currentTarget.getAttribute('data-tip');
        var isMultiline = e.currentTarget.getAttribute('data-multiline') || multiline || false;

        // If it is focus event or called by ReactTooltip.show, switch to `solid` effect
        var switchToSolid = e instanceof window.FocusEvent || isGlobalCall;

        // if it needs to skip adding hide listener to scroll
        var scrollHide = true;
        if (e.currentTarget.getAttribute('data-scroll-hide')) {
          scrollHide = e.currentTarget.getAttribute('data-scroll-hide') === 'true';
        } else if (this.props.scrollHide != null) {
          scrollHide = this.props.scrollHide;
        }

        // adding aria-describedby to target to make tooltips read by screen readers
        if (e && e.currentTarget && e.currentTarget.setAttribute) {
          e.currentTarget.setAttribute('aria-describedby', this.props.id || this.state.uuid);
        }

        // Make sure the correct place is set
        var desiredPlace = e.currentTarget.getAttribute('data-place') || this.props.place || 'top';
        var effect = switchToSolid && 'solid' || this.getEffect(e.currentTarget);
        var offset = e.currentTarget.getAttribute('data-offset') || this.props.offset || {};
        var result = getPosition(e, e.currentTarget, this.tooltipRef, desiredPlace.split(',')[0], desiredPlace, effect, offset);
        if (result.position && this.props.overridePosition) {
          result.position = this.props.overridePosition(result.position, e, e.currentTarget, this.tooltipRef, desiredPlace, desiredPlace, effect, offset);
        }
        var place = result.isNewState ? result.newState.place : desiredPlace.split(',')[0];

        // To prevent previously created timers from triggering
        this.clearTimer();
        var target = e.currentTarget;
        var reshowDelay = this.state.show ? target.getAttribute('data-delay-update') || this.props.delayUpdate : 0;
        var self = this;
        var updateState = function updateState() {
          self.setState({
            originTooltip: originTooltip,
            isMultiline: isMultiline,
            desiredPlace: desiredPlace,
            place: place,
            type: target.getAttribute('data-type') || self.props.type || 'dark',
            customColors: {
              text: target.getAttribute('data-text-color') || self.props.textColor || null,
              background: target.getAttribute('data-background-color') || self.props.backgroundColor || null,
              border: target.getAttribute('data-border-color') || self.props.borderColor || null,
              arrow: target.getAttribute('data-arrow-color') || self.props.arrowColor || null
            },
            customRadius: {
              tooltip: target.getAttribute('data-tooltip-radius') || self.props.tooltipRadius || '3',
              arrow: target.getAttribute('data-arrow-radius') || self.props.arrowRadius || '0'
            },
            effect: effect,
            offset: offset,
            padding: target.getAttribute('data-padding') || self.props.padding,
            html: (target.getAttribute('data-html') ? target.getAttribute('data-html') === 'true' : self.props.html) || false,
            delayShow: target.getAttribute('data-delay-show') || self.props.delayShow || 0,
            delayHide: target.getAttribute('data-delay-hide') || self.props.delayHide || 0,
            delayUpdate: target.getAttribute('data-delay-update') || self.props.delayUpdate || 0,
            border: (target.getAttribute('data-border') ? target.getAttribute('data-border') === 'true' : self.props.border) || false,
            borderClass: target.getAttribute('data-border-class') || self.props.borderClass || 'border',
            extraClass: target.getAttribute('data-class') || self.props["class"] || self.props.className || '',
            disable: (target.getAttribute('data-tip-disable') ? target.getAttribute('data-tip-disable') === 'true' : self.props.disable) || false,
            currentTarget: target
          }, function () {
            if (scrollHide) {
              self.addScrollListener(self.state.currentTarget);
            }
            self.updateTooltip(e);
            if (getContent && Array.isArray(getContent)) {
              self.intervalUpdateContent = setInterval(function () {
                if (self.mount) {
                  var _getContent = self.props.getContent;
                  var placeholder = TipContent(originTooltip, '', _getContent[0](), isMultiline);
                  var isEmptyTip = self.isEmptyTip(placeholder);
                  self.setState({
                    isEmptyTip: isEmptyTip
                  });
                  self.updatePosition();
                }
              }, getContent[1]);
            }
          });
        };

        // If there is no delay call immediately, don't allow events to get in first.
        if (reshowDelay) {
          this.delayReshow = setTimeout(updateState, reshowDelay);
        } else {
          updateState();
        }
      }

      /**
       * When mouse hover, update tool tip
       */
    }, {
      key: "updateTooltip",
      value: function updateTooltip(e) {
        var _this5 = this;
        var _this$state = this.state,
          delayShow = _this$state.delayShow,
          disable = _this$state.disable;
        var _this$props6 = this.props,
          afterShow = _this$props6.afterShow,
          disableProp = _this$props6.disable;
        var placeholder = this.getTooltipContent();
        var eventTarget = e.currentTarget || e.target;

        // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
        if (this.mouseOnToolTip()) {
          return;
        }

        // if the tooltip is empty, disable the tooltip
        if (this.isEmptyTip(placeholder) || disable || disableProp) {
          return;
        }
        var delayTime = !this.state.show ? parseInt(delayShow, 10) : 0;
        var updateState = function updateState() {
          if (Array.isArray(placeholder) && placeholder.length > 0 || placeholder) {
            var isInvisible = !_this5.state.show;
            _this5.setState({
              currentEvent: e,
              currentTarget: eventTarget,
              show: true
            }, function () {
              _this5.updatePosition(function () {
                if (isInvisible && afterShow) {
                  afterShow(e);
                }
              });
            });
          }
        };
        if (this.delayShowLoop) {
          clearTimeout(this.delayShowLoop);
        }
        if (delayTime) {
          this.delayShowLoop = setTimeout(updateState, delayTime);
        } else {
          this.delayShowLoop = null;
          updateState();
        }
      }

      /*
       * If we're mousing over the tooltip remove it when we leave.
       */
    }, {
      key: "listenForTooltipExit",
      value: function listenForTooltipExit() {
        var show = this.state.show;
        if (show && this.tooltipRef) {
          this.tooltipRef.addEventListener('mouseleave', this.hideTooltip);
        }
      }
    }, {
      key: "removeListenerForTooltipExit",
      value: function removeListenerForTooltipExit() {
        var show = this.state.show;
        if (show && this.tooltipRef) {
          this.tooltipRef.removeEventListener('mouseleave', this.hideTooltip);
        }
      }

      /**
       * When mouse leave, hide tooltip
       */
    }, {
      key: "hideTooltip",
      value: function hideTooltip(e, hasTarget) {
        var _this6 = this;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
          isScroll: false
        };
        var disable = this.state.disable;
        var isScroll = options.isScroll;
        var delayHide = isScroll ? 0 : this.state.delayHide;
        var _this$props7 = this.props,
          afterHide = _this$props7.afterHide,
          disableProp = _this$props7.disable;
        var placeholder = this.getTooltipContent();
        if (!this.mount) return;
        if (this.isEmptyTip(placeholder) || disable || disableProp) return; // if the tooltip is empty, disable the tooltip
        if (hasTarget) {
          // Don't trigger other elements belongs to other ReactTooltip
          var targetArray = this.getTargetArray(this.props.id);
          var isMyElement = targetArray.some(function (ele) {
            return ele === e.currentTarget;
          });
          if (!isMyElement || !this.state.show) return;
        }

        // clean up aria-describedby when hiding tooltip
        if (e && e.currentTarget && e.currentTarget.removeAttribute) {
          e.currentTarget.removeAttribute('aria-describedby');
        }
        var resetState = function resetState() {
          var isVisible = _this6.state.show;
          // Check if the mouse is actually over the tooltip, if so don't hide the tooltip
          if (_this6.mouseOnToolTip()) {
            _this6.listenForTooltipExit();
            return;
          }
          _this6.removeListenerForTooltipExit();
          _this6.setState({
            show: false
          }, function () {
            _this6.removeScrollListener(_this6.state.currentTarget);
            if (isVisible && afterHide) {
              afterHide(e);
            }
          });
        };
        this.clearTimer();
        if (delayHide) {
          this.delayHideLoop = setTimeout(resetState, parseInt(delayHide, 10));
        } else {
          resetState();
        }
      }

      /**
       * When scroll, hide tooltip
       */
    }, {
      key: "hideTooltipOnScroll",
      value: function hideTooltipOnScroll(event, hasTarget) {
        this.hideTooltip(event, hasTarget, {
          isScroll: true
        });
      }

      /**
       * Add scroll event listener when tooltip show
       * automatically hide the tooltip when scrolling
       */
    }, {
      key: "addScrollListener",
      value: function addScrollListener(currentTarget) {
        var isCaptureMode = this.isCapture(currentTarget);
        window.addEventListener('scroll', this.hideTooltipOnScroll, isCaptureMode);
      }
    }, {
      key: "removeScrollListener",
      value: function removeScrollListener(currentTarget) {
        var isCaptureMode = this.isCapture(currentTarget);
        window.removeEventListener('scroll', this.hideTooltipOnScroll, isCaptureMode);
      }

      // Calculation the position
    }, {
      key: "updatePosition",
      value: function updatePosition(callbackAfter) {
        var _this7 = this;
        var _this$state2 = this.state,
          currentEvent = _this$state2.currentEvent,
          currentTarget = _this$state2.currentTarget,
          place = _this$state2.place,
          desiredPlace = _this$state2.desiredPlace,
          effect = _this$state2.effect,
          offset = _this$state2.offset;
        var node = this.tooltipRef;
        var result = getPosition(currentEvent, currentTarget, node, place, desiredPlace, effect, offset);
        if (result.position && this.props.overridePosition) {
          result.position = this.props.overridePosition(result.position, currentEvent, currentTarget, node, place, desiredPlace, effect, offset);
        }
        if (result.isNewState) {
          // Switch to reverse placement
          return this.setState(result.newState, function () {
            _this7.updatePosition(callbackAfter);
          });
        }
        if (callbackAfter && typeof callbackAfter === 'function') {
          callbackAfter();
        }

        // Set tooltip position
        node.style.left = result.position.left + 'px';
        node.style.top = result.position.top + 'px';
      }

      /**
       * CLear all kinds of timeout of interval
       */
    }, {
      key: "clearTimer",
      value: function clearTimer() {
        if (this.delayShowLoop) {
          clearTimeout(this.delayShowLoop);
          this.delayShowLoop = null;
        }
        if (this.delayHideLoop) {
          clearTimeout(this.delayHideLoop);
          this.delayHideLoop = null;
        }
        if (this.delayReshow) {
          clearTimeout(this.delayReshow);
          this.delayReshow = null;
        }
        if (this.intervalUpdateContent) {
          clearInterval(this.intervalUpdateContent);
          this.intervalUpdateContent = null;
        }
      }
    }, {
      key: "hasCustomColors",
      value: function hasCustomColors() {
        var _this8 = this;
        return Boolean(Object.keys(this.state.customColors).find(function (color) {
          return color !== 'border' && _this8.state.customColors[color];
        }) || this.state.border && this.state.customColors['border']);
      }
    }, {
      key: "render",
      value: function render() {
        var _this9 = this;
        var _this$state3 = this.state,
          extraClass = _this$state3.extraClass,
          html = _this$state3.html,
          ariaProps = _this$state3.ariaProps,
          disable = _this$state3.disable,
          uuid = _this$state3.uuid;
        var content = this.getTooltipContent();
        var isEmptyTip = this.isEmptyTip(content);
        var style = this.props.disableInternalStyle ? '' : generateTooltipStyle(this.state.uuid, this.state.customColors, this.state.type, this.state.border, this.state.padding, this.state.customRadius);
        var tooltipClass = '__react_component_tooltip' + " ".concat(this.state.uuid) + (this.state.show && !disable && !isEmptyTip ? ' show' : '') + (this.state.border ? ' ' + this.state.borderClass : '') + " place-".concat(this.state.place) + // top, bottom, left, right
        " type-".concat(this.hasCustomColors() ? 'custom' : this.state.type) + (
        // dark, success, warning, error, info, light, custom
        this.props.delayUpdate ? ' allow_hover' : '') + (this.props.clickable ? ' allow_click' : '');
        var Wrapper = this.props.wrapper;
        if (ReactTooltip.supportedWrappers.indexOf(Wrapper) < 0) {
          Wrapper = ReactTooltip.defaultProps.wrapper;
        }
        var wrapperClassName = [tooltipClass, extraClass].filter(Boolean).join(' ');
        if (html) {
          var htmlContent = "".concat(content).concat(style ? "\n<style aria-hidden=\"true\">".concat(style, "</style>") : '');
          return /*#__PURE__*/React__default["default"].createElement(Wrapper, _extends$1({
            className: "".concat(wrapperClassName),
            id: this.props.id || uuid,
            ref: function ref(_ref) {
              return _this9.tooltipRef = _ref;
            }
          }, ariaProps, {
            "data-id": "tooltip",
            dangerouslySetInnerHTML: {
              __html: htmlContent
            }
          }));
        } else {
          return /*#__PURE__*/React__default["default"].createElement(Wrapper, _extends$1({
            className: "".concat(wrapperClassName),
            id: this.props.id || uuid
          }, ariaProps, {
            ref: function ref(_ref2) {
              return _this9.tooltipRef = _ref2;
            },
            "data-id": "tooltip"
          }), style && /*#__PURE__*/React__default["default"].createElement("style", {
            dangerouslySetInnerHTML: {
              __html: style
            },
            "aria-hidden": "true"
          }), content);
        }
      }
    }], [{
      key: "propTypes",
      get: function get() {
        return {
          uuid: PropTypes__default["default"].string,
          children: PropTypes__default["default"].any,
          place: PropTypes__default["default"].string,
          type: PropTypes__default["default"].string,
          effect: PropTypes__default["default"].string,
          offset: PropTypes__default["default"].object,
          padding: PropTypes__default["default"].string,
          multiline: PropTypes__default["default"].bool,
          border: PropTypes__default["default"].bool,
          borderClass: PropTypes__default["default"].string,
          textColor: PropTypes__default["default"].string,
          backgroundColor: PropTypes__default["default"].string,
          borderColor: PropTypes__default["default"].string,
          arrowColor: PropTypes__default["default"].string,
          arrowRadius: PropTypes__default["default"].string,
          tooltipRadius: PropTypes__default["default"].string,
          insecure: PropTypes__default["default"].bool,
          "class": PropTypes__default["default"].string,
          className: PropTypes__default["default"].string,
          id: PropTypes__default["default"].string,
          html: PropTypes__default["default"].bool,
          delayHide: PropTypes__default["default"].number,
          delayUpdate: PropTypes__default["default"].number,
          delayShow: PropTypes__default["default"].number,
          event: PropTypes__default["default"].string,
          eventOff: PropTypes__default["default"].string,
          isCapture: PropTypes__default["default"].bool,
          globalEventOff: PropTypes__default["default"].string,
          getContent: PropTypes__default["default"].any,
          afterShow: PropTypes__default["default"].func,
          afterHide: PropTypes__default["default"].func,
          overridePosition: PropTypes__default["default"].func,
          disable: PropTypes__default["default"].bool,
          scrollHide: PropTypes__default["default"].bool,
          resizeHide: PropTypes__default["default"].bool,
          wrapper: PropTypes__default["default"].string,
          bodyMode: PropTypes__default["default"].bool,
          possibleCustomEvents: PropTypes__default["default"].string,
          possibleCustomEventsOff: PropTypes__default["default"].string,
          clickable: PropTypes__default["default"].bool,
          disableInternalStyle: PropTypes__default["default"].bool
        };
      }
    }, {
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var ariaProps = prevState.ariaProps;
        var newAriaProps = parseAria(nextProps);
        var isChanged = Object.keys(newAriaProps).some(function (props) {
          return newAriaProps[props] !== ariaProps[props];
        });
        if (!isChanged) {
          return null;
        }
        return _objectSpread2(_objectSpread2({}, prevState), {}, {
          ariaProps: newAriaProps
        });
      }
    }]);
    return ReactTooltip;
  }(React__default["default"].Component), _defineProperty(_class2, "defaultProps", {
    insecure: true,
    resizeHide: true,
    wrapper: 'div',
    clickable: false
  }), _defineProperty(_class2, "supportedWrappers", ['div', 'span']), _defineProperty(_class2, "displayName", 'ReactTooltip'), _class2)) || _class) || _class) || _class) || _class) || _class) || _class) || _class;

  const Banking = ({
    isSubscription,
    stripeAvailable,
    payPalAvailable,
    APM,
    isStripe,
    isPayPal,
    setGateway,
    gateway,
    setDeep,
    deep,
    config
  }) => {
    let paypalTest = ['BANCONTACT', 'EPS', 'GIROPAY', 'IDEAL', 'SEPA', 'SOFORT', 'PRZELEWY24', 'BLIK', 'MERCADOPAGO', 'MYBANK', 'TRUSTLY'];
    let stripeTest = ['BANCONTACT', 'EPS', 'GIROPAY', 'IDEAL', 'SEPA', 'SOFORT', 'PRZELEWY24', 'AFTERPAY_CLEARPAY', 'ALIPAY', 'AU_BECS_DEBIT', 'BOLETO', 'FPX', 'GRABPAY', 'KLARNA', 'OXXO', 'WECHAT_PAY'];
    stripeAvailable = stripeAvailable.filter(v => stripeTest.find(e => e === v));
    payPalAvailable = payPalAvailable.filter(v => paypalTest.find(e => e === v)).filter(v => !stripeAvailable.includes(v));
    if (!isPayPal) {
      payPalAvailable = [];
    }
    if (!payPalAvailable.length && !stripeAvailable.length || !isPayPal && !isStripe || isSubscription) {
      return null;
    }
    let isOne = false;
    if ([...payPalAvailable, ...stripeAvailable].length === 1) {
      isOne = true;
    }
    let onClick = () => {
      if (isOne) {
        if (stripeAvailable.length) {
          setGateway('STRIPE', stripeAvailable[0]);
        } else {
          setGateway('PAYPAL', payPalAvailable[0]);
        }
      } else {
        setDeep('extra');
      }
    };
    let isActive = gateway === 'PAYPAL' && payPalAvailable.includes(APM) || gateway === 'STRIPE' && stripeAvailable.includes(APM);
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${isActive ? 'active' : ''}`
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: stripeAvailable.length ? config.PAYMENT_ICONS.STRIPE_EXTRA[stripeAvailable[0]] : config.PAYMENT_ICONS.PAYPAL_EXTRA[payPalAvailable[0]],
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Banking, Regional methods"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, payPalAvailable.map(v => config.PAYMENT_FULL_NAME.PAYPAL_EXTRA[v]).join(', '), payPalAvailable.length ? ', ' : '', stripeAvailable.map(v => config.PAYMENT_FULL_NAME.STRIPE_EXTRA[v]).join(', '))), !isOne ? deep === 'extra' && isOne === false ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons"
    }, payPalAvailable.map((v, key) => /*#__PURE__*/React__default["default"].createElement("img", {
      key: key,
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA[v],
      alt: "",
      className: "rectangle"
    })), stripeAvailable.map((v, key) => /*#__PURE__*/React__default["default"].createElement("img", {
      key: key,
      src: config.PAYMENT_ICONS.STRIPE_EXTRA[v],
      alt: "",
      className: "rectangle"
    }))) : null), deep === 'extra' && isOne === false && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-list"
    }, payPalAvailable.map((v, key) => /*#__PURE__*/React__default["default"].createElement("div", {
      key: key,
      className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
      onClick: () => setGateway('PAYPAL', v)
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA[v],
      alt: "",
      className: "rectangle"
    }), config.PAYMENT_FULL_NAME.PAYPAL_EXTRA[v])), stripeAvailable.map((v, key) => /*#__PURE__*/React__default["default"].createElement("div", {
      key: key,
      className: `gateway-list-item ${gateway === 'STRIPE' && APM === v ? 'active' : ''}`,
      onClick: () => setGateway('STRIPE', v)
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.STRIPE_EXTRA[v],
      alt: "",
      className: "rectangle"
    }), config.PAYMENT_FULL_NAME.STRIPE_EXTRA[v]))));
  };
  const Crypto = ({
    crypto,
    deep,
    setDeep,
    setGateway,
    gateway,
    isMarketplace,
    config
  }) => {
    let [USDCModal, showUSDCModal] = React.useState(false);
    let [USDTModal, showUSDTModal] = React.useState(false);
    if (!crypto.length) {
      return null;
    }
    let isOne = false;
    if (crypto.length === 1) {
      isOne = true;
    }
    let onClick = () => {
      if (isOne) {
        setGateway(crypto[0]);
      } else {
        setDeep();
      }
    };
    let isERC20USDC = crypto.includes('USDC:ERC20');
    let isBEP20USDC = crypto.includes('USDC:BEP20');
    let isERC20USDT = crypto.includes('USDT:ERC20');
    let isBEP20USDT = crypto.includes('USDT:BEP20');
    let isTRC20USDT = crypto.includes('USDT:TRC20');
    let bothChainUSDC = isERC20USDC && isBEP20USDC;
    let bothChainUSDT = [isERC20USDT, isBEP20USDT, isTRC20USDT].filter(i => i).length > 1;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${crypto.includes(gateway) ? 'active' : ''} is-crypto`
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'} ${crypto.includes(gateway) ? 'active' : ''}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS[crypto[0]],
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, isOne && crypto[0].includes('USDC') ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "USDC ", /*#__PURE__*/React__default["default"].createElement("br", null)) : '', isOne && crypto[0].includes('USDT') ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "USDT ", /*#__PURE__*/React__default["default"].createElement("br", null)) : '', isOne && (isBEP20USDT || isBEP20USDC) && 'Binance Smart Chain (BEP20)', isOne && isERC20USDT && isERC20USDC && 'Ethereum Chain (ERC20)', isOne && isTRC20USDT && isTRC20USDT && 'Tron Chain (TRC20)', !isOne ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Cryptocurrencies ", /*#__PURE__*/React__default["default"].createElement("br", null)) : '', isOne && !crypto[0].includes('USDC') && !crypto[0].includes('USDT') ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, config.PAYMENT_FULL_NAME[crypto[0]], /*#__PURE__*/React__default["default"].createElement("br", null)) : ''), !isOne ? deep === 'crypto' ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, !isOne && crypto.map(v => bothChainUSDC && v.includes('USDC') || bothChainUSDT && v.includes('USDT') ? '' : /*#__PURE__*/React__default["default"].createElement("span", null, config.PAYMENT_FULL_NAME[v], " ")), !isOne && bothChainUSDC && /*#__PURE__*/React__default["default"].createElement("span", null, "USDC "), !isOne && bothChainUSDT && /*#__PURE__*/React__default["default"].createElement("span", null, "USDT ")) : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Send a direct transaction to an address")), !isOne ? deep === 'crypto' && isOne === false ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons"
    }, crypto.map((v, key) => {
      if (bothChainUSDC && v.includes('USDC')) {
        return '';
      } else if (bothChainUSDT && v.includes('USDT')) {
        return '';
      } else {
        return /*#__PURE__*/React__default["default"].createElement("img", {
          key: key,
          src: config.PAYMENT_ICONS[v],
          alt: ""
        });
      }
    }), bothChainUSDC && /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS['USDC'],
      alt: ""
    }), bothChainUSDT && /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS['USDT'],
      alt: ""
    })) : null), deep === 'crypto' && isOne === false && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-list"
    }, crypto.filter(v => v !== 'USDC:ERC20').filter(v => v !== 'USDC:BEP20').filter(v => v !== 'USDT:ERC20').filter(v => v !== 'USDT:TRC20').filter(v => v !== 'USDT:BEP20').map((v, key) => {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        key: key,
        className: `gateway-list-item ${gateway === v ? 'active' : ''}`,
        onClick: () => {
          setGateway(v);
          showUSDCModal(false);
        }
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS[v],
        alt: ""
      }), v === 'BINANCE_COIN' ? /*#__PURE__*/React__default["default"].createElement("span", null, config.PAYMENT_FULL_NAME[v], /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", null, "(BNB)")) : v === 'BITCOIN_LN' ? /*#__PURE__*/React__default["default"].createElement("span", null, config.PAYMENT_FULL_NAME.BITCOIN, /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "(Lightning Network)")) : config.PAYMENT_FULL_NAME[v]);
    }), /*#__PURE__*/React__default["default"].createElement(USDC, {
      USDCModal: USDCModal,
      showUSDCModal: data => {
        showUSDCModal(data);
        showUSDTModal(false);
      },
      crypto: crypto,
      gateway: gateway,
      setGateway: setGateway,
      config: config
    }), /*#__PURE__*/React__default["default"].createElement(USDT, {
      USDTModal: USDTModal,
      showUSDTModal: data => {
        showUSDTModal(data);
        showUSDCModal(false);
      },
      crypto: crypto,
      gateway: gateway,
      setGateway: setGateway,
      config: config
    })));
  };
  const USDC = ({
    USDCModal,
    showUSDCModal,
    gateway,
    setGateway,
    crypto,
    config
  }) => {
    let isERC20 = crypto.includes('USDC:ERC20');
    let isBEP20 = crypto.includes('USDC:BEP20');
    let bothChain = isERC20 && isBEP20;
    let onClick = () => {
      if (bothChain) {
        showUSDCModal(true);
      } else {
        if (crypto.includes('USDC:ERC20')) {
          setGateway('USDC:ERC20');
        } else {
          setGateway('USDC:BEP20');
        }
      }
    };
    let items = [{
      type: 'BEP20',
      title: 'Binance Smart Chain',
      full: 'USDC:BEP20'
    }, {
      type: 'ERC20',
      title: 'Ethereum Chain',
      full: 'USDC:ERC20'
    }];
    if (crypto.includes('USDC:ERC20') || crypto.includes('USDC:BEP20')) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: `gateway-list-item ${gateway === 'USDC:BEP20' || gateway === 'USDC:ERC20' ? 'active' : ''} ${USDCModal ? 'w-100 d-flex flex-column align-items-start' : ''}`,
        onClick: onClick
      }, bothChain ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDC")) : isBEP20 ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDC (BEP20) ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Binance Smart Chain"))) : isERC20 ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDC (ERC20) ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Ethereum Chain"))) : null, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "gateway-list-item-extended"
      }, USDCModal && items.map(({
        type,
        title,
        full
      }) => /*#__PURE__*/React__default["default"].createElement("div", {
        className: `gateway-list-item ${gateway === full ? 'active' : ''} `,
        onClick: () => setGateway(full)
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDC']
      }), /*#__PURE__*/React__default["default"].createElement("span", null, type, " ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", null, title))))));
    } else {
      return null;
    }
  };
  const USDT = ({
    USDTModal,
    showUSDTModal,
    gateway,
    setGateway,
    crypto,
    config
  }) => {
    let isERC20 = crypto.includes('USDT:ERC20');
    let isBEP20 = crypto.includes('USDT:BEP20');
    let isTRC20 = crypto.includes('USDT:TRC20');
    let bothChain = [isERC20, isBEP20, isTRC20].filter(i => i).length > 1;
    let onClick = () => {
      if (bothChain) {
        showUSDTModal(true);
      } else {
        if (crypto.includes('USDT:ERC20')) {
          setGateway('USDT:ERC20');
        } else if (crypto.includes('USDT:BEP20')) {
          setGateway('USDT:BEP20');
        } else {
          setGateway('USDT:TRC20');
        }
      }
    };
    let items = [];
    if (isBEP20) {
      items.push({
        type: 'BEP20',
        title: 'Binance Smart Chain',
        full: 'USDT:BEP20'
      });
    }
    if (isERC20) {
      items.push({
        type: 'ERC20',
        title: 'Ethereum Chain',
        full: 'USDT:ERC20'
      });
    }
    if (isTRC20) {
      items.push({
        type: 'TRC20',
        title: 'Tron Chain',
        full: 'USDT:TRC20'
      });
    }
    if (crypto.includes('USDT:ERC20') || crypto.includes('USDT:BEP20') || crypto.includes('USDT:TRC20')) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: `gateway-list-item ${gateway === 'USDT:BEP20' || gateway === 'USDT:ERC20' || gateway === 'USDT:TRC20' ? 'active' : ''} ${USDTModal ? 'w-100 d-flex flex-column align-items-start' : ''}`,
        onClick: onClick
      }, bothChain ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDT")) : isBEP20 ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDT (BEP20) ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Binance Smart Chain"))) : isERC20 ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDT (ERC20) ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Ethereum Chain"))) : isTRC20 ? /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React__default["default"].createElement("span", null, "USDT (TRC20) ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Tron Chain"))) : null, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "gateway-list-item-extended"
      }, USDTModal && items.map(({
        type,
        title,
        full
      }) => /*#__PURE__*/React__default["default"].createElement("div", {
        className: `gateway-list-item ${gateway === full ? 'active' : ''} `,
        onClick: () => setGateway(full)
      }, /*#__PURE__*/React__default["default"].createElement("img", {
        src: config.PAYMENT_ICONS['USDT']
      }), /*#__PURE__*/React__default["default"].createElement("span", null, type, " ", /*#__PURE__*/React__default["default"].createElement("br", null), /*#__PURE__*/React__default["default"].createElement("small", null, title))))));
    } else {
      return null;
    }
  };
  const PayPal = ({
    isSubscription,
    isPayPalCreditCardAvailable,
    isPayPal,
    APM,
    hideCredit,
    setGateway,
    gateway,
    payPalAvailable,
    deep,
    setDeep,
    config
  }) => {
    if (!isPayPal) {
      return null;
    }
    let paypal = ['PAYPAL', 'CARD', 'PAYLATER', 'CREDIT'];
    payPalAvailable = payPalAvailable.filter(v => paypal.find(e => e === v));
    let isOne = false;
    if (!payPalAvailable.includes('CARD') || hideCredit) {
      isOne = true;
    }
    if (isSubscription && isPayPalCreditCardAvailable) {
      payPalAvailable.push('CARD');
      payPalAvailable.push('PAYPAL');
      isOne = false;
    }
    let onClick = () => {
      if (isOne) {
        setGateway('PAYPAL');
      } else {
        setDeep();
      }
    };
    let isActive = isOne && gateway === 'PAYPAL' && !APM || gateway === 'PAYPAL' && (APM === 'CREDIT' || APM === 'PAYLATER') || gateway === 'PAYPAL_CREDIT_CARD';
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${isActive ? 'active' : ''} ${payPalAvailable.includes(gateway) && !APM ? 'active' : ''}`
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "PayPal"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, isOne ? 'Use your PayPal account' : 'PayPal', payPalAvailable.map(v => {
      if (v === 'CARD' && !hideCredit) {
        return ', Credit Card with PayPal';
      } else if (v === 'PAYLATER') {
        return ', Pay Later';
      } else if (v === 'CREDIT') {
        return ', PayPal Credit';
      } else {
        return '';
      }
    }))), !isOne ? deep === 'paypal' && isOne === false ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL,
      alt: ""
    }), hideCredit ? null : /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.CARD,
      alt: ""
    })) : null), deep === 'paypal' && isOne === false && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-list"
    }, payPalAvailable.map((v, key) => {
      if (v === 'CARD' && !hideCredit) {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL_CREDIT_CARD' ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL_CREDIT_CARD')
        }, /*#__PURE__*/React__default["default"].createElement("img", {
          src: config.PAYMENT_ICONS.CARD,
          alt: ""
        }), "Credit Card with PayPal");
      } else if (v === 'PAYLATER') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL', v)
        }, /*#__PURE__*/React__default["default"].createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), "Pay Later");
      } else if (v === 'CREDIT') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL', v)
        }, /*#__PURE__*/React__default["default"].createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), "PayPal Credit");
      } else if (v === 'PAYPAL') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && !APM ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL')
        }, /*#__PURE__*/React__default["default"].createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), "PayPal");
      }
    })));
  };
  const Stripe = ({
    APM,
    isStripe,
    gateway,
    setGateway,
    setDeep,
    config
  }) => {
    const [currentBrowser, setBrowser] = React.useState('');
    React.useEffect(() => {
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        setBrowser('chrome');
      } else if (navigator.userAgent.indexOf('Safari') > -1) {
        setBrowser('safari');
      }
    }, []);
    if (!isStripe) {
      return null;
    }
    let isActive = gateway === 'STRIPE' && !APM;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('STRIPE');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Credit/Debit Cards", currentBrowser === 'chrome' ? ', Google Pay' : currentBrowser === 'safari' ? ', Apple Pay' : ''), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Pay with Visa, Mastercard, Amex or use ", currentBrowser === 'chrome' ? 'Google Pay' : currentBrowser === 'safari' ? 'Apple Pay' : 'Apple Pay or Google Pay', " if they are enabled on your device."), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.CARDS.VISA,
      alt: "",
      className: "rectangle"
    }), /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.CARDS.MASTERCARD,
      alt: "",
      className: "rectangle"
    }), /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.CARDS.AMERICANEXPRESS,
      alt: "",
      className: "rectangle",
      style: {
        width: '2rem',
        marginLeft: '-0.5rem'
      }
    }), currentBrowser === 'chrome' ? /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.CARDS.GOOGLEPAY,
      alt: "",
      className: "rectangle",
      style: {
        width: '1.5rem',
        marginLeft: -5
      }
    }) : null, currentBrowser === 'safari' ? /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.CARDS.APPLEPAY,
      alt: "",
      className: "rectangle",
      style: {
        width: '2rem',
        marginLeft: -9
      }
    }) : null));
  };
  const Skrill = ({
    isSkrill,
    gateway,
    setGateway,
    setDeep,
    config
  }) => {
    if (!isSkrill) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${gateway === 'SKRILL' ? 'active' : ''}`,
      onClick: () => {
        setGateway('SKRILL');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.SKRILL,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Skrill"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Proceed with the purchase using your Skrill wallet"))));
  };
  const CashApp = ({
    isCashApp,
    gateway,
    setGateway,
    setDeep,
    config
  }) => {
    if (!isCashApp) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${gateway === 'CASH_APP' ? 'active' : ''}`,
      onClick: () => {
        setGateway('CASH_APP');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.CASH_APP,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Cash App"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Pay through Cash App using your mobile device for instant payments"))));
  };
  const PerfectMoney = ({
    isPerfectMoney,
    gateway,
    setGateway,
    setDeep,
    config
  }) => {
    if (!isPerfectMoney) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${gateway === 'PERFECT_MONEY' ? 'active' : ''}`,
      onClick: () => {
        setGateway('PERFECT_MONEY');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.PERFECT_MONEY,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Perfect Money"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Use your Perfect Money account to proceed with the purchase"))));
  };
  const Venmo = ({
    payPalAvailable,
    setGateway,
    APM,
    gateway,
    setDeep,
    config
  }) => {
    if (!payPalAvailable.includes('VENMO')) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${gateway === 'PAYPAL' && APM === 'VENMO' ? 'active' : ''}`,
      onClick: () => {
        setGateway('PAYPAL', 'VENMO');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA.VENMO,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Venmo"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle"
    }, "Available for some US customers and USD purchases only"))));
  };
  const Binance = ({
    isSubscription,
    isBinance,
    setGateway,
    gateway,
    setDeep,
    config
  }) => {
    if (!isBinance || isSubscription) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${gateway === 'BINANCE' ? 'active' : ''}`,
      onClick: () => {
        setGateway('BINANCE');
        setDeep();
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-row-reverse justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React__default["default"].createElement("img", {
      src: config.PAYMENT_ICONS.BINANCE,
      alt: ""
    })), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-title"
    }, "Binance Pay"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-subtitle isBinancePay"
    }, "If you do not have a Binance account, ", /*#__PURE__*/React__default["default"].createElement("a", {
      href: "https://accounts.binance.com/en/register?ref=395915096",
      target: "_blank"
    }, "register here"), " and send crypto transactions with 0% fees."))));
  };

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$h = "";
  styleInject(css_248z$h);

  const GatewaySelector = ({
    type,
    config,
    theme,
    cartProducts,
    productInfo,
    invoiceInfo,
    paymentOptions,
    isSubscription,
    gateway,
    APM,
    setGateway,
    appliedCoupon
  }) => {
    const pathname = window.location.pathname;
    let availableStripeAPM;
    if (type === 'product') {
      availableStripeAPM = productInfo.available_stripe_apm || [];
    } else if (type === 'checkout') {
      availableStripeAPM = (cartProducts.find(({
        available_stripe_apm
      }) => available_stripe_apm ? available_stripe_apm.length : null) || {}).available_stripe_apm || [];
    } else if (type === 'invoice') {
      availableStripeAPM = invoiceInfo.available_stripe_apm || [];
    }
    const stripeAvailable = availableStripeAPM.map(({
      id
    }) => config.STRIPE_APM_PARSE[id]);
    const [payPalAvailable, setAvailable] = React.useState([]);
    const [deep, setDeep] = React.useState(null);
    React.useEffect(() => {
      if (window.paypal && !isSubscription) {
        let data = [];
        if (window.paypal.FUNDING) {
          Object.keys(window.paypal.FUNDING).map(fundingSource => {
            let button = window.paypal.Buttons({
              fundingSource: window.paypal.FUNDING[fundingSource]
            });
            if (button.isEligible()) {
              data.push(fundingSource);
            }
          });
        }
        setAvailable([...data]);
      }
    }, [window && window.paypal]);
    const isMarketplace = pathname.includes('discover');
    const isBinance = paymentOptions.includes('BINANCE');
    const isPayPal = paymentOptions.includes('PAYPAL') && (!isSubscription || !appliedCoupon && isSubscription);
    const isStripe = paymentOptions.includes('STRIPE');
    const isPayPalCreditCardAvailable = paymentOptions.includes('PAYPAL_CREDIT_CARD');
    const crypto = paymentOptions.filter(i => ['BITCOIN', 'BINANCE_COIN', 'LITECOIN', 'TRON', 'BITCOIN_LN', 'CONCORDIUM', 'USDC:BEP20', 'USDC:ERC20', 'USDT:BEP20', 'USDT:ERC20', 'USDT:TRC20', 'ETHEREUM', 'CRONOS', 'BITCOIN_CASH', 'MONERO', 'NANO', 'SOLANA', 'RIPPLE'].includes(i));
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "gateway-container unselectable"
    }, /*#__PURE__*/React__default["default"].createElement(Crypto, {
      crypto: crypto,
      isMarketplace: isMarketplace,
      setGateway: setGateway,
      gateway: gateway,
      deep: deep,
      setDeep: () => setDeep(deep === 'crypto' ? null : 'crypto'),
      APM: APM,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(Binance, {
      isSubscription: isSubscription,
      isBinance: isBinance,
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep(deep === 'binance' ? null : 'binance'),
      deep: deep,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(Stripe, {
      isStripe: isStripe,
      gateway: gateway,
      setGateway: setGateway,
      setDeep: () => setDeep(deep === 'stripe' ? null : 'stripe'),
      APM: APM,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(PayPal, {
      isPayPal: isPayPal,
      isSubscription: isSubscription,
      isPayPalCreditCardAvailable: isPayPalCreditCardAvailable,
      payPalAvailable: payPalAvailable,
      hideCredit: isStripe,
      setGateway: setGateway,
      gateway: gateway,
      deep: deep,
      setDeep: () => setDeep(deep === 'paypal' ? null : 'paypal'),
      APM: APM,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(Banking, {
      isPayPal: isPayPal,
      isStripe: isStripe,
      isSubscription: isSubscription,
      payPalAvailable: payPalAvailable,
      stripeAvailable: stripeAvailable,
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep(deep === 'extra' ? null : 'extra'),
      deep: deep,
      APM: APM,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(Venmo, {
      isPayPal: isPayPal,
      payPalAvailable: payPalAvailable,
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep(deep === 'venmo' ? null : 'venmo'),
      deep: deep,
      APM: APM,
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(CashApp, {
      isCashApp: paymentOptions.includes('CASH_APP'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('cashapp'),
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(PerfectMoney, {
      isPerfectMoney: paymentOptions.includes('PERFECT_MONEY'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('perfect_money'),
      config: config,
      theme: theme
    }), /*#__PURE__*/React__default["default"].createElement(Skrill, {
      isSkrill: paymentOptions.includes('SKRILL'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('skrill'),
      config: config,
      theme: theme
    }), isStripe && (APM === 'KLARNA' || APM === 'AFTERPAY_CLEARPAY' || APM === 'SOFORT') && /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        fontSize: '.7rem',
        borderColor: '#fcab0a',
        borderWidth: 2,
        background: '#fcab0a29'
      }
    }, config.PAYMENT_FULL_NAME.STRIPE_EXTRA[APM], " payments take 2 to 14 days for the transaction to be processed and completed, depending on your bank. Once you have sent the payment, please wait for the invoice to be marked as paid."));
  };

  const useForceUpdate = () => {
    const [, setNewState] = React.useState(false);
    return () => setNewState(mySelf => !mySelf);
  };

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  var css_248z$g = "";
  styleInject(css_248z$g);

  const AddCircular = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M7.5 10H12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10 7.5V12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const ArrowRight = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M4.16675 10H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10.8333 15L15.8333 10",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10.8333 5L15.8333 10",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const CheckCircular = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M7.5 10L9.16667 11.6667L12.5 8.33333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const PlusCircular = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: {
        ...style,
        transform: "scale(1.25)"
      },
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M6.75 9H11.25",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M9 6.75V11.25",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Cube = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M9.81567 10.3947L16.1315 6.44737",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3.5 6.44737L9.81579 10.3947V17.5L16.1316 13.5526V6.44737L9.81579 2.5L3.5 6.44737Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3.5 6.44737V13.5526L9.81579 17.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Embed = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "null",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M5.83333 6.66666L2.5 10L5.83333 13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M14.1667 6.66666L17.5001 10L14.1667 13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M11.6666 3.33334L8.33325 16.6667",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Plus = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10 4.16667V15.8333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M4.16675 10H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Refresh = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3.375 9.16667C3.58574 7.55895 4.37518 6.08315 5.59557 5.01552C6.81595 3.94789 8.38359 3.36163 10.0051 3.36647C11.6265 3.37132 13.1906 3.96695 14.4046 5.04186C15.6186 6.11677 16.3992 7.59726 16.6003 9.20621C16.8014 10.8152 16.4093 12.4423 15.4972 13.7829C14.5852 15.1236 13.2158 16.0859 11.6455 16.4897C10.0751 16.8935 8.41136 16.7112 6.96573 15.9768C5.5201 15.2424 4.39166 14.0064 3.79167 12.5M3.375 16.6667V12.5H7.54167",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Upload = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3.33325 14.1667V15.8333C3.33325 16.2754 3.50885 16.6993 3.82141 17.0118C4.13397 17.3244 4.55789 17.5 4.99992 17.5H14.9999C15.4419 17.5 15.8659 17.3244 16.1784 17.0118C16.491 16.6993 16.6666 16.2754 16.6666 15.8333V14.1667",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M5.83325 7.5L9.99992 3.33333L14.1666 7.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10 3.33333V13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Invoice = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M11.6667 2.5V5.83333C11.6667 6.05435 11.7545 6.26631 11.9108 6.42259C12.0671 6.57887 12.2791 6.66667 12.5001 6.66667H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M14.1667 17.5H5.83341C5.39139 17.5 4.96746 17.3244 4.6549 17.0118C4.34234 16.6993 4.16675 16.2754 4.16675 15.8333V4.16667C4.16675 3.72464 4.34234 3.30072 4.6549 2.98816C4.96746 2.67559 5.39139 2.5 5.83341 2.5H11.6667L15.8334 6.66667V15.8333C15.8334 16.2754 15.6578 16.6993 15.3453 17.0118C15.0327 17.3244 14.6088 17.5 14.1667 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M7.5 5.83333H8.33333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M7.5 10.8333H12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10.8333 14.1667H12.4999",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const Settings = ({
    width = 20,
    height = 20,
    className,
    style
  }) => /*#__PURE__*/React__default["default"].createElement("svg", {
    width: width,
    height: height,
    className: className,
    style: style,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M7.74375 3.23775C8.06325 1.92075 9.93675 1.92075 10.2563 3.23775C10.3042 3.4356 10.3982 3.61933 10.5305 3.774C10.6629 3.92867 10.8299 4.04989 11.018 4.12781C11.2061 4.20573 11.4099 4.23814 11.6128 4.2224C11.8158 4.20667 12.0122 4.14323 12.186 4.03725C13.3432 3.33225 14.6685 4.65675 13.9635 5.81475C13.8577 5.98849 13.7943 6.18475 13.7786 6.38758C13.7629 6.59041 13.7953 6.79408 13.8731 6.98203C13.951 7.16999 14.0721 7.33693 14.2265 7.46929C14.381 7.60164 14.5646 7.69568 14.7623 7.74375C16.0793 8.06325 16.0793 9.93675 14.7623 10.2563C14.5644 10.3042 14.3807 10.3982 14.226 10.5305C14.0713 10.6629 13.9501 10.8299 13.8722 11.018C13.7943 11.2061 13.7619 11.4099 13.7776 11.6128C13.7933 11.8158 13.8568 12.0122 13.9628 12.186C14.6678 13.3432 13.3432 14.6685 12.1852 13.9635C12.0115 13.8577 11.8152 13.7943 11.6124 13.7786C11.4096 13.7629 11.2059 13.7953 11.018 13.8731C10.83 13.951 10.6631 14.0721 10.5307 14.2265C10.3984 14.381 10.3043 14.5646 10.2563 14.7623C9.93675 16.0793 8.06325 16.0793 7.74375 14.7623C7.69581 14.5644 7.60183 14.3807 7.46947 14.226C7.3371 14.0713 7.17008 13.9501 6.98201 13.8722C6.79394 13.7943 6.59013 13.7619 6.38716 13.7776C6.1842 13.7933 5.98781 13.8568 5.814 13.9628C4.65675 14.6678 3.3315 13.3432 4.0365 12.1852C4.14233 12.0115 4.20566 11.8152 4.22136 11.6124C4.23706 11.4096 4.20468 11.2059 4.12685 11.018C4.04903 10.83 3.92795 10.6631 3.77345 10.5307C3.61896 10.3984 3.43542 10.3043 3.23775 10.2563C1.92075 9.93675 1.92075 8.06325 3.23775 7.74375C3.4356 7.69581 3.61933 7.60183 3.774 7.46947C3.92867 7.3371 4.04989 7.17008 4.12781 6.98201C4.20573 6.79394 4.23814 6.59013 4.2224 6.38716C4.20667 6.1842 4.14323 5.98781 4.03725 5.814C3.33225 4.65675 4.65675 3.3315 5.81475 4.0365C6.56475 4.4925 7.53675 4.089 7.74375 3.23775Z",
    stroke: "#555D67",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z",
    stroke: "#555D67",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));

  const Delete = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 18 18",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3 5.25H15",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M7.5 8.25V12.75",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M10.5 8.25V12.75",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M3.75 5.25L4.5 14.25C4.5 14.6478 4.65804 15.0294 4.93934 15.3107C5.22064 15.592 5.60218 15.75 6 15.75H12C12.3978 15.75 12.7794 15.592 13.0607 15.3107C13.342 15.0294 13.5 14.6478 13.5 14.25L14.25 5.25",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React__default["default"].createElement("path", {
      d: "M6.75 5.25V3C6.75 2.80109 6.82902 2.61032 6.96967 2.46967C7.11032 2.32902 7.30109 2.25 7.5 2.25H10.5C10.6989 2.25 10.8897 2.32902 11.0303 2.46967C11.171 2.61032 11.25 2.80109 11.25 3V5.25",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const CustomButton = ({
    size = 'medium',
    variant = 'primary',
    type = 'button',
    iconPosition = 'right',
    iconName,
    className,
    children,
    style,
    skip,
    square,
    ...rest
  }) => {
    const [button, setButton] = React.useState(null);
    React.useEffect(() => {
      let isDown = false;
      let added = false;
      let ripple = document.createElement('span');
      [...document.body.classList].includes('dark') || 'light';
      if (!button) {
        return;
      }
      const downListener = e => {
        if (e.button === 2 || !ripple.animate) {
          return false;
        }
        isDown = true;
        ripple.classList.add('ripple-effect');
        let rect = button.getBoundingClientRect();
        let xPos = e.x - rect.left;
        let yPos = e.y - rect.top;
        let scaledSize = Math.max(rect.width, rect.height) * Math.PI * 1.5;
        ripple.style.left = `${xPos}px`;
        ripple.style.top = `${yPos}px`;
        ripple.style.backgroundColor = 'white';
        ripple.style.opacity = '0.175';
        if (!added) {
          added = true;
          button.appendChild(ripple);
        }
        let rippleAnimate = ripple.animate({
          height: ['0px', `${scaledSize}px`],
          width: ['0px', `${scaledSize}px`]
        }, {
          duration: 700
        });
        rippleAnimate.onfinish = () => {
          ripple.style.width = `${scaledSize}px`;
          ripple.style.height = `${scaledSize}px`;
        };
      };
      const overListener = () => {
        if (!isDown) {
          return;
        }
        let rippleAnimate = ripple.animate({
          opacity: [.175, 0]
        }, {
          duration: 700 / 3
        });
        rippleAnimate.onfinish = () => {
          if (added) {
            added = false;
            ripple.remove();
          }
        };
      };
      const upListener = () => {
        if (!isDown || !ripple.animate) {
          return;
        }
        isDown = false;
        let rippleAnimate = ripple.animate({
          opacity: [.175, 0]
        }, {
          duration: 700 / 3
        });
        rippleAnimate.onfinish = () => {
          if (added) {
            added = false;
            ripple.remove();
          }
        };
      };
      button.addEventListener('mousedown', downListener);
      button.addEventListener('mouseup', upListener);
      button.addEventListener('mouseover', overListener);
      return () => {
        button.removeEventListener('mousedown', downListener);
        button.removeEventListener('mouseup', upListener);
        button.removeEventListener('mouseover', overListener);
      };
    }, [button, skip]);
    const classes = ['button', size, variant];
    if (className) {
      classes.push(className);
    }
    const iconStyle = {};
    if (iconPosition === 'right') {
      iconStyle.marginLeft = '0.5rem';
    } else {
      iconStyle.marginRight = '0.5rem';
    }
    let icon = null;
    switch (iconName) {
      case 'plus':
        icon = /*#__PURE__*/React__default["default"].createElement(Plus, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'arrow':
        icon = /*#__PURE__*/React__default["default"].createElement(ArrowRight, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'cube':
        icon = /*#__PURE__*/React__default["default"].createElement(Cube, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'embed':
        icon = /*#__PURE__*/React__default["default"].createElement(Embed, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'upload':
        icon = /*#__PURE__*/React__default["default"].createElement(Upload, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'refresh':
        icon = /*#__PURE__*/React__default["default"].createElement(Refresh, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'add-circular':
        icon = /*#__PURE__*/React__default["default"].createElement(AddCircular, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'check-circular':
        icon = /*#__PURE__*/React__default["default"].createElement(CheckCircular, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'plus-circular':
        icon = /*#__PURE__*/React__default["default"].createElement(PlusCircular, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'invoice':
        icon = /*#__PURE__*/React__default["default"].createElement(Invoice, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'settings':
        icon = /*#__PURE__*/React__default["default"].createElement(Settings, {
          className: "icon",
          style: iconStyle
        });
        break;
      case 'delete':
        icon = /*#__PURE__*/React__default["default"].createElement(Delete, {
          className: "icon",
          style: iconStyle
        });
        break;
    }
    if (icon) {
      classes.push('withIcon');
    }
    if (square) {
      classes.push('square');
    }
    return /*#__PURE__*/React__default["default"].createElement("button", _extends({
      type: type,
      style: style,
      className: classes.join(' ')
    }, rest, {
      ref: setButton
    }), iconPosition === 'left' && icon, children, iconPosition === 'right' && icon);
  };

  var css_248z$f = "";
  styleInject(css_248z$f);

  const Index$2 = ({
    purple,
    big
  }) => /*#__PURE__*/React__default["default"].createElement("div", {
    className: `sk-circle-fade ${purple && 'purple' || ''} ${big && 'big' || ''}`
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sk-circle-fade-dot"
  }));

  function useBackToShop(onBackToShop) {
    return React.useCallback(() => {
      if (onBackToShop) {
        onBackToShop();
      } else {
        window.location.href = '/';
      }
    }, [onBackToShop]);
  }

  function useGoToPurchase(gateway, setStep, onShowMessage, trialPeriod = 0) {
    return React.useCallback(() => {
      if (gateway) {
        setStep(2);
      } else {
        if (trialPeriod) {
          setStep(2);
        } else {
          onShowMessage({
            type: 'error',
            text: 'Please select payment method!'
          });
        }
      }
    }, [gateway, onShowMessage, setStep, trialPeriod]);
  }

  function useRegulationForm(products, gateway, isAPM) {
    const [form, setForm] = React.useState({
      name: '',
      surname: '',
      address_line1: '',
      address_city: '',
      address_country: '',
      address_postal_code: '',
      address_state: ''
    });
    const countries = React.useMemo(() => (products || []).filter(({
      country_regulations
    }) => country_regulations).map(({
      country_regulations
    }) => country_regulations), [products]);
    const isVisible = React.useMemo(() => gateway === 'STRIPE' && countries.length, [countries, gateway]);
    const isExtended = React.useMemo(() => isAPM || countries.includes('IN'), [countries, isAPM, gateway]);
    let isFilled;
    if (isExtended) {
      isFilled = form.name && form.surname && form.address_line1 && form.address_city && form.address_country && form.address_postal_code && form.address_state;
    } else {
      isFilled = form.name && form.surname;
    }
    return [form, setForm, isVisible, isFilled, isExtended];
  }

  function useSubmitPayment({
    config,
    isCustomDomain,
    email,
    gateway,
    APM,
    customFields,
    appliedCoupon,
    hasDiscount,
    payPalEmailDelivery,
    isVisibleRegulationForm = false,
    isExtendedRegulationForm = false,
    regulationForm = {},
    setSending,
    onCreateInvoice,
    onCreateInvoiceTrial,
    onShowMessage,
    onSuccess,
    onFail,
    // checkout | product
    type,
    // if type 'checkout'
    products,
    // if type 'product'
    product,
    customerPrice,
    addons,
    quantity = 1,
    trialPeriod = 0,
    discordIntegrationCode
  }) {
    const [trialStatus, setTrialStatus] = React.useState(null);
    const handleSubmitPayment = React.useCallback(({
      token,
      onSuccessCreateInvoice,
      onFailCreateInvoice
    }) => {
      let internalCustomFields = customFields;
      if (isVisibleRegulationForm) {
        internalCustomFields = {
          ...customFields,
          name: regulationForm.name,
          surname: regulationForm.surname
        };
      }
      let data = {
        custom_fields: JSON.stringify({
          custom_fields: internalCustomFields
        }),
        gateway: gateway ? gateway : '',
        email
      };
      let productsAddons = {};
      let productsVariants = {};
      if (type === 'checkout') {
        data.cart = JSON.stringify({
          products: products.map(prod => ({
            uniqid: prod.uniqid,
            unit_quantity: prod.quantity
          }))
        });
        productsAddons = Object.fromEntries(products.map(prod => [prod.uniqid, addons[prod.uniqid] || []]));
        productsVariants = Object.fromEntries(products.map(prod => [prod.uniqid, prod.priceVariant ? prod.priceVariant.title : null]));
      } else if (type === 'product') {
        data.product_id = product.uniqid;
        data.quantity = quantity;
        productsAddons[product.uniqid] = addons[product.uniqid];
        productsVariants[product.uniqid] = product.priceVariant ? product.priceVariant.title : null;
      } else if (type === 'subscription') {
        data.product_id = product.uniqid;
        data.quantity = 1;
        productsAddons[product.uniqid] = addons[product.uniqid];
      }
      const productsWithAddons = Object.keys(productsAddons).filter(productId => (productsAddons[productId] || []).length);
      const productsWithVariants = Object.keys(productsVariants).filter(productId => Boolean(productsVariants[productId]));
      if (productsWithVariants.length) {
        data.product_variants = JSON.stringify(Object.fromEntries(productsWithVariants.map(productId => [productId, productsVariants[productId]])));
      }
      if (productsWithAddons.length) {
        data.product_addons = JSON.stringify(Object.fromEntries(productsWithAddons.map(productId => [productId, productsAddons[productId].map(({
          uniqid
        }) => uniqid).join(',')])));
      }
      if (isVisibleRegulationForm && isExtendedRegulationForm) {
        data.name = regulationForm.name;
        data.surname = regulationForm.surname;
        data.address_line1 = regulationForm.address_line1;
        data.address_city = regulationForm.address_city;
        data.address_country = regulationForm.address_country;
        data.address_postal_code = regulationForm.address_postal_code;
        data.address_state = regulationForm.address_state;
      }
      let forcePayPal = false;
      if (type === 'checkout') {
        forcePayPal = products.find(({
          shop_force_paypal_email_delivery
        }) => !!shop_force_paypal_email_delivery);
      } else if (type === 'product' || type === 'subscription') {
        forcePayPal = !!+product.shop_force_paypal_email_delivery;
      }
      if (appliedCoupon && !(appliedCoupon.disabled_with_volume_discounts && hasDiscount)) {
        data.coupon_code = appliedCoupon.code;
      }
      if (data.gateway === 'PAYPAL') {
        data.credit_card = false;
        if (APM) {
          data.paypal_apm = config.PAYPAL_APM[APM];
        }
        if (!forcePayPal) {
          data.paypal_email_delivery = payPalEmailDelivery;
        }
      }
      if (data.gateway === 'PAYPAL_CREDIT_CARD') {
        data.credit_card = true;
        data.gateway = 'PAYPAL';
        if (!forcePayPal) {
          data.paypal_email_delivery = payPalEmailDelivery;
        }
      }
      if (data.gateway === 'STRIPE') {
        if (APM) {
          data.stripe_apm = config.STRIPE_APM[APM];
        }
      }
      if (product.pay_what_you_want && customerPrice) {
        data.pay_what_you_want_price = customerPrice;
      }
      setSending(true);
      data.discord_integration_code = discordIntegrationCode ? discordIntegrationCode : null;
      if (trialPeriod) {
        return onCreateInvoiceTrial({
          product_id: product.uniqid,
          custom_fields: data.custom_fields
        }, token).then(({
          data,
          status,
          error,
          message
        }) => {
          if (status === 200) {
            onShowMessage({
              type: 'success',
              text: message
            });
            setTrialStatus('success');
            onSuccess({
              type: 'invoice-trial'
            });
          } else {
            onShowMessage({
              type: 'error',
              text: error || 'Server error!'
            });
            onFail();
          }
        }).catch(error => {
          setTrialStatus('error');
          onShowMessage({
            type: 'error',
            text: error ? error.error || error.message : 'Server error!'
          });
          onFail();
        }).finally(() => setSending(false));
      } else {
        return onCreateInvoice(data, token).then(response => {
          const {
            data,
            status,
            error,
            message
          } = response;
          if (status === 200) {
            const {
              invoice
            } = data;
            if (message) {
              onShowMessage({
                type: 'success',
                text: message
              });
            }
            if (onSuccessCreateInvoice) {
              onSuccessCreateInvoice();
            }
            onSuccess({
              type: 'invoice',
              invoice
            });
          } else {
            onShowMessage({
              type: 'error',
              text: error || 'Server error!'
            });
            onFail();
          }
        }).catch(error => {
          if (onFailCreateInvoice) {
            onFailCreateInvoice();
          }
          onShowMessage({
            type: 'error',
            text: error ? error.error || error.message : 'Server error!'
          });
          onFail();
        }).finally(() => setSending(false));
      }
    }, [customFields, gateway, email, type, addons, isVisibleRegulationForm, isExtendedRegulationForm, appliedCoupon, hasDiscount, setSending, trialPeriod, products, product, product, quantity, regulationForm.name, regulationForm.surname, regulationForm.address_line1, regulationForm.address_city, regulationForm.address_country, regulationForm.address_postal_code, regulationForm.address_state, APM, config.PAYPAL_APM, config.STRIPE_APM, payPalEmailDelivery, onCreateInvoiceTrial, onShowMessage, onSuccess, onFail, onCreateInvoice, discordIntegrationCode]);
    return [handleSubmitPayment, trialStatus];
  }

  function useCustomFields(products) {
    const [customFields, setCustomFields] = React.useState({});
    React.useEffect(() => {
      const custom = {};
      products.map(product => {
        let productFields = [];
        if (product.custom_fields) {
          productFields = JSON.parse(product.custom_fields).custom_fields;
        }
        product.custom_fields = JSON.stringify({
          custom_fields: productFields
        });
        if (productFields.length) {
          productFields.forEach(v => {
            if (v.type === 'checkbox' || v.type && v.type.value === 'checkbox') {
              custom[v.name] = v.default || false;
            } else {
              custom[v.name] = v.default;
            }
          });
        }
        if (window && window.location && window.location.search) {
          let buttonFields = window.location.search.substr(1).split('&');
          const defaultKeys = ['quantity', 'gateway', 'APM', 'step', 'email', 'payPalEmailDelivery', 'couponCode', 'code'];
          buttonFields.map(field => {
            let key = field.split('=')[0].replace(/-/g, '_');
            let value = field.split('=')[1];
            if (key) {
              let found = false;
              for (let i = 0; i < defaultKeys.length; i++) {
                if (defaultKeys[i] === key) found = true;
              }
              if (!found) custom[key] = decodeURIComponent(value);
            }
          });
        }
      });
      setCustomFields(custom);
    }, [products]);
    return [customFields, setCustomFields];
  }

  function useQueryString() {
    const qs = {};
    const isNaturalNumber = n => {
      n = n.toString();
      const n1 = Math.abs(n),
        n2 = parseInt(n, 10);
      return !isNaN(n1) && n2 === n1 && n1.toString() === n;
    };
    window.location.search.replace('?', '').split('&').forEach(e => {
      const key = e.split(/=(.*)/s)[0];
      if (isNaturalNumber(key)) {
        qs[key] = parseInt(e.split(/=(.*)/s)[1]);
        return;
      }
      qs[key] = e.split(/=(.*)/s)[1];
    });
    return qs;
  }

  const initialValue$1 = {
    type: 'product',
    config: {},
    settings: {},
    theme: {},
    isCustomDomain: false,
    isCartEnabled: false,
    shopInfo: {},
    productId: null,
    productInfo: {},
    invoiceInfo: {},
    cartProducts: [],
    addons: [],
    bundles: [],
    priceVariants: [],
    onAddToCart: () => {},
    onApplyCoupon: () => {},
    onBackToShop: () => window.location.href = '/',
    onCreateInvoice: () => {},
    onCreateInvoiceTrial: () => {},
    onToastMessage: () => {},
    onOpenTermsModal: () => {},
    onChangeProductQuantity: (uniqid, quantity) => {},
    onChangeStep: step => {},
    onCustomerAuthEmail: () => {},
    onCustomerAuthCode: () => {},
    onShowProductTerms: () => {},
    onShowMessage: () => {},
    onSuccess: () => {},
    onFail: () => {},
    sellixHelper: {
      getStock(quantity) {
        return quantity;
      }
    },
    options: {}
  };
  const PurchaseDetailsContext = /*#__PURE__*/React__default["default"].createContext(initialValue$1);
  const usePurchaseDetailsContext = () => React.useContext(PurchaseDetailsContext);

  const initialValue = {
    getParam: (name, defaultValue) => {}
  };
  const DefaultParamsContext = /*#__PURE__*/React__default["default"].createContext(initialValue);
  const useDefaultParamsContext = () => React.useContext(DefaultParamsContext);

  var css_248z$e = "";
  styleInject(css_248z$e);

  const Coupon = ({
    isCart,
    currency,
    appliedCoupon,
    setCoupon,
    openCoupon,
    disabledWithDiscount,
    showPayPalWarning
  }) => {
    const {
      config,
      cartProducts,
      shopInfo,
      productInfo,
      onApplyCoupon,
      onShowMessage
    } = usePurchaseDetailsContext();
    const {
      getParam
    } = useDefaultParamsContext();
    const [couponSuccess, setSuccess] = React.useState(false);
    const [couponError, setError] = React.useState(false);
    const [couponLoading, setLoading] = React.useState(false);
    const [code, setCode] = React.useState(getParam('couponCode', null));
    React.useEffect(() => {
      setCode(appliedCoupon ? appliedCoupon.code : '');
      setSuccess(appliedCoupon);
      return () => {
        setCode('');
      };
    }, [appliedCoupon]);
    const applyCoupon = React.useCallback(() => {
      if (!code) {
        return;
      }
      setSuccess(false);
      setError(false);
      setLoading(true);
      let data = {
        code: code
      };
      if (isCart) {
        data.cart = JSON.stringify({
          shop_id: shopInfo.id,
          products: cartProducts.map(product => ({
            uniqid: product.uniqid,
            unit_quantity: product.quantity
          }))
        });
      } else {
        data.product_id = productInfo.uniqid;
      }
      onApplyCoupon(data).then(res => {
        if (res.status === 200) {
          setCoupon(res.data.coupon);
          setSuccess(true);
        } else if (res.status === 400) {
          setCoupon(null);
          setError(true);
        } else {
          throw res;
        }
      }).catch(error => {
        setError(true);
        onShowMessage({
          type: 'error',
          text: error ? error.error || error.message : 'Server error!'
        });
      }).finally(() => {
        setLoading(false);
      });
    }, [cartProducts, code, isCart, onApplyCoupon, productInfo.id, setCoupon, shopInfo.id]);
    const qsCouponCode = getParam('couponCode', null);
    React.useEffect(() => {
      if (qsCouponCode) {
        setCode(qsCouponCode);
        let data = {
          code: qsCouponCode
        };
        if (isCart) {
          data.cart = JSON.stringify({
            shop_id: shopInfo.id,
            products: cartProducts.map(product => ({
              uniqid: product.uniqid,
              unit_quantity: product.quantity
            }))
          });
        } else {
          data.product_id = productInfo.uniqid;
        }
        onApplyCoupon(data).then(res => {
          if (res.status === 200) {
            setCoupon(res.data.coupon);
            setSuccess(true);
          } else if (res.status === 400) {
            setCoupon(null);
            setError(true);
          } else {
            throw res;
          }
        }).catch(error => {
          setError(true);
          onShowMessage({
            type: 'error',
            text: error ? error.error || error.message : 'Server error!'
          });
        }).finally(() => {
          setLoading(false);
        });
      }
    }, [qsCouponCode]);
    const currencyTitle = config.CURRENCY_LIST[currency];
    return openCoupon && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pb-3"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-form"
    }, /*#__PURE__*/React__default["default"].createElement("input", {
      className: "sellix-input",
      type: "text",
      id: "coupon",
      name: "coupon",
      placeholder: "Coupon code",
      onChange: e => {
        setCode(e.target.value);
      },
      value: code
    }), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "d-flex align-items-center m-auto",
      onClick: applyCoupon
    }, couponLoading ? /*#__PURE__*/React__default["default"].createElement(Index$2, null) : /*#__PURE__*/React__default["default"].createElement("span", null, "Apply ", /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-tags"
    })))), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-result"
    }, !disabledWithDiscount && couponSuccess && /*#__PURE__*/React__default["default"].createElement("span", {
      className: "text-green"
    }, parseInt(appliedCoupon.discount), appliedCoupon.discount_type === 'FIXED' ? currencyTitle : '%', " Coupon is applied!"), couponError ? /*#__PURE__*/React__default["default"].createElement("span", {
      className: "text-red text-center"
    }, "Coupon not valid: It might be expired, invalid for the cart's products or does not exist.") : null, disabledWithDiscount ? /*#__PURE__*/React__default["default"].createElement("span", {
      className: "text-red text-center"
    }, "This coupon cannot be applied when a volume discount is used") : null, showPayPalWarning && /*#__PURE__*/React__default["default"].createElement("span", {
      className: "text-red text-center",
      style: {
        paddingLeft: 2
      }
    }, "PayPal won't be an available payment method with coupons")));
  };

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16 | 0,
        v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  /**
   * Copyright (c) 2016 Konstantin Kulinicenko.
   * Licensed under the MIT License (MIT), see
   * https://github.com/40818419/react-code-input
   */
  const BACKSPACE_KEY = 8;
  const LEFT_ARROW_KEY = 37;
  const UP_ARROW_KEY = 38;
  const RIGHT_ARROW_KEY = 39;
  const DOWN_ARROW_KEY = 40;
  const E_KEY = 69;
  class ReactCodeInput extends React.Component {
    constructor(props) {
      super(props);
      const {
        fields,
        type,
        isValid,
        disabled,
        filterKeyCodes,
        forceUppercase
      } = props;
      let {
        value
      } = props;
      if (forceUppercase) {
        value = value.toUpperCase();
      }
      this.state = {
        value,
        fields,
        type,
        input: [],
        isValid,
        disabled,
        filterKeyCodes,
        defaultInputStyle: {
          fontFamily: 'monospace',
          MozAppearance: 'textfield',
          borderRadius: '6px',
          border: '1px solid',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
          margin: '4px',
          paddingLeft: '8px',
          paddingRight: 0,
          width: '36px',
          height: '42px',
          fontSize: '32px',
          boxSizing: 'border-box'
        }
      };
      for (let i = 0; i < Number(this.state.fields); i += 1) {
        if (i < 32) {
          const value = this.state.value[i] || '';
          this.state.input.push(value);
        }
      }
      this.textInput = [];
      this.uuid = uuidv4();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        isValid: nextProps.isValid,
        value: nextProps.value,
        disabled: nextProps.disabled
      });
    }
    handleBlur(e) {
      this.handleTouch(e.target.value);
    }
    handleTouch(value) {
      const {
        touch,
        untouch,
        name
      } = this.props;
      if (typeof touch === 'function' && typeof untouch === 'function') {
        if (value === '') {
          touch(name);
        } else {
          untouch(name);
        }
      }
    }
    handleChange(e) {
      const {
        filterChars,
        filterCharsIsWhitelist
      } = this.props;
      let value = String(e.target.value);
      if (this.props.forceUppercase) {
        value = value.toUpperCase();
      }
      if (this.state.type === 'number') {
        value = value.replace(/[^\d]/g, '');
      }

      /** Filter Chars */
      value = value.split('').filter(currChar => {
        if (filterCharsIsWhitelist) {
          return filterChars.includes(currChar);
        }
        return !filterChars.includes(currChar);
      }).join('');
      let fullValue = value;
      if (value !== '') {
        const input = this.state.input.slice();
        if (value.length > 1) {
          value.split('').map((chart, i) => {
            if (Number(e.target.dataset.id) + i < this.props.fields) {
              input[Number(e.target.dataset.id) + i] = chart;
            }
            return false;
          });
        } else {
          input[Number(e.target.dataset.id)] = value;
        }
        input.map((s, i) => {
          if (this.textInput[i]) {
            this.textInput[i].value = s;
          }
          return false;
        });
        const newTarget = this.textInput[e.target.dataset.id < input.length ? Number(e.target.dataset.id) + 1 : e.target.dataset.id];
        if (newTarget) {
          newTarget.focus();
          newTarget.select();
        }
        fullValue = input.join('');
        this.setState({
          value: input.join(''),
          input
        });
      }
      if (this.props.onChange && fullValue) {
        this.props.onChange(fullValue);
      }
      this.handleTouch(fullValue);
    }
    handleKeyDown(e) {
      const target = Number(e.target.dataset.id),
        nextTarget = this.textInput[target + 1],
        prevTarget = this.textInput[target - 1];
      let input, value;
      if (this.state.filterKeyCodes.length > 0) {
        this.state.filterKeyCodes.map(item => {
          if (item === e.keyCode) {
            e.preventDefault();
            return true;
          }
        });
      }
      switch (e.keyCode) {
        case BACKSPACE_KEY:
          e.preventDefault();
          this.textInput[target].value = '';
          input = this.state.input.slice();
          input[target] = '';
          value = input.join('');
          this.setState({
            value,
            input
          });
          if (this.textInput[target].value === '') {
            if (prevTarget) {
              prevTarget.focus();
              prevTarget.select();
            }
          }
          if (this.props.onChange) {
            this.props.onChange(value);
          }
          break;
        case LEFT_ARROW_KEY:
          e.preventDefault();
          if (prevTarget) {
            prevTarget.focus();
            prevTarget.select();
          }
          break;
        case RIGHT_ARROW_KEY:
          e.preventDefault();
          if (nextTarget) {
            nextTarget.focus();
            nextTarget.select();
          }
          break;
        case UP_ARROW_KEY:
          e.preventDefault();
          break;
        case DOWN_ARROW_KEY:
          e.preventDefault();
          break;
        case E_KEY:
          // This case needs to be handled because of https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in
          if (e.target.type === 'number') {
            e.preventDefault();
            break;
          }
          break;
      }
      this.handleTouch(value);
    }
    render() {
      const {
          className,
          style = {},
          inputStyle = {},
          inputStyleInvalid = {},
          type,
          autoFocus,
          autoComplete,
          pattern,
          inputMode,
          placeholder
        } = this.props,
        {
          disabled,
          input,
          isValid,
          defaultInputStyle
        } = this.state,
        styles = {
          container: {
            display: 'inline-block',
            ...style
          },
          input: isValid ? inputStyle : inputStyleInvalid
        };
      if (!className && Object.keys(inputStyle).length === 0) {
        Object.assign(inputStyle, {
          ...defaultInputStyle,
          color: 'black',
          backgroundColor: 'white',
          borderColor: 'lightgrey'
        });
      }
      if (!className && Object.keys(inputStyleInvalid).length === 0) {
        Object.assign(inputStyleInvalid, {
          ...defaultInputStyle,
          color: '#b94a48',
          backgroundColor: '#f2dede',
          borderColor: '#eed3d7'
        });
      }
      if (disabled) {
        Object.assign(styles.input, {
          cursor: 'not-allowed',
          color: 'lightgrey',
          borderColor: 'lightgrey',
          backgroundColor: '#efeff1'
        });
      }
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: `react-code-input ${className}`,
        style: styles.container
      }, input.map((value, i) => {
        return /*#__PURE__*/React__default["default"].createElement("input", {
          ref: ref => {
            this.textInput[i] = ref;
          },
          id: `${this.uuid}-${i}`,
          "data-id": i,
          autoFocus: autoFocus && i === 0 ? 'autoFocus' : '',
          value: value,
          key: `input_${i}`,
          type: type,
          min: 0,
          max: 9,
          maxLength: input.length === i + 1 ? 1 : input.length,
          style: styles.input,
          autoComplete: autoComplete,
          onFocus: e => e.target.select(e),
          onBlur: e => this.handleBlur(e),
          onChange: e => this.handleChange(e),
          onKeyDown: e => this.handleKeyDown(e),
          disabled: disabled,
          "data-valid": isValid,
          pattern: pattern,
          inputMode: inputMode,
          placeholder: placeholder
        });
      }));
    }
  }
  ReactCodeInput.defaultProps = {
    autoComplete: 'off',
    autoFocus: true,
    isValid: true,
    disabled: false,
    forceUppercase: false,
    fields: 4,
    value: '',
    type: 'text',
    filterKeyCodes: [189, 190],
    filterChars: ['-', '.'],
    filterCharsIsWhitelist: false
  };
  ReactCodeInput.propTypes = {
    type: PropTypes__default["default"].oneOf(['text', 'number', 'password', 'tel']),
    fields: PropTypes__default["default"].number,
    placeholder: PropTypes__default["default"].string,
    value: PropTypes__default["default"].string,
    onChange: PropTypes__default["default"].func,
    name: PropTypes__default["default"].string,
    touch: PropTypes__default["default"].func,
    untouch: PropTypes__default["default"].func,
    className: PropTypes__default["default"].string,
    isValid: PropTypes__default["default"].bool,
    disabled: PropTypes__default["default"].bool,
    style: PropTypes__default["default"].object,
    inputStyle: PropTypes__default["default"].object,
    inputStyleInvalid: PropTypes__default["default"].object,
    autoComplete: PropTypes__default["default"].string,
    autoFocus: PropTypes__default["default"].bool,
    forceUppercase: PropTypes__default["default"].bool,
    filterKeyCodes: PropTypes__default["default"].array,
    filterChars: PropTypes__default["default"].array,
    filterCharsIsWhitelist: PropTypes__default["default"].bool,
    pattern: PropTypes__default["default"].string,
    inputMode: PropTypes__default["default"].oneOf(['verbatim', 'latin', 'latin-name', 'latin-prose', 'full-width-latin', 'kana', 'kana-name', 'katakana', 'numeric', 'tel', 'email', 'url'])
  };

  const CodeAuthForm = props => {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pb-3"
    }, /*#__PURE__*/React__default["default"].createElement("label", {
      className: "sellix-label"
    }, "Authentication Code"), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "sellix-note pb-2"
    }, "We have sent a unique code to your email address, please insert it below."), /*#__PURE__*/React__default["default"].createElement(ReactCodeInput, {
      type: "number",
      fields: 8,
      onChange: e => {
        props.setCode(e);
      },
      value: props.code
    })), props.skipFields ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form-field"
    }, /*#__PURE__*/React__default["default"].createElement("label", {
      className: "sellix-label"
    }, "First Name"), /*#__PURE__*/React__default["default"].createElement("input", {
      type: "text",
      onChange: e => props.setFirstName(e.target.value),
      value: props.firstname,
      placeholder: "First Name",
      required: true,
      className: "sellix-input"
    })), props.skipFields ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form-field"
    }, /*#__PURE__*/React__default["default"].createElement("label", {
      className: "sellix-label"
    }, "Last Name"), /*#__PURE__*/React__default["default"].createElement("input", {
      type: "text",
      onChange: e => props.setLastName(e.target.value),
      value: props.lastname,
      placeholder: "Last Name",
      required: true,
      className: "sellix-input"
    })));
  };

  const FULL_FIELDS = [{
    name: 'name',
    placeholder: 'Name',
    required: 'Name is required'
  }, {
    name: 'surname',
    placeholder: 'Surname',
    required: 'Surname is required'
  }, {
    name: 'address_line1',
    placeholder: 'Address',
    required: 'Address is required'
  }, {
    name: 'address_city',
    placeholder: 'City',
    required: 'City is required'
  }, {
    name: 'address_country',
    placeholder: 'Country',
    required: 'Country is required',
    isAddress: true
  }, {
    name: 'address_postal_code',
    placeholder: 'Postal Code',
    required: 'Postal Code is required'
  }, {
    name: 'address_state',
    placeholder: 'State',
    required: 'State is required'
  }];
  const FIELDS = [{
    name: 'name',
    placeholder: 'Name',
    required: 'Name is required'
  }, {
    name: 'surname',
    placeholder: 'Surname',
    required: 'Surname is required'
  }];

  var css_248z$d = "";
  styleInject(css_248z$d);

  const ChevronDown = () => /*#__PURE__*/React__default["default"].createElement("svg", {
    style: {
      minWidth: 20
    },
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M5 7.5L10 12.5L15 7.5",
    stroke: "#555D67",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
  const COUNTRIES = [{
    "label": "Afghanistan",
    "phone": "+93",
    "value": "AF"
  }, {
    "label": "Albania",
    "phone": "+355",
    "value": "AL"
  }, {
    "label": "Algeria",
    "phone": "+213",
    "value": "DZ"
  }, {
    "label": "American Samoa",
    "phone": "+1684",
    "value": "AS"
  }, {
    "label": "Andorra",
    "phone": "+376",
    "value": "AD"
  }, {
    "label": "Angola",
    "phone": "+244",
    "value": "AO"
  }, {
    "label": "Anguilla",
    "phone": "+1264",
    "value": "AI"
  }, {
    "label": "Antarctica",
    "phone": "+672",
    "value": "AQ"
  }, {
    "label": "Antigua and Barbuda",
    "phone": "+1268",
    "value": "AG"
  }, {
    "label": "Argentina",
    "phone": "+54",
    "value": "AR"
  }, {
    "label": "Armenia",
    "phone": "+374",
    "value": "AM"
  }, {
    "label": "Aruba",
    "phone": "+297",
    "value": "AW"
  }, {
    "label": "Australia",
    "phone": "+61",
    "value": "AU"
  }, {
    "label": "Austria",
    "phone": "+43",
    "value": "AT"
  }, {
    "label": "Azerbaijan",
    "phone": "+994",
    "value": "AZ"
  }, {
    "label": "Bahamas",
    "phone": "+1242",
    "value": "BS"
  }, {
    "label": "Bahrain",
    "phone": "+973",
    "value": "BH"
  }, {
    "label": "Bangladesh",
    "phone": "+880",
    "value": "BD"
  }, {
    "label": "Barbados",
    "phone": "+1246",
    "value": "BB"
  }, {
    "label": "Belarus",
    "phone": "+375",
    "value": "BY"
  }, {
    "label": "Belgium",
    "phone": "+32",
    "value": "BE"
  }, {
    "label": "Belize",
    "phone": "+501",
    "value": "BZ"
  }, {
    "label": "Benin",
    "phone": "+229",
    "value": "BJ"
  }, {
    "label": "Bermuda",
    "phone": "+1441",
    "value": "BM"
  }, {
    "label": "Bhutan",
    "phone": "+975",
    "value": "BT"
  }, {
    "label": "Bolivia",
    "phone": "+591",
    "value": "BO"
  }, {
    "label": "Bonaire",
    "phone": "+5997",
    "value": "BQ"
  }, {
    "label": "Bosnia and Herzegovina",
    "phone": "+387",
    "value": "BA"
  }, {
    "label": "Botswana",
    "phone": "+267",
    "value": "BW"
  }, {
    "label": "Bouvet Island",
    "phone": "+47",
    "value": "BV"
  }, {
    "label": "Brazil",
    "phone": "+55",
    "value": "BR"
  }, {
    "label": "British Indian Ocean Territory",
    "phone": "+246",
    "value": "IO"
  }, {
    "label": "British Virgin Islands",
    "phone": "+1284",
    "value": "VG"
  }, {
    "label": "Brunei",
    "phone": "+673",
    "value": "BN"
  }, {
    "label": "Bulgaria",
    "phone": "+359",
    "value": "BG"
  }, {
    "label": "Burkina Faso",
    "phone": "+226",
    "value": "BF"
  }, {
    "label": "Burundi",
    "phone": "+257",
    "value": "BI"
  }, {
    "label": "Cambodia",
    "phone": "+855",
    "value": "KH"
  }, {
    "label": "Cameroon",
    "phone": "+237",
    "value": "CM"
  }, {
    "label": "Canada",
    "phone": "+1",
    "value": "CA"
  }, {
    "label": "Cape Verde",
    "phone": "+238",
    "value": "CV"
  }, {
    "label": "Cayman Islands",
    "phone": "+1345",
    "value": "KY"
  }, {
    "label": "Central African Republic",
    "phone": "+236",
    "value": "CF"
  }, {
    "label": "Chad",
    "phone": "+235",
    "value": "TD"
  }, {
    "label": "Chile",
    "phone": "+56",
    "value": "CL"
  }, {
    "label": "China",
    "phone": "+86",
    "value": "CN"
  }, {
    "label": "Christmas Island",
    "phone": "+61",
    "value": "CX"
  }, {
    "label": "Cocos [Keeling] Islands",
    "phone": "+61",
    "value": "CC"
  }, {
    "label": "Colombia",
    "phone": "+57",
    "value": "CO"
  }, {
    "label": "Comoros",
    "phone": "+269",
    "value": "KM"
  }, {
    "label": "Cook Islands",
    "phone": "+682",
    "value": "CK"
  }, {
    "label": "Costa Rica",
    "phone": "+506",
    "value": "CR"
  }, {
    "label": "Croatia",
    "phone": "+385",
    "value": "HR"
  }, {
    "label": "Cuba",
    "phone": "+53",
    "value": "CU"
  }, {
    "label": "Curacao",
    "phone": "+5999",
    "value": "CW"
  }, {
    "label": "Cyprus",
    "phone": "+357",
    "value": "CY"
  }, {
    "label": "Czech Republic",
    "phone": "+420",
    "value": "CZ"
  }, {
    "label": "Democratic Republic of the Congo",
    "phone": "+243",
    "value": "CD"
  }, {
    "label": "Denmark",
    "phone": "+45",
    "value": "DK"
  }, {
    "label": "Djibouti",
    "phone": "+253",
    "value": "DJ"
  }, {
    "label": "Dominica",
    "phone": "+1767",
    "value": "DM"
  }, {
    "label": "Dominican Republic",
    "phone": "+1809,1829,1849",
    "value": "DO"
  }, {
    "label": "East Timor",
    "phone": "+670",
    "value": "TL"
  }, {
    "label": "Ecuador",
    "phone": "+593",
    "value": "EC"
  }, {
    "label": "Egypt",
    "phone": "+20",
    "value": "EG"
  }, {
    "label": "El Salvador",
    "phone": "+503",
    "value": "SV"
  }, {
    "label": "Equatorial Guinea",
    "phone": "+240",
    "value": "GQ"
  }, {
    "label": "Eritrea",
    "phone": "+291",
    "value": "ER"
  }, {
    "label": "Estonia",
    "phone": "+372",
    "value": "EE"
  }, {
    "label": "Ethiopia",
    "phone": "+251",
    "value": "ET"
  }, {
    "label": "Falkland Islands",
    "phone": "+500",
    "value": "FK"
  }, {
    "label": "Faroe Islands",
    "phone": "+298",
    "value": "FO"
  }, {
    "label": "Fiji",
    "phone": "+679",
    "value": "FJ"
  }, {
    "label": "Finland",
    "phone": "+358",
    "value": "FI"
  }, {
    "label": "France",
    "phone": "+33",
    "value": "FR"
  }, {
    "label": "French Guiana",
    "phone": "+594",
    "value": "GF"
  }, {
    "label": "French Polynesia",
    "phone": "+689",
    "value": "PF"
  }, {
    "label": "French Southern Territories",
    "phone": "+262",
    "value": "TF"
  }, {
    "label": "Gabon",
    "phone": "+241",
    "value": "GA"
  }, {
    "label": "Gambia",
    "phone": "+220",
    "value": "GM"
  }, {
    "label": "Georgia",
    "phone": "+995",
    "value": "GE"
  }, {
    "label": "Germany",
    "phone": "+49",
    "value": "DE"
  }, {
    "label": "Ghana",
    "phone": "+233",
    "value": "GH"
  }, {
    "label": "Gibraltar",
    "phone": "+350",
    "value": "GI"
  }, {
    "label": "Greece",
    "phone": "+30",
    "value": "GR"
  }, {
    "label": "Greenland",
    "phone": "+299",
    "value": "GL"
  }, {
    "label": "Grenada",
    "phone": "+1473",
    "value": "GD"
  }, {
    "label": "Guadeloupe",
    "phone": "+590",
    "value": "GP"
  }, {
    "label": "Guam",
    "phone": "+1671",
    "value": "GU"
  }, {
    "label": "Guatemala",
    "phone": "+502",
    "value": "GT"
  }, {
    "label": "Guernsey",
    "phone": "+44",
    "value": "GG"
  }, {
    "label": "Guinea",
    "phone": "+224",
    "value": "GN"
  }, {
    "label": "Guinea-Bissau",
    "phone": "+245",
    "value": "GW"
  }, {
    "label": "Guyana",
    "phone": "+592",
    "value": "GY"
  }, {
    "label": "Haiti",
    "phone": "+509",
    "value": "HT"
  }, {
    "label": "Heard Island and McDonald Islands",
    "phone": "+61",
    "value": "HM"
  }, {
    "label": "Honduras",
    "phone": "+504",
    "value": "HN"
  }, {
    "label": "Hong Kong",
    "phone": "+852",
    "value": "HK"
  }, {
    "label": "Hungary",
    "phone": "+36",
    "value": "HU"
  }, {
    "label": "Iceland",
    "phone": "+354",
    "value": "IS"
  }, {
    "label": "India",
    "phone": "+91",
    "value": "IN"
  }, {
    "label": "Indonesia",
    "phone": "+62",
    "value": "ID"
  }, {
    "label": "Iran",
    "phone": "+98",
    "value": "IR"
  }, {
    "label": "Iraq",
    "phone": "+964",
    "value": "IQ"
  }, {
    "label": "Ireland",
    "phone": "+353",
    "value": "IE"
  }, {
    "label": "Isle of Man",
    "phone": "+44",
    "value": "IM"
  }, {
    "label": "Israel",
    "phone": "+972",
    "value": "IL"
  }, {
    "label": "Italy",
    "phone": "+39",
    "value": "IT"
  }, {
    "label": "Ivory Coast",
    "phone": "+225",
    "value": "CI"
  }, {
    "label": "Jamaica",
    "phone": "+1876",
    "value": "JM"
  }, {
    "label": "Japan",
    "phone": "+81",
    "value": "JP"
  }, {
    "label": "Jersey",
    "phone": "+44",
    "value": "JE"
  }, {
    "label": "Jordan",
    "phone": "+962",
    "value": "JO"
  }, {
    "label": "Kazakhstan",
    "phone": "+76,77",
    "value": "KZ"
  }, {
    "label": "Kenya",
    "phone": "+254",
    "value": "KE"
  }, {
    "label": "Kiribati",
    "phone": "+686",
    "value": "KI"
  }, {
    "label": "Kosovo",
    "phone": "+377,381,383,386",
    "value": "XK"
  }, {
    "label": "Kuwait",
    "phone": "+965",
    "value": "KW"
  }, {
    "label": "Kyrgyzstan",
    "phone": "+996",
    "value": "KG"
  }, {
    "label": "Laos",
    "phone": "+856",
    "value": "LA"
  }, {
    "label": "Latvia",
    "phone": "+371",
    "value": "LV"
  }, {
    "label": "Lebanon",
    "phone": "+961",
    "value": "LB"
  }, {
    "label": "Lesotho",
    "phone": "+266",
    "value": "LS"
  }, {
    "label": "Liberia",
    "phone": "+231",
    "value": "LR"
  }, {
    "label": "Libya",
    "phone": "+218",
    "value": "LY"
  }, {
    "label": "Liechtenstein",
    "phone": "+423",
    "value": "LI"
  }, {
    "label": "Lithuania",
    "phone": "+370",
    "value": "LT"
  }, {
    "label": "Luxembourg",
    "phone": "+352",
    "value": "LU"
  }, {
    "label": "Macao",
    "phone": "+853",
    "value": "MO"
  }, {
    "label": "Madagascar",
    "phone": "+261",
    "value": "MG"
  }, {
    "label": "Malawi",
    "phone": "+265",
    "value": "MW"
  }, {
    "label": "Malaysia",
    "phone": "+60",
    "value": "MY"
  }, {
    "label": "Maldives",
    "phone": "+960",
    "value": "MV"
  }, {
    "label": "Mali",
    "phone": "+223",
    "value": "ML"
  }, {
    "label": "Malta",
    "phone": "+356",
    "value": "MT"
  }, {
    "label": "Marshall Islands",
    "phone": "+692",
    "value": "MH"
  }, {
    "label": "Martinique",
    "phone": "+596",
    "value": "MQ"
  }, {
    "label": "Mauritania",
    "phone": "+222",
    "value": "MR"
  }, {
    "label": "Mauritius",
    "phone": "+230",
    "value": "MU"
  }, {
    "label": "Mayotte",
    "phone": "+262",
    "value": "YT"
  }, {
    "label": "Mexico",
    "phone": "+52",
    "value": "MX"
  }, {
    "label": "Micronesia",
    "phone": "+691",
    "value": "FM"
  }, {
    "label": "Moldova",
    "phone": "+373",
    "value": "MD"
  }, {
    "label": "Monaco",
    "phone": "+377",
    "value": "MC"
  }, {
    "label": "Mongolia",
    "phone": "+976",
    "value": "MN"
  }, {
    "label": "Montenegro",
    "phone": "+382",
    "value": "ME"
  }, {
    "label": "Montserrat",
    "phone": "+1664",
    "value": "MS"
  }, {
    "label": "Morocco",
    "phone": "+212",
    "value": "MA"
  }, {
    "label": "Mozambique",
    "phone": "+258",
    "value": "MZ"
  }, {
    "label": "Myanmar [Burma]",
    "phone": "+95",
    "value": "MM"
  }, {
    "label": "Namibia",
    "phone": "+264",
    "value": "NA"
  }, {
    "label": "Nauru",
    "phone": "+674",
    "value": "NR"
  }, {
    "label": "Nepal",
    "phone": "+977",
    "value": "NP"
  }, {
    "label": "Netherlands",
    "phone": "+31",
    "value": "NL"
  }, {
    "label": "New Caledonia",
    "phone": "+687",
    "value": "NC"
  }, {
    "label": "New Zealand",
    "phone": "+64",
    "value": "NZ"
  }, {
    "label": "Nicaragua",
    "phone": "+505",
    "value": "NI"
  }, {
    "label": "Niger",
    "phone": "+227",
    "value": "NE"
  }, {
    "label": "Nigeria",
    "phone": "+234",
    "value": "NG"
  }, {
    "label": "Niue",
    "phone": "+683",
    "value": "NU"
  }, {
    "label": "Norfolk Island",
    "phone": "+672",
    "value": "NF"
  }, {
    "label": "North Korea",
    "phone": "+850",
    "value": "KP"
  }, {
    "label": "North Macedonia",
    "phone": "+389",
    "value": "MK"
  }, {
    "label": "Northern Mariana Islands",
    "phone": "+1670",
    "value": "MP"
  }, {
    "label": "Norway",
    "phone": "+47",
    "value": "NO"
  }, {
    "label": "Oman",
    "phone": "+968",
    "value": "OM"
  }, {
    "label": "Pakistan",
    "phone": "+92",
    "value": "PK"
  }, {
    "label": "Palau",
    "phone": "+680",
    "value": "PW"
  }, {
    "label": "Palestine",
    "phone": "+970",
    "value": "PS"
  }, {
    "label": "Panama",
    "phone": "+507",
    "value": "PA"
  }, {
    "label": "Papua New Guinea",
    "phone": "+675",
    "value": "PG"
  }, {
    "label": "Paraguay",
    "phone": "+595",
    "value": "PY"
  }, {
    "label": "Peru",
    "phone": "+51",
    "value": "PE"
  }, {
    "label": "Philippines",
    "phone": "+63",
    "value": "PH"
  }, {
    "label": "Pitcairn Islands",
    "phone": "+64",
    "value": "PN"
  }, {
    "label": "Poland",
    "phone": "+48",
    "value": "PL"
  }, {
    "label": "Portugal",
    "phone": "+351",
    "value": "PT"
  }, {
    "label": "Puerto Rico",
    "phone": "+1787,1939",
    "value": "PR"
  }, {
    "label": "Qatar",
    "phone": "+974",
    "value": "QA"
  }, {
    "label": "Republic of the Congo",
    "phone": "+242",
    "value": "CG"
  }, {
    "label": "Romania",
    "phone": "+40",
    "value": "RO"
  }, {
    "label": "Russia",
    "phone": "+7",
    "value": "RU"
  }, {
    "label": "Rwanda",
    "phone": "+250",
    "value": "RW"
  }, {
    "label": "Réunion",
    "phone": "+262",
    "value": "RE"
  }, {
    "label": "Saint Barthélemy",
    "phone": "+590",
    "value": "BL"
  }, {
    "label": "Saint Helena",
    "phone": "+290",
    "value": "SH"
  }, {
    "label": "Saint Kitts and Nevis",
    "phone": "+1869",
    "value": "KN"
  }, {
    "label": "Saint Lucia",
    "phone": "+1758",
    "value": "LC"
  }, {
    "label": "Saint Martin",
    "phone": "+590",
    "value": "MF"
  }, {
    "label": "Saint Pierre and Miquelon",
    "phone": "+508",
    "value": "PM"
  }, {
    "label": "Saint Vincent and the Grenadines",
    "phone": "+1784",
    "value": "VC"
  }, {
    "label": "Samoa",
    "phone": "+685",
    "value": "WS"
  }, {
    "label": "San Marino",
    "phone": "+378",
    "value": "SM"
  }, {
    "label": "Saudi Arabia",
    "phone": "+966",
    "value": "SA"
  }, {
    "label": "Senegal",
    "phone": "+221",
    "value": "SN"
  }, {
    "label": "Serbia",
    "phone": "+381",
    "value": "RS"
  }, {
    "label": "Seychelles",
    "phone": "+248",
    "value": "SC"
  }, {
    "label": "Sierra Leone",
    "phone": "+232",
    "value": "SL"
  }, {
    "label": "Singapore",
    "phone": "+65",
    "value": "SG"
  }, {
    "label": "Sint Maarten",
    "phone": "+1721",
    "value": "SX"
  }, {
    "label": "Slovakia",
    "phone": "+421",
    "value": "SK"
  }, {
    "label": "Slovenia",
    "phone": "+386",
    "value": "SI"
  }, {
    "label": "Solomon Islands",
    "phone": "+677",
    "value": "SB"
  }, {
    "label": "Somalia",
    "phone": "+252",
    "value": "SO"
  }, {
    "label": "South Africa",
    "phone": "+27",
    "value": "ZA"
  }, {
    "label": "South Georgia and the South Sandwich Islands",
    "phone": "+500",
    "value": "GS"
  }, {
    "label": "South Korea",
    "phone": "+82",
    "value": "KR"
  }, {
    "label": "South Sudan",
    "phone": "+211",
    "value": "SS"
  }, {
    "label": "Spain",
    "phone": "+34",
    "value": "ES"
  }, {
    "label": "Sri Lanka",
    "phone": "+94",
    "value": "LK"
  }, {
    "label": "Sudan",
    "phone": "+249",
    "value": "SD"
  }, {
    "label": "Surilabel",
    "phone": "+597",
    "value": "SR"
  }, {
    "label": "Svalbard and Jan Mayen",
    "phone": "+4779",
    "value": "SJ"
  }, {
    "label": "Swaziland",
    "phone": "+268",
    "value": "SZ"
  }, {
    "label": "Sweden",
    "phone": "+46",
    "value": "SE"
  }, {
    "label": "Switzerland",
    "phone": "+41",
    "value": "CH"
  }, {
    "label": "Syria",
    "phone": "+963",
    "value": "SY"
  }, {
    "label": "São Tomé and Príncipe",
    "phone": "+239",
    "value": "ST"
  }, {
    "label": "Taiwan",
    "phone": "+886",
    "value": "TW"
  }, {
    "label": "Tajikistan",
    "phone": "+992",
    "value": "TJ"
  }, {
    "label": "Tanzania",
    "phone": "+255",
    "value": "TZ"
  }, {
    "label": "Thailand",
    "phone": "+66",
    "value": "TH"
  }, {
    "label": "Togo",
    "phone": "+228",
    "value": "TG"
  }, {
    "label": "Tokelau",
    "phone": "+690",
    "value": "TK"
  }, {
    "label": "Tonga",
    "phone": "+676",
    "value": "TO"
  }, {
    "label": "Trinidad and Tobago",
    "phone": "+1868",
    "value": "TT"
  }, {
    "label": "Tunisia",
    "phone": "+216",
    "value": "TN"
  }, {
    "label": "Turkey",
    "phone": "+90",
    "value": "TR"
  }, {
    "label": "Turkmenistan",
    "phone": "+993",
    "value": "TM"
  }, {
    "label": "Turks and Caicos Islands",
    "phone": "+1649",
    "value": "TC"
  }, {
    "label": "Tuvalu",
    "phone": "+688",
    "value": "TV"
  }, {
    "label": "U.S. Minor Outlying Islands",
    "phone": "+1",
    "value": "UM"
  }, {
    "label": "U.S. Virgin Islands",
    "phone": "+1340",
    "value": "VI"
  }, {
    "label": "Uganda",
    "phone": "+256",
    "value": "UG"
  }, {
    "label": "Ukraine",
    "phone": "+380",
    "value": "UA"
  }, {
    "label": "United Arab Emirates",
    "phone": "+971",
    "value": "AE"
  }, {
    "label": "United Kingdom",
    "phone": "+44",
    "value": "GB"
  }, {
    "label": "United States",
    "phone": "+1",
    "value": "US"
  }, {
    "label": "Uruguay",
    "phone": "+598",
    "value": "UY"
  }, {
    "label": "Uzbekistan",
    "phone": "+998",
    "value": "UZ"
  }, {
    "label": "Vanuatu",
    "phone": "+678",
    "value": "VU"
  }, {
    "label": "Vatican City",
    "phone": "+379",
    "value": "VA"
  }, {
    "label": "Venezuela",
    "phone": "+58",
    "value": "VE"
  }, {
    "label": "Vietnam",
    "phone": "+84",
    "value": "VN"
  }, {
    "label": "Wallis and Futuna",
    "phone": "+681",
    "value": "WF"
  }, {
    "label": "Western Sahara",
    "phone": "+212",
    "value": "EH"
  }, {
    "label": "Yemen",
    "phone": "+967",
    "value": "YE"
  }, {
    "label": "Zambia",
    "phone": "+260",
    "value": "ZM"
  }, {
    "label": "Zimbabwe",
    "phone": "+263",
    "value": "ZW"
  }, {
    "label": "Åland",
    "phone": "+358",
    "value": "AX"
  }];
  const StripeForm = ({
    regulationForm,
    setRegulationForm,
    isExtendedRegulationForm,
    setState,
    state
  }) => {
    const qs = useQueryString();
    let requiredForm = {
      name: '',
      surname: ''
    };
    if (isExtendedRegulationForm) {
      requiredForm.address_line1 = '';
      requiredForm.address_city = '';
      requiredForm.address_country = '';
      requiredForm.address_postal_code = '';
      requiredForm.address_state = '';
    }
    let [form, setForm] = React.useState(requiredForm);
    let [touched, setTouched] = React.useState(requiredForm);
    let fields = isExtendedRegulationForm ? FULL_FIELDS : FIELDS;
    const updateForm = () => {
      if (qs['stripeForm']) {
        const dataRegulationForm = JSON.parse(decodeURIComponent(window.atob(qs['stripeForm'])));
        Object.keys(form).forEach(e => {
          if (dataRegulationForm[e]) {
            form[e] = dataRegulationForm[e];
            regulationForm[e] = dataRegulationForm[e];
          }
        });
        setState({
          ...state,
          stripeForm: qs['stripeForm']
        });
      }
    };
    React.useEffect(() => {
      if (setState) {
        updateForm();
      }
    }, [setState]);
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "stripe-additional-form-container"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-label"
    }, "Details requested by Stripe"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "stripe-additional-form"
    }, fields.map(({
      name,
      placeholder,
      isAddress,
      required
    }, key) => {
      if (isAddress) {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: "select-container",
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("select", {
          style: {
            height: '2.5rem'
          },
          className: `select sellix-input ${!regulationForm[name] && touched[name] ? "is-invalid" : ""}`,
          name: name,
          value: form[name],
          placeholder: placeholder,
          onChange: e => {
            setForm({
              ...form,
              [name]: e.target.value
            });
            setRegulationForm({
              ...regulationForm,
              [name]: e.target.value
            });
            if (setState) {
              setState({
                ...state,
                stripeForm: btoa(JSON.stringify(regulationForm))
              });
            }
          },
          onBlur: () => setTouched({
            ...touched,
            [name]: true
          })
        }, /*#__PURE__*/React__default["default"].createElement("option", {
          value: "",
          disabled: true,
          hidden: true
        }, "Country"), COUNTRIES.map(({
          label,
          value
        }) => /*#__PURE__*/React__default["default"].createElement("option", {
          value: value,
          key: value
        }, label))), /*#__PURE__*/React__default["default"].createElement(ChevronDown, null), !form[name] && touched[name] && /*#__PURE__*/React__default["default"].createElement("div", {
          className: "text-left invalid-feedback"
        }, required));
      } else {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: `${name === 'address_line1' ? 'w-100' : ''}`,
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("input", {
          type: "text",
          name: name,
          style: {
            height: '2.5rem'
          },
          onChange: e => {
            setForm({
              ...form,
              [name]: e.target.value
            });
            setRegulationForm({
              ...regulationForm,
              [name]: e.target.value
            });
            if (setState) {
              setState({
                ...state,
                stripeForm: btoa(JSON.stringify(regulationForm))
              });
            }
          },
          onBlur: () => setTouched({
            ...touched,
            [name]: true
          }),
          value: form[name],
          placeholder: placeholder,
          className: `sellix-input ${!form[name] && touched[name] ? 'is-invalid' : ''}`
        }), !form[name] && touched[name] && /*#__PURE__*/React__default["default"].createElement("div", {
          className: "text-left invalid-feedback"
        }, required));
      }
    })));
  };

  var css_248z$c = "";
  styleInject(css_248z$c);

  const Icon = () => /*#__PURE__*/React__default["default"].createElement("svg", {
    width: "24px",
    height: "24px",
    viewBox: "0 0 24 24",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default["default"].createElement("g", null, /*#__PURE__*/React__default["default"].createElement("path", {
    d: "M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M13,17 L11,17 L11,15 L13,15 L13,17 L13,17 Z M13,13 L11,13 L11,7 L13,7 L13,13 L13,13 Z"
  })));
  const Alert = ({
    skipTitle = false,
    show = true,
    className = '',
    blue,
    red,
    title,
    text,
    small
  }) => {
    if (!show) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: `sellix-widget alert ${small ? 'small' : ''} ${className ? className : ''} fade ${show ? 'show' : ''} ${red ? 'red' : ''} ${blue ? 'blue' : ''}`
    }, skipTitle ? null : /*#__PURE__*/React__default["default"].createElement("b", null, /*#__PURE__*/React__default["default"].createElement(Icon, null), title), /*#__PURE__*/React__default["default"].createElement("span", null, text));
  };

  const Form = ({
    isCart,
    isPayPal,
    isRegulations,
    customFieldsValues,
    regulationForm,
    isExtendedRegulationForm,
    setEmail,
    setPayPalEmailDelivery,
    onSetCustomFields,
    onSetRegulationForm,
    discordState,
    invoiceError,
    config,
    email,
    payPalEmailDelivery
  }) => {
    const {
      getParam
    } = useDefaultParamsContext();
    const {
      cartProducts,
      productInfo,
      onShowProductTerms
    } = usePurchaseDetailsContext();
    let discord_integration = false;
    if (isCart) {
      cartProducts.forEach(p => {
        if (p.discord_integration) discord_integration = true;
      });
    } else {
      discord_integration = productInfo.discord_integration;
    }
    const [touched, setTouched] = React.useState('');
    const [warning, setWarning] = React.useState('');
    const [customFields, setCustomFields] = React.useState([]);
    const location = window.location;
    React.useEffect(() => {
      if (isCart) {
        let f = [];
        cartProducts.map(product => {
          let urlFields = [];
          if (location.search) {
            let button_fields = location.search.substr(1).split('&');
            button_fields.map(field => {
              let key = field.split('=')[0].replace(/-/g, '_');
              let value = field.split('=')[1];
              if (key) {
                urlFields.push({
                  default: decodeURIComponent(value),
                  name: key,
                  placeholder: '',
                  regex: '',
                  required: false,
                  type: 'hidden'
                });
              }
            });
          }
          if (product && product.custom_fields) {
            f = [...f, ...JSON.parse(product.custom_fields).custom_fields, ...urlFields];
          } else {
            f = [...f, ...urlFields];
          }
        });
        let arrayUniqueByKey = [];
        for (let i = 0; i < f.length; i++) {
          if (arrayUniqueByKey.find(({
            name
          }) => f[i].name === name)) ; else {
            arrayUniqueByKey.push(f[i]);
          }
        }
        setCustomFields(arrayUniqueByKey);
      } else {
        let urlFields = [];
        if (location.search) {
          let button_fields = location.search.substr(1).split('&');
          button_fields.map(field => {
            let key = field.split('=')[0].replace(/-/g, '_');
            let value = field.split('=')[1];
            if (key) {
              urlFields.push({
                default: decodeURIComponent(value),
                name: key,
                placeholder: '',
                regex: '',
                required: false,
                type: 'hidden'
              });
            }
          });
        }
        if (productInfo && productInfo.custom_fields) {
          setCustomFields([...JSON.parse(productInfo.custom_fields).custom_fields, ...urlFields]);
        } else {
          setCustomFields([...urlFields]);
        }
      }
    }, [cartProducts, productInfo]);
    let forcePayPal = isCart ? cartProducts.find(({
      shop_force_paypal_email_delivery
    }) => !!+shop_force_paypal_email_delivery) : !!+productInfo.shop_force_paypal_email_delivery;
    let regexNormalize = (value, regex) => value.replace(regex, '');
    const handleDiscordButton = () => {
      window.open(config.DISCORD.DISCORD_INTEGRATION_OAUTH_URL + discordState, '_self', 'noopener,noreferrer');
    };
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form"
    }, isPayPal && forcePayPal && /*#__PURE__*/React__default["default"].createElement(Alert, {
      small: true,
      title: "Please note",
      text: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", null, "Sellix fulfillment emails will be delivered to your PayPal email.\xA0", !warning && /*#__PURE__*/React__default["default"].createElement("span", {
        style: {
          color: 'var(--buttonColor)',
          textDecoration: 'underline',
          cursor: 'pointer'
        },
        onClick: () => setWarning(true)
      }, "More Info")), warning && /*#__PURE__*/React__default["default"].createElement("div", null, "You will also not be able to view the product here on the website after the purchase. ", /*#__PURE__*/React__default["default"].createElement("br", null), "This is to avoid fraud purchases with PayPal."))
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${customFields.length ? 'pb-3' : isPayPal && !forcePayPal ? 'pb-3' : ''}`
    }, /*#__PURE__*/React__default["default"].createElement("input", {
      type: "text",
      name: "email",
      style: {
        height: '3rem'
      },
      onChange: e => {
        setEmail(e.target.value);
      },
      onBlur: () => setTouched(true),
      value: email,
      placeholder: "Email for invoice updates",
      className: `sellix-input ${!email && touched ? 'is-invalid' : ''}`
    }), !email && touched && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "text-left invalid-feedback"
    }, "Email is required"), discord_integration && (!getParam('code', false) || invoiceError) ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form-discord"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "sellix-discord-button",
      onClick: handleDiscordButton
    }, "Connect your ", /*#__PURE__*/React__default["default"].createElement("img", {
      alt: "Discord",
      src: "https://cdn.sellix.io/static/gateways/discord.png"
    }), "  account")) : null), isPayPal && !forcePayPal && /*#__PURE__*/React__default["default"].createElement("div", {
      className: `${customFields.length ? 'pb-3' : ''} mr-0 w-100`
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-checkbox mb-0 mr-0"
    }, /*#__PURE__*/React__default["default"].createElement("input", {
      type: "checkbox",
      id: "paypal_email_delivery",
      checked: payPalEmailDelivery,
      onChange: e => {
        setPayPalEmailDelivery(e.target.checked);
      }
    }), /*#__PURE__*/React__default["default"].createElement("label", {
      className: "sellix-label",
      htmlFor: "paypal_email_delivery",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, "Deliver to PayPal email."))), customFields.map((field, key) => {
      let fieldType;
      if (typeof field.type === 'string') {
        fieldType = field.type.toLowerCase();
      } else if (typeof (field.type && field.type.value) === 'string') {
        fieldType = field.type.value.toLowerCase();
      } else {
        fieldType = 'unknown';
      }
      if (fieldType === 'text') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: "sellix-product-form-field",
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("label", {
          className: "sellix-label"
        }, field.name, " ", /*#__PURE__*/React__default["default"].createElement("small", {
          className: "font-italic"
        }, !field.required && '(optional)')), /*#__PURE__*/React__default["default"].createElement("input", {
          type: "text",
          onChange: e => {
            let value = e.target.value;
            if (field.regex) {
              value = regexNormalize(value, new RegExp(field.regex, 'g'));
            }
            if (!value) {
              onSetCustomFields(field.name, e.target.value);
            } else {
              onSetCustomFields(field.name, value);
            }
          },
          value: customFieldsValues[field.name],
          defaultValue: field.default,
          placeholder: field.placeholder,
          required: field.required,
          className: "sellix-input"
        }));
      }
      if (fieldType === 'hidden') {
        return /*#__PURE__*/React__default["default"].createElement("input", {
          key: `${key}-${key}`,
          type: "hidden",
          name: customFieldsValues[field.name],
          value: field.default,
          defaultValue: field.default
        });
      }
      if (fieldType === 'number') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: "sellix-product-form-field",
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("label", {
          className: "sellix-label"
        }, field.name, " ", /*#__PURE__*/React__default["default"].createElement("small", {
          className: "font-italic"
        }, !field.required && ' (optional)')), /*#__PURE__*/React__default["default"].createElement("input", {
          type: field.regex ? 'text' : 'number',
          onChange: e => {
            let value = e.target.value;
            if (field.regex) {
              value = regexNormalize(value, new RegExp(field.regex, 'g'));
            }
            if (!value) {
              onSetCustomFields(field.name, e.target.value);
            } else {
              onSetCustomFields(field.name, value);
            }
          },
          value: customFieldsValues[field.name],
          defaultValue: field.default,
          placeholder: field.placeholder,
          required: field.required,
          className: "sellix-input"
        }));
      }
      if (fieldType === 'largetextbox') {
        return /*#__PURE__*/React__default["default"].createElement("div", {
          className: "sellix-product-form-field",
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("label", {
          className: "sellix-label"
        }, field.name, " ", /*#__PURE__*/React__default["default"].createElement("small", {
          className: "font-italic"
        }, !field.required && ' (optional)')), /*#__PURE__*/React__default["default"].createElement("textarea", {
          className: "sellix-input textarea",
          value: customFieldsValues[field.name],
          defaultValue: field.default,
          rows: 5,
          placeholder: field.placeholder,
          required: field.required,
          onChange: e => {
            let value = e.target.value;
            if (field.regex) {
              value = regexNormalize(value, new RegExp(field.regex, 'g'));
            }
            onSetCustomFields(field.name, value);
          }
        }));
      }
      if (fieldType === 'checkbox') {
        return /*#__PURE__*/React__default["default"].createElement("label", {
          className: "sellix-checkbox mb-3",
          htmlFor: `sk${field.name}`,
          key: key
        }, /*#__PURE__*/React__default["default"].createElement("input", {
          type: "checkbox",
          id: `sk${field.name}`,
          name: field.name,
          checked: customFieldsValues[field.name] ? 'checked' : '',
          onChange: e => {
            onSetCustomFields(field.name, e.target.checked);
          }
        }), /*#__PURE__*/React__default["default"].createElement("label", {
          className: "sellix-label",
          htmlFor: `sk${field.name}`
        }, field.name, " ", /*#__PURE__*/React__default["default"].createElement("small", {
          className: "font-italic"
        }, !field.required && ' (optional)')));
      }
    }), isRegulations && /*#__PURE__*/React__default["default"].createElement(StripeForm, {
      isExtendedRegulationForm: isExtendedRegulationForm,
      regulationForm: regulationForm,
      setRegulationForm: onSetRegulationForm
    }), productInfo && (productInfo.shop_terms_of_service || productInfo.terms_of_service) && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "terms-link",
      onClick: onShowProductTerms
    }, "By clicking Pay you agree to ", productInfo.name, "'s ", /*#__PURE__*/React__default["default"].createElement("span", null, "Terms of Service")));
  };

  var css_248z$b = "";
  styleInject(css_248z$b);

  const ItemInCheck = props => {
    const [calculation, showCalculation] = React.useState(false);
    const {
      productInfo,
      currency,
      currencyTitle
    } = props;
    const {
      product: {
        title,
        uniqid,
        quantity
      },
      price,
      productDiscount,
      productAmount,
      addonsDiscount,
      addonsList,
      volumeDiscount,
      volumeAmount,
      bundleDiscount,
      bundleAmount,
      couponDiscount,
      couponAmount,
      taxDiscount,
      taxAmount
    } = productInfo;
    let total = +[productDiscount, addonsDiscount, volumeDiscount, bundleDiscount, couponDiscount, taxDiscount].reduce((val, func) => func(val), quantity * price).toFixed(2);
    const isFree = total < 0;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      key: uniqid,
      className: `sellix-check-item ${calculation !== uniqid ? 'pb-1 mb-1' : ''}`
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-head"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "sellix-check-item-name"
    }, title), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "d-flex"
    }, calculation === uniqid ? /*#__PURE__*/React__default["default"].createElement("span", null, quantity, " \xD7 ", currencyTitle, price) : /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 400
      }
    }, isFree ? 'Free' : `${currencyTitle}${total}`), /*#__PURE__*/React__default["default"].createElement("span", {
      "data-tip": true,
      "data-for": `calc-${uniqid}`,
      className: "cursor-pointer",
      onClick: () => showCalculation(calculation === uniqid ? null : uniqid)
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-light fa-info-circle"
    }), /*#__PURE__*/React__default["default"].createElement(ReactTooltip, {
      id: `calc-${uniqid}`,
      place: "left",
      className: "sellix-check-item-tooltip"
    }, "How is the price calculated?")))), calculation === uniqid && /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, addonsList ? addonsList.map(({
      title,
      price_conversions
    }) => /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, title, ":"), /*#__PURE__*/React__default["default"].createElement("span", null, currencyTitle, price_conversions[currency]))) : null, productAmount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Product Discount:"), /*#__PURE__*/React__default["default"].createElement("span", null, "-", productAmount)) : null, volumeAmount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Volume Discount:"), /*#__PURE__*/React__default["default"].createElement("span", null, "-", volumeAmount)) : null, bundleAmount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Bundle Discount:"), /*#__PURE__*/React__default["default"].createElement("span", null, "-", bundleAmount)) : null, couponAmount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Coupon Discount:"), /*#__PURE__*/React__default["default"].createElement("span", null, "-", couponAmount)) : null, taxAmount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Tax:"), /*#__PURE__*/React__default["default"].createElement("span", null, "+", taxAmount)) : null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-check-item-row mt-1"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Subtotal:"), /*#__PURE__*/React__default["default"].createElement("b", null, /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        color: 'var(--lightFontColor)',
        fontSize: 13.4,
        fontWeight: 400
      }
    }, isFree ? 'Free' : `${currencyTitle}${total}`), productAmount || volumeAmount || bundleAmount || couponAmount ? /*#__PURE__*/React__default["default"].createElement("s", {
      style: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--darkFontColor)'
      },
      className: "ml-1"
    }, currencyTitle, (quantity * price).toFixed(2)) : null))));
  };
  const TITLES$1 = ['Purchase', 'Payment Method', 'Product Delivery'];
  const CheckoutPurchase = ({
    hasDiscount,
    taxAmount,
    couponAmount,
    productDiscounts,
    bundleDiscounts,
    appliedCoupon,
    setAppliedCoupon,
    paymentOptions,
    currency
  }) => {
    const {
      config,
      theme,
      isCustomDomain,
      cartProducts,
      shopInfo,
      addons,
      onCreateInvoice,
      onBackToShop,
      onShowMessage,
      onChangeStep,
      onSuccess,
      onFail: _onFail
    } = usePurchaseDetailsContext();
    const currencyTitle = config.CURRENCY_LIST[currency];
    const qs = useQueryString();
    const [openCoupon, setOpenCoupon] = React.useState(null);
    const [gateway, setGateway] = React.useState(null);
    const [APM, setAPM] = React.useState(null);
    const [regulationForm, setRegulationForm, isVisibleRegulationForm, isFilledRegulationForm, isExtendedRegulationForm] = useRegulationForm(cartProducts, gateway, APM);
    const [customFields, setCustomFields] = useCustomFields(cartProducts);
    const [sending, setSending] = React.useState(false);
    const [payPalEmailDelivery, setPayPalEmailDelivery] = React.useState(false);
    const [step, setStepInternal] = React.useState(qs['step'] ? parseInt(qs['step']) : 0);
    const _setStep = React.useCallback(step => {
      setStepInternal(step);
      onChangeStep(step);
    }, [onChangeStep]);
    const [email, setEmail] = React.useState(null);
    const [state, setState] = React.useState({});
    const [url, setUrl] = React.useState('');
    const setStep = step => {
      setState({
        ...state,
        step
      });
      _setStep(step);
    };
    const forceUpdate = useForceUpdate();
    const handleGoPurchaseForm = useGoToPurchase(gateway, setStep, onShowMessage);
    const handleBackToShop = useBackToShop(onBackToShop);
    const [invoiceError, setInvoiceError] = React.useState(false);
    const onFail = React.useCallback(() => {
      setInvoiceError(true);
      _onFail();
    }, []);
    const [handleSubmitPayment] = useSubmitPayment({
      config,
      isCustomDomain,
      email,
      gateway,
      APM,
      customFields,
      appliedCoupon,
      hasDiscount: hasDiscount,
      payPalEmailDelivery,
      isVisibleRegulationForm,
      isExtendedRegulationForm,
      regulationForm,
      setSending,
      onCreateInvoice,
      onShowMessage,
      onSuccess,
      onFail,
      type: 'checkout',
      products: cartProducts,
      addons,
      discordIntegrationCode: state['code'] ? state['code'] : qs['code']
    });
    let total = 0;
    productDiscounts.map(product => {
      let {
        price,
        product: {
          quantity
        },
        productDiscount,
        taxDiscount,
        couponDiscount,
        volumeDiscount,
        addonsDiscount,
        bundleDiscount
      } = product;
      let subtotal = +[productDiscount, addonsDiscount, volumeDiscount, bundleDiscount, couponDiscount, taxDiscount].reduce((val, func) => func(val), quantity * price);
      total = +(total + (subtotal < 0 ? 0 : subtotal));
    });
    total = (+total).toFixed(2);
    let isFree = Math.sign(total) === -1;
    let withoutBundleList = productDiscounts.filter(({
      isBundle
    }) => !isBundle);
    let bundlesList = productDiscounts.filter(({
      isBundle
    }) => isBundle).reduce((acc, d) => {
      if (!acc[d.isBundle]) {
        acc[d.isBundle] = [d];
        return acc;
      } else {
        acc[d.isBundle] = [...acc[d.isBundle], d];
        return acc;
      }
    }, {});
    const bundleTotal = list => {
      const total = list.reduce((acc, product) => {
        const {
          price,
          product: {
            quantity
          },
          productDiscount,
          taxDiscount,
          couponDiscount,
          volumeDiscount,
          addonsDiscount,
          bundleDiscount
        } = product;
        let total = +[productDiscount, addonsDiscount, volumeDiscount, bundleDiscount, couponDiscount, taxDiscount].reduce((val, func) => func(val), quantity * price).toFixed(2);
        const isFree = total < 0;
        return isFree ? acc : acc + total;
      }, 0);
      const isFree = total < 0;
      return `${isFree ? 'Free' : `${currencyTitle}${+total.toFixed(2)}`}`;
    };
    let disabledPayButton = sending || !email || isVisibleRegulationForm && !isFilledRegulationForm;
    React.useEffect(() => {
      const _state = {};
      ['gateway', 'APM', 'step', 'email', 'payPalEmailDelivery', 'couponCode', 'code'].forEach(param => {
        if (qs[param]) {
          _state[param] = qs[param];
        }
      });
      if (_state.gateway) {
        setGateway(qs['gateway']);
      }
      if (_state.APM) {
        setAPM(qs['APM']);
      }
      if (_state.step) {
        setStep(parseInt(qs['step']));
      }
      _state.redirectUrl = window.location.href.split('?')[0];
      setState({
        ...state,
        ..._state
      });
      setUrl(config.DISCORD.DISCORD_INTEGRATION_OAUTH_URL + btoa(JSON.stringify(_state)));
    }, []);
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-title",
      style: {
        height: '18px'
      }
    }, TITLES$1[step]), step === 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      onClick: handleBackToShop,
      className: "sellix-product-back"
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fas fa-times"
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-body"
    }, step === 0 ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "unselectable w-100"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-body-list"
    }, withoutBundleList.map(product => /*#__PURE__*/React__default["default"].createElement(ItemInCheck, {
      productInfo: product,
      currency: currency,
      currencyTitle: currencyTitle
    })), Object.keys(bundlesList).map(v => /*#__PURE__*/React__default["default"].createElement("div", {
      className: "bundle-list-wrapper"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "bundle-list-title"
    }, bundlesList[v][0].bundleTitle), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "bundle-list-total"
    }, bundleTotal(bundlesList[v])), bundlesList[v].map(product => /*#__PURE__*/React__default["default"].createElement(ItemInCheck, {
      productInfo: product,
      currency: currency,
      currencyTitle: currencyTitle
    }))))), bundleDiscounts.map(({
      bundle,
      discountTitle
    }) => bundle ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0",
      style: {
        paddingTop: '.75rem',
        paddingBottom: '.25rem'
      }
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Bundle discount ", /*#__PURE__*/React__default["default"].createElement("small", null, "(", bundle.title, ")")), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--darkFontColor)'
      }
    }, bundle && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 13.5,
        color: 'var(--lightFontColor)'
      }
    }, "-", discountTitle))) : /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        height: 0,
        overflow: 'hidden'
      }
    })), appliedCoupon && !(appliedCoupon.disabled_with_volume_discounts && hasDiscount) ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0",
      style: {
        paddingTop: '.75rem',
        paddingBottom: '.25rem'
      }
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Coupon Discount"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--darkFontColor)'
      }
    }, appliedCoupon && !(appliedCoupon.disabled_with_volume_discounts && hasDiscount) && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 13.5,
        color: 'var(--lightFontColor)'
      }
    }, "-", couponAmount))) : /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        height: 0,
        overflow: 'hidden'
      }
    }), +shopInfo.vat_percentage ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0",
      style: {
        paddingTop: '.75rem',
        paddingBottom: '.25rem'
      }
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Tax"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--darkFontColor)'
      }
    }, +shopInfo.vat_percentage && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 13.5,
        color: 'var(--lightFontColor)'
      }
    }, "+", taxAmount))) : null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Total"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total-price unselectable"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, isFree ? '' : currencyTitle), total ? /*#__PURE__*/React__default["default"].createElement("div", null, isFree ? 'Free' : total) : null)))) : null, step === 1 && paymentOptions.length === 0 && /*#__PURE__*/React__default["default"].createElement("p", {
      className: "sellix-product-no-gateway"
    }, "This product has no payment options."), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-payment-methods"
    }, /*#__PURE__*/React__default["default"].createElement(GatewaySelector, {
      type: "checkout",
      config: config,
      theme: theme,
      cartProducts: cartProducts,
      paymentOptions: paymentOptions,
      gateway: gateway,
      APM: APM,
      setGateway: (gateway, APM) => {
        setState({
          ...state,
          gateway,
          APM
        });
        setGateway(gateway);
        setAPM(APM);
      }
    })), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React__default["default"].createElement(Form, {
      isCart: true,
      isPayPal: gateway === 'PAYPAL' || gateway === 'PAYPAL_CREDIT_CARD',
      isRegulations: isVisibleRegulationForm,
      regulationForm: regulationForm,
      isExtendedRegulationForm: isExtendedRegulationForm,
      customFieldsValues: customFields,
      setState: state => setState(state),
      state: state,
      url: url,
      setUrl: url => setUrl(url),
      config: config,
      invoiceError: invoiceError,
      onSetEmail: email => setEmail(email),
      onSetPayPalEmailDelivery: email => setPayPalEmailDelivery(email),
      onSetCustomFields: (key, value) => {
        setCustomFields({
          ...customFields,
          [key]: value
        });
        forceUpdate();
      },
      onSetRegulationForm: form => setRegulationForm(form)
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-footer"
    }, step === 0 && /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "mb-3 w-100",
      onClick: () => setStep(1)
    }, "Select Gateway"), /*#__PURE__*/React__default["default"].createElement(Coupon, {
      isCart: true,
      currency: currency,
      setCoupon: appliedCoupon => setAppliedCoupon(appliedCoupon),
      appliedCoupon: appliedCoupon,
      openCoupon: openCoupon,
      setState: setState,
      state: state,
      disabledWithDiscount: appliedCoupon && appliedCoupon.disabled_with_volume_discounts && hasDiscount
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-button",
      onClick: () => setOpenCoupon(!openCoupon)
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-tags"
    }), " Apply a Coupon"))), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(0)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      onClick: handleGoPurchaseForm
    }, "Continue")), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(1)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      disabled: disabledPayButton,
      onClick: handleSubmitPayment
    }, sending ? /*#__PURE__*/React__default["default"].createElement(Index$2, null) : 'Pay')))));
  };

  function useOutOfStockMessage({
    quantity_min,
    type,
    stock: productStock,
    priceVariant
  }) {
    return React.useMemo(() => {
      const quantityMin = +quantity_min === -1 ? 1 : quantity_min;
      let stock = priceVariant && type === 'SERIALS' ? priceVariant.stock || 0 : productStock;
      if (+stock === -1) {
        return '';
      }
      if (+stock === 0) {
        return 'Product is out of stock';
      }
      const isPlural = stock > 1;
      const are = isPlural ? 'are' : 'is';
      const s = isPlural ? 's' : '';
      return parseInt(stock) < parseInt(quantityMin) ? `There ${are} ${stock} item${s} left, but minimum quantity for purchase is ${quantity_min}` : '';
    }, [quantity_min, priceVariant, type, productStock]);
  }

  function useProductQuantity(products, cartProducts) {
    const initialProductsQuantity = React.useMemo(() => {
      if (products.length > 1) {
        return Object.fromEntries(products.map(product => {
          const cartQuantity = (cartProducts.find(p => p.uniqid === product.uniqid) || {}).quantity;
          if (cartQuantity) {
            return [product.uniqid, cartQuantity || 0];
          }
          return [product.uniqid, +product.quantity_min === -1 ? 1 : product.quantity_min || 0];
        }));
      }
      const product = products[0];
      if (window.location.search) {
        const quantityParam = parseInt(window.location.search.split('quantity=')[1].split('&')[0]);
        if (!(isNaN(quantityParam) || quantityParam < 1 || product.stock !== -1 && quantityParam > product.stock || product.quantity_max !== -1 && quantityParam > product.quantity_max || product.quantity_min !== -1 && quantityParam < product.quantity_min)) {
          return {
            [product.uniqid]: quantityParam
          };
        }
      }
      return {
        [product.uniqid]: +product.quantity_min === -1 ? 1 : product.quantity_min || 0
      };
    }, [cartProducts, products]);
    const [productsQuantity, setProductsQuantity] = React.useState(initialProductsQuantity);
    const setProductQuantity = React.useCallback((uniqid, newQuantity) => {
      setProductsQuantity(prevProductsQuantity => {
        if (prevProductsQuantity[uniqid] === newQuantity) {
          return prevProductsQuantity;
        }
        return {
          ...prevProductsQuantity,
          [uniqid]: newQuantity
        };
      });
    }, []);
    return [productsQuantity, setProductsQuantity, setProductQuantity];
  }

  function useDiscordState(productQuantity, gateway, APM, step, email, payPalEmailDelivery, appliedCoupon) {
    const [discordState, setDiscordState] = React.useState("");
    React.useEffect(() => {
      const userData = {
        quantity: productQuantity,
        gateway,
        APM,
        step,
        email,
        payPalEmailDelivery,
        couponCode: appliedCoupon ? appliedCoupon.code : "",
        redirectUrl: window.location.href.split('?')[0]
      };
      setDiscordState(btoa(JSON.stringify(userData)));
    }, [productQuantity, gateway, APM, step, email, payPalEmailDelivery, appliedCoupon]);
    return {
      discordState
    };
  }

  var css_248z$a = "";
  styleInject(css_248z$a);

  const Index$1 = ({
    product,
    cartProducts,
    onAddToCart,
    openAdd
  }) => {
    const defaultCartSelect = {
      value: 'Custom'
    };
    const [options, setOptions] = React.useState([]);
    const [cartSelect, setCartSelect] = React.useState( /* null */defaultCartSelect);
    const [submit, setSubmit] = React.useState(false);
    const [cartInput, setCartInput] = React.useState('');
    const quantity = (cartProducts.find(item => item.uniqid === product.uniqid) || {}).quantity || 0;
    const {
      quantity_max,
      quantity_min
    } = product;
    const stock = product.stock === -1 ? 999999999999999 : product.stock - quantity;
    const add = () => {
      if (!cartSelect) {
        setSubmit(true);
        return;
      }
      let max = quantity_max === -1 ? stock : quantity_max;
      const quantity = cartSelect && cartSelect.value !== 'Custom' ? +cartSelect.value : +cartInput;
      onAddToCart(product.uniqid, Math.min(quantity, max));
      setCartSelect(defaultCartSelect);
      setCartInput('');
    };

    // const onChange = option => setCartSelect(option);
    //
    // useEffect(() => {
    //     if(cartSelect || cartInput) {
    //         setSubmit(false);
    //     }
    // }, [cartSelect, cartInput])
    //
    // useEffect(() => {
    //     let data = [];
    //     let max = quantity_max === -1 ? product.stock === -1 ? 999999999999 : product.stock : quantity_max;
    //     let min = quantity_min;
    //     let equal = min === max;
    //
    //     if(product.stock === 1) {
    //         if(!quantity) {
    //             data.push(1);
    //         }
    //     } else if(equal) {
    //         if(!quantity) {
    //             data.push(min);
    //         }
    //     } else {
    //         Array.from(Array(10).keys()).map((key) => {
    //             if(key === 0 || max === quantity) {
    //                 return;
    //             }
    //
    //             if((quantity + key) <= max && (quantity + key) >= min) {
    //                 data.push(key);
    //             }
    //         });
    //
    //         if(stock > 9 && (quantity_max === -1 ? product.stock === -1 ? 99999999999 : product.stock : quantity_max) > 9) {
    //             data.push('Custom');
    //         }
    //     }
    //
    //     // setCartInput(quantity_max === -1 ? product.stock : quantity_max)
    //     setOptions([...data.map((key) => ({ label: key, value: key }))]);
    //
    // }, [product.stock, quantity, quantity_max, quantity_min, stock]);

    let inStock = stock === -1 ? true : stock;
    if (!inStock && !options.length) {
      return null;
    }
    return openAdd ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pb-3"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `add-to-cart-button ${!cartSelect && submit ? 'empty' : ''} mb-0`
    }, /*#__PURE__*/React__default["default"].createElement("div", null, cartSelect && cartSelect.value === 'Custom' ? /*#__PURE__*/React__default["default"].createElement("input", {
      type: "number",
      placeholder: "Type here",
      value: cartInput,
      onChange: e => setCartInput(e.target.value),
      minLength: quantity_min,
      maxLength: quantity_max === -1 ? stock : quantity_max
    }) : null
    // <Select
    //     placeholder="Quantity"
    //     options={options}
    //     classNamePrefix="react-select"
    //     isMulti={false}
    //     formatOptionLabel={({label}) => label}
    //     className="w-100"
    //     closeMenuOnSelect={true}
    //     isSearchable={false}
    //     backspaceRemovesValue={true}
    //     value={cartSelect ? cartSelect : null}
    //     onChange={onChange}
    // />
    ), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      onClick: add
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "Add "), " ", /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-cart-shopping"
    })))) : null;
  };

  var css_248z$9 = "";
  styleInject(css_248z$9);

  const Quantity = props => {
    const {
      productQuantity,
      setProductQuantity,
      productInfo
    } = props;
    const {
      price_variants,
      priceVariant: activePriceVariant,
      type,
      quantity_max,
      quantity_min
    } = productInfo;
    const [quantity, setQuantity] = React.useState(productQuantity);
    const {
      sellixHelper
    } = usePurchaseDetailsContext();
    const isVariant = price_variants && price_variants.length;
    const stock = React.useMemo(() => {
      if (isVariant && type === 'SERIALS') {
        return activePriceVariant.stock;
      }
      return productInfo.stock;
    }, [type, isVariant, activePriceVariant, productInfo.stock]);
    React.useEffect(() => {
      if (isVariant) {
        const newQuantity = +productInfo.quantity_min === -1 ? 1 : productInfo.quantity_min || 0;
        setQuantity(newQuantity);
        setProductQuantity(newQuantity);
      }
    }, [isVariant, activePriceVariant, productInfo.quantity_min, setProductQuantity]);
    const decreaseCount = () => {
      const newQuantity = Number(quantity > quantity_min ? quantity - 1 : quantity);
      setQuantity(newQuantity);
      setProductQuantity(newQuantity);
    };
    const increaseCount = () => {
      if (!isValidCount(parseInt(quantity) + 1)) {
        return true;
      }
      const newQuantity = Number(quantity) + 1;
      setQuantity(newQuantity);
      setProductQuantity(newQuantity);
    };
    const isValidCount = count => {
      if (isNaN(count)) {
        return false;
      }
      if (count < 1) {
        return false;
      }
      if (quantity_max !== -1 && count > quantity_max || quantity_min !== -1 && count < quantity_min) {
        return false;
      }
      return !(stock !== -1 && count > stock);
    };
    const onInputChange = e => {
      if (!isNaN(e.target.value)) {
        let validatedCount = Number(e.target.value);
        if (stock === -1) {
          if (quantity_max !== -1) {
            if (validatedCount >= quantity_max) {
              validatedCount = +quantity_max;
            }
          }
        }
        if (stock !== -1) {
          if (quantity_max === -1) {
            if (validatedCount >= stock) {
              validatedCount = +stock;
            }
          }
          if (quantity_max !== -1) {
            if (validatedCount >= quantity_max) {
              validatedCount = +quantity_max;
            }
          }
        }
        setQuantity(Number(validatedCount));
        setProductQuantity(Number(validatedCount));
      }
    };
    const onBlur = e => {
      if (+e.target.value < +quantity_min) {
        setQuantity(Number(quantity_min));
        setProductQuantity(Number(quantity_min));
      }
    };
    let isValidMinus = !isValidCount(quantity - 1);
    let isValidPlus = !isValidCount(quantity + 1);
    let equal = quantity_min === quantity_max;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-stock-container"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-stock-count"
    }, !equal && stock !== 1 && /*#__PURE__*/React__default["default"].createElement("span", {
      className: `sellix-stock-count-picker unselectable ${isValidMinus && 'can-click'}`,
      onClick: decreaseCount
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-minus"
    })), /*#__PURE__*/React__default["default"].createElement("span", null, /*#__PURE__*/React__default["default"].createElement("input", {
      type: "text",
      value: quantity,
      onChange: onInputChange,
      onBlur: onBlur,
      disabled: equal,
      style: equal ? {
        width: 120
      } : {}
    })), !equal && stock !== 1 && /*#__PURE__*/React__default["default"].createElement("span", {
      className: `sellix-stock-count-picker unselectable ${isValidPlus && 'can-click'}`,
      onClick: increaseCount
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-plus"
    }))), stock === 1 ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-stock-total unselectable"
    }, "Last Product") : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-stock-total unselectable"
    }, "Stock", /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        marginLeft: '0.5rem'
      }
    }, stock === -1 ? '∞' : sellixHelper.getStock(stock - quantity))));
  };

  var css_248z$8 = "";
  styleInject(css_248z$8);

  const Index = ({
    config,
    product,
    quantity,
    isCart,
    isOutOfStock
  }) => {
    let {
      quantity_min,
      quantity_max,
      volume_discounts,
      currency
    } = product;
    const currencyTitle = config.CURRENCY_LIST[currency];
    let minimum = +quantity === +quantity_min && quantity_min !== quantity_max && quantity_min > 1;
    let maximum = +quantity === +quantity_max && quantity_min !== quantity_max;
    let equal = quantity_min === quantity_max;
    let discountList = [];
    if (volume_discounts) {
      discountList = JSON.parse(volume_discounts).volume_discounts;
    }
    let nextDiscount = discountList.find(discount => !(quantity >= discount.quantity));
    if (isOutOfStock) {
      return null;
    }
    return /*#__PURE__*/React__default["default"].createElement("div", null, minimum || maximum || equal ? /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "quantity-message"
    }, minimum && /*#__PURE__*/React__default["default"].createElement("span", null, "Minimum required quantity: ", /*#__PURE__*/React__default["default"].createElement("b", null, quantity_min)), maximum && /*#__PURE__*/React__default["default"].createElement("span", null, " Maximum quantity purchasable: ", /*#__PURE__*/React__default["default"].createElement("b", null, quantity_max)), equal && /*#__PURE__*/React__default["default"].createElement("span", null, "You can only purchase ", /*#__PURE__*/React__default["default"].createElement("b", null, quantity_max), " items per order"))) : null, !isCart && nextDiscount ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "discount-message"
    }, /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "quantity-message"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        fontSize: 14
      }
    }, "Add ", /*#__PURE__*/React__default["default"].createElement("b", null, nextDiscount.quantity - quantity), " more to get a ", /*#__PURE__*/React__default["default"].createElement("b", null, nextDiscount.value, nextDiscount.type === 'FIXED' ? currencyTitle : '%'), " discount")))) : null);
  };

  const TITLES = ['Purchase', 'Payment Method', 'Product Delivery'];
  const ProductPurchase = ({
    hasDiscount,
    productDiscounts,
    appliedCoupon,
    setAppliedCoupon,
    currency
  }) => {
    const {
      config,
      theme,
      isCustomDomain,
      isCartEnabled,
      cartProducts,
      productInfo,
      addons,
      options,
      onAddToCart,
      onChangeProductQuantity,
      onChangeStep,
      onCreateInvoice,
      onBackToShop,
      onShowMessage,
      onSuccess,
      onFail: _onFail
    } = usePurchaseDetailsContext();
    const {
      getParam
    } = useDefaultParamsContext();
    const currencyTitle = config.CURRENCY_LIST[currency];
    const products = React.useMemo(() => [productInfo], [productInfo]);
    const [openCoupon, setOpenCoupon] = React.useState(null);
    const [gateway, setGateway] = React.useState(getParam('gateway', null));
    const [APM, setAPM] = React.useState(getParam('APM', null));
    const [regulationForm, setRegulationForm, isVisibleRegulationForm, isFilledRegulationForm, isExtendedRegulationForm] = useRegulationForm(products, gateway, APM);
    const [customFields, setCustomFields] = useCustomFields(products);
    const [sending, setSending] = React.useState(false);
    const [payPalEmailDelivery, setPayPalEmailDelivery] = React.useState(getParam('payPalEmailDelivery', null));
    const [step, setStepInternal] = React.useState(parseInt(getParam('step', 0)));
    const setStep = React.useCallback(step => {
      setStepInternal(step);
      onChangeStep(step);
    }, [onChangeStep]);
    const [email, setEmail] = React.useState(getParam('email', null));
    const [openAddToCart, setOpenAddToCart] = React.useState(false);
    const [productsQuantity,, setProductQuantity] = useProductQuantity(products, cartProducts);
    let productQuantity = productsQuantity[productInfo.uniqid];
    const outOfStockMessage = useOutOfStockMessage(productInfo);
    const discounts = React.useMemo(() => {
      return (productDiscounts || []).find(discount => discount.product.uniqid === productInfo.uniqid);
    }, [productDiscounts, productInfo.uniqid]);
    const {
      stock,
      price_discount,
      paymentOptions = []
    } = productInfo;
    const {
      price,
      productDiscount,
      addonsDiscount,
      addonsList,
      volumeDiscount,
      volumeAmount,
      bundleDiscount,
      couponDiscount,
      taxDiscount
    } = discounts;
    const isPayWhatYouWant = Boolean(productInfo.pay_what_you_want);
    const [customerPrice, setCustomerPrice] = React.useState(parseFloat(productInfo.price) ? productInfo.price : 0.01);
    const isCorrectCustomerPrice = isPayWhatYouWant && parseFloat(customerPrice) >= (parseFloat(productInfo.price) ? productInfo.price : 0.01) || !isPayWhatYouWant;
    let totalPrice = +[productDiscount, addonsDiscount, volumeDiscount, bundleDiscount, couponDiscount, taxDiscount].reduce((val, func) => func(val), productQuantity * (isPayWhatYouWant ? customerPrice : price)).toFixed(2);
    const isFree = Math.sign(totalPrice) === 0 && !isPayWhatYouWant;
    const fromCart = React.useMemo(() => (cartProducts.find(p => p.uniqid === productInfo.uniqid) || {}).quantity, [cartProducts, productInfo.uniqid]);
    const forceUpdate = useForceUpdate();
    const handleGoPurchaseForm = useGoToPurchase(gateway, setStep, onShowMessage);
    const handleBackToShop = useBackToShop(onBackToShop);
    const [invoiceError, setInvoiceError] = React.useState(false);
    const onFail = React.useCallback(() => {
      setInvoiceError(true);
      _onFail();
    }, []);
    const [handleSubmitPayment] = useSubmitPayment({
      config,
      isCustomDomain,
      email,
      gateway,
      APM,
      customFields,
      appliedCoupon,
      hasDiscount,
      payPalEmailDelivery,
      isVisibleRegulationForm,
      isExtendedRegulationForm,
      regulationForm,
      setSending,
      onCreateInvoice,
      onShowMessage,
      onSuccess,
      onFail,
      type: 'product',
      product: productInfo,
      customerPrice,
      addons,
      quantity: productsQuantity[productInfo.uniqid],
      discordIntegrationCode: getParam('code')
    });
    const handleSetProductQuantity = React.useCallback(quantity => {
      setProductQuantity(productInfo.uniqid, quantity);
      onChangeProductQuantity(productInfo.uniqid, quantity);
    }, [onChangeProductQuantity, productInfo.uniqid, setProductQuantity]);
    let disabledPayButton = sending || !email || isVisibleRegulationForm && !isFilledRegulationForm;
    const {
      discordState
    } = useDiscordState(productQuantity, gateway, APM, step, email, payPalEmailDelivery, appliedCoupon);
    React.useEffect(() => {
      if (getParam('quantity')) {
        onChangeProductQuantity(productInfo.uniqid, productQuantity);
      }
    }, []);
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-title",
      style: {
        height: '18px'
      }
    }, TITLES[step]), step === 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      onClick: handleBackToShop,
      className: "sellix-product-back"
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fas fa-times"
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-body"
    }, step === 0 && !outOfStockMessage ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "unselectable w-100"
    }, /*#__PURE__*/React__default["default"].createElement(Quantity, {
      productInfo: productInfo,
      productQuantity: productQuantity,
      setProductQuantity: handleSetProductQuantity
    }), isPayWhatYouWant && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-form-field"
    }, /*#__PURE__*/React__default["default"].createElement("label", {
      className: "sellix-label",
      htmlFor: "pay_what_you_want_price"
    }, "Choose your price"), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "currency-title"
    }, config.CURRENCY_LIST[currency]), /*#__PURE__*/React__default["default"].createElement("input", {
      type: "text",
      className: `sellix-input has-currency ${!isCorrectCustomerPrice ? 'is-invalid' : ''}`,
      name: "pay_what_you_want_price",
      placeholder: "Choose your price",
      value: customerPrice,
      onChange: e => setCustomerPrice(e.target.value)
    }), !isCorrectCustomerPrice && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "text-left invalid-feedback"
    }, "Your price should be more than ", /*#__PURE__*/React__default["default"].createElement("b", null, parseFloat(productInfo.price) ? productInfo.price : 0.01)))), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total correct-margin-top"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Subtotal"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total-price unselectable"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, Math.sign(totalPrice) === -1 || isFree ? '' : currencyTitle), Math.sign(totalPrice) === -1 || isFree ? 'Free' : (+totalPrice).toFixed(2)))), price_discount && !isFree ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0 pt-2"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Product Discount"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, price_discount && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 14.5
      }
    }, "-", price_discount, "%"))) : null, volumeAmount && !isFree ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0 pt-2"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Volume Discount"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, volumeAmount && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 14.5
      }
    }, "-", volumeAmount))) : null, appliedCoupon && !(appliedCoupon.disabled_with_volume_discounts && hasDiscount) ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0 pt-2"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Coupon"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 13.5
      }
    }, "-", appliedCoupon.discount_type === 'FIXED' ? currencyTitle : '', +appliedCoupon.discount, appliedCoupon.discount_type !== 'FIXED' ? '%' : ''))) : null, addonsList.length && !isFree ? addonsList.map(({
      title,
      price_conversions
    }) => {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sellix-product-total mt-0 pt-2"
      }, /*#__PURE__*/React__default["default"].createElement("span", {
        className: "unselectable"
      }, title), /*#__PURE__*/React__default["default"].createElement("div", {
        className: "d-flex flex-column align-items-end",
        style: {
          color: 'var(--lightFontColor)'
        }
      }, /*#__PURE__*/React__default["default"].createElement("small", {
        style: {
          fontSize: 14.5
        }
      }, config.CURRENCY_LIST[productInfo.currency], price_conversions[productInfo.currency])));
    }) : null, productInfo.vat_percentage && !isFree && +productInfo.vat_percentage ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0 pt-2"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Tax"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 14.5
      }
    }, +productInfo.vat_percentage ? productInfo.vat_percentage : 0, "%"))) : null) : null, step === 1 && paymentOptions.length === 0 && /*#__PURE__*/React__default["default"].createElement("p", {
      className: "sellix-product-no-gateway"
    }, "This product has no payment options."), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-payment-methods"
    }, /*#__PURE__*/React__default["default"].createElement(GatewaySelector, {
      type: "product",
      config: config,
      theme: theme,
      productInfo: productInfo,
      paymentOptions: paymentOptions,
      gateway: gateway,
      APM: APM,
      setGateway: (gateway, APM) => {
        setGateway(gateway);
        setAPM(APM);
      }
    })), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React__default["default"].createElement(Form, {
      isPayPal: gateway === 'PAYPAL' || gateway === 'PAYPAL_CREDIT_CARD',
      isRegulations: isVisibleRegulationForm,
      regulationForm: regulationForm,
      isExtendedRegulationForm: isExtendedRegulationForm,
      customFieldsValues: customFields,
      config: config,
      invoiceError: invoiceError,
      setEmail: email => setEmail(email),
      setPayPalEmailDelivery: value => setPayPalEmailDelivery(value),
      onSetCustomFields: (key, value) => {
        setCustomFields({
          ...customFields,
          [key]: value
        });
        forceUpdate();
      },
      onSetRegulationForm: form => setRegulationForm(form),
      email: email,
      payPalEmailDelivery: payPalEmailDelivery,
      discordState: discordState
    })), outOfStockMessage && /*#__PURE__*/React__default["default"].createElement("p", {
      className: "text-red mt-3"
    }, outOfStockMessage), +stock !== 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-footer"
    }, step === 0 && /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(Index, {
      config: config,
      product: productInfo,
      quantity: productQuantity,
      isOutOfStock: outOfStockMessage
    }), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "mb-3 w-100",
      onClick: () => setStep(isFree ? 2 : 1),
      style: outOfStockMessage ? {
        opacity: 0.7,
        pointerEvents: 'none'
      } : {},
      disabled: !isCorrectCustomerPrice
    }, isFree ? 'Get it' : 'Buy Now'), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(Index$1, {
      cartProducts: cartProducts,
      product: productInfo,
      openAdd: openAddToCart,
      onAddToCart: onAddToCart
    }), /*#__PURE__*/React__default["default"].createElement(Coupon, {
      currency: currency,
      setCoupon: coupon => setAppliedCoupon(coupon),
      appliedCoupon: appliedCoupon,
      openCoupon: openCoupon,
      disabledWithDiscount: appliedCoupon && appliedCoupon.disabled_with_volume_discounts && hasDiscount
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-center"
    }, isFree ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-button",
      onClick: () => setOpenCoupon(!openCoupon)
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-tags"
    }), " Apply a Coupon"), isFree || outOfStockMessage || isPayWhatYouWant || !isCartEnabled || !(productInfo.stock - (fromCart || 0)) ? null : /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-button",
      onClick: () => setOpenAddToCart(!openAddToCart)
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-cart-shopping"
    }), " Add to Cart")))), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(0)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      onClick: handleGoPurchaseForm,
      style: outOfStockMessage ? {
        opacity: 0.7,
        pointerEvents: 'none'
      } : {}
    }, "Continue")), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: `justify-content-between ${options.isCaptchaV2Visible ? 'd-none' : 'd-flex'}`
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(isFree ? 0 : 1)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      disabled: disabledPayButton,
      onClick: handleSubmitPayment
    }, sending ? /*#__PURE__*/React__default["default"].createElement(Index$2, null) : null, /*#__PURE__*/React__default["default"].createElement("span", {
      style: {
        display: sending ? 'none' : 'inline'
      }
    }, "Pay"))))));
  };

  /*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   */

  /**
   * Module exports.
   * @public
   */

  var parse_1 = parse;
  var serialize_1 = serialize;

  /**
   * Module variables.
   * @private
   */

  var decode = decodeURIComponent;
  var encode = encodeURIComponent;

  /**
   * RegExp to match field-content in RFC 7230 sec 3.2
   *
   * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
   * field-vchar   = VCHAR / obs-text
   * obs-text      = %x80-FF
   */

  var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

  /**
   * Parse a cookie header.
   *
   * Parse the given cookie header string into an object
   * The object has the various cookies as keys(names) => values
   *
   * @param {string} str
   * @param {object} [options]
   * @return {object}
   * @public
   */

  function parse(str, options) {
    if (typeof str !== 'string') {
      throw new TypeError('argument str must be a string');
    }

    var obj = {};
    var opt = options || {};
    var pairs = str.split(';');
    var dec = opt.decode || decode;

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      var index = pair.indexOf('=');

      // skip things that don't look like key=value
      if (index < 0) {
        continue;
      }

      var key = pair.substring(0, index).trim();

      // only assign once
      if (undefined == obj[key]) {
        var val = pair.substring(index + 1, pair.length).trim();

        // quoted values
        if (val[0] === '"') {
          val = val.slice(1, -1);
        }

        obj[key] = tryDecode(val, dec);
      }
    }

    return obj;
  }

  /**
   * Serialize data into a cookie header.
   *
   * Serialize the a name value pair into a cookie string suitable for
   * http headers. An optional options object specified cookie parameters.
   *
   * serialize('foo', 'bar', { httpOnly: true })
   *   => "foo=bar; httpOnly"
   *
   * @param {string} name
   * @param {string} val
   * @param {object} [options]
   * @return {string}
   * @public
   */

  function serialize(name, val, options) {
    var opt = options || {};
    var enc = opt.encode || encode;

    if (typeof enc !== 'function') {
      throw new TypeError('option encode is invalid');
    }

    if (!fieldContentRegExp.test(name)) {
      throw new TypeError('argument name is invalid');
    }

    var value = enc(val);

    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError('argument val is invalid');
    }

    var str = name + '=' + value;

    if (null != opt.maxAge) {
      var maxAge = opt.maxAge - 0;

      if (isNaN(maxAge) || !isFinite(maxAge)) {
        throw new TypeError('option maxAge is invalid')
      }

      str += '; Max-Age=' + Math.floor(maxAge);
    }

    if (opt.domain) {
      if (!fieldContentRegExp.test(opt.domain)) {
        throw new TypeError('option domain is invalid');
      }

      str += '; Domain=' + opt.domain;
    }

    if (opt.path) {
      if (!fieldContentRegExp.test(opt.path)) {
        throw new TypeError('option path is invalid');
      }

      str += '; Path=' + opt.path;
    }

    if (opt.expires) {
      if (typeof opt.expires.toUTCString !== 'function') {
        throw new TypeError('option expires is invalid');
      }

      str += '; Expires=' + opt.expires.toUTCString();
    }

    if (opt.httpOnly) {
      str += '; HttpOnly';
    }

    if (opt.secure) {
      str += '; Secure';
    }

    if (opt.sameSite) {
      var sameSite = typeof opt.sameSite === 'string'
        ? opt.sameSite.toLowerCase() : opt.sameSite;

      switch (sameSite) {
        case true:
          str += '; SameSite=Strict';
          break;
        case 'lax':
          str += '; SameSite=Lax';
          break;
        case 'strict':
          str += '; SameSite=Strict';
          break;
        case 'none':
          str += '; SameSite=None';
          break;
        default:
          throw new TypeError('option sameSite is invalid');
      }
    }

    return str;
  }

  /**
   * Try decoding a string using a decoding function.
   *
   * @param {string} str
   * @param {function} decode
   * @private
   */

  function tryDecode(str, decode) {
    try {
      return decode(str);
    } catch (e) {
      return str;
    }
  }

  function hasDocumentCookie() {
      // Can we get/set cookies on document.cookie?
      return typeof document === 'object' && typeof document.cookie === 'string';
  }
  function parseCookies(cookies, options) {
      if (typeof cookies === 'string') {
          return parse_1(cookies, options);
      }
      else if (typeof cookies === 'object' && cookies !== null) {
          return cookies;
      }
      else {
          return {};
      }
  }
  function isParsingCookie(value, doNotParse) {
      if (typeof doNotParse === 'undefined') {
          // We guess if the cookie start with { or [, it has been serialized
          doNotParse =
              !value || (value[0] !== '{' && value[0] !== '[' && value[0] !== '"');
      }
      return !doNotParse;
  }
  function readCookie(value, options) {
      if (options === void 0) { options = {}; }
      var cleanValue = cleanupCookieValue(value);
      if (isParsingCookie(cleanValue, options.doNotParse)) {
          try {
              return JSON.parse(cleanValue);
          }
          catch (e) {
              // At least we tried
          }
      }
      // Ignore clean value if we failed the deserialization
      // It is not relevant anymore to trim those values
      return value;
  }
  function cleanupCookieValue(value) {
      // express prepend j: before serializing a cookie
      if (value && value[0] === 'j' && value[1] === ':') {
          return value.substr(2);
      }
      return value;
  }

  var __assign = (undefined && undefined.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  var Cookies = /** @class */ (function () {
      function Cookies(cookies, options) {
          var _this = this;
          this.changeListeners = [];
          this.HAS_DOCUMENT_COOKIE = false;
          this.cookies = parseCookies(cookies, options);
          new Promise(function () {
              _this.HAS_DOCUMENT_COOKIE = hasDocumentCookie();
          }).catch(function () { });
      }
      Cookies.prototype._updateBrowserValues = function (parseOptions) {
          if (!this.HAS_DOCUMENT_COOKIE) {
              return;
          }
          this.cookies = parse_1(document.cookie, parseOptions);
      };
      Cookies.prototype._emitChange = function (params) {
          for (var i = 0; i < this.changeListeners.length; ++i) {
              this.changeListeners[i](params);
          }
      };
      Cookies.prototype.get = function (name, options, parseOptions) {
          if (options === void 0) { options = {}; }
          this._updateBrowserValues(parseOptions);
          return readCookie(this.cookies[name], options);
      };
      Cookies.prototype.getAll = function (options, parseOptions) {
          if (options === void 0) { options = {}; }
          this._updateBrowserValues(parseOptions);
          var result = {};
          for (var name_1 in this.cookies) {
              result[name_1] = readCookie(this.cookies[name_1], options);
          }
          return result;
      };
      Cookies.prototype.set = function (name, value, options) {
          var _a;
          if (typeof value === 'object') {
              value = JSON.stringify(value);
          }
          this.cookies = __assign(__assign({}, this.cookies), (_a = {}, _a[name] = value, _a));
          if (this.HAS_DOCUMENT_COOKIE) {
              document.cookie = serialize_1(name, value, options);
          }
          this._emitChange({ name: name, value: value, options: options });
      };
      Cookies.prototype.remove = function (name, options) {
          var finalOptions = (options = __assign(__assign({}, options), { expires: new Date(1970, 1, 1, 0, 0, 1), maxAge: 0 }));
          this.cookies = __assign({}, this.cookies);
          delete this.cookies[name];
          if (this.HAS_DOCUMENT_COOKIE) {
              document.cookie = serialize_1(name, '', finalOptions);
          }
          this._emitChange({ name: name, value: undefined, options: options });
      };
      Cookies.prototype.addChangeListener = function (callback) {
          this.changeListeners.push(callback);
      };
      Cookies.prototype.removeChangeListener = function (callback) {
          var idx = this.changeListeners.indexOf(callback);
          if (idx >= 0) {
              this.changeListeners.splice(idx, 1);
          }
      };
      return Cookies;
  }());

  function getTopDomain() {
    let topDomain = 'local-test-sellix.com';
    if (window.location.hostname.includes('sellix.gg')) {
      topDomain = 'sellix.gg';
    } else if (window.location.hostname.includes('mysellix.io')) {
      topDomain = 'mysellix.io';
    } else if (window.location.hostname.includes('sellix.io')) {
      topDomain = 'sellix.io';
    }
    return topDomain;
  }
  function useCustomerAuthCookies() {
    const cookies = React.useMemo(() => new Cookies(), []);
    let setCookies = React.useCallback((data, name = 'customerToken') => {
      let options = {
        path: '/',
        expires: new Date(new Date().getFullYear() + 1, 1, 1, 1, 1, 1, 0),
        sameSite: 'lax',
        secure: !window.location.hostname.includes('local-test-sellix.com')
      };
      const topDomain = getTopDomain();
      const domains = [`.customer-portal.${topDomain}`, window.location.hostname];
      domains.forEach(domain => {
        cookies.set(name, data, {
          domain,
          ...options
        });
      });
    }, [cookies]);
    let removeCookies = React.useCallback((name = 'customerToken') => {
      let options = {
        path: '/',
        expires: new Date(2000, 1, 1, 1, 1, 1, 0),
        sameSite: 'lax',
        secure: false
      };
      const topDomain = getTopDomain();
      const domains = [`.customer-portal.${topDomain}`, window.location.hostname];
      domains.forEach(domain => {
        cookies.set(name, '', {
          domain,
          ...options
        });
      });
    }, [cookies]);
    return {
      setCookies,
      removeCookies
    };
  }

  /*!
   * Adapted from jQuery UI core
   *
   * http://jqueryui.com
   *
   * Copyright 2014 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   * http://api.jqueryui.com/category/ui-core/
   */

  const tabbableNode = /input|select|textarea|button|object|iframe/;
  function hidesContents(element) {
    const zeroSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

    // If the node is empty, this is good enough
    if (zeroSize && !element.innerHTML) return true;
    try {
      // Otherwise we need to check some styles
      const style = window.getComputedStyle(element);
      return zeroSize ? style.getPropertyValue('overflow') !== 'visible' ||
      // if 'overflow: visible' set, check if there is actually any overflow
      element.scrollWidth <= 0 && element.scrollHeight <= 0 : style.getPropertyValue('display') == 'none';
    } catch (exception) {
      // eslint-disable-next-line no-console
      console.warn('Failed to inspect element style');
      return false;
    }
  }
  function visible(element) {
    let parentElement = element;
    let rootNode = element.getRootNode && element.getRootNode();
    while (parentElement) {
      if (parentElement === document.body) break;

      // if we are not hidden yet, skip to checking outside the Web Component
      if (rootNode && parentElement === rootNode) parentElement = rootNode.host.parentNode;
      if (hidesContents(parentElement)) return false;
      parentElement = parentElement.parentNode;
    }
    return true;
  }
  function focusable(element, isTabIndexNotNaN) {
    const nodeName = element.nodeName.toLowerCase();
    const res = tabbableNode.test(nodeName) && !element.disabled || (nodeName === 'a' ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
    return res && visible(element);
  }
  function tabbable(element) {
    let tabIndex = element.getAttribute('tabindex');
    if (tabIndex === null) tabIndex = undefined;
    const isTabIndexNaN = isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
  }
  function findTabbableDescendants(element) {
    const descendants = [].slice.call(element.querySelectorAll('*'), 0).reduce((finished, el) => finished.concat(!el.shadowRoot ? [el] : findTabbableDescendants(el.shadowRoot)), []);
    return descendants.filter(tabbable);
  }

  let focusLaterElements = [];
  let modalElement = null;
  let needToFocus = false;

  /* eslint-enable no-console */

  function handleBlur() {
    needToFocus = true;
  }
  function handleFocus() {
    if (needToFocus) {
      needToFocus = false;
      if (!modalElement) {
        return;
      }
      // need to see how jQuery shims document.on('focusin') so we don't need the
      // setTimeout, firefox doesn't support focusin, if it did, we could focus
      // the element outside of a setTimeout. Side-effect of this implementation
      // is that the document.body gets focus, and then we focus our element right
      // after, seems fine.
      setTimeout(() => {
        if (modalElement.contains(document.activeElement)) {
          return;
        }
        const el = findTabbableDescendants(modalElement)[0] || modalElement;
        el.focus();
      }, 0);
    }
  }
  function markForFocusLater() {
    focusLaterElements.push(document.activeElement);
  }

  /* eslint-disable no-console */
  function returnFocus(preventScroll = false) {
    let toFocus = null;
    try {
      if (focusLaterElements.length !== 0) {
        toFocus = focusLaterElements.pop();
        toFocus.focus({
          preventScroll
        });
      }
      return;
    } catch (e) {
      console.warn(['You tried to return focus to', toFocus, 'but it is not in the DOM anymore'].join(' '));
    }
  }

  /* eslint-enable no-console */

  function popWithoutFocus() {
    focusLaterElements.length > 0 && focusLaterElements.pop();
  }
  function setupScopedFocus(element) {
    modalElement = element;
    if (window.addEventListener) {
      window.addEventListener('blur', handleBlur, false);
      document.addEventListener('focus', handleFocus, true);
    } else {
      window.attachEvent('onBlur', handleBlur);
      document.attachEvent('onFocus', handleFocus);
    }
  }
  function teardownScopedFocus() {
    modalElement = null;
    if (window.addEventListener) {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('focus', handleFocus);
    } else {
      window.detachEvent('onBlur', handleBlur);
      document.detachEvent('onFocus', handleFocus);
    }
  }

  function getActiveElement(el = document) {
    return el.activeElement.shadowRoot ? getActiveElement(el.activeElement.shadowRoot) : el.activeElement;
  }
  function scopeTab(node, event) {
    const tabbable = findTabbableDescendants(node);
    if (!tabbable.length) {
      // Do nothing, since there are no elements that can receive focus.
      event.preventDefault();
      return;
    }
    let target;
    const shiftKey = event.shiftKey;
    const head = tabbable[0];
    const tail = tabbable[tabbable.length - 1];
    const activeElement = getActiveElement();

    // proceed with default browser behavior on tab.
    // Focus on last element on shift + tab.
    if (node === activeElement) {
      if (!shiftKey) return;
      target = tail;
    }
    if (tail === activeElement && !shiftKey) {
      target = head;
    }
    if (head === activeElement && shiftKey) {
      target = tail;
    }
    if (target) {
      event.preventDefault();
      target.focus();
      return;
    }

    // Safari radio issue.
    //
    // Safari does not move the focus to the radio button,
    // so we need to force it to really walk through all elements.
    //
    // This is very error prone, since we are trying to guess
    // if it is a safari browser from the first occurence between
    // chrome or safari.
    //
    // The chrome user agent contains the first ocurrence
    // as the 'chrome/version' and later the 'safari/version'.
    const checkSafari = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);
    const isSafariDesktop = checkSafari != null && checkSafari[1] != 'Chrome' && /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;

    // If we are not in safari desktop, let the browser control
    // the focus
    if (!isSafariDesktop) return;
    var x = tabbable.indexOf(activeElement);
    if (x > -1) {
      x += shiftKey ? -1 : 1;
    }
    target = tabbable[x];

    // If the tabbable element does not exist,
    // focus head/tail based on shiftKey
    if (typeof target === 'undefined') {
      event.preventDefault();
      target = shiftKey ? tail : head;
      target.focus();
      return;
    }
    event.preventDefault();
    target.focus();
  }

  var canUseDOM$1 = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
  var ExecutionEnvironment = {
    canUseDOM: canUseDOM$1,
    canUseWorkers: typeof Worker !== 'undefined',
    canUseEventListeners: canUseDOM$1 && !!(window.addEventListener || window.attachEvent),
    canUseViewport: canUseDOM$1 && !!window.screen
  };

  const EE = ExecutionEnvironment;
  const canUseDOM = EE.canUseDOM;

  // import warning from "warning";
  let globalElement = null;

  /* eslint-enable no-console */

  function assertNodeList(nodeList, selector) {
    if (!nodeList || !nodeList.length) {
      throw new Error(`react-modal: No elements were found for selector ${selector}.`);
    }
  }
  function setElement(element) {
    let useElement = element;
    if (typeof useElement === 'string' && canUseDOM) {
      const el = document.querySelectorAll(useElement);
      assertNodeList(el, useElement);
      useElement = el;
    }
    globalElement = useElement || globalElement;
    return globalElement;
  }
  function validateElement(appElement) {
    const el = appElement || globalElement;
    if (el) {
      return Array.isArray(el) || el instanceof HTMLCollection || el instanceof NodeList ? el : [el];
    } else {
      throw Error(['react-modal: App element is not defined.', 'Please use `Modal.setAppElement(el)` or set `appElement={el}`.', 'This is needed so screen readers don\'t see main content', 'when modal is opened. It is not recommended, but you can opt-out', 'by setting `ariaHideApp={false}`.'].join(' '));
    }
  }
  function hide(appElement) {
    for (let el of validateElement(appElement)) {
      el.setAttribute('aria-hidden', 'true');
    }
  }
  function show(appElement) {
    for (let el of validateElement(appElement)) {
      el.removeAttribute('aria-hidden');
    }
  }

  let htmlClassList = {};
  let docBodyClassList = {};

  /* eslint-enable no-console */

  /**
   * Track the number of reference of a class.
   * @param {object} poll The poll to receive the reference.
   * @param {string} className The class name.
   * @return {string}
   */
  const incrementReference = (poll, className) => {
    if (!poll[className]) {
      poll[className] = 0;
    }
    poll[className] += 1;
    return className;
  };

  /**
   * Drop the reference of a class.
   * @param {object} poll The poll to receive the reference.
   * @param {string} className The class name.
   * @return {string}
   */
  const decrementReference = (poll, className) => {
    if (poll[className]) {
      poll[className] -= 1;
    }
    return className;
  };

  /**
   * Track a class and add to the given class list.
   * @param {Object} classListRef A class list of an element.
   * @param {Object} poll         The poll to be used.
   * @param {Array}  classes      The list of classes to be tracked.
   */
  const trackClass = (classListRef, poll, classes) => {
    classes.forEach(className => {
      incrementReference(poll, className);
      classListRef.add(className);
    });
  };

  /**
   * Untrack a class and remove from the given class list if the reference
   * reaches 0.
   * @param {Object} classListRef A class list of an element.
   * @param {Object} poll         The poll to be used.
   * @param {Array}  classes      The list of classes to be untracked.
   */
  const untrackClass = (classListRef, poll, classes) => {
    classes.forEach(className => {
      decrementReference(poll, className);
      poll[className] === 0 && classListRef.remove(className);
    });
  };

  /**
   * Public inferface to add classes to the document.body.
   * @param {string} bodyClass The class string to be added.
   *                           It may contain more then one class
   *                           with ' ' as separator.
   */
  const add = (element, classString) => trackClass(element.classList, element.nodeName.toLowerCase() == 'html' ? htmlClassList : docBodyClassList, classString.split(' '));

  /**
   * Public inferface to remove classes from the document.body.
   * @param {string} bodyClass The class string to be added.
   *                           It may contain more then one class
   *                           with ' ' as separator.
   */
  const remove = (element, classString) => untrackClass(element.classList, element.nodeName.toLowerCase() == 'html' ? htmlClassList : docBodyClassList, classString.split(' '));

  // Tracks portals that are open and emits events to subscribers

  class PortalOpenInstances {
    constructor() {
      this.openInstances = [];
      this.subscribers = [];
    }
    register = openInstance => {
      if (this.openInstances.indexOf(openInstance) !== -1) {
        // if ("production" !== "production") {
        //     // eslint-disable-next-line no-console
        //     console.warn(
        //         `React-Modal: Cannot register modal instance that's already open`
        //     );
        // }
        return;
      }
      this.openInstances.push(openInstance);
      this.emit('register');
    };
    deregister = openInstance => {
      const index = this.openInstances.indexOf(openInstance);
      if (index === -1) {
        // if ("production" !== "production") {
        //     // eslint-disable-next-line no-console
        //     console.warn(
        //         `React-Modal: Unable to deregister ${openInstance} as ` +
        //         `it was never registered`
        //     );
        // }
        return;
      }
      this.openInstances.splice(index, 1);
      this.emit('deregister');
    };
    subscribe = callback => {
      this.subscribers.push(callback);
    };
    emit = eventType => {
      this.subscribers.forEach(subscriber => subscriber(eventType,
      // shallow copy to avoid accidental mutation
      this.openInstances.slice()));
    };
  }
  let portalOpenInstances = new PortalOpenInstances();

  // Body focus trap see Issue #742

  let before,
    after,
    instances = [];

  /* eslint-enable no-console */

  function focusContent() {
    if (instances.length === 0) {
      // if ("production" !== "production") {
      //     // eslint-disable-next-line no-console
      //     console.warn(`React-Modal: Open instances > 0 expected`);
      // }
      return;
    }
    instances[instances.length - 1].focusContent();
  }
  function bodyTrap(eventType, openInstances) {
    if (!before && !after) {
      before = document.createElement('div');
      before.setAttribute('data-react-modal-body-trap', '');
      before.style.position = 'absolute';
      before.style.opacity = '0';
      before.setAttribute('tabindex', '0');
      before.addEventListener('focus', focusContent);
      after = before.cloneNode();
      after.addEventListener('focus', focusContent);
    }
    instances = openInstances;
    if (instances.length > 0) {
      // Add focus trap
      if (document.body.firstChild !== before) {
        document.body.insertBefore(before, document.body.firstChild);
      }
      if (document.body.lastChild !== after) {
        document.body.appendChild(after);
      }
    } else {
      // Remove focus trap
      if (before.parentElement) {
        before.parentElement.removeChild(before);
      }
      if (after.parentElement) {
        after.parentElement.removeChild(after);
      }
    }
  }
  portalOpenInstances.subscribe(bodyTrap);

  // so that our CSS is statically analyzable
  const CLASS_NAMES = {
    overlay: 'ReactModal__Overlay',
    content: 'ReactModal__Content'
  };
  const TAB_KEY = 9;
  const ESC_KEY = 27;
  let ariaHiddenInstances = 0;
  class ModalPortal extends React.Component {
    static defaultProps = {
      style: {
        overlay: {},
        content: {}
      },
      defaultStyles: {}
    };

    // static propTypes = {
    //     isOpen: PropTypes.bool.isRequired,
    //     defaultStyles: PropTypes.shape({
    //         content: PropTypes.object,
    //         overlay: PropTypes.object
    //     }),
    //     style: PropTypes.shape({
    //         content: PropTypes.object,
    //         overlay: PropTypes.object
    //     }),
    //     className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    //     overlayClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    //     bodyOpenClassName: PropTypes.string,
    //     htmlOpenClassName: PropTypes.string,
    //     ariaHideApp: PropTypes.bool,
    //     appElement: PropTypes.oneOfType([
    //         PropTypes.instanceOf(SafeHTMLElement),
    //         PropTypes.instanceOf(SafeHTMLCollection),
    //         PropTypes.instanceOf(SafeNodeList),
    //         PropTypes.arrayOf(PropTypes.instanceOf(SafeHTMLElement))
    //     ]),
    //     onAfterOpen: PropTypes.func,
    //     onAfterClose: PropTypes.func,
    //     onRequestClose: PropTypes.func,
    //     closeTimeoutMS: PropTypes.number,
    //     shouldFocusAfterRender: PropTypes.bool,
    //     shouldCloseOnOverlayClick: PropTypes.bool,
    //     shouldReturnFocusAfterClose: PropTypes.bool,
    //     preventScroll: PropTypes.bool,
    //     role: PropTypes.string,
    //     contentLabel: PropTypes.string,
    //     aria: PropTypes.object,
    //     data: PropTypes.object,
    //     children: PropTypes.node,
    //     shouldCloseOnEsc: PropTypes.bool,
    //     overlayRef: PropTypes.func,
    //     contentRef: PropTypes.func,
    //     id: PropTypes.string,
    //     overlayElement: PropTypes.func,
    //     contentElement: PropTypes.func,
    //     testId: PropTypes.string
    // };

    constructor(props) {
      super(props);
      this.state = {
        afterOpen: false,
        beforeClose: false
      };
      this.shouldClose = null;
      this.moveFromContentToOverlay = null;
    }
    componentDidMount() {
      if (this.props.isOpen) {
        this.open();
      }
    }
    componentDidUpdate(prevProps, prevState) {
      // if ("production" !== "production") {
      //     if (prevProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
      //         // eslint-disable-next-line no-console
      //         console.warn(
      //             'React-Modal: "bodyOpenClassName" prop has been modified. ' +
      //             "This may cause unexpected behavior when multiple modals are open."
      //         );
      //     }
      //     if (prevProps.htmlOpenClassName !== this.props.htmlOpenClassName) {
      //         // eslint-disable-next-line no-console
      //         console.warn(
      //             'React-Modal: "htmlOpenClassName" prop has been modified. ' +
      //             "This may cause unexpected behavior when multiple modals are open."
      //         );
      //     }
      // }

      if (this.props.isOpen && !prevProps.isOpen) {
        this.open();
      } else if (!this.props.isOpen && prevProps.isOpen) {
        this.close();
      }

      // Focus only needs to be set once when the modal is being opened
      if (this.props.shouldFocusAfterRender && this.state.isOpen && !prevState.isOpen) {
        this.focusContent();
      }
    }
    componentWillUnmount() {
      if (this.state.isOpen) {
        this.afterClose();
      }
      clearTimeout(this.closeTimer);
      cancelAnimationFrame(this.openAnimationFrame);
    }
    setOverlayRef = overlay => {
      this.overlay = overlay;
      this.props.overlayRef && this.props.overlayRef(overlay);
    };
    setContentRef = content => {
      this.content = content;
      this.props.contentRef && this.props.contentRef(content);
    };
    beforeOpen() {
      const {
        appElement,
        ariaHideApp,
        htmlOpenClassName,
        bodyOpenClassName
      } = this.props;

      // Add classes.
      bodyOpenClassName && add(document.body, bodyOpenClassName);
      htmlOpenClassName && add(document.getElementsByTagName('html')[0], htmlOpenClassName);
      if (ariaHideApp) {
        ariaHiddenInstances += 1;
        hide(appElement);
      }
      portalOpenInstances.register(this);
    }
    afterClose = () => {
      const {
        appElement,
        ariaHideApp,
        htmlOpenClassName,
        bodyOpenClassName
      } = this.props;

      // Remove classes.
      bodyOpenClassName && remove(document.body, bodyOpenClassName);
      htmlOpenClassName && remove(document.getElementsByTagName('html')[0], htmlOpenClassName);

      // Reset aria-hidden attribute if all modals have been removed
      if (ariaHideApp && ariaHiddenInstances > 0) {
        ariaHiddenInstances -= 1;
        if (ariaHiddenInstances === 0) {
          show(appElement);
        }
      }
      if (this.props.shouldFocusAfterRender) {
        if (this.props.shouldReturnFocusAfterClose) {
          returnFocus(this.props.preventScroll);
          teardownScopedFocus();
        } else {
          popWithoutFocus();
        }
      }
      if (this.props.onAfterClose) {
        this.props.onAfterClose();
      }
      portalOpenInstances.deregister(this);
    };
    open = () => {
      this.beforeOpen();
      if (this.state.afterOpen && this.state.beforeClose) {
        clearTimeout(this.closeTimer);
        this.setState({
          beforeClose: false
        });
      } else {
        if (this.props.shouldFocusAfterRender) {
          setupScopedFocus(this.node);
          markForFocusLater();
        }
        this.setState({
          isOpen: true
        }, () => {
          this.openAnimationFrame = requestAnimationFrame(() => {
            this.setState({
              afterOpen: true
            });
            if (this.props.isOpen && this.props.onAfterOpen) {
              this.props.onAfterOpen({
                overlayEl: this.overlay,
                contentEl: this.content
              });
            }
          });
        });
      }
    };
    close = () => {
      if (this.props.closeTimeoutMS > 0) {
        this.closeWithTimeout();
      } else {
        this.closeWithoutTimeout();
      }
    };

    // Don't steal focus from inner elements
    focusContent = () => this.content && !this.contentHasFocus() && this.content.focus({
      preventScroll: true
    });
    closeWithTimeout = () => {
      const closesAt = Date.now() + this.props.closeTimeoutMS;
      this.setState({
        beforeClose: true,
        closesAt
      }, () => {
        this.closeTimer = setTimeout(this.closeWithoutTimeout, this.state.closesAt - Date.now());
      });
    };
    closeWithoutTimeout = () => {
      this.setState({
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      }, this.afterClose);
    };
    handleKeyDown = event => {
      if (event.keyCode === TAB_KEY) {
        scopeTab(this.content, event);
      }
      if (this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
        event.stopPropagation();
        this.requestClose(event);
      }
    };
    handleOverlayOnClick = event => {
      if (this.shouldClose === null) {
        this.shouldClose = true;
      }
      if (this.shouldClose && this.props.shouldCloseOnOverlayClick) {
        if (this.ownerHandlesClose()) {
          this.requestClose(event);
        } else {
          this.focusContent();
        }
      }
      this.shouldClose = null;
    };
    handleContentOnMouseUp = () => {
      this.shouldClose = false;
    };
    handleOverlayOnMouseDown = event => {
      if (!this.props.shouldCloseOnOverlayClick && event.target == this.overlay) {
        event.preventDefault();
      }
    };
    handleContentOnClick = () => {
      this.shouldClose = false;
    };
    handleContentOnMouseDown = () => {
      this.shouldClose = false;
    };
    requestClose = event => this.ownerHandlesClose() && this.props.onRequestClose(event);
    ownerHandlesClose = () => this.props.onRequestClose;
    shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;
    contentHasFocus = () => document.activeElement === this.content || this.content.contains(document.activeElement);
    buildClassName = (which, additional) => {
      const classNames = typeof additional === 'object' ? additional : {
        base: CLASS_NAMES[which],
        afterOpen: `${CLASS_NAMES[which]}--after-open`,
        beforeClose: `${CLASS_NAMES[which]}--before-close`
      };
      let className = classNames.base;
      if (this.state.afterOpen) {
        className = `${className} ${classNames.afterOpen}`;
      }
      if (this.state.beforeClose) {
        className = `${className} ${classNames.beforeClose}`;
      }
      return typeof additional === 'string' && additional ? `${className} ${additional}` : className;
    };
    attributesFromObject = (prefix, items) => Object.keys(items).reduce((acc, name) => {
      acc[`${prefix}-${name}`] = items[name];
      return acc;
    }, {});
    render() {
      const {
        id,
        className,
        overlayClassName,
        defaultStyles,
        children
      } = this.props;
      const contentStyles = className ? {} : defaultStyles.content;
      const overlayStyles = overlayClassName ? {} : defaultStyles.overlay;
      if (this.shouldBeClosed()) {
        return null;
      }
      const overlayProps = {
        ref: this.setOverlayRef,
        className: this.buildClassName('overlay', overlayClassName),
        style: {
          ...overlayStyles,
          ...this.props.style.overlay
        },
        onClick: this.handleOverlayOnClick,
        onMouseDown: this.handleOverlayOnMouseDown
      };
      const contentProps = {
        id,
        ref: this.setContentRef,
        style: {
          ...contentStyles,
          ...this.props.style.content
        },
        className: this.buildClassName('content', className),
        tabIndex: '-1',
        onKeyDown: this.handleKeyDown,
        onMouseDown: this.handleContentOnMouseDown,
        onMouseUp: this.handleContentOnMouseUp,
        onClick: this.handleContentOnClick,
        role: this.props.role,
        'aria-label': this.props.contentLabel,
        ...this.attributesFromObject('aria', {
          modal: true,
          ...this.props.aria
        }),
        ...this.attributesFromObject('data', this.props.data || {}),
        'data-testid': this.props.testId
      };
      const contentElement = this.props.contentElement(contentProps, children);
      return this.props.overlayElement(overlayProps, contentElement);
    }
  }

  const portalClassName = 'ReactModalPortal';
  const bodyOpenClassName = 'ReactModal__Body--open';
  const isReact16 = canUseDOM && ReactDOM__default["default"].createPortal !== undefined;
  let createHTMLElement = name => document.createElement(name);
  const getCreatePortal = () => isReact16 ? ReactDOM__default["default"].createPortal : ReactDOM__default["default"].unstable_renderSubtreeIntoContainer;
  function getParentElement(parentSelector) {
    return parentSelector();
  }
  class Modal extends React.Component {
    static defaultProps = {
      isOpen: false,
      portalClassName,
      bodyOpenClassName,
      role: 'dialog',
      ariaHideApp: true,
      closeTimeoutMS: 0,
      shouldFocusAfterRender: true,
      shouldCloseOnEsc: true,
      shouldCloseOnOverlayClick: true,
      shouldReturnFocusAfterClose: true,
      preventScroll: false,
      parentSelector: () => document.body,
      overlayElement: (props, contentEl) => /*#__PURE__*/React__default["default"].createElement("div", props, contentEl),
      contentElement: (props, children) => /*#__PURE__*/React__default["default"].createElement("div", props, children)
    };

    /* eslint-disable react/no-unused-prop-types */
    // static propTypes = {
    //     isOpen: PropTypes.bool.isRequired,
    //     style: PropTypes.shape({
    //         content: PropTypes.object,
    //         overlay: PropTypes.object
    //     }),
    //     portalClassName: PropTypes.string,
    //     bodyOpenClassName: PropTypes.string,
    //     htmlOpenClassName: PropTypes.string,
    //     className: PropTypes.oneOfType([
    //         PropTypes.string,
    //         PropTypes.shape({
    //             base: PropTypes.string.isRequired,
    //             afterOpen: PropTypes.string.isRequired,
    //             beforeClose: PropTypes.string.isRequired
    //         })
    //     ]),
    //     overlayClassName: PropTypes.oneOfType([
    //         PropTypes.string,
    //         PropTypes.shape({
    //             base: PropTypes.string.isRequired,
    //             afterOpen: PropTypes.string.isRequired,
    //             beforeClose: PropTypes.string.isRequired
    //         })
    //     ]),
    //     appElement: PropTypes.oneOfType([
    //         PropTypes.instanceOf(SafeHTMLElement),
    //         PropTypes.instanceOf(SafeHTMLCollection),
    //         PropTypes.instanceOf(SafeNodeList),
    //         PropTypes.arrayOf(PropTypes.instanceOf(SafeHTMLElement))
    //     ]),
    //     onAfterOpen: PropTypes.func,
    //     onRequestClose: PropTypes.func,
    //     closeTimeoutMS: PropTypes.number,
    //     ariaHideApp: PropTypes.bool,
    //     shouldFocusAfterRender: PropTypes.bool,
    //     shouldCloseOnOverlayClick: PropTypes.bool,
    //     shouldReturnFocusAfterClose: PropTypes.bool,
    //     preventScroll: PropTypes.bool,
    //     parentSelector: PropTypes.func,
    //     aria: PropTypes.object,
    //     data: PropTypes.object,
    //     role: PropTypes.string,
    //     contentLabel: PropTypes.string,
    //     shouldCloseOnEsc: PropTypes.bool,
    //     overlayRef: PropTypes.func,
    //     contentRef: PropTypes.func,
    //     id: PropTypes.string,
    //     overlayElement: PropTypes.func,
    //     contentElement: PropTypes.func
    // };
    /* eslint-enable react/no-unused-prop-types */
    static defaultStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
      },
      content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px'
      }
    };
    static setAppElement(element) {
      setElement(element);
    }
    componentDidMount() {
      if (!canUseDOM) return;
      if (!isReact16) {
        this.node = createHTMLElement('div');
      }
      this.node.className = this.props.portalClassName;
      const parent = getParentElement(this.props.parentSelector);
      parent.appendChild(this.node);
      !isReact16 && this.renderPortal(this.props);
    }
    getSnapshotBeforeUpdate(prevProps) {
      const prevParent = getParentElement(prevProps.parentSelector);
      const nextParent = getParentElement(this.props.parentSelector);
      return {
        prevParent,
        nextParent
      };
    }
    componentDidUpdate(prevProps, _, snapshot) {
      if (!canUseDOM) return;
      const {
        isOpen,
        portalClassName
      } = this.props;
      if (prevProps.portalClassName !== portalClassName) {
        this.node.className = portalClassName;
      }
      const {
        prevParent,
        nextParent
      } = snapshot;
      if (nextParent !== prevParent) {
        prevParent.removeChild(this.node);
        nextParent.appendChild(this.node);
      }

      // Stop unnecessary renders if modal is remaining closed
      if (!prevProps.isOpen && !isOpen) return;
      !isReact16 && this.renderPortal(this.props);
    }
    componentWillUnmount() {
      if (!canUseDOM || !this.node || !this.portal) return;
      const state = this.portal.state;
      const now = Date.now();
      const closesAt = state.isOpen && this.props.closeTimeoutMS && (state.closesAt || now + this.props.closeTimeoutMS);
      if (closesAt) {
        if (!state.beforeClose) {
          this.portal.closeWithTimeout();
        }
        setTimeout(this.removePortal, closesAt - now);
      } else {
        this.removePortal();
      }
    }
    removePortal = () => {
      !isReact16 && ReactDOM__default["default"].unmountComponentAtNode(this.node);
      const parent = getParentElement(this.props.parentSelector);
      if (parent && parent.contains(this.node)) {
        parent.removeChild(this.node);
      } else {
        // eslint-disable-next-line no-console
        console.warn('React-Modal: "parentSelector" prop did not returned any DOM ' + 'element. Make sure that the parent element is unmounted to ' + 'avoid any memory leaks.');
      }
    };
    portalRef = ref => {
      this.portal = ref;
    };
    renderPortal = props => {
      const createPortal = getCreatePortal();
      const portal = createPortal(this, /*#__PURE__*/React__default["default"].createElement(ModalPortal, _extends({
        defaultStyles: Modal.defaultStyles
      }, props)), this.node);
      this.portalRef(portal);
    };
    render() {
      if (!canUseDOM || !isReact16) {
        return null;
      }
      if (!this.node && isReact16) {
        this.node = createHTMLElement('div');
      }
      const createPortal = getCreatePortal();
      return createPortal( /*#__PURE__*/React__default["default"].createElement(ModalPortal, _extends({
        ref: this.portalRef,
        defaultStyles: Modal.defaultStyles
      }, this.props)), this.node);
    }
  }

  var css_248z$7 = "";
  styleInject(css_248z$7);

  Modal.setAppElement("#modal");

  var css_248z$6 = "";
  styleInject(css_248z$6);

  var css_248z$5 = "";
  styleInject(css_248z$5);

  var css_248z$4 = "";
  styleInject(css_248z$4);

  var css_248z$3 = "";
  styleInject(css_248z$3);

  var css_248z$2 = "";
  styleInject(css_248z$2);

  var css_248z$1 = "";
  styleInject(css_248z$1);

  const AlertSuccess = () => {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sw-container"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sw",
      style: {
        width: 140,
        top: '-.75rem',
        backgroundColor: 'transparent'
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sw-icon-success"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "elem-1"
    }), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "elem-2"
    }), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "elem-3"
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "elem-4"
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "elem-5"
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "elem-6"
    }))));
  };

  var css_248z = "";
  styleInject(css_248z);

  const Success = ({
    invoice,
    isTrial,
    isSubscription
  }) => {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-delivery-success"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-delivery-success-header"
    }, /*#__PURE__*/React__default["default"].createElement(AlertSuccess, null), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-delivery-success-title"
    }, (invoice ? !!+invoice.developer_invoice : false) ? 'Payment Completed' : isTrial ? 'Trial Start' : isSubscription ? 'Subscription Started' : 'Order completed!')), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-delivery-success-info"
    }, (invoice ? !!+invoice.developer_invoice : false) ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Your invoice has been paid.", /*#__PURE__*/React__default["default"].createElement("br", null), "We will send a confirmation email to your address and you will be redirected to the seller's website") : isTrial ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Your trial has been started. ", /*#__PURE__*/React__default["default"].createElement("br", null), "You will receive the product within minutes, check your email!") : isSubscription ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Your subscription is now active. ", /*#__PURE__*/React__default["default"].createElement("br", null), "You will receive an email with the confirmation of your purchase and a receipt soon.") : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, "Your invoice has been paid. ", /*#__PURE__*/React__default["default"].createElement("br", null), "You will receive the product within minutes, check your email!")));
  };

  const SubscriptionPurchase = ({
    hasDiscount,
    productDiscounts,
    appliedCoupon,
    setAppliedCoupon,
    currency
  }) => {
    const {
      config,
      theme,
      isCustomDomain,
      productInfo,
      addons,
      onCreateInvoice,
      onCreateInvoiceTrial,
      onBackToShop,
      onShowMessage,
      onCustomerAuthEmail,
      onCustomerAuthCode,
      onChangeStep,
      onSuccess,
      onFail: _onFail
    } = usePurchaseDetailsContext();
    const qs = {};
    window.location.search.replace('?', '').split('&').forEach(e => {
      qs[e.split(/=(.*)/s)[0]] = e.split(/=(.*)/s)[1];
    });
    const {
      price_display,
      paymentOptions = []
    } = productInfo;
    const currencyTitle = config.CURRENCY_LIST[currency];
    const titles = React.useMemo(() => ['Subscription', productInfo.trial_period ? 'Available Gateways After Trial Ends' : 'Payment Method', 'Subscription Email', 'Billing Info'], [productInfo.trial_period]);
    const subtitles = React.useMemo(() => [null, productInfo.trial_period ? 'You are not able to select these gateways now, it\'s just for your information to know how you will be able to pay after the trial period ends.' : null, null, null]);
    const products = React.useMemo(() => [productInfo], [productInfo]);
    const [openCoupon, setOpenCoupon] = React.useState(null);
    const [gateway, setGateway] = React.useState(null);
    const [APM, setAPM] = React.useState(null);
    const [regulationForm, setRegulationForm, isVisibleRegulationForm, isFilledRegulationForm, isExtendedRegulationForm] = useRegulationForm(products, gateway, APM);
    const [customFields, setCustomFields] = useCustomFields(products);
    const [sending, setSending] = React.useState(false);
    const [sendingCode, setSendingCode] = React.useState(false);
    const [skipFields, setSkipFields] = React.useState(true);
    const [payPalEmailDelivery, setPayPalEmailDelivery] = React.useState(false);
    const [step, setStepInternal] = React.useState(qs['step'] ? parseInt(qs['step']) : 0);
    const _setStep = React.useCallback(step => {
      setStepInternal(step);
      onChangeStep(step);
    }, [onChangeStep]);
    const [email, setEmail] = React.useState(null);
    const discounts = React.useMemo(() => {
      return (productDiscounts || []).find(discount => discount.product.uniqid === productInfo.uniqid);
    }, [productDiscounts, productInfo.uniqid]);
    const {
      price,
      productDiscount,
      addonsDiscount,
      addonsList,
      volumeDiscount,
      volumeAmount,
      bundleDiscount,
      couponDiscount,
      taxDiscount
    } = discounts;
    const [state, setState] = React.useState({});
    const [url, setUrl] = React.useState('');
    const setStep = step => {
      setState({
        ...state,
        step
      });
      _setStep(step);
    };
    const [firstname, setFirstName] = React.useState('');
    const [lastname, setLastName] = React.useState('');
    const [code, setCode] = React.useState('');
    const {
      setCookies
    } = useCustomerAuthCookies();
    const forceUpdate = useForceUpdate();
    const handleGoPurchaseForm = useGoToPurchase(gateway, setStep, onShowMessage, productInfo.trial_period);
    const handleBackToShop = useBackToShop(onBackToShop);
    const [invoiceError, setInvoiceError] = React.useState(false);
    const onFail = React.useCallback(() => {
      setInvoiceError(true);
      _onFail();
    }, []);
    const [handleSubmitPayment, trialStatus] = useSubmitPayment({
      config,
      isCustomDomain,
      email,
      gateway,
      APM,
      customFields,
      appliedCoupon,
      hasDiscount,
      payPalEmailDelivery,
      setSending,
      onCreateInvoice,
      onCreateInvoiceTrial,
      onShowMessage,
      onSuccess,
      isVisibleRegulationForm,
      isExtendedRegulationForm,
      onFail,
      type: 'product',
      product: productInfo,
      addons,
      quantity: 1,
      trialPeriod: productInfo.trial_period,
      discordIntegrationCode: state['code'] ? state['code'] : qs['code']
    });
    React.useEffect(() => {
      const _state = {};
      ['gateway', 'APM', 'step', 'email', 'payPalEmailDelivery', 'couponCode', 'code'].forEach(param => {
        if (qs[param]) {
          _state[param] = qs[param];
        }
      });
      if (_state.gateway) {
        setGateway(qs['gateway']);
      }
      if (_state.APM) {
        setAPM(qs['APM']);
      }
      if (_state.step) {
        setStep(parseInt(qs['step']));
      }
      _state.redirectUrl = window.location.href.split('?')[0];
      setState({
        ...state,
        ..._state
      });
      setUrl(config.DISCORD.DISCORD_INTEGRATION_OAUTH_URL + btoa(JSON.stringify(_state)));
    }, []);
    const handleSubmitCode = () => {
      setSendingCode(true);
      const data = {
        email
      };
      onCustomerAuthEmail(data).then(({
        data,
        status,
        error
      }) => {
        if (status === 200) {
          setStep(3);
          if (data && data.fields_required) {
            setSkipFields(false);
          }
        } else {
          onShowMessage({
            type: 'error',
            text: error || 'Server error!'
          });
        }
      }).catch(error => {
        onShowMessage({
          type: 'error',
          text: error ? error.error || error.message : 'Server error!'
        });
      }).finally(() => {
        setSendingCode(false);
      });
    };
    const handleSubmitAuth = () => {
      setSendingCode(true);
      let data = {
        email,
        code
      };
      if (!skipFields) {
        data.name = firstname;
        data.surname = lastname;
      }
      onCustomerAuthCode(data).then(({
        data,
        status,
        error,
        message
      }) => {
        if (status === 200) {
          setCookies(data.token);
          return handleSubmitPayment({
            token: data.token,
            onFailCreateInvoice: () => {
              setCode('');
              setStep(2);
            }
          });
        } else {
          onShowMessage({
            type: 'error',
            text: error || 'Server error!'
          });
        }
      }).catch(error => {
        onShowMessage({
          type: 'error',
          text: error ? error.error || error.message : 'Server error!'
        });
      }).finally(() => {
        setSendingCode(false);
      });
    };
    const totalPrice = Number(couponDiscount(price_display) || 0).toFixed(2) || 0;
    if (trialStatus === 'success') {
      return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(Success, {
        isTrial: true
      }));
    }
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: `sellix-product-title ${Boolean(subtitles[step]) && 'has-subtitle'}`,
      style: {
        height: '18px'
      }
    }, titles[step]), Boolean(subtitles[step]) && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-subtitle"
    }, subtitles[step]), step === 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      onClick: handleBackToShop,
      className: "sellix-product-back"
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fas fa-times"
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-body"
    }, step === 0 ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "unselectable w-100"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Billed every"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("b", null, productInfo.recurring_interval_count, " ", config.RECURRING_INTERVAL.find(({
      value
    }) => productInfo.recurring_interval === value).label.toLowerCase(), productInfo.recurring_interval_count > 1 ? 's' : ''))), productInfo.trial_period ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total correct-margin-top"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Trial period"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("b", null, productInfo.trial_period, " day", productInfo.trial_period > 1 ? 's' : ''))) : null, productInfo.trial_period ? null : addonsList.map(({
      title,
      uniqid,
      price_conversions
    }) => /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-2",
      key: uniqid
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      "data-tip": true,
      "data-for": `addon-${uniqid}`,
      className: "unselectable cursor-pointer"
    }, title, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-light fa-info-circle ml-2"
    }), /*#__PURE__*/React__default["default"].createElement(ReactTooltip, {
      id: `addon-${uniqid}`,
      place: "left",
      className: "sellix-check-item-tooltip"
    }, "Payment for the addon is charged only the first time")), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 14.5
      }
    }, config.CURRENCY_LIST[productInfo.currency], price_conversions[productInfo.currency])))), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total correct-margin-top"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Payment at each renewal"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total-price unselectable"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, Math.sign(totalPrice) === -1 ? '' : currencyTitle), Math.sign(totalPrice) === -1 ? 'Free' : (+totalPrice + +totalPrice * +productInfo.vat_percentage / 100).toFixed(2)))), appliedCoupon && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total mt-0 pt-2"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Coupon"), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex flex-column align-items-end",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, appliedCoupon && /*#__PURE__*/React__default["default"].createElement("small", {
      style: {
        fontSize: 13.5
      }
    }, "-", appliedCoupon.discount_type === 'FIXED' ? currency : '', +appliedCoupon.discount, appliedCoupon.discount_type !== 'FIXED' ? '%' : ''))), +productInfo.vat_percentage ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-total"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "unselectable"
    }, "Tax"), /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("b", null, productInfo.vat_percentage, "%"))) : null) : null, step === 1 && paymentOptions.length === 0 && /*#__PURE__*/React__default["default"].createElement("p", {
      className: "sellix-product-no-gateway"
    }, "This product has no payment options."), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-payment-methods"
    }, /*#__PURE__*/React__default["default"].createElement(GatewaySelector, {
      type: "product",
      config: config,
      theme: theme,
      productInfo: productInfo,
      appliedCoupon: appliedCoupon,
      isSubscription: true,
      paymentOptions: paymentOptions,
      gateway: productInfo.trial_period ? null : gateway,
      APM: APM,
      setGateway: (gateway, APM) => {
        setState({
          ...state,
          gateway,
          APM
        });
        setGateway(gateway);
        setAPM(APM);
      }
    })), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React__default["default"].createElement(Form, {
      isPayPal: gateway === 'PAYPAL' || gateway === 'PAYPAL_CREDIT_CARD',
      customFieldsValues: customFields,
      setState: state => setState(state),
      state: state,
      url: url,
      setUrl: url => setUrl(url),
      invoiceError: invoiceError,
      onSetEmail: email => setEmail(email),
      config: config,
      onSetPayPalEmailDelivery: email => setPayPalEmailDelivery(email),
      onSetCustomFields: (key, value) => {
        setCustomFields({
          ...customFields,
          [key]: value
        });
        forceUpdate();
      }
    })), step === 3 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React__default["default"].createElement(CodeAuthForm, {
      setFirstName: setFirstName,
      setLastName: setLastName,
      setCode: setCode,
      firstname: firstname,
      lastname: lastname,
      code: code,
      skipFields: skipFields
    })), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-footer"
    }, step === 0 && /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "w-100",
      onClick: () => setStep(1)
    }, "Payment Method")), step === 1 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(0)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      onClick: handleGoPurchaseForm
    }, "Continue")), step === 2 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => setStep(1)
    }, "Back"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      disabled: sendingCode || !email,
      onClick: handleSubmitCode
    }, sendingCode ? /*#__PURE__*/React__default["default"].createElement(Index$2, null) : 'Continue')), step === 3 && trialStatus !== 'error' && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "button-ghost back",
      disabled: sending || !email,
      onClick: () => {
        setStep(2);
        setCode('');
      }
    }, "Change Email"), /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "next",
      onClick: handleSubmitAuth
    }, sending ? /*#__PURE__*/React__default["default"].createElement(Index$2, null) : productInfo.trial_period ? 'Start Trial' : 'Start Subscription')), trialStatus === 'error' ? /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React__default["default"].createElement(CustomButton, {
      className: "w-100"
    }, "Go to Customer Billing Portal")) : null, step === 0 && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React__default["default"].createElement(Coupon, {
      setCoupon: coupon => setAppliedCoupon(coupon),
      appliedCoupon: appliedCoupon,
      openCoupon: openCoupon,
      setState: setState,
      state: state,
      disabledWithDiscount: false,
      showPayPalWarning: paymentOptions.includes('PAYPAL')
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "coupon-button",
      onClick: () => setOpenCoupon(!openCoupon)
    }, /*#__PURE__*/React__default["default"].createElement("i", {
      className: "fa-regular fa-tags"
    }), " Apply a Coupon"))))));
  };

  function DefaultParamsProvider({
    children
  }) {
    const queryStringParams = React.useMemo(() => {
      return new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      });
    }, []);
    const getParam = React.useCallback((name, defaultValue) => {
      const value = queryStringParams[name];
      if (typeof value === 'undefined' || value === null) {
        return defaultValue;
      }
      return value;
    }, []);
    return /*#__PURE__*/React__default["default"].createElement(DefaultParamsContext.Provider, {
      value: {
        getParam
      }
    }, children);
  }

  function PurchaseDetailsProvider({
    children,
    ...props
  }) {
    const {
      config,
      isCartEnabled,
      isCustomDomain,
      shopInfo,
      type,
      // checkout | product | subscription
      productInfo,
      invoiceInfo,
      cartProducts,
      addons,
      bundles,
      priceVariants,
      theme,
      settings,
      onAddToCart,
      onApplyCoupon,
      onBackToShop,
      onCreateInvoice,
      onCreateInvoiceTrial,
      onShowMessage,
      onShowProductTerms,
      onChangeProductQuantity,
      onChangeStep,
      onCustomerAuthEmail,
      onCustomerAuthCode,
      onSuccess,
      onFail,
      sellixHelper,
      options
    } = props;
    const internalCartProducts = React.useMemo(() => {
      if (!cartProducts || !cartProducts.length) {
        return cartProducts;
      }
      return cartProducts.map(product => {
        const priceVariant = priceVariants[product.uniqid];
        return {
          ...product,
          priceVariant: priceVariant ? priceVariant : null
        };
      });
    }, [cartProducts, priceVariants]);
    const internalProductInfo = React.useMemo(() => {
      if (!productInfo) {
        return productInfo;
      }
      const priceVariant = priceVariants[productInfo.uniqid];
      if (priceVariant) {
        return {
          ...productInfo,
          priceVariant
        };
      }
      return productInfo;
    }, [productInfo, priceVariants]);
    return /*#__PURE__*/React__default["default"].createElement(PurchaseDetailsContext.Provider, {
      value: {
        type: type || initialValue$1.config,
        config: config || initialValue$1.config,
        isCartEnabled: isCartEnabled || initialValue$1.isCartEnabled,
        isCustomDomain: isCustomDomain || initialValue$1.isCustomDomain,
        shopInfo: shopInfo || initialValue$1.shopInfo,
        productInfo: internalProductInfo,
        invoiceInfo: invoiceInfo || initialValue$1.invoiceInfo,
        cartProducts: internalCartProducts,
        addons: addons || initialValue$1.addons,
        bundles: bundles || initialValue$1.bundles,
        priceVariants: priceVariants || initialValue$1.priceVariants,
        theme: theme || initialValue$1.theme,
        settings: settings || initialValue$1.settings,
        onAddToCart: onAddToCart || initialValue$1.onAddToCart,
        onApplyCoupon: onApplyCoupon || initialValue$1.onApplyCoupon,
        onBackToShop: onBackToShop || initialValue$1.onBackToShop,
        onCreateInvoice: onCreateInvoice || initialValue$1.onCreateInvoice,
        onCreateInvoiceTrial: onCreateInvoiceTrial || initialValue$1.onCreateInvoiceTrial,
        onShowMessage: onShowMessage || initialValue$1.onShowMessage,
        onShowProductTerms: onShowProductTerms || initialValue$1.onShowProductTerms,
        onChangeProductQuantity: onChangeProductQuantity || initialValue$1.onChangeProductQuantity,
        onChangeStep: onChangeStep || initialValue$1.onChangeStep,
        onCustomerAuthEmail: onCustomerAuthEmail || initialValue$1.onCustomerAuthEmail,
        onCustomerAuthCode: onCustomerAuthCode || initialValue$1.onCustomerAuthCode,
        onSuccess: onSuccess || initialValue$1.onSuccess,
        onFail: onFail || initialValue$1.onFail,
        sellixHelper: sellixHelper || initialValue$1.sellixHelper,
        options: options || initialValue$1.options
      }
    }, children);
  }

  const PurchaseDetailsInternal = () => {
    const {
      config,
      shopInfo,
      type,
      productInfo,
      cartProducts,
      addons,
      bundles
    } = usePurchaseDetailsContext();
    const currency = type === 'checkout' ? shopInfo.currency : productInfo.currency;
    const products = React.useMemo(() => {
      if (type === 'checkout') {
        return cartProducts;
      } else if (type === 'product' || type === 'subscription') {
        return [productInfo];
      }
    }, [cartProducts, productInfo, type]);
    const [appliedCoupon, setAppliedCoupon] = React.useState(null);
    const productDiscounts = useProductDiscounts(config, currency, shopInfo, products, addons, bundles, appliedCoupon);
    const bundleDiscounts = useBundleDiscounts(config, currency, shopInfo, bundles, products);
    let hasDiscount = productDiscounts.filter(({
      volumeAmount
    }) => !!volumeAmount).length;
    const [, couponAmount] = useCouponDiscount(config, currency, appliedCoupon, hasDiscount);
    const paymentOptions = useProductPayments(products);
    let taxAmount = +shopInfo.vat_percentage ? `${+shopInfo.vat_percentage}%` : '';
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sellix-product-card"
    }, type === 'checkout' && /*#__PURE__*/React__default["default"].createElement(CheckoutPurchase, {
      appliedCoupon: appliedCoupon,
      setAppliedCoupon: setAppliedCoupon,
      currency: currency,
      productDiscounts: productDiscounts,
      bundleDiscounts: bundleDiscounts,
      paymentOptions: paymentOptions,
      hasDiscount: hasDiscount,
      taxAmount: taxAmount,
      couponAmount: couponAmount
    }), type === 'product' && /*#__PURE__*/React__default["default"].createElement(ProductPurchase, {
      appliedCoupon: appliedCoupon,
      setAppliedCoupon: setAppliedCoupon,
      currency: currency,
      productDiscounts: productDiscounts,
      hasDiscount: hasDiscount
    }), type === 'subscription' && /*#__PURE__*/React__default["default"].createElement(SubscriptionPurchase, {
      appliedCoupon: appliedCoupon,
      setAppliedCoupon: setAppliedCoupon,
      currency: currency,
      productDiscounts: productDiscounts,
      hasDiscount: hasDiscount
    }), /*#__PURE__*/React__default["default"].createElement("div", {
      id: "purchase-detail-recaptcha-v2"
    }));
  };
  const PurchaseDetails = props => {
    return /*#__PURE__*/React__default["default"].createElement(DefaultParamsProvider, null, /*#__PURE__*/React__default["default"].createElement(PurchaseDetailsProvider, props, /*#__PURE__*/React__default["default"].createElement(PurchaseDetailsInternal, null)));
  };

  exports.PurchaseDetails = PurchaseDetails;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({}, React, PropTypes, ReactDOM);
