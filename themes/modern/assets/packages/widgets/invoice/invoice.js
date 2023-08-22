var Invoice = (function (exports, React, ReactDOM, moment) {
  'use strict';

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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var Collapse$3 = {};

  function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

  Object.defineProperty(Collapse$3, "__esModule", {
    value: true
  });
  Collapse$3.Collapse = void 0;

  var _react$2 = _interopRequireDefault$2(React);

  function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

  function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$2(subClass, superClass); }

  function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$2(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$2(this, result); }; }

  function _possibleConstructorReturn$2(self, call) { if (call && (_typeof$3(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$2(self); }

  function _assertThisInitialized$2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf$2(o) { _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$2(o); }

  function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Collapse$2 = /*#__PURE__*/function (_React$Component) {
    _inherits$2(Collapse, _React$Component);

    var _super = _createSuper$2(Collapse);

    function Collapse(props) {
      var _this;

      _classCallCheck$2(this, Collapse);

      _this = _super.call(this, props);

      _defineProperty$2(_assertThisInitialized$2(_this), "timeout", undefined);

      _defineProperty$2(_assertThisInitialized$2(_this), "container", undefined);

      _defineProperty$2(_assertThisInitialized$2(_this), "content", undefined);

      _defineProperty$2(_assertThisInitialized$2(_this), "onResize", function () {
        clearTimeout(_this.timeout);

        if (!_this.container || !_this.content) {
          return;
        }

        var _this$props = _this.props,
            isOpened = _this$props.isOpened,
            checkTimeout = _this$props.checkTimeout;
        var containerHeight = Math.floor(_this.container.clientHeight);
        var contentHeight = Math.floor(_this.content.clientHeight);
        var isFullyOpened = isOpened && Math.abs(contentHeight - containerHeight) <= 1;
        var isFullyClosed = !isOpened && Math.abs(containerHeight) <= 1;

        if (isFullyOpened || isFullyClosed) {
          _this.onRest({
            isFullyOpened: isFullyOpened,
            isFullyClosed: isFullyClosed,
            isOpened: isOpened,
            containerHeight: containerHeight,
            contentHeight: contentHeight
          });
        } else {
          _this.onWork({
            isFullyOpened: isFullyOpened,
            isFullyClosed: isFullyClosed,
            isOpened: isOpened,
            containerHeight: containerHeight,
            contentHeight: contentHeight
          });

          _this.timeout = setTimeout(function () {
            return _this.onResize();
          }, checkTimeout);
        }
      });

      _defineProperty$2(_assertThisInitialized$2(_this), "onRest", function (_ref) {
        var isFullyOpened = _ref.isFullyOpened,
            isFullyClosed = _ref.isFullyClosed,
            isOpened = _ref.isOpened,
            containerHeight = _ref.containerHeight,
            contentHeight = _ref.contentHeight;

        if (!_this.container || !_this.content) {
          return;
        }

        var hasOpened = isOpened && _this.container.style.height === "".concat(contentHeight, "px");
        var hasClosed = !isOpened && _this.container.style.height === '0px';

        if (hasOpened || hasClosed) {
          _this.container.style.overflow = isOpened ? 'initial' : 'hidden';
          _this.container.style.height = isOpened ? 'auto' : '0px';
          var onRest = _this.props.onRest;

          if (onRest) {
            onRest({
              isFullyOpened: isFullyOpened,
              isFullyClosed: isFullyClosed,
              isOpened: isOpened,
              containerHeight: containerHeight,
              contentHeight: contentHeight
            });
          }
        }
      });

      _defineProperty$2(_assertThisInitialized$2(_this), "onWork", function (_ref2) {
        var isFullyOpened = _ref2.isFullyOpened,
            isFullyClosed = _ref2.isFullyClosed,
            isOpened = _ref2.isOpened,
            containerHeight = _ref2.containerHeight,
            contentHeight = _ref2.contentHeight;

        if (!_this.container || !_this.content) {
          return;
        }

        var isOpenining = isOpened && _this.container.style.height === "".concat(contentHeight, "px");
        var isClosing = !isOpened && _this.container.style.height === '0px';

        if (isOpenining || isClosing) {
          // No need to do any work
          return;
        }

        _this.container.style.overflow = 'hidden';
        _this.container.style.height = isOpened ? "".concat(contentHeight, "px") : '0px';
        var onWork = _this.props.onWork;

        if (onWork) {
          onWork({
            isFullyOpened: isFullyOpened,
            isFullyClosed: isFullyClosed,
            isOpened: isOpened,
            containerHeight: containerHeight,
            contentHeight: contentHeight
          });
        }
      });

      _defineProperty$2(_assertThisInitialized$2(_this), "onRefContainer", function (container) {
        _this.container = container;
      });

      _defineProperty$2(_assertThisInitialized$2(_this), "onRefContent", function (content) {
        _this.content = content;
      });

      if (props.initialStyle) {
        _this.initialStyle = props.initialStyle;
      } else {
        _this.initialStyle = props.isOpened ? {
          height: 'auto',
          overflow: 'initial'
        } : {
          height: '0px',
          overflow: 'hidden'
        };
      }

      return _this;
    }

    _createClass$2(Collapse, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.onResize();
      }
    }, {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        var _this$props2 = this.props,
            theme = _this$props2.theme,
            isOpened = _this$props2.isOpened,
            children = _this$props2.children;
        return children !== nextProps.children || isOpened !== nextProps.isOpened || Object.keys(theme).some(function (c) {
          return theme[c] !== nextProps.theme[c];
        });
      }
    }, {
      key: "getSnapshotBeforeUpdate",
      value: function getSnapshotBeforeUpdate() {
        if (!this.container || !this.content) {
          return null;
        }

        if (this.container.style.height === 'auto') {
          var contentHeight = this.content.clientHeight;
          this.container.style.height = "".concat(contentHeight, "px");
        }

        return null;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.onResize();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        clearTimeout(this.timeout);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props3 = this.props,
            theme = _this$props3.theme,
            children = _this$props3.children,
            isOpened = _this$props3.isOpened;
        return /*#__PURE__*/_react$2["default"].createElement("div", {
          ref: this.onRefContainer,
          className: theme.collapse,
          style: this.initialStyle,
          "aria-hidden": !isOpened
        }, /*#__PURE__*/_react$2["default"].createElement("div", {
          ref: this.onRefContent,
          className: theme.content
        }, children));
      }
    }]);

    return Collapse;
  }(_react$2["default"].Component);

  Collapse$3.Collapse = Collapse$2;

  _defineProperty$2(Collapse$2, "defaultProps", {
    theme: {
      collapse: 'ReactCollapse--collapse',
      content: 'ReactCollapse--content'
    },
    initialStyle: undefined,
    onRest: undefined,
    onWork: undefined,
    checkTimeout: 50
  });

  var UnmountClosed$2 = {};

  function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

  Object.defineProperty(UnmountClosed$2, "__esModule", {
    value: true
  });
  UnmountClosed$2.UnmountClosed = void 0;

  var _react$1 = _interopRequireDefault$1(React);

  var _Collapse = Collapse$3;

  var _excluded$1 = ["isOpened"],
      _excluded2 = ["isOpened"];

  function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _objectWithoutProperties$1(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose$1(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose$1(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

  function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

  function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

  function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }

  function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var UnmountClosed$1 = /*#__PURE__*/function (_React$PureComponent) {
    _inherits$1(UnmountClosed, _React$PureComponent);

    var _super = _createSuper$1(UnmountClosed);

    function UnmountClosed(props) {
      var _this;

      _classCallCheck$1(this, UnmountClosed);

      _this = _super.call(this, props);

      _defineProperty$1(_assertThisInitialized$1(_this), "onWork", function (_ref) {
        var isOpened = _ref.isOpened,
            rest = _objectWithoutProperties$1(_ref, _excluded$1);

        _this.setState({
          isResting: false,
          isOpened: isOpened
        });

        var onWork = _this.props.onWork;

        if (onWork) {
          onWork(_objectSpread$1({
            isOpened: isOpened
          }, rest));
        }
      });

      _defineProperty$1(_assertThisInitialized$1(_this), "onRest", function (_ref2) {
        var isOpened = _ref2.isOpened,
            rest = _objectWithoutProperties$1(_ref2, _excluded2);

        _this.setState({
          isResting: true,
          isOpened: isOpened,
          isInitialRender: false
        });

        var onRest = _this.props.onRest;

        if (onRest) {
          onRest(_objectSpread$1({
            isOpened: isOpened
          }, rest));
        }
      });

      _defineProperty$1(_assertThisInitialized$1(_this), "getInitialStyle", function () {
        var _this$state = _this.state,
            isOpened = _this$state.isOpened,
            isInitialRender = _this$state.isInitialRender;

        if (isInitialRender) {
          return isOpened ? {
            height: 'auto',
            overflow: 'initial'
          } : {
            height: '0px',
            overflow: 'hidden'
          };
        }

        return {
          height: '0px',
          overflow: 'hidden'
        };
      });

      _this.state = {
        isResting: true,
        isOpened: props.isOpened,
        isInitialRender: true
      };
      return _this;
    }

    _createClass$1(UnmountClosed, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var isOpened = this.props.isOpened;

        if (prevProps.isOpened !== isOpened) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            isResting: false,
            isOpened: isOpened,
            isInitialRender: false
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$state2 = this.state,
            isResting = _this$state2.isResting,
            isOpened = _this$state2.isOpened;
        return isResting && !isOpened ? null : /*#__PURE__*/_react$1["default"].createElement(_Collapse.Collapse, _extends({}, this.props, {
          initialStyle: this.getInitialStyle(),
          onWork: this.onWork,
          onRest: this.onRest
        }));
      }
    }]);

    return UnmountClosed;
  }(_react$1["default"].PureComponent);

  UnmountClosed$2.UnmountClosed = UnmountClosed$1;

  _defineProperty$1(UnmountClosed$1, "defaultProps", {
    onWork: undefined,
    onRest: undefined
  });

  var _require$1 = Collapse$3,
      Collapse = _require$1.Collapse;

  var _require2 = UnmountClosed$2,
      UnmountClosed = _require2.UnmountClosed; // Default export


  var lib$1 = UnmountClosed; // Extra "named exports"

  UnmountClosed.Collapse = Collapse;
  UnmountClosed.UnmountClosed = UnmountClosed;

  var Collapse$1 = /*@__PURE__*/getDefaultExportFromCjs(lib$1);

  var classnames = {exports: {}};

  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */

  (function (module) {
  	/* global define */

  	(function () {

  		var hasOwn = {}.hasOwnProperty;

  		function classNames() {
  			var classes = [];

  			for (var i = 0; i < arguments.length; i++) {
  				var arg = arguments[i];
  				if (!arg) continue;

  				var argType = typeof arg;

  				if (argType === 'string' || argType === 'number') {
  					classes.push(arg);
  				} else if (Array.isArray(arg)) {
  					if (arg.length) {
  						var inner = classNames.apply(null, arg);
  						if (inner) {
  							classes.push(inner);
  						}
  					}
  				} else if (argType === 'object') {
  					if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
  						classes.push(arg.toString());
  						continue;
  					}

  					for (var key in arg) {
  						if (hasOwn.call(arg, key) && arg[key]) {
  							classes.push(key);
  						}
  					}
  				}
  			}

  			return classes.join(' ');
  		}

  		if (module.exports) {
  			classNames.default = classNames;
  			module.exports = classNames;
  		} else {
  			window.classNames = classNames;
  		}
  	}()); 
  } (classnames));

  var classnamesExports = classnames.exports;
  var a = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const createCoords = v => ({
    x: v,
    y: v
  });
  const oppositeSideMap = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  const oppositeAlignmentMap = {
    start: 'end',
    end: 'start'
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === 'function' ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split('-')[0];
  }
  function getAlignment(placement) {
    return placement.split('-')[1];
  }
  function getOppositeAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }
  function getAxisLength(axis) {
    return axis === 'y' ? 'height' : 'width';
  }
  function getSideAxis(placement) {
    return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
  }
  function getSideList(side, isStart, rtl) {
    const lr = ['left', 'right'];
    const rl = ['right', 'left'];
    const tb = ['top', 'bottom'];
    const bt = ['bottom', 'top'];
    switch (side) {
      case 'top':
      case 'bottom':
        if (rtl) return isStart ? rl : lr;
        return isStart ? lr : rl;
      case 'left':
      case 'right':
        return isStart ? tb : bt;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === 'start', rtl);
    if (alignment) {
      list = list.map(side => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== 'number' ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    return {
      ...rect,
      top: rect.y,
      left: rect.x,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    };
  }

  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === 'y';
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case 'top':
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case 'bottom':
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case 'right':
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case 'left':
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case 'start':
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case 'end':
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain positioning strategy.
   *
   * This export does not have any `platform` interface logic. You will need to
   * write one for the platform you are using Floating UI with.
   */
  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
    let rects = await platform.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === 'object') {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
        continue;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };

  /**
   * Resolves with an object of overflow side offsets that determine how much the
   * element is overflowing a given clipping boundary on each side.
   * - positive = overflowing the boundary by that number of pixels
   * - negative = how many pixels left before it will overflow
   * - 0 = lies flush with the boundary
   * @see https://floating-ui.com/docs/detectOverflow
   */
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = 'clippingAncestors',
      rootBoundary = 'viewport',
      elementContext = 'floating',
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === 'floating' ? 'reference' : 'floating';
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform.getClippingRect({
      element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === 'floating' ? {
      ...rects.floating,
      x,
      y
    } : rects.reference;
    const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
    const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow = options => ({
    name: 'arrow',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform,
        elements
      } = state;
      // Since `element` is required, we don't Partial<> the type.
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform.getDimensions(element);
      const isYAxis = axis === 'y';
      const minProp = isYAxis ? 'top' : 'left';
      const maxProp = isYAxis ? 'bottom' : 'right';
      const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

      // DOM platform can return `window` as the `offsetParent`.
      if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;

      // If the padding is large enough that it causes the arrow to no longer be
      // centered, modify the padding so that it is centered.
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

      // Make sure the arrow doesn't overflow the floating element if the center
      // point is outside the floating element's bounds.
      const min$1 = minPadding;
      const max = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset = clamp(min$1, center, max);

      // If the reference is small enough that the arrow's padding causes it to
      // to point to nothing for an aligned placement, adjust the offset of the
      // floating element itself. This stops `shift()` from taking action, but can
      // be worked around by calling it again after the `arrow()` if desired.
      const shouldAddOffset = getAlignment(placement) != null && center != offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? min$1 - center : max - center : 0;
      return {
        [axis]: coords[axis] - alignmentOffset,
        data: {
          [axis]: offset,
          centerOffset: center - offset + alignmentOffset
        }
      };
    }
  });

  /**
   * Optimizes the visibility of the floating element by flipping the `placement`
   * in order to keep it in view when the preferred placement(s) will overflow the
   * clipping boundary. Alternative to `autoPlacement`.
   * @see https://floating-ui.com/docs/flip
   */
  const flip = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'flip',
      options,
      async fn(state) {
        var _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = 'bestFit',
          fallbackAxisSideDirection = 'none',
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        const side = getSide(placement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== 'none') {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides[0]], overflow[sides[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];

        // One or more sides is overflowing.
        if (!overflows.every(side => side <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }

          // First, find the candidates that fit on the mainAxis side of overflow,
          // then find the placement that fits the best on the main crossAxis side.
          let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

          // Otherwise fallback.
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case 'bestFit':
                {
                  var _overflowsData$map$so;
                  const placement = (_overflowsData$map$so = overflowsData.map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
                  if (placement) {
                    resetPlacement = placement;
                  }
                  break;
                }
              case 'initialPlacement':
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };

  // For type backwards-compatibility, the `OffsetOptions` type was also
  // Derivable.
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform,
      elements
    } = state;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === 'y';
    const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);

    // eslint-disable-next-line prefer-const
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === 'number' ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: 0,
      crossAxis: 0,
      alignmentAxis: null,
      ...rawValue
    };
    if (alignment && typeof alignmentAxis === 'number') {
      crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }

  /**
   * Modifies the placement by translating the floating element along the
   * specified axes.
   * A number (shorthand for `mainAxis` or distance), or an axes configuration
   * object may be passed.
   * @see https://floating-ui.com/docs/offset
   */
  const offset = function (options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: 'offset',
      options,
      async fn(state) {
        const {
          x,
          y
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: diffCoords
        };
      }
    };
  };

  /**
   * Optimizes the visibility of the floating element by shifting it in order to
   * keep it in view when it will overflow the clipping boundary.
   * @see https://floating-ui.com/docs/shift
   */
  const shift = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'shift',
      options,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: _ref => {
              let {
                x,
                y
              } = _ref;
              return {
                x,
                y
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === 'y' ? 'top' : 'left';
          const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
          const min = mainAxisCoord + overflow[minSide];
          const max = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min, mainAxisCoord, max);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === 'y' ? 'top' : 'left';
          const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
          const min = crossAxisCoord + overflow[minSide];
          const max = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min, crossAxisCoord, max);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y
          }
        };
      }
    };
  };

  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || '').toLowerCase();
    }
    // Mocked nodes in testing environments may not be instances of Node. By
    // returning `#document` an infinite loop won't occur.
    // https://github.com/floating-ui/floating-ui/issues/2317
    return '#document';
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    // Browsers without `ShadowRoot` support.
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
  }
  function isTableElement(element) {
    return ['table', 'td', 'th'].includes(getNodeName(element));
  }
  function isContainingBlock(element) {
    const webkit = isWebKit();
    const css = getComputedStyle$1(element);

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else {
        currentNode = getParentNode(currentNode);
      }
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === 'undefined' || !CSS.supports) return false;
    return CSS.supports('-webkit-backdrop-filter', 'none');
  }
  function isLastTraversableNode(node) {
    return ['html', 'body', '#document'].includes(getNodeName(node));
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.pageXOffset,
      scrollTop: element.pageYOffset
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === 'html') {
      return node;
    }
    const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    isShadowRoot(node) && node.host ||
    // Fallback.
    getDocumentElement(node);
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
  }

  function getCssDimensions(element) {
    const css = getComputedStyle$1(element);
    // In testing environments, the `width` and `height` properties are empty
    // strings for SVG elements, returning NaN. Fallback to `0` in this case.
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }

  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }

  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;

    // 0, NaN, or Infinity should always fallback to 1.

    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }

  const noOffsets = /*#__PURE__*/createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentIFrame = win.frameElement;
      while (currentIFrame && offsetParent && offsetWin !== win) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentIFrame = getWindow(currentIFrame).frameElement;
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }

  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    if (offsetParent === documentElement) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
    };
  }

  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
  }

  // Gets the entire size of the scrollable document area, even extending outside
  // of the `<html>` and `<body>` rect bounds if horizontally scrollable.
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle$1(body).direction === 'rtl') {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  // Returns the inner client rect, subtracting scrollbars if present.
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === 'viewport') {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === 'document') {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        ...clippingAncestor,
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
  }

  // A "clipping ancestor" is an `overflow` element with the characteristic of
  // clipping (or hiding) child elements. This returns all clipping ancestors
  // of the given element up the tree.
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element).filter(el => isElement(el) && getNodeName(el) !== 'body');
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
    let currentNode = elementIsFixed ? getParentNode(element) : element;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        // Drop non-containing blocks.
        result = result.filter(ancestor => ancestor !== currentNode);
      } else {
        // Record last containing block for next iteration.
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }

  // Gets the maximum area that the element is visible in due to any number of
  // clipping ancestors.
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }

  function getDimensions(element) {
    return getCssDimensions(element);
  }

  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === 'fixed';
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    return element.offsetParent;
  }

  // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.
  function getOffsetParent(element, polyfill) {
    const window = getWindow(element);
    if (!isHTMLElement(element)) {
      return window;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
      return window;
    }
    return offsetParent || getContainingBlock(element) || window;
  }

  const getElementRects = async function (_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...(await getDimensionsFn(floating))
      }
    };
  };

  function isRTL(element) {
    return getComputedStyle$1(element).direction === 'rtl';
  }

  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain CSS positioning
   * strategy.
   */
  const computePosition = (reference, floating, options) => {
    // This caches the expensive `getClippingElementAncestors` function so that
    // multiple lifecycle resets re-use the same result. It only lives for a
    // single call. If other functions become expensive, we can add them as well.
    const cache = new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  /*
  * React Tooltip
  * {@link https://github.com/ReactTooltip/react-tooltip}
  * @copyright ReactTooltip Team
  * @license MIT
  */
  const f="react-tooltip-core-styles",h="react-tooltip-base-styles";function y({css:e,id:t=h,type:r="base",ref:o}){var n,l;if("core"===r&&"undefined"!=typeof process&&(null===(n=null===process||void 0===process?void 0:process.env)||void 0===n?void 0:n.REACT_TOOLTIP_DISABLE_CORE_STYLES))return;if("core"!==r&&"undefined"!=typeof process&&(null===(l=null===process||void 0===process?void 0:process.env)||void 0===l?void 0:l.REACT_TOOLTIP_DISABLE_BASE_STYLES))return;"core"===r&&(t=f),o||(o={});const{insertAt:c}=o;if(!e||"undefined"==typeof document||document.getElementById(t))return;const i=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.id=t,s.type="text/css","top"===c&&i.firstChild?i.insertBefore(s,i.firstChild):i.appendChild(s),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(document.createTextNode(e));}const S=(e,t,r)=>{let o=null;return function(...n){const l=()=>{o=null,r||e.apply(this,n);};r&&!o&&(e.apply(this,n),o=setTimeout(l,t)),r||(o&&clearTimeout(o),o=setTimeout(l,t));}},E="DEFAULT_TOOLTIP_ID",_={anchorRefs:new Set,activeAnchor:{current:null},attach:()=>{},detach:()=>{},setActiveAnchor:()=>{}},g=React.createContext({getTooltipData:()=>_});function b(e=E){return React.useContext(g).getTooltipData(e)}const O="undefined"!=typeof window?React.useLayoutEffect:React.useEffect,L=e=>{if(!(e instanceof HTMLElement||e instanceof SVGElement))return !1;const t=getComputedStyle(e);return ["overflow","overflow-x","overflow-y"].some((e=>{const r=t.getPropertyValue(e);return "auto"===r||"scroll"===r}))},R=e=>{if(!e)return null;let t=e.parentElement;for(;t;){if(L(t))return t;t=t.parentElement;}return document.scrollingElement||document.documentElement},k=async({elementReference:e=null,tooltipReference:t=null,tooltipArrowReference:r=null,place:o="top",offset:n=10,strategy:l="absolute",middlewares:c=[offset(Number(n)),flip(),shift({padding:5})]})=>{if(!e)return {tooltipStyles:{},tooltipArrowStyles:{},place:o};if(null===t)return {tooltipStyles:{},tooltipArrowStyles:{},place:o};const i=c;return r?(i.push(arrow({element:r,padding:5})),computePosition(e,t,{placement:o,strategy:l,middleware:i}).then((({x:e,y:t,placement:r,middlewareData:o})=>{var n,l;const c={left:`${e}px`,top:`${t}px`},{x:i,y:s}=null!==(n=o.arrow)&&void 0!==n?n:{x:0,y:0};return {tooltipStyles:c,tooltipArrowStyles:{left:null!=i?`${i}px`:"",top:null!=s?`${s}px`:"",right:"",bottom:"",[null!==(l={top:"bottom",right:"left",bottom:"top",left:"right"}[r.split("-")[0]])&&void 0!==l?l:"bottom"]:"-4px"},place:r}}))):computePosition(e,t,{placement:"bottom",strategy:l,middleware:i}).then((({x:e,y:t,placement:r})=>({tooltipStyles:{left:`${e}px`,top:`${t}px`},tooltipArrowStyles:{},place:r})))};var N="core-styles-module_tooltip__3vRRp",x="core-styles-module_fixed__pcSol",I="core-styles-module_arrow__cvMwQ",C="core-styles-module_noArrow__xock6",$="core-styles-module_clickable__ZuTTB",B="core-styles-module_show__Nt9eE",H={tooltip:"styles-module_tooltip__mnnfp",arrow:"styles-module_arrow__K0L3T",dark:"styles-module_dark__xNqje",light:"styles-module_light__Z6W-X",success:"styles-module_success__A2AKt",warning:"styles-module_warning__SCK0X",error:"styles-module_error__JvumD",info:"styles-module_info__BWdHW"};const D=({id:t,className:o,classNameArrow:n,variant:l="dark",anchorId:s,anchorSelect:u,place:d="top",offset:p=10,events:v=["hover"],openOnClick:m=!1,positionStrategy:f="absolute",middlewares:h,wrapper:y,delayShow:w=0,delayHide:E=0,float:_=!1,hidden:g=!1,noArrow:A=!1,clickable:T=!1,closeOnEsc:L=!1,closeOnScroll:D=!1,closeOnResize:j=!1,style:q,position:z,afterShow:W,afterHide:M,content:P,contentWrapperRef:K,isOpen:X,setIsOpen:Y,activeAnchor:F,setActiveAnchor:V})=>{const Z=React.useRef(null),G=React.useRef(null),J=React.useRef(null),Q=React.useRef(null),[U,ee]=React.useState(d),[te,re]=React.useState({}),[oe,ne]=React.useState({}),[le,ce]=React.useState(!1),[ie,se]=React.useState(!1),ae=React.useRef(!1),ue=React.useRef(null),{anchorRefs:de,setActiveAnchor:pe}=b(t),ve=React.useRef(!1),[me,fe]=React.useState([]),he=React.useRef(!1),ye=m||v.includes("click");O((()=>(he.current=!0,()=>{he.current=!1;})),[]),React.useEffect((()=>{if(!le){const e=setTimeout((()=>{se(!1);}),150);return ()=>{clearTimeout(e);}}return ()=>null}),[le]);const we=e=>{he.current&&(e&&se(!0),setTimeout((()=>{he.current&&(null==Y||Y(e),void 0===X&&ce(e));}),10));};React.useEffect((()=>{if(void 0===X)return ()=>null;X&&se(!0);const e=setTimeout((()=>{ce(X);}),10);return ()=>{clearTimeout(e);}}),[X]),React.useEffect((()=>{le!==ae.current&&(ae.current=le,le?null==W||W():null==M||M());}),[le]);const Se=(e=E)=>{Q.current&&clearTimeout(Q.current),Q.current=setTimeout((()=>{ve.current||we(!1);}),e);},Ee=e=>{var t;if(!e)return;const r=null!==(t=e.currentTarget)&&void 0!==t?t:e.target;if(!(null==r?void 0:r.isConnected))return V(null),void pe({current:null});w?(J.current&&clearTimeout(J.current),J.current=setTimeout((()=>{we(!0);}),w)):we(!0),V(r),pe({current:r}),Q.current&&clearTimeout(Q.current);},_e=()=>{T?Se(E||100):E?Se():we(!1),J.current&&clearTimeout(J.current);},ge=({x:e,y:t})=>{k({place:d,offset:p,elementReference:{getBoundingClientRect:()=>({x:e,y:t,width:0,height:0,top:t,left:e,right:e,bottom:t})},tooltipReference:Z.current,tooltipArrowReference:G.current,strategy:f,middlewares:h}).then((e=>{Object.keys(e.tooltipStyles).length&&re(e.tooltipStyles),Object.keys(e.tooltipArrowStyles).length&&ne(e.tooltipArrowStyles),ee(e.place);}));},Ae=e=>{if(!e)return;const t=e,r={x:t.clientX,y:t.clientY};ge(r),ue.current=r;},be=e=>{Ee(e),E&&Se();},Te=e=>{var t;[document.querySelector(`[id='${s}']`),...me].some((t=>null==t?void 0:t.contains(e.target)))||(null===(t=Z.current)||void 0===t?void 0:t.contains(e.target))||(we(!1),J.current&&clearTimeout(J.current));},Oe=S(Ee,50,!0),Le=S(_e,50,!0);React.useEffect((()=>{var e,t;const r=new Set(de);me.forEach((e=>{r.add({current:e});}));const o=document.querySelector(`[id='${s}']`);o&&r.add({current:o});const n=()=>{we(!1);},l=R(F),c=R(Z.current);D&&(window.addEventListener("scroll",n),null==l||l.addEventListener("scroll",n),null==c||c.addEventListener("scroll",n)),j&&window.addEventListener("resize",n);const i=e=>{"Escape"===e.key&&we(!1);};L&&window.addEventListener("keydown",i);const a=[];ye?(window.addEventListener("click",Te),a.push({event:"click",listener:be})):(a.push({event:"mouseenter",listener:Oe},{event:"mouseleave",listener:Le},{event:"focus",listener:Oe},{event:"blur",listener:Le}),_&&a.push({event:"mousemove",listener:Ae}));const u=()=>{ve.current=!0;},d=()=>{ve.current=!1,_e();};return T&&!ye&&(null===(e=Z.current)||void 0===e||e.addEventListener("mouseenter",u),null===(t=Z.current)||void 0===t||t.addEventListener("mouseleave",d)),a.forEach((({event:e,listener:t})=>{r.forEach((r=>{var o;null===(o=r.current)||void 0===o||o.addEventListener(e,t);}));})),()=>{var e,t;D&&(window.removeEventListener("scroll",n),null==l||l.removeEventListener("scroll",n),null==c||c.removeEventListener("scroll",n)),j&&window.removeEventListener("resize",n),ye&&window.removeEventListener("click",Te),L&&window.removeEventListener("keydown",i),T&&!ye&&(null===(e=Z.current)||void 0===e||e.removeEventListener("mouseenter",u),null===(t=Z.current)||void 0===t||t.removeEventListener("mouseleave",d)),a.forEach((({event:e,listener:t})=>{r.forEach((r=>{var o;null===(o=r.current)||void 0===o||o.removeEventListener(e,t);}));}));}}),[ie,de,me,L,v]),React.useEffect((()=>{let e=null!=u?u:"";!e&&t&&(e=`[data-tooltip-id='${t}']`);const r=new MutationObserver((r=>{const o=[];r.forEach((r=>{if("attributes"===r.type&&"data-tooltip-id"===r.attributeName){r.target.getAttribute("data-tooltip-id")===t&&o.push(r.target);}if("childList"===r.type&&(F&&[...r.removedNodes].some((e=>{var t;return !!(null===(t=null==e?void 0:e.contains)||void 0===t?void 0:t.call(e,F))&&(se(!1),we(!1),V(null),J.current&&clearTimeout(J.current),Q.current&&clearTimeout(Q.current),!0)})),e))try{const t=[...r.addedNodes].filter((e=>1===e.nodeType));o.push(...t.filter((t=>t.matches(e)))),o.push(...t.flatMap((t=>[...t.querySelectorAll(e)])));}catch(e){}})),o.length&&fe((e=>[...e,...o]));}));return r.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-tooltip-id"]}),()=>{r.disconnect();}}),[t,u,F]);const Re=()=>{z?ge(z):_?ue.current&&ge(ue.current):k({place:d,offset:p,elementReference:F,tooltipReference:Z.current,tooltipArrowReference:G.current,strategy:f,middlewares:h}).then((e=>{he.current&&(Object.keys(e.tooltipStyles).length&&re(e.tooltipStyles),Object.keys(e.tooltipArrowStyles).length&&ne(e.tooltipArrowStyles),ee(e.place));}));};React.useEffect((()=>{Re();}),[le,F,P,q,d,p,f,z]),React.useEffect((()=>{if(!(null==K?void 0:K.current))return ()=>null;const e=new ResizeObserver((()=>{Re();}));return e.observe(K.current),()=>{e.disconnect();}}),[P,null==K?void 0:K.current]),React.useEffect((()=>{var e;const t=document.querySelector(`[id='${s}']`),r=[...me,t];F&&r.includes(F)||V(null!==(e=me[0])&&void 0!==e?e:t);}),[s,me,F]),React.useEffect((()=>()=>{J.current&&clearTimeout(J.current),Q.current&&clearTimeout(Q.current);}),[]),React.useEffect((()=>{let e=u;if(!e&&t&&(e=`[data-tooltip-id='${t}']`),e)try{const t=Array.from(document.querySelectorAll(e));fe(t);}catch(e){fe([]);}}),[t,u]);const ke=!g&&P&&le&&Object.keys(te).length>0;return ie?React.createElement(y,{id:t,role:"tooltip",className:a("react-tooltip",N,H.tooltip,H[l],o,`react-tooltip__place-${U}`,{[B]:ke,[x]:"fixed"===f,[$]:T}),style:{...q,...te},ref:Z},P,React.createElement(y,{className:a("react-tooltip-arrow",I,H.arrow,n,{[C]:A}),style:oe,ref:G})):null},j=({content:t})=>React.createElement("span",{dangerouslySetInnerHTML:{__html:t}}),q=({id:t,anchorId:o,anchorSelect:n,content:l,html:s,render:a,className:u,classNameArrow:d,variant:p="dark",place:v="top",offset:m=10,wrapper:f="div",children:h=null,events:y=["hover"],openOnClick:w=!1,positionStrategy:S="absolute",middlewares:E,delayShow:_=0,delayHide:g=0,float:A=!1,hidden:T=!1,noArrow:O=!1,clickable:L=!1,closeOnEsc:R=!1,closeOnScroll:k=!1,closeOnResize:N=!1,style:x,position:I,isOpen:C,setIsOpen:$,afterShow:B,afterHide:H})=>{const[q,z]=React.useState(l),[W,M]=React.useState(s),[P,K]=React.useState(v),[X,Y]=React.useState(p),[F,V]=React.useState(m),[Z,G]=React.useState(_),[J,Q]=React.useState(g),[U,ee]=React.useState(A),[te,re]=React.useState(T),[oe,ne]=React.useState(f),[le,ce]=React.useState(y),[ie,se]=React.useState(S),[ae,ue]=React.useState(null),{anchorRefs:de,activeAnchor:pe}=b(t),ve=e=>null==e?void 0:e.getAttributeNames().reduce(((t,r)=>{var o;if(r.startsWith("data-tooltip-")){t[r.replace(/^data-tooltip-/,"")]=null!==(o=null==e?void 0:e.getAttribute(r))&&void 0!==o?o:null;}return t}),{}),me=e=>{const t={place:e=>{var t;K(null!==(t=e)&&void 0!==t?t:v);},content:e=>{z(null!=e?e:l);},html:e=>{M(null!=e?e:s);},variant:e=>{var t;Y(null!==(t=e)&&void 0!==t?t:p);},offset:e=>{V(null===e?m:Number(e));},wrapper:e=>{var t;ne(null!==(t=e)&&void 0!==t?t:f);},events:e=>{const t=null==e?void 0:e.split(" ");ce(null!=t?t:y);},"position-strategy":e=>{var t;se(null!==(t=e)&&void 0!==t?t:S);},"delay-show":e=>{G(null===e?_:Number(e));},"delay-hide":e=>{Q(null===e?g:Number(e));},float:e=>{ee(null===e?A:"true"===e);},hidden:e=>{re(null===e?T:"true"===e);}};Object.values(t).forEach((e=>e(null))),Object.entries(e).forEach((([e,r])=>{var o;null===(o=t[e])||void 0===o||o.call(t,r);}));};React.useEffect((()=>{z(l);}),[l]),React.useEffect((()=>{M(s);}),[s]),React.useEffect((()=>{K(v);}),[v]),React.useEffect((()=>{Y(p);}),[p]),React.useEffect((()=>{V(m);}),[m]),React.useEffect((()=>{G(_);}),[_]),React.useEffect((()=>{Q(g);}),[g]),React.useEffect((()=>{ee(A);}),[A]),React.useEffect((()=>{re(T);}),[T]),React.useEffect((()=>{se(S);}),[S]),React.useEffect((()=>{var e;const r=new Set(de);let l=n;if(!l&&t&&(l=`[data-tooltip-id='${t}']`),l)try{document.querySelectorAll(l).forEach((e=>{r.add({current:e});}));}catch(e){console.warn(`[react-tooltip] "${l}" is not a valid CSS selector`);}const c=document.querySelector(`[id='${o}']`);if(c&&r.add({current:c}),!r.size)return ()=>null;const i=null!==(e=null!=ae?ae:c)&&void 0!==e?e:pe.current,s=new MutationObserver((e=>{e.forEach((e=>{var t;if(!i||"attributes"!==e.type||!(null===(t=e.attributeName)||void 0===t?void 0:t.startsWith("data-tooltip-")))return;const r=ve(i);me(r);}));})),a={attributes:!0,childList:!1,subtree:!1};if(i){const e=ve(i);me(e),s.observe(i,a);}return ()=>{s.disconnect();}}),[de,pe,ae,o,n]);let fe=h;const he=React.useRef(null);if(a){const t=a({content:null!=q?q:null,activeAnchor:ae});fe=t?React.createElement("div",{ref:he,className:"react-tooltip-content-wrapper"},t):null;}else q&&(fe=q);W&&(fe=React.createElement(j,{content:W}));const ye={id:t,anchorId:o,anchorSelect:n,className:u,classNameArrow:d,content:fe,contentWrapperRef:he,place:P,variant:X,offset:F,wrapper:oe,events:le,openOnClick:w,positionStrategy:ie,middlewares:E,delayShow:Z,delayHide:J,float:U,hidden:te,noArrow:O,clickable:L,closeOnEsc:R,closeOnScroll:k,closeOnResize:N,style:x,position:I,isOpen:C,setIsOpen:$,afterShow:B,afterHide:H,activeAnchor:ae,setActiveAnchor:e=>ue(e)};return React.createElement(D,{...ye})};y({css:`:root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9}.core-styles-module_tooltip__3vRRp{visibility:hidden;position:absolute;top:0;left:0;pointer-events:none;opacity:0;transition:opacity 0.3s ease-out;will-change:opacity,visibility}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{visibility:visible;opacity:var(--rt-opacity)}`,type:"core"}),y({css:`
.styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px;transform:rotate(45deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}`});

  const Light = () => /*#__PURE__*/React.createElement("svg", {
    version: "1.0",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1000.000000pt",
    height: "1000.000000pt",
    viewBox: "0 0 1000.000000 1000.000000",
    preserveAspectRatio: "xMidYMid meet"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(0.000000,1000.000000) scale(0.100000,-0.100000)",
    fill: "var(--purple6)",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1335 9985 c-339 -54 -621 -200 -871 -449 -253 -253 -397 -535 -450\n-881 -20 -134 -20 -7176 0 -7310 53 -346 197 -628 450 -881 253 -253 535 -397\n881 -450 134 -20 7176 -20 7310 0 346 53 628 197 881 450 253 253 397 535 450\n881 11 75 14 670 14 3655 0 2985 -3 3580 -14 3655 -53 346 -197 628 -450 881\n-253 253 -535 397 -881 450 -128 20 -7196 19 -7320 -1z"
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(0.000000,1000.000000) scale(0.100000,-0.100000)",
    fill: "white",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4775 8709 c-224 -17 -481 -58 -710 -115 -920 -228 -1557 -759 -1800\n-1499 -80 -242 -109 -441 -109 -735 1 -380 60 -651 200 -920 72 -138 160 -255\n297 -392 260 -262 494 -409 892 -561 263 -100 624 -214 980 -307 88 -23 234\n-62 324 -87 90 -24 167 -41 171 -36 4 4 31 109 59 233 67 287 70 300 79 300 4\n0 129 -96 277 -213 149 -117 492 -387 762 -600 271 -214 495 -393 499 -398 3\n-6 4 -13 1 -15 -10 -10 -1979 -665 -1984 -660 -3 3 17 103 46 222 28 119 48\n220 45 225 -3 5 -13 9 -22 9 -26 0 -242 56 -389 101 -272 83 -550 194 -848\n339 -353 173 -597 325 -867 542 -53 43 -103 78 -110 78 -14 0 -871 -1736 -876\n-1774 -2 -17 20 -37 105 -97 253 -179 464 -305 738 -439 707 -345 1515 -562\n2305 -620 176 -13 649 -13 821 0 529 41 1047 177 1428 376 467 243 825 611\n1002 1029 119 282 169 548 169 906 0 394 -56 670 -191 944 -76 156 -166 279\n-314 433 -198 207 -381 347 -600 459 -126 64 -421 181 -675 268 -395 134\n-1088 334 -1099 317 -3 -6 -33 -126 -66 -266 -33 -141 -62 -256 -65 -256 -3 0\n-161 122 -350 272 -190 149 -534 420 -765 601 -231 181 -424 334 -430 339 -6\n6 -5 12 4 17 25 16 1979 666 1985 660 3 -3 -24 -128 -59 -279 -36 -150 -65\n-276 -65 -280 0 -4 57 -22 128 -40 250 -65 676 -216 997 -355 144 -62 524\n-249 650 -319 55 -31 104 -55 110 -52 6 2 77 143 157 312 543 1142 698 1471\n698 1486 0 19 -161 116 -370 222 -670 340 -1524 572 -2300 626 -168 11 -704\n11 -865 -1z"
  })));
  const Loader = ({
    className
  }) => /*#__PURE__*/React.createElement("div", {
    className: (className || ' ') + 'custom-loader'
  }, /*#__PURE__*/React.createElement(Light, null));

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
  const isReact16 = canUseDOM && ReactDOM.createPortal !== undefined;
  let createHTMLElement = name => document.createElement(name);
  const getCreatePortal = () => isReact16 ? ReactDOM.createPortal : ReactDOM.unstable_renderSubtreeIntoContainer;
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
      overlayElement: (props, contentEl) => /*#__PURE__*/React.createElement("div", props, contentEl),
      contentElement: (props, children) => /*#__PURE__*/React.createElement("div", props, children)
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
      !isReact16 && ReactDOM.unmountComponentAtNode(this.node);
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
      const portal = createPortal(this, /*#__PURE__*/React.createElement(ModalPortal, _extends$1({
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
      return createPortal( /*#__PURE__*/React.createElement(ModalPortal, _extends$1({
        ref: this.portalRef,
        defaultStyles: Modal.defaultStyles
      }, this.props)), this.node);
    }
  }

  Modal.setAppElement("#modal");
  const ModalContainer = ({
    width,
    height,
    children,
    className,
    confirm,
    visible,
    skipClose,
    open,
    closeModal,
    wrapClassName = "",
    modalClassName = "",
    ...rest
  }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    React.useEffect(() => {
      if (open) {
        openModal();
      } else {
        closeModalAction(true);
      }
    }, [open]);
    const openModal = () => {
      setModalIsOpen(true);
    };
    const closeModalAction = initial => {
      setModalIsOpen(false);
      closeModal(initial);
    };
    let customStyles = {
      content: {},
      overlay: {}
    };
    if (width) {
      customStyles.content.width = width;
      customStyles.content.height = height;
    }
    return /*#__PURE__*/React.createElement(Modal, _extends$1({
      parentSelector: () => document.querySelector('#modal'),
      isOpen: modalIsOpen,
      onRequestClose: () => closeModalAction(),
      style: customStyles,
      closeTimeoutMS: 0,
      overlayClassName: "sellix-overlay",
      className: `sellix-modal ${className ? className : ''} ${confirm ? 'confirm' : ''} ${visible ? 'visible' : ''}`,
      shouldCloseOnOverlayClick: !skipClose,
      wrapClassName: wrapClassName,
      modalClassName: modalClassName
    }, rest), !skipClose && /*#__PURE__*/React.createElement("div", {
      className: "sellix-modal-close",
      onClick: () => closeModalAction()
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-light fa-times",
      style: {
        color: "var(--black9)",
        fontSize: "1.25rem"
      }
    })), children);
  };

  const initialValue$3 = {
    i18n: {
      t: phrase => phrase
    }
  };
  const I18nContext = /*#__PURE__*/React.createContext(initialValue$3);
  const useI18nContext = (keyPrefix = '') => {
    const context = React.useContext(I18nContext);
    const {
      i18n
    } = context;
    const t = React.useCallback((key, options, ...args) => {
      const translationKey = `${keyPrefix}.${key}`;
      const translation = i18n.t(translationKey, options, ...args);
      if (translation === translationKey) {
        return i18n.t(key, options, ...args);
      }
      return translation;
    }, [context, keyPrefix]);
    if (!keyPrefix) {
      return context;
    }
    return {
      ...context,
      i18n: {
        ...i18n,
        t
      }
    };
  };

  const AlertPartial = ({
    openModal,
    closeModal,
    invoice
  }) => {
    const {
      i18n
    } = useI18nContext();
    let receivedMessage = '';
    let name = '';
    if (invoice.cashapp_partial_amount_received) {
      receivedMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, "$", invoice.cashapp_partial_amount_received), ' ', i18n.t('shop.invoice.invoiceDetails.alerts.partial.of'), ' ', /*#__PURE__*/React.createElement("b", null, "$", invoice.total_display));
      name = i18n.t('shop.invoice.invoiceDetails.alerts.partial.payments');
    } else {
      receivedMessage = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, invoice.crypto_received), ' ', i18n.t('shop.invoice.invoiceDetails.alerts.partial.of'), ' ', /*#__PURE__*/React.createElement("b", null, invoice.crypto_amount));
      name = i18n.t('shop.invoice.invoiceDetails.alerts.partial.transaction');
    }
    return /*#__PURE__*/React.createElement(ModalContainer, {
      open: openModal,
      closeModal: closeModal,
      className: "partial"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sellix-modal-header"
    }, i18n.t('shop.invoice.invoiceDetails.alerts.partial.title')), /*#__PURE__*/React.createElement("div", {
      className: "sellix-modal-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "partial-icon"
    }, /*#__PURE__*/React.createElement("div", {
      className: "elem-1"
    }), /*#__PURE__*/React.createElement("div", {
      className: "elem-2"
    })), /*#__PURE__*/React.createElement("div", {
      className: "partial-text"
    }, i18n.t('shop.invoice.invoiceDetails.alerts.partial.message.0', {
      name: name
    }), i18n.t('shop.invoice.invoiceDetails.alerts.partial.message.1'), " ", receivedMessage, i18n.t('shop.invoice.invoiceDetails.alerts.partial.message.2')))));
  };
  const AlertCanceled = ({
    refunded,
    reversed
  }) => {
    const {
      i18n
    } = useI18nContext();
    let message = i18n.t('shop.invoice.invoiceDetails.alerts.canceled.message');
    if (refunded) {
      message = i18n.t('shop.invoice.invoiceDetails.alerts.canceled.messageRefunded');
    }
    if (reversed) {
      message = i18n.t('shop.invoice.invoiceDetails.alerts.canceled.messageReversed');
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "cancelled-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cancelled"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cancelled-icon"
    }, /*#__PURE__*/React.createElement("span", {
      className: "elem-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "elem-2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "elem-3"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cancelled-text"
    }, message)));
  };
  const AlertDispute = () => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: "dispute-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dispute"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dispute-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-gavel"
    })), /*#__PURE__*/React.createElement("div", {
      className: "dispute-text"
    }, i18n.t('shop.invoice.invoiceDetails.alerts.dispute.message'))));
  };
  const AlertAwait = ({
    cashapp
  }) => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: "await-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "await"
    }, /*#__PURE__*/React.createElement("div", {
      className: "await-icon"
    }, /*#__PURE__*/React.createElement("div", {
      className: "elem"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-hourglass-half"
    })), /*#__PURE__*/React.createElement("div", {
      className: "await-text"
    }, cashapp ? /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.alerts.await.messageCashApp.0'), ' ', /*#__PURE__*/React.createElement("b", {
      style: {
        color: '#00d81e'
      }
    }, "Cash App"), ' ', i18n.t('shop.invoice.invoiceDetails.alerts.await.messageCashApp.1'), /*#__PURE__*/React.createElement("br", null), i18n.t('shop.invoice.invoiceDetails.alerts.await.messageCashApp.2'), /*#__PURE__*/React.createElement("br", null), i18n.t('shop.invoice.invoiceDetails.alerts.await.messageCashApp.3')) : /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.alerts.await.message.0'), /*#__PURE__*/React.createElement("br", null), i18n.t('shop.invoice.invoiceDetails.alerts.await.message.1')))));
  };
  const AlertProcessing = ({
    message: Message
  }) => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: "processing-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "processing"
    }, /*#__PURE__*/React.createElement("div", {
      className: "processing-icon"
    }, /*#__PURE__*/React.createElement("div", {
      className: "elem"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fas fa-hourglass-half"
    })), /*#__PURE__*/React.createElement("div", {
      className: "processing-text"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.alerts.processing.message')))));
  };

  const Icon = () => /*#__PURE__*/React.createElement("svg", {
    width: "24px",
    height: "24px",
    viewBox: "0 0 24 24",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 L12,2 Z M13,17 L11,17 L11,15 L13,15 L13,17 L13,17 Z M13,13 L11,13 L11,7 L13,7 L13,13 L13,13 Z"
  })));
  const Alert$1 = ({
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
    return /*#__PURE__*/React.createElement("div", {
      className: `sellix-widget alert ${small ? 'small' : ''} ${className ? className : ''} fade ${show ? 'show' : ''} ${red ? 'red' : ''} ${blue ? 'blue' : ''}`
    }, skipTitle ? null : /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Icon, null), title), /*#__PURE__*/React.createElement("span", null, text));
  };

  var Component = {};

  var toggleSelection = function () {
    var selection = document.getSelection();
    if (!selection.rangeCount) {
      return function () {};
    }
    var active = document.activeElement;

    var ranges = [];
    for (var i = 0; i < selection.rangeCount; i++) {
      ranges.push(selection.getRangeAt(i));
    }

    switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
      case 'INPUT':
      case 'TEXTAREA':
        active.blur();
        break;

      default:
        active = null;
        break;
    }

    selection.removeAllRanges();
    return function () {
      selection.type === 'Caret' &&
      selection.removeAllRanges();

      if (!selection.rangeCount) {
        ranges.forEach(function(range) {
          selection.addRange(range);
        });
      }

      active &&
      active.focus();
    };
  };

  var deselectCurrent = toggleSelection;

  var clipboardToIE11Formatting = {
    "text/plain": "Text",
    "text/html": "Url",
    "default": "Text"
  };

  var defaultMessage = "Copy to clipboard: #{key}, Enter";

  function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
    return message.replace(/#{\s*key\s*}/g, copyKey);
  }

  function copy(text, options) {
    var debug,
      message,
      reselectPrevious,
      range,
      selection,
      mark,
      success = false;
    if (!options) {
      options = {};
    }
    debug = options.debug || false;
    try {
      reselectPrevious = deselectCurrent();

      range = document.createRange();
      selection = document.getSelection();

      mark = document.createElement("span");
      mark.textContent = text;
      // avoid screen readers from reading out loud the text
      mark.ariaHidden = "true";
      // reset user styles for span element
      mark.style.all = "unset";
      // prevents scrolling to the end of the page
      mark.style.position = "fixed";
      mark.style.top = 0;
      mark.style.clip = "rect(0, 0, 0, 0)";
      // used to preserve spaces and line breaks
      mark.style.whiteSpace = "pre";
      // do not inherit user-select (it may be `none`)
      mark.style.webkitUserSelect = "text";
      mark.style.MozUserSelect = "text";
      mark.style.msUserSelect = "text";
      mark.style.userSelect = "text";
      mark.addEventListener("copy", function(e) {
        e.stopPropagation();
        if (options.format) {
          e.preventDefault();
          if (typeof e.clipboardData === "undefined") { // IE 11
            debug && console.warn("unable to use e.clipboardData");
            debug && console.warn("trying IE specific stuff");
            window.clipboardData.clearData();
            var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
            window.clipboardData.setData(format, text);
          } else { // all other browsers
            e.clipboardData.clearData();
            e.clipboardData.setData(options.format, text);
          }
        }
        if (options.onCopy) {
          e.preventDefault();
          options.onCopy(e.clipboardData);
        }
      });

      document.body.appendChild(mark);

      range.selectNodeContents(mark);
      selection.addRange(range);

      var successful = document.execCommand("copy");
      if (!successful) {
        throw new Error("copy command was unsuccessful");
      }
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using execCommand: ", err);
      debug && console.warn("trying IE specific stuff");
      try {
        window.clipboardData.setData(options.format || "text", text);
        options.onCopy && options.onCopy(window.clipboardData);
        success = true;
      } catch (err) {
        debug && console.error("unable to copy using clipboardData: ", err);
        debug && console.error("falling back to prompt");
        message = format("message" in options ? options.message : defaultMessage);
        window.prompt(message, text);
      }
    } finally {
      if (selection) {
        if (typeof selection.removeRange == "function") {
          selection.removeRange(range);
        } else {
          selection.removeAllRanges();
        }
      }

      if (mark) {
        document.body.removeChild(mark);
      }
      reselectPrevious();
    }

    return success;
  }

  var copyToClipboard = copy;

  function _typeof$1(obj) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof$1(obj); }

  Object.defineProperty(Component, "__esModule", {
    value: true
  });
  Component.CopyToClipboard = void 0;

  var _react = _interopRequireDefault(React);

  var _copyToClipboard = _interopRequireDefault(copyToClipboard);

  var _excluded = ["text", "onCopy", "options", "children"];

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var CopyToClipboard$1 = /*#__PURE__*/function (_React$PureComponent) {
    _inherits(CopyToClipboard, _React$PureComponent);

    var _super = _createSuper(CopyToClipboard);

    function CopyToClipboard() {
      var _this;

      _classCallCheck(this, CopyToClipboard);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "onClick", function (event) {
        var _this$props = _this.props,
            text = _this$props.text,
            onCopy = _this$props.onCopy,
            children = _this$props.children,
            options = _this$props.options;

        var elem = _react["default"].Children.only(children);

        var result = (0, _copyToClipboard["default"])(text, options);

        if (onCopy) {
          onCopy(text, result);
        } // Bypass onClick if it was present


        if (elem && elem.props && typeof elem.props.onClick === 'function') {
          elem.props.onClick(event);
        }
      });

      return _this;
    }

    _createClass(CopyToClipboard, [{
      key: "render",
      value: function render() {
        var _this$props2 = this.props;
            _this$props2.text;
            _this$props2.onCopy;
            _this$props2.options;
            var children = _this$props2.children,
            props = _objectWithoutProperties(_this$props2, _excluded);

        var elem = _react["default"].Children.only(children);

        return /*#__PURE__*/_react["default"].cloneElement(elem, _objectSpread(_objectSpread({}, props), {}, {
          onClick: this.onClick
        }));
      }
    }]);

    return CopyToClipboard;
  }(_react["default"].PureComponent);

  Component.CopyToClipboard = CopyToClipboard$1;

  _defineProperty(CopyToClipboard$1, "defaultProps", {
    onCopy: undefined,
    options: undefined
  });

  var _require = Component,
      CopyToClipboard = _require.CopyToClipboard;

  CopyToClipboard.CopyToClipboard = CopyToClipboard;
  var lib = CopyToClipboard;

  const Clipboard = ({
    tag = "span",
    text = '',
    onCopy,
    children,
    className
  }) => {
    const Component = tag;
    return /*#__PURE__*/React.createElement(lib.CopyToClipboard, {
      text: text,
      onCopy: onCopy
    }, /*#__PURE__*/React.createElement(Component, {
      className: `${className ? className : ''} cursor-pointer`
    }, children ? children : text));
  };

  const AddCircularIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.5 10H12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 7.5V12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const ArrowRightIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4.16675 10H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.8333 15L15.8333 10",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.8333 5L15.8333 10",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const CheckCircularIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.5 10L9.16667 11.6667L12.5 8.33333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const PlusCircularIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
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
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.75 9H11.25",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 6.75V11.25",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const CubeIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.81567 10.3947L16.1315 6.44737",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.5 6.44737L9.81579 10.3947V17.5L16.1316 13.5526V6.44737L9.81579 2.5L3.5 6.44737Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.5 6.44737V13.5526L9.81579 17.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const EmbedIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "null",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5.83333 6.66666L2.5 10L5.83333 13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.1667 6.66666L17.5001 10L14.1667 13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11.6666 3.33334L8.33325 16.6667",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const PlusIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 4.16667V15.8333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4.16675 10H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const RefreshIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3.375 9.16667C3.58574 7.55895 4.37518 6.08315 5.59557 5.01552C6.81595 3.94789 8.38359 3.36163 10.0051 3.36647C11.6265 3.37132 13.1906 3.96695 14.4046 5.04186C15.6186 6.11677 16.3992 7.59726 16.6003 9.20621C16.8014 10.8152 16.4093 12.4423 15.4972 13.7829C14.5852 15.1236 13.2158 16.0859 11.6455 16.4897C10.0751 16.8935 8.41136 16.7112 6.96573 15.9768C5.5201 15.2424 4.39166 14.0064 3.79167 12.5M3.375 16.6667V12.5H7.54167",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const UploadIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3.33325 14.1667V15.8333C3.33325 16.2754 3.50885 16.6993 3.82141 17.0118C4.13397 17.3244 4.55789 17.5 4.99992 17.5H14.9999C15.4419 17.5 15.8659 17.3244 16.1784 17.0118C16.491 16.6993 16.6666 16.2754 16.6666 15.8333V14.1667",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5.83325 7.5L9.99992 3.33333L14.1666 7.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 3.33333V13.3333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const InvoiceIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11.6667 2.5V5.83333C11.6667 6.05435 11.7545 6.26631 11.9108 6.42259C12.0671 6.57887 12.2791 6.66667 12.5001 6.66667H15.8334",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.1667 17.5H5.83341C5.39139 17.5 4.96746 17.3244 4.6549 17.0118C4.34234 16.6993 4.16675 16.2754 4.16675 15.8333V4.16667C4.16675 3.72464 4.34234 3.30072 4.6549 2.98816C4.96746 2.67559 5.39139 2.5 5.83341 2.5H11.6667L15.8334 6.66667V15.8333C15.8334 16.2754 15.6578 16.6993 15.3453 17.0118C15.0327 17.3244 14.6088 17.5 14.1667 17.5Z",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.5 5.83333H8.33333",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.5 10.8333H12.5",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.8333 14.1667H12.4999",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  };

  const SettingsIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    className: className,
    style: style,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7.74375 3.23775C8.06325 1.92075 9.93675 1.92075 10.2563 3.23775C10.3042 3.4356 10.3982 3.61933 10.5305 3.774C10.6629 3.92867 10.8299 4.04989 11.018 4.12781C11.2061 4.20573 11.4099 4.23814 11.6128 4.2224C11.8158 4.20667 12.0122 4.14323 12.186 4.03725C13.3432 3.33225 14.6685 4.65675 13.9635 5.81475C13.8577 5.98849 13.7943 6.18475 13.7786 6.38758C13.7629 6.59041 13.7953 6.79408 13.8731 6.98203C13.951 7.16999 14.0721 7.33693 14.2265 7.46929C14.381 7.60164 14.5646 7.69568 14.7623 7.74375C16.0793 8.06325 16.0793 9.93675 14.7623 10.2563C14.5644 10.3042 14.3807 10.3982 14.226 10.5305C14.0713 10.6629 13.9501 10.8299 13.8722 11.018C13.7943 11.2061 13.7619 11.4099 13.7776 11.6128C13.7933 11.8158 13.8568 12.0122 13.9628 12.186C14.6678 13.3432 13.3432 14.6685 12.1852 13.9635C12.0115 13.8577 11.8152 13.7943 11.6124 13.7786C11.4096 13.7629 11.2059 13.7953 11.018 13.8731C10.83 13.951 10.6631 14.0721 10.5307 14.2265C10.3984 14.381 10.3043 14.5646 10.2563 14.7623C9.93675 16.0793 8.06325 16.0793 7.74375 14.7623C7.69581 14.5644 7.60183 14.3807 7.46947 14.226C7.3371 14.0713 7.17008 13.9501 6.98201 13.8722C6.79394 13.7943 6.59013 13.7619 6.38716 13.7776C6.1842 13.7933 5.98781 13.8568 5.814 13.9628C4.65675 14.6678 3.3315 13.3432 4.0365 12.1852C4.14233 12.0115 4.20566 11.8152 4.22136 11.6124C4.23706 11.4096 4.20468 11.2059 4.12685 11.018C4.04903 10.83 3.92795 10.6631 3.77345 10.5307C3.61896 10.3984 3.43542 10.3043 3.23775 10.2563C1.92075 9.93675 1.92075 8.06325 3.23775 7.74375C3.4356 7.69581 3.61933 7.60183 3.774 7.46947C3.92867 7.3371 4.04989 7.17008 4.12781 6.98201C4.20573 6.79394 4.23814 6.59013 4.2224 6.38716C4.20667 6.1842 4.14323 5.98781 4.03725 5.814C3.33225 4.65675 4.65675 3.3315 5.81475 4.0365C6.56475 4.4925 7.53675 4.089 7.74375 3.23775Z",
    stroke: "#555D67",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z",
    stroke: "#555D67",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));

  const DeleteIcon = ({
    width = 20,
    height = 20,
    className,
    style
  }) => {
    return /*#__PURE__*/React.createElement("svg", {
      width: width,
      height: height,
      className: className,
      style: style,
      viewBox: "0 0 18 18",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 5.25H15",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.5 8.25V12.75",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.5 8.25V12.75",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.75 5.25L4.5 14.25C4.5 14.6478 4.65804 15.0294 4.93934 15.3107C5.22064 15.592 5.60218 15.75 6 15.75H12C12.3978 15.75 12.7794 15.592 13.0607 15.3107C13.342 15.0294 13.5 14.6478 13.5 14.25L14.25 5.25",
      stroke: "#D24242",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
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
    const iconClasses = ['icon'];
    if (iconPosition === 'right') {
      iconClasses.push('ml-2');
    } else {
      iconClasses.push('mr-2');
    }
    let icon = null;
    switch (iconName) {
      case 'plus':
        icon = /*#__PURE__*/React.createElement(PlusIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'arrow':
        icon = /*#__PURE__*/React.createElement(ArrowRightIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'cube':
        icon = /*#__PURE__*/React.createElement(CubeIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'embed':
        icon = /*#__PURE__*/React.createElement(EmbedIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'upload':
        icon = /*#__PURE__*/React.createElement(UploadIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'refresh':
        icon = /*#__PURE__*/React.createElement(RefreshIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'add-circular':
        icon = /*#__PURE__*/React.createElement(AddCircularIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'check-circular':
        icon = /*#__PURE__*/React.createElement(CheckCircularIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'plus-circular':
        icon = /*#__PURE__*/React.createElement(PlusCircularIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'invoice':
        icon = /*#__PURE__*/React.createElement(InvoiceIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'settings':
        icon = /*#__PURE__*/React.createElement(SettingsIcon, {
          className: iconClasses.join(' '),
          style: iconStyle
        });
        break;
      case 'delete':
        icon = /*#__PURE__*/React.createElement(DeleteIcon, {
          className: iconClasses.join(' '),
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
    return /*#__PURE__*/React.createElement("button", _extends$1({
      type: type,
      style: style,
      className: classes.join(' ')
    }, rest, {
      ref: setButton
    }), iconPosition === 'left' && icon, children, iconPosition === 'right' && icon);
  };

  const Index = ({
    purple,
    big
  }) => /*#__PURE__*/React.createElement("div", {
    className: `sk-circle-fade ${purple && 'purple' || ''} ${big && 'big' || ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sk-circle-fade-dot"
  }));

  var qrcode = {exports: {}};

  (function (module, exports) {
  	//---------------------------------------------------------------------
  	//
  	// QR Code Generator for JavaScript
  	//
  	// Copyright (c) 2009 Kazuhiko Arase
  	//
  	// URL: http://www.d-project.com/
  	//
  	// Licensed under the MIT license:
  	//  http://www.opensource.org/licenses/mit-license.php
  	//
  	// The word 'QR Code' is registered trademark of
  	// DENSO WAVE INCORPORATED
  	//  http://www.denso-wave.com/qrcode/faqpatent-e.html
  	//
  	//---------------------------------------------------------------------

  	var qrcode = function() {

  	  //---------------------------------------------------------------------
  	  // qrcode
  	  //---------------------------------------------------------------------

  	  /**
  	   * qrcode
  	   * @param typeNumber 1 to 40
  	   * @param errorCorrectionLevel 'L','M','Q','H'
  	   */
  	  var qrcode = function(typeNumber, errorCorrectionLevel) {

  	    var PAD0 = 0xEC;
  	    var PAD1 = 0x11;

  	    var _typeNumber = typeNumber;
  	    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  	    var _modules = null;
  	    var _moduleCount = 0;
  	    var _dataCache = null;
  	    var _dataList = [];

  	    var _this = {};

  	    var makeImpl = function(test, maskPattern) {

  	      _moduleCount = _typeNumber * 4 + 17;
  	      _modules = function(moduleCount) {
  	        var modules = new Array(moduleCount);
  	        for (var row = 0; row < moduleCount; row += 1) {
  	          modules[row] = new Array(moduleCount);
  	          for (var col = 0; col < moduleCount; col += 1) {
  	            modules[row][col] = null;
  	          }
  	        }
  	        return modules;
  	      }(_moduleCount);

  	      setupPositionProbePattern(0, 0);
  	      setupPositionProbePattern(_moduleCount - 7, 0);
  	      setupPositionProbePattern(0, _moduleCount - 7);
  	      setupPositionAdjustPattern();
  	      setupTimingPattern();
  	      setupTypeInfo(test, maskPattern);

  	      if (_typeNumber >= 7) {
  	        setupTypeNumber(test);
  	      }

  	      if (_dataCache == null) {
  	        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
  	      }

  	      mapData(_dataCache, maskPattern);
  	    };

  	    var setupPositionProbePattern = function(row, col) {

  	      for (var r = -1; r <= 7; r += 1) {

  	        if (row + r <= -1 || _moduleCount <= row + r) continue;

  	        for (var c = -1; c <= 7; c += 1) {

  	          if (col + c <= -1 || _moduleCount <= col + c) continue;

  	          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
  	              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
  	              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
  	            _modules[row + r][col + c] = true;
  	          } else {
  	            _modules[row + r][col + c] = false;
  	          }
  	        }
  	      }
  	    };

  	    var getBestMaskPattern = function() {

  	      var minLostPoint = 0;
  	      var pattern = 0;

  	      for (var i = 0; i < 8; i += 1) {

  	        makeImpl(true, i);

  	        var lostPoint = QRUtil.getLostPoint(_this);

  	        if (i == 0 || minLostPoint > lostPoint) {
  	          minLostPoint = lostPoint;
  	          pattern = i;
  	        }
  	      }

  	      return pattern;
  	    };

  	    var setupTimingPattern = function() {

  	      for (var r = 8; r < _moduleCount - 8; r += 1) {
  	        if (_modules[r][6] != null) {
  	          continue;
  	        }
  	        _modules[r][6] = (r % 2 == 0);
  	      }

  	      for (var c = 8; c < _moduleCount - 8; c += 1) {
  	        if (_modules[6][c] != null) {
  	          continue;
  	        }
  	        _modules[6][c] = (c % 2 == 0);
  	      }
  	    };

  	    var setupPositionAdjustPattern = function() {

  	      var pos = QRUtil.getPatternPosition(_typeNumber);

  	      for (var i = 0; i < pos.length; i += 1) {

  	        for (var j = 0; j < pos.length; j += 1) {

  	          var row = pos[i];
  	          var col = pos[j];

  	          if (_modules[row][col] != null) {
  	            continue;
  	          }

  	          for (var r = -2; r <= 2; r += 1) {

  	            for (var c = -2; c <= 2; c += 1) {

  	              if (r == -2 || r == 2 || c == -2 || c == 2
  	                  || (r == 0 && c == 0) ) {
  	                _modules[row + r][col + c] = true;
  	              } else {
  	                _modules[row + r][col + c] = false;
  	              }
  	            }
  	          }
  	        }
  	      }
  	    };

  	    var setupTypeNumber = function(test) {

  	      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

  	      for (var i = 0; i < 18; i += 1) {
  	        var mod = (!test && ( (bits >> i) & 1) == 1);
  	        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
  	      }

  	      for (var i = 0; i < 18; i += 1) {
  	        var mod = (!test && ( (bits >> i) & 1) == 1);
  	        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
  	      }
  	    };

  	    var setupTypeInfo = function(test, maskPattern) {

  	      var data = (_errorCorrectionLevel << 3) | maskPattern;
  	      var bits = QRUtil.getBCHTypeInfo(data);

  	      // vertical
  	      for (var i = 0; i < 15; i += 1) {

  	        var mod = (!test && ( (bits >> i) & 1) == 1);

  	        if (i < 6) {
  	          _modules[i][8] = mod;
  	        } else if (i < 8) {
  	          _modules[i + 1][8] = mod;
  	        } else {
  	          _modules[_moduleCount - 15 + i][8] = mod;
  	        }
  	      }

  	      // horizontal
  	      for (var i = 0; i < 15; i += 1) {

  	        var mod = (!test && ( (bits >> i) & 1) == 1);

  	        if (i < 8) {
  	          _modules[8][_moduleCount - i - 1] = mod;
  	        } else if (i < 9) {
  	          _modules[8][15 - i - 1 + 1] = mod;
  	        } else {
  	          _modules[8][15 - i - 1] = mod;
  	        }
  	      }

  	      // fixed module
  	      _modules[_moduleCount - 8][8] = (!test);
  	    };

  	    var mapData = function(data, maskPattern) {

  	      var inc = -1;
  	      var row = _moduleCount - 1;
  	      var bitIndex = 7;
  	      var byteIndex = 0;
  	      var maskFunc = QRUtil.getMaskFunction(maskPattern);

  	      for (var col = _moduleCount - 1; col > 0; col -= 2) {

  	        if (col == 6) col -= 1;

  	        while (true) {

  	          for (var c = 0; c < 2; c += 1) {

  	            if (_modules[row][col - c] == null) {

  	              var dark = false;

  	              if (byteIndex < data.length) {
  	                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
  	              }

  	              var mask = maskFunc(row, col - c);

  	              if (mask) {
  	                dark = !dark;
  	              }

  	              _modules[row][col - c] = dark;
  	              bitIndex -= 1;

  	              if (bitIndex == -1) {
  	                byteIndex += 1;
  	                bitIndex = 7;
  	              }
  	            }
  	          }

  	          row += inc;

  	          if (row < 0 || _moduleCount <= row) {
  	            row -= inc;
  	            inc = -inc;
  	            break;
  	          }
  	        }
  	      }
  	    };

  	    var createBytes = function(buffer, rsBlocks) {

  	      var offset = 0;

  	      var maxDcCount = 0;
  	      var maxEcCount = 0;

  	      var dcdata = new Array(rsBlocks.length);
  	      var ecdata = new Array(rsBlocks.length);

  	      for (var r = 0; r < rsBlocks.length; r += 1) {

  	        var dcCount = rsBlocks[r].dataCount;
  	        var ecCount = rsBlocks[r].totalCount - dcCount;

  	        maxDcCount = Math.max(maxDcCount, dcCount);
  	        maxEcCount = Math.max(maxEcCount, ecCount);

  	        dcdata[r] = new Array(dcCount);

  	        for (var i = 0; i < dcdata[r].length; i += 1) {
  	          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
  	        }
  	        offset += dcCount;

  	        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
  	        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

  	        var modPoly = rawPoly.mod(rsPoly);
  	        ecdata[r] = new Array(rsPoly.getLength() - 1);
  	        for (var i = 0; i < ecdata[r].length; i += 1) {
  	          var modIndex = i + modPoly.getLength() - ecdata[r].length;
  	          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
  	        }
  	      }

  	      var totalCodeCount = 0;
  	      for (var i = 0; i < rsBlocks.length; i += 1) {
  	        totalCodeCount += rsBlocks[i].totalCount;
  	      }

  	      var data = new Array(totalCodeCount);
  	      var index = 0;

  	      for (var i = 0; i < maxDcCount; i += 1) {
  	        for (var r = 0; r < rsBlocks.length; r += 1) {
  	          if (i < dcdata[r].length) {
  	            data[index] = dcdata[r][i];
  	            index += 1;
  	          }
  	        }
  	      }

  	      for (var i = 0; i < maxEcCount; i += 1) {
  	        for (var r = 0; r < rsBlocks.length; r += 1) {
  	          if (i < ecdata[r].length) {
  	            data[index] = ecdata[r][i];
  	            index += 1;
  	          }
  	        }
  	      }

  	      return data;
  	    };

  	    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

  	      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

  	      var buffer = qrBitBuffer();

  	      for (var i = 0; i < dataList.length; i += 1) {
  	        var data = dataList[i];
  	        buffer.put(data.getMode(), 4);
  	        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
  	        data.write(buffer);
  	      }

  	      // calc num max data.
  	      var totalDataCount = 0;
  	      for (var i = 0; i < rsBlocks.length; i += 1) {
  	        totalDataCount += rsBlocks[i].dataCount;
  	      }

  	      if (buffer.getLengthInBits() > totalDataCount * 8) {
  	        throw 'code length overflow. ('
  	          + buffer.getLengthInBits()
  	          + '>'
  	          + totalDataCount * 8
  	          + ')';
  	      }

  	      // end code
  	      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
  	        buffer.put(0, 4);
  	      }

  	      // padding
  	      while (buffer.getLengthInBits() % 8 != 0) {
  	        buffer.putBit(false);
  	      }

  	      // padding
  	      while (true) {

  	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
  	          break;
  	        }
  	        buffer.put(PAD0, 8);

  	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
  	          break;
  	        }
  	        buffer.put(PAD1, 8);
  	      }

  	      return createBytes(buffer, rsBlocks);
  	    };

  	    _this.addData = function(data, mode) {

  	      mode = mode || 'Byte';

  	      var newData = null;

  	      switch(mode) {
  	      case 'Numeric' :
  	        newData = qrNumber(data);
  	        break;
  	      case 'Alphanumeric' :
  	        newData = qrAlphaNum(data);
  	        break;
  	      case 'Byte' :
  	        newData = qr8BitByte(data);
  	        break;
  	      case 'Kanji' :
  	        newData = qrKanji(data);
  	        break;
  	      default :
  	        throw 'mode:' + mode;
  	      }

  	      _dataList.push(newData);
  	      _dataCache = null;
  	    };

  	    _this.isDark = function(row, col) {
  	      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
  	        throw row + ',' + col;
  	      }
  	      return _modules[row][col];
  	    };

  	    _this.getModuleCount = function() {
  	      return _moduleCount;
  	    };

  	    _this.make = function() {
  	      if (_typeNumber < 1) {
  	        var typeNumber = 1;

  	        for (; typeNumber < 40; typeNumber++) {
  	          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
  	          var buffer = qrBitBuffer();

  	          for (var i = 0; i < _dataList.length; i++) {
  	            var data = _dataList[i];
  	            buffer.put(data.getMode(), 4);
  	            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
  	            data.write(buffer);
  	          }

  	          var totalDataCount = 0;
  	          for (var i = 0; i < rsBlocks.length; i++) {
  	            totalDataCount += rsBlocks[i].dataCount;
  	          }

  	          if (buffer.getLengthInBits() <= totalDataCount * 8) {
  	            break;
  	          }
  	        }

  	        _typeNumber = typeNumber;
  	      }

  	      makeImpl(false, getBestMaskPattern() );
  	    };

  	    _this.createTableTag = function(cellSize, margin) {

  	      cellSize = cellSize || 2;
  	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

  	      var qrHtml = '';

  	      qrHtml += '<table style="';
  	      qrHtml += ' border-width: 0px; border-style: none;';
  	      qrHtml += ' border-collapse: collapse;';
  	      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
  	      qrHtml += '">';
  	      qrHtml += '<tbody>';

  	      for (var r = 0; r < _this.getModuleCount(); r += 1) {

  	        qrHtml += '<tr>';

  	        for (var c = 0; c < _this.getModuleCount(); c += 1) {
  	          qrHtml += '<td style="';
  	          qrHtml += ' border-width: 0px; border-style: none;';
  	          qrHtml += ' border-collapse: collapse;';
  	          qrHtml += ' padding: 0px; margin: 0px;';
  	          qrHtml += ' width: ' + cellSize + 'px;';
  	          qrHtml += ' height: ' + cellSize + 'px;';
  	          qrHtml += ' background-color: ';
  	          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
  	          qrHtml += ';';
  	          qrHtml += '"/>';
  	        }

  	        qrHtml += '</tr>';
  	      }

  	      qrHtml += '</tbody>';
  	      qrHtml += '</table>';

  	      return qrHtml;
  	    };

  	    _this.createSvgTag = function(cellSize, margin, alt, title) {

  	      var opts = {};
  	      if (typeof arguments[0] == 'object') {
  	        // Called by options.
  	        opts = arguments[0];
  	        // overwrite cellSize and margin.
  	        cellSize = opts.cellSize;
  	        margin = opts.margin;
  	        alt = opts.alt;
  	        title = opts.title;
  	      }

  	      cellSize = cellSize || 2;
  	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

  	      // Compose alt property surrogate
  	      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
  	      alt.text = alt.text || null;
  	      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

  	      // Compose title property surrogate
  	      title = (typeof title === 'string') ? {text: title} : title || {};
  	      title.text = title.text || null;
  	      title.id = (title.text) ? title.id || 'qrcode-title' : null;

  	      var size = _this.getModuleCount() * cellSize + margin * 2;
  	      var c, mc, r, mr, qrSvg='', rect;

  	      rect = 'l' + cellSize + ',0 0,' + cellSize +
  	        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

  	      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
  	      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
  	      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
  	      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
  	      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
  	          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
  	      qrSvg += '>';
  	      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
  	          escapeXml(title.text) + '</title>' : '';
  	      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
  	          escapeXml(alt.text) + '</description>' : '';
  	      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
  	      qrSvg += '<path d="';

  	      for (r = 0; r < _this.getModuleCount(); r += 1) {
  	        mr = r * cellSize + margin;
  	        for (c = 0; c < _this.getModuleCount(); c += 1) {
  	          if (_this.isDark(r, c) ) {
  	            mc = c*cellSize+margin;
  	            qrSvg += 'M' + mc + ',' + mr + rect;
  	          }
  	        }
  	      }

  	      qrSvg += '" stroke="transparent" fill="black"/>';
  	      qrSvg += '</svg>';

  	      return qrSvg;
  	    };

  	    _this.createDataURL = function(cellSize, margin) {

  	      cellSize = cellSize || 2;
  	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

  	      var size = _this.getModuleCount() * cellSize + margin * 2;
  	      var min = margin;
  	      var max = size - margin;

  	      return createDataURL(size, size, function(x, y) {
  	        if (min <= x && x < max && min <= y && y < max) {
  	          var c = Math.floor( (x - min) / cellSize);
  	          var r = Math.floor( (y - min) / cellSize);
  	          return _this.isDark(r, c)? 0 : 1;
  	        } else {
  	          return 1;
  	        }
  	      } );
  	    };

  	    _this.createImgTag = function(cellSize, margin, alt) {

  	      cellSize = cellSize || 2;
  	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

  	      var size = _this.getModuleCount() * cellSize + margin * 2;

  	      var img = '';
  	      img += '<img';
  	      img += '\u0020src="';
  	      img += _this.createDataURL(cellSize, margin);
  	      img += '"';
  	      img += '\u0020width="';
  	      img += size;
  	      img += '"';
  	      img += '\u0020height="';
  	      img += size;
  	      img += '"';
  	      if (alt) {
  	        img += '\u0020alt="';
  	        img += escapeXml(alt);
  	        img += '"';
  	      }
  	      img += '/>';

  	      return img;
  	    };

  	    var escapeXml = function(s) {
  	      var escaped = '';
  	      for (var i = 0; i < s.length; i += 1) {
  	        var c = s.charAt(i);
  	        switch(c) {
  	        case '<': escaped += '&lt;'; break;
  	        case '>': escaped += '&gt;'; break;
  	        case '&': escaped += '&amp;'; break;
  	        case '"': escaped += '&quot;'; break;
  	        default : escaped += c; break;
  	        }
  	      }
  	      return escaped;
  	    };

  	    var _createHalfASCII = function(margin) {
  	      var cellSize = 1;
  	      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

  	      var size = _this.getModuleCount() * cellSize + margin * 2;
  	      var min = margin;
  	      var max = size - margin;

  	      var y, x, r1, r2, p;

  	      var blocks = {
  	        '██': '█',
  	        '█ ': '▀',
  	        ' █': '▄',
  	        '  ': ' '
  	      };

  	      var blocksLastLineNoMargin = {
  	        '██': '▀',
  	        '█ ': '▀',
  	        ' █': ' ',
  	        '  ': ' '
  	      };

  	      var ascii = '';
  	      for (y = 0; y < size; y += 2) {
  	        r1 = Math.floor((y - min) / cellSize);
  	        r2 = Math.floor((y + 1 - min) / cellSize);
  	        for (x = 0; x < size; x += 1) {
  	          p = '█';

  	          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
  	            p = ' ';
  	          }

  	          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
  	            p += ' ';
  	          }
  	          else {
  	            p += '█';
  	          }

  	          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
  	          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
  	        }

  	        ascii += '\n';
  	      }

  	      if (size % 2 && margin > 0) {
  	        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
  	      }

  	      return ascii.substring(0, ascii.length-1);
  	    };

  	    _this.createASCII = function(cellSize, margin) {
  	      cellSize = cellSize || 1;

  	      if (cellSize < 2) {
  	        return _createHalfASCII(margin);
  	      }

  	      cellSize -= 1;
  	      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

  	      var size = _this.getModuleCount() * cellSize + margin * 2;
  	      var min = margin;
  	      var max = size - margin;

  	      var y, x, r, p;

  	      var white = Array(cellSize+1).join('██');
  	      var black = Array(cellSize+1).join('  ');

  	      var ascii = '';
  	      var line = '';
  	      for (y = 0; y < size; y += 1) {
  	        r = Math.floor( (y - min) / cellSize);
  	        line = '';
  	        for (x = 0; x < size; x += 1) {
  	          p = 1;

  	          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
  	            p = 0;
  	          }

  	          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
  	          line += p ? white : black;
  	        }

  	        for (r = 0; r < cellSize; r += 1) {
  	          ascii += line + '\n';
  	        }
  	      }

  	      return ascii.substring(0, ascii.length-1);
  	    };

  	    _this.renderTo2dContext = function(context, cellSize) {
  	      cellSize = cellSize || 2;
  	      var length = _this.getModuleCount();
  	      for (var row = 0; row < length; row++) {
  	        for (var col = 0; col < length; col++) {
  	          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
  	          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
  	        }
  	      }
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // qrcode.stringToBytes
  	  //---------------------------------------------------------------------

  	  qrcode.stringToBytesFuncs = {
  	    'default' : function(s) {
  	      var bytes = [];
  	      for (var i = 0; i < s.length; i += 1) {
  	        var c = s.charCodeAt(i);
  	        bytes.push(c & 0xff);
  	      }
  	      return bytes;
  	    }
  	  };

  	  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  	  //---------------------------------------------------------------------
  	  // qrcode.createStringToBytes
  	  //---------------------------------------------------------------------

  	  /**
  	   * @param unicodeData base64 string of byte array.
  	   * [16bit Unicode],[16bit Bytes], ...
  	   * @param numChars
  	   */
  	  qrcode.createStringToBytes = function(unicodeData, numChars) {

  	    // create conversion map.

  	    var unicodeMap = function() {

  	      var bin = base64DecodeInputStream(unicodeData);
  	      var read = function() {
  	        var b = bin.read();
  	        if (b == -1) throw 'eof';
  	        return b;
  	      };

  	      var count = 0;
  	      var unicodeMap = {};
  	      while (true) {
  	        var b0 = bin.read();
  	        if (b0 == -1) break;
  	        var b1 = read();
  	        var b2 = read();
  	        var b3 = read();
  	        var k = String.fromCharCode( (b0 << 8) | b1);
  	        var v = (b2 << 8) | b3;
  	        unicodeMap[k] = v;
  	        count += 1;
  	      }
  	      if (count != numChars) {
  	        throw count + ' != ' + numChars;
  	      }

  	      return unicodeMap;
  	    }();

  	    var unknownChar = '?'.charCodeAt(0);

  	    return function(s) {
  	      var bytes = [];
  	      for (var i = 0; i < s.length; i += 1) {
  	        var c = s.charCodeAt(i);
  	        if (c < 128) {
  	          bytes.push(c);
  	        } else {
  	          var b = unicodeMap[s.charAt(i)];
  	          if (typeof b == 'number') {
  	            if ( (b & 0xff) == b) {
  	              // 1byte
  	              bytes.push(b);
  	            } else {
  	              // 2bytes
  	              bytes.push(b >>> 8);
  	              bytes.push(b & 0xff);
  	            }
  	          } else {
  	            bytes.push(unknownChar);
  	          }
  	        }
  	      }
  	      return bytes;
  	    };
  	  };

  	  //---------------------------------------------------------------------
  	  // QRMode
  	  //---------------------------------------------------------------------

  	  var QRMode = {
  	    MODE_NUMBER :    1 << 0,
  	    MODE_ALPHA_NUM : 1 << 1,
  	    MODE_8BIT_BYTE : 1 << 2,
  	    MODE_KANJI :     1 << 3
  	  };

  	  //---------------------------------------------------------------------
  	  // QRErrorCorrectionLevel
  	  //---------------------------------------------------------------------

  	  var QRErrorCorrectionLevel = {
  	    L : 1,
  	    M : 0,
  	    Q : 3,
  	    H : 2
  	  };

  	  //---------------------------------------------------------------------
  	  // QRMaskPattern
  	  //---------------------------------------------------------------------

  	  var QRMaskPattern = {
  	    PATTERN000 : 0,
  	    PATTERN001 : 1,
  	    PATTERN010 : 2,
  	    PATTERN011 : 3,
  	    PATTERN100 : 4,
  	    PATTERN101 : 5,
  	    PATTERN110 : 6,
  	    PATTERN111 : 7
  	  };

  	  //---------------------------------------------------------------------
  	  // QRUtil
  	  //---------------------------------------------------------------------

  	  var QRUtil = function() {

  	    var PATTERN_POSITION_TABLE = [
  	      [],
  	      [6, 18],
  	      [6, 22],
  	      [6, 26],
  	      [6, 30],
  	      [6, 34],
  	      [6, 22, 38],
  	      [6, 24, 42],
  	      [6, 26, 46],
  	      [6, 28, 50],
  	      [6, 30, 54],
  	      [6, 32, 58],
  	      [6, 34, 62],
  	      [6, 26, 46, 66],
  	      [6, 26, 48, 70],
  	      [6, 26, 50, 74],
  	      [6, 30, 54, 78],
  	      [6, 30, 56, 82],
  	      [6, 30, 58, 86],
  	      [6, 34, 62, 90],
  	      [6, 28, 50, 72, 94],
  	      [6, 26, 50, 74, 98],
  	      [6, 30, 54, 78, 102],
  	      [6, 28, 54, 80, 106],
  	      [6, 32, 58, 84, 110],
  	      [6, 30, 58, 86, 114],
  	      [6, 34, 62, 90, 118],
  	      [6, 26, 50, 74, 98, 122],
  	      [6, 30, 54, 78, 102, 126],
  	      [6, 26, 52, 78, 104, 130],
  	      [6, 30, 56, 82, 108, 134],
  	      [6, 34, 60, 86, 112, 138],
  	      [6, 30, 58, 86, 114, 142],
  	      [6, 34, 62, 90, 118, 146],
  	      [6, 30, 54, 78, 102, 126, 150],
  	      [6, 24, 50, 76, 102, 128, 154],
  	      [6, 28, 54, 80, 106, 132, 158],
  	      [6, 32, 58, 84, 110, 136, 162],
  	      [6, 26, 54, 82, 110, 138, 166],
  	      [6, 30, 58, 86, 114, 142, 170]
  	    ];
  	    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
  	    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
  	    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

  	    var _this = {};

  	    var getBCHDigit = function(data) {
  	      var digit = 0;
  	      while (data != 0) {
  	        digit += 1;
  	        data >>>= 1;
  	      }
  	      return digit;
  	    };

  	    _this.getBCHTypeInfo = function(data) {
  	      var d = data << 10;
  	      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
  	        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
  	      }
  	      return ( (data << 10) | d) ^ G15_MASK;
  	    };

  	    _this.getBCHTypeNumber = function(data) {
  	      var d = data << 12;
  	      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
  	        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
  	      }
  	      return (data << 12) | d;
  	    };

  	    _this.getPatternPosition = function(typeNumber) {
  	      return PATTERN_POSITION_TABLE[typeNumber - 1];
  	    };

  	    _this.getMaskFunction = function(maskPattern) {

  	      switch (maskPattern) {

  	      case QRMaskPattern.PATTERN000 :
  	        return function(i, j) { return (i + j) % 2 == 0; };
  	      case QRMaskPattern.PATTERN001 :
  	        return function(i, j) { return i % 2 == 0; };
  	      case QRMaskPattern.PATTERN010 :
  	        return function(i, j) { return j % 3 == 0; };
  	      case QRMaskPattern.PATTERN011 :
  	        return function(i, j) { return (i + j) % 3 == 0; };
  	      case QRMaskPattern.PATTERN100 :
  	        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
  	      case QRMaskPattern.PATTERN101 :
  	        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
  	      case QRMaskPattern.PATTERN110 :
  	        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
  	      case QRMaskPattern.PATTERN111 :
  	        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

  	      default :
  	        throw 'bad maskPattern:' + maskPattern;
  	      }
  	    };

  	    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
  	      var a = qrPolynomial([1], 0);
  	      for (var i = 0; i < errorCorrectLength; i += 1) {
  	        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
  	      }
  	      return a;
  	    };

  	    _this.getLengthInBits = function(mode, type) {

  	      if (1 <= type && type < 10) {

  	        // 1 - 9

  	        switch(mode) {
  	        case QRMode.MODE_NUMBER    : return 10;
  	        case QRMode.MODE_ALPHA_NUM : return 9;
  	        case QRMode.MODE_8BIT_BYTE : return 8;
  	        case QRMode.MODE_KANJI     : return 8;
  	        default :
  	          throw 'mode:' + mode;
  	        }

  	      } else if (type < 27) {

  	        // 10 - 26

  	        switch(mode) {
  	        case QRMode.MODE_NUMBER    : return 12;
  	        case QRMode.MODE_ALPHA_NUM : return 11;
  	        case QRMode.MODE_8BIT_BYTE : return 16;
  	        case QRMode.MODE_KANJI     : return 10;
  	        default :
  	          throw 'mode:' + mode;
  	        }

  	      } else if (type < 41) {

  	        // 27 - 40

  	        switch(mode) {
  	        case QRMode.MODE_NUMBER    : return 14;
  	        case QRMode.MODE_ALPHA_NUM : return 13;
  	        case QRMode.MODE_8BIT_BYTE : return 16;
  	        case QRMode.MODE_KANJI     : return 12;
  	        default :
  	          throw 'mode:' + mode;
  	        }

  	      } else {
  	        throw 'type:' + type;
  	      }
  	    };

  	    _this.getLostPoint = function(qrcode) {

  	      var moduleCount = qrcode.getModuleCount();

  	      var lostPoint = 0;

  	      // LEVEL1

  	      for (var row = 0; row < moduleCount; row += 1) {
  	        for (var col = 0; col < moduleCount; col += 1) {

  	          var sameCount = 0;
  	          var dark = qrcode.isDark(row, col);

  	          for (var r = -1; r <= 1; r += 1) {

  	            if (row + r < 0 || moduleCount <= row + r) {
  	              continue;
  	            }

  	            for (var c = -1; c <= 1; c += 1) {

  	              if (col + c < 0 || moduleCount <= col + c) {
  	                continue;
  	              }

  	              if (r == 0 && c == 0) {
  	                continue;
  	              }

  	              if (dark == qrcode.isDark(row + r, col + c) ) {
  	                sameCount += 1;
  	              }
  	            }
  	          }

  	          if (sameCount > 5) {
  	            lostPoint += (3 + sameCount - 5);
  	          }
  	        }
  	      }
  	      // LEVEL2

  	      for (var row = 0; row < moduleCount - 1; row += 1) {
  	        for (var col = 0; col < moduleCount - 1; col += 1) {
  	          var count = 0;
  	          if (qrcode.isDark(row, col) ) count += 1;
  	          if (qrcode.isDark(row + 1, col) ) count += 1;
  	          if (qrcode.isDark(row, col + 1) ) count += 1;
  	          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
  	          if (count == 0 || count == 4) {
  	            lostPoint += 3;
  	          }
  	        }
  	      }

  	      // LEVEL3

  	      for (var row = 0; row < moduleCount; row += 1) {
  	        for (var col = 0; col < moduleCount - 6; col += 1) {
  	          if (qrcode.isDark(row, col)
  	              && !qrcode.isDark(row, col + 1)
  	              &&  qrcode.isDark(row, col + 2)
  	              &&  qrcode.isDark(row, col + 3)
  	              &&  qrcode.isDark(row, col + 4)
  	              && !qrcode.isDark(row, col + 5)
  	              &&  qrcode.isDark(row, col + 6) ) {
  	            lostPoint += 40;
  	          }
  	        }
  	      }

  	      for (var col = 0; col < moduleCount; col += 1) {
  	        for (var row = 0; row < moduleCount - 6; row += 1) {
  	          if (qrcode.isDark(row, col)
  	              && !qrcode.isDark(row + 1, col)
  	              &&  qrcode.isDark(row + 2, col)
  	              &&  qrcode.isDark(row + 3, col)
  	              &&  qrcode.isDark(row + 4, col)
  	              && !qrcode.isDark(row + 5, col)
  	              &&  qrcode.isDark(row + 6, col) ) {
  	            lostPoint += 40;
  	          }
  	        }
  	      }

  	      // LEVEL4

  	      var darkCount = 0;

  	      for (var col = 0; col < moduleCount; col += 1) {
  	        for (var row = 0; row < moduleCount; row += 1) {
  	          if (qrcode.isDark(row, col) ) {
  	            darkCount += 1;
  	          }
  	        }
  	      }

  	      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
  	      lostPoint += ratio * 10;

  	      return lostPoint;
  	    };

  	    return _this;
  	  }();

  	  //---------------------------------------------------------------------
  	  // QRMath
  	  //---------------------------------------------------------------------

  	  var QRMath = function() {

  	    var EXP_TABLE = new Array(256);
  	    var LOG_TABLE = new Array(256);

  	    // initialize tables
  	    for (var i = 0; i < 8; i += 1) {
  	      EXP_TABLE[i] = 1 << i;
  	    }
  	    for (var i = 8; i < 256; i += 1) {
  	      EXP_TABLE[i] = EXP_TABLE[i - 4]
  	        ^ EXP_TABLE[i - 5]
  	        ^ EXP_TABLE[i - 6]
  	        ^ EXP_TABLE[i - 8];
  	    }
  	    for (var i = 0; i < 255; i += 1) {
  	      LOG_TABLE[EXP_TABLE[i] ] = i;
  	    }

  	    var _this = {};

  	    _this.glog = function(n) {

  	      if (n < 1) {
  	        throw 'glog(' + n + ')';
  	      }

  	      return LOG_TABLE[n];
  	    };

  	    _this.gexp = function(n) {

  	      while (n < 0) {
  	        n += 255;
  	      }

  	      while (n >= 256) {
  	        n -= 255;
  	      }

  	      return EXP_TABLE[n];
  	    };

  	    return _this;
  	  }();

  	  //---------------------------------------------------------------------
  	  // qrPolynomial
  	  //---------------------------------------------------------------------

  	  function qrPolynomial(num, shift) {

  	    if (typeof num.length == 'undefined') {
  	      throw num.length + '/' + shift;
  	    }

  	    var _num = function() {
  	      var offset = 0;
  	      while (offset < num.length && num[offset] == 0) {
  	        offset += 1;
  	      }
  	      var _num = new Array(num.length - offset + shift);
  	      for (var i = 0; i < num.length - offset; i += 1) {
  	        _num[i] = num[i + offset];
  	      }
  	      return _num;
  	    }();

  	    var _this = {};

  	    _this.getAt = function(index) {
  	      return _num[index];
  	    };

  	    _this.getLength = function() {
  	      return _num.length;
  	    };

  	    _this.multiply = function(e) {

  	      var num = new Array(_this.getLength() + e.getLength() - 1);

  	      for (var i = 0; i < _this.getLength(); i += 1) {
  	        for (var j = 0; j < e.getLength(); j += 1) {
  	          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
  	        }
  	      }

  	      return qrPolynomial(num, 0);
  	    };

  	    _this.mod = function(e) {

  	      if (_this.getLength() - e.getLength() < 0) {
  	        return _this;
  	      }

  	      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

  	      var num = new Array(_this.getLength() );
  	      for (var i = 0; i < _this.getLength(); i += 1) {
  	        num[i] = _this.getAt(i);
  	      }

  	      for (var i = 0; i < e.getLength(); i += 1) {
  	        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
  	      }

  	      // recursive call
  	      return qrPolynomial(num, 0).mod(e);
  	    };

  	    return _this;
  	  }
  	  //---------------------------------------------------------------------
  	  // QRRSBlock
  	  //---------------------------------------------------------------------

  	  var QRRSBlock = function() {

  	    var RS_BLOCK_TABLE = [

  	      // L
  	      // M
  	      // Q
  	      // H

  	      // 1
  	      [1, 26, 19],
  	      [1, 26, 16],
  	      [1, 26, 13],
  	      [1, 26, 9],

  	      // 2
  	      [1, 44, 34],
  	      [1, 44, 28],
  	      [1, 44, 22],
  	      [1, 44, 16],

  	      // 3
  	      [1, 70, 55],
  	      [1, 70, 44],
  	      [2, 35, 17],
  	      [2, 35, 13],

  	      // 4
  	      [1, 100, 80],
  	      [2, 50, 32],
  	      [2, 50, 24],
  	      [4, 25, 9],

  	      // 5
  	      [1, 134, 108],
  	      [2, 67, 43],
  	      [2, 33, 15, 2, 34, 16],
  	      [2, 33, 11, 2, 34, 12],

  	      // 6
  	      [2, 86, 68],
  	      [4, 43, 27],
  	      [4, 43, 19],
  	      [4, 43, 15],

  	      // 7
  	      [2, 98, 78],
  	      [4, 49, 31],
  	      [2, 32, 14, 4, 33, 15],
  	      [4, 39, 13, 1, 40, 14],

  	      // 8
  	      [2, 121, 97],
  	      [2, 60, 38, 2, 61, 39],
  	      [4, 40, 18, 2, 41, 19],
  	      [4, 40, 14, 2, 41, 15],

  	      // 9
  	      [2, 146, 116],
  	      [3, 58, 36, 2, 59, 37],
  	      [4, 36, 16, 4, 37, 17],
  	      [4, 36, 12, 4, 37, 13],

  	      // 10
  	      [2, 86, 68, 2, 87, 69],
  	      [4, 69, 43, 1, 70, 44],
  	      [6, 43, 19, 2, 44, 20],
  	      [6, 43, 15, 2, 44, 16],

  	      // 11
  	      [4, 101, 81],
  	      [1, 80, 50, 4, 81, 51],
  	      [4, 50, 22, 4, 51, 23],
  	      [3, 36, 12, 8, 37, 13],

  	      // 12
  	      [2, 116, 92, 2, 117, 93],
  	      [6, 58, 36, 2, 59, 37],
  	      [4, 46, 20, 6, 47, 21],
  	      [7, 42, 14, 4, 43, 15],

  	      // 13
  	      [4, 133, 107],
  	      [8, 59, 37, 1, 60, 38],
  	      [8, 44, 20, 4, 45, 21],
  	      [12, 33, 11, 4, 34, 12],

  	      // 14
  	      [3, 145, 115, 1, 146, 116],
  	      [4, 64, 40, 5, 65, 41],
  	      [11, 36, 16, 5, 37, 17],
  	      [11, 36, 12, 5, 37, 13],

  	      // 15
  	      [5, 109, 87, 1, 110, 88],
  	      [5, 65, 41, 5, 66, 42],
  	      [5, 54, 24, 7, 55, 25],
  	      [11, 36, 12, 7, 37, 13],

  	      // 16
  	      [5, 122, 98, 1, 123, 99],
  	      [7, 73, 45, 3, 74, 46],
  	      [15, 43, 19, 2, 44, 20],
  	      [3, 45, 15, 13, 46, 16],

  	      // 17
  	      [1, 135, 107, 5, 136, 108],
  	      [10, 74, 46, 1, 75, 47],
  	      [1, 50, 22, 15, 51, 23],
  	      [2, 42, 14, 17, 43, 15],

  	      // 18
  	      [5, 150, 120, 1, 151, 121],
  	      [9, 69, 43, 4, 70, 44],
  	      [17, 50, 22, 1, 51, 23],
  	      [2, 42, 14, 19, 43, 15],

  	      // 19
  	      [3, 141, 113, 4, 142, 114],
  	      [3, 70, 44, 11, 71, 45],
  	      [17, 47, 21, 4, 48, 22],
  	      [9, 39, 13, 16, 40, 14],

  	      // 20
  	      [3, 135, 107, 5, 136, 108],
  	      [3, 67, 41, 13, 68, 42],
  	      [15, 54, 24, 5, 55, 25],
  	      [15, 43, 15, 10, 44, 16],

  	      // 21
  	      [4, 144, 116, 4, 145, 117],
  	      [17, 68, 42],
  	      [17, 50, 22, 6, 51, 23],
  	      [19, 46, 16, 6, 47, 17],

  	      // 22
  	      [2, 139, 111, 7, 140, 112],
  	      [17, 74, 46],
  	      [7, 54, 24, 16, 55, 25],
  	      [34, 37, 13],

  	      // 23
  	      [4, 151, 121, 5, 152, 122],
  	      [4, 75, 47, 14, 76, 48],
  	      [11, 54, 24, 14, 55, 25],
  	      [16, 45, 15, 14, 46, 16],

  	      // 24
  	      [6, 147, 117, 4, 148, 118],
  	      [6, 73, 45, 14, 74, 46],
  	      [11, 54, 24, 16, 55, 25],
  	      [30, 46, 16, 2, 47, 17],

  	      // 25
  	      [8, 132, 106, 4, 133, 107],
  	      [8, 75, 47, 13, 76, 48],
  	      [7, 54, 24, 22, 55, 25],
  	      [22, 45, 15, 13, 46, 16],

  	      // 26
  	      [10, 142, 114, 2, 143, 115],
  	      [19, 74, 46, 4, 75, 47],
  	      [28, 50, 22, 6, 51, 23],
  	      [33, 46, 16, 4, 47, 17],

  	      // 27
  	      [8, 152, 122, 4, 153, 123],
  	      [22, 73, 45, 3, 74, 46],
  	      [8, 53, 23, 26, 54, 24],
  	      [12, 45, 15, 28, 46, 16],

  	      // 28
  	      [3, 147, 117, 10, 148, 118],
  	      [3, 73, 45, 23, 74, 46],
  	      [4, 54, 24, 31, 55, 25],
  	      [11, 45, 15, 31, 46, 16],

  	      // 29
  	      [7, 146, 116, 7, 147, 117],
  	      [21, 73, 45, 7, 74, 46],
  	      [1, 53, 23, 37, 54, 24],
  	      [19, 45, 15, 26, 46, 16],

  	      // 30
  	      [5, 145, 115, 10, 146, 116],
  	      [19, 75, 47, 10, 76, 48],
  	      [15, 54, 24, 25, 55, 25],
  	      [23, 45, 15, 25, 46, 16],

  	      // 31
  	      [13, 145, 115, 3, 146, 116],
  	      [2, 74, 46, 29, 75, 47],
  	      [42, 54, 24, 1, 55, 25],
  	      [23, 45, 15, 28, 46, 16],

  	      // 32
  	      [17, 145, 115],
  	      [10, 74, 46, 23, 75, 47],
  	      [10, 54, 24, 35, 55, 25],
  	      [19, 45, 15, 35, 46, 16],

  	      // 33
  	      [17, 145, 115, 1, 146, 116],
  	      [14, 74, 46, 21, 75, 47],
  	      [29, 54, 24, 19, 55, 25],
  	      [11, 45, 15, 46, 46, 16],

  	      // 34
  	      [13, 145, 115, 6, 146, 116],
  	      [14, 74, 46, 23, 75, 47],
  	      [44, 54, 24, 7, 55, 25],
  	      [59, 46, 16, 1, 47, 17],

  	      // 35
  	      [12, 151, 121, 7, 152, 122],
  	      [12, 75, 47, 26, 76, 48],
  	      [39, 54, 24, 14, 55, 25],
  	      [22, 45, 15, 41, 46, 16],

  	      // 36
  	      [6, 151, 121, 14, 152, 122],
  	      [6, 75, 47, 34, 76, 48],
  	      [46, 54, 24, 10, 55, 25],
  	      [2, 45, 15, 64, 46, 16],

  	      // 37
  	      [17, 152, 122, 4, 153, 123],
  	      [29, 74, 46, 14, 75, 47],
  	      [49, 54, 24, 10, 55, 25],
  	      [24, 45, 15, 46, 46, 16],

  	      // 38
  	      [4, 152, 122, 18, 153, 123],
  	      [13, 74, 46, 32, 75, 47],
  	      [48, 54, 24, 14, 55, 25],
  	      [42, 45, 15, 32, 46, 16],

  	      // 39
  	      [20, 147, 117, 4, 148, 118],
  	      [40, 75, 47, 7, 76, 48],
  	      [43, 54, 24, 22, 55, 25],
  	      [10, 45, 15, 67, 46, 16],

  	      // 40
  	      [19, 148, 118, 6, 149, 119],
  	      [18, 75, 47, 31, 76, 48],
  	      [34, 54, 24, 34, 55, 25],
  	      [20, 45, 15, 61, 46, 16]
  	    ];

  	    var qrRSBlock = function(totalCount, dataCount) {
  	      var _this = {};
  	      _this.totalCount = totalCount;
  	      _this.dataCount = dataCount;
  	      return _this;
  	    };

  	    var _this = {};

  	    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

  	      switch(errorCorrectionLevel) {
  	      case QRErrorCorrectionLevel.L :
  	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
  	      case QRErrorCorrectionLevel.M :
  	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
  	      case QRErrorCorrectionLevel.Q :
  	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
  	      case QRErrorCorrectionLevel.H :
  	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
  	      default :
  	        return undefined;
  	      }
  	    };

  	    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

  	      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

  	      if (typeof rsBlock == 'undefined') {
  	        throw 'bad rs block @ typeNumber:' + typeNumber +
  	            '/errorCorrectionLevel:' + errorCorrectionLevel;
  	      }

  	      var length = rsBlock.length / 3;

  	      var list = [];

  	      for (var i = 0; i < length; i += 1) {

  	        var count = rsBlock[i * 3 + 0];
  	        var totalCount = rsBlock[i * 3 + 1];
  	        var dataCount = rsBlock[i * 3 + 2];

  	        for (var j = 0; j < count; j += 1) {
  	          list.push(qrRSBlock(totalCount, dataCount) );
  	        }
  	      }

  	      return list;
  	    };

  	    return _this;
  	  }();

  	  //---------------------------------------------------------------------
  	  // qrBitBuffer
  	  //---------------------------------------------------------------------

  	  var qrBitBuffer = function() {

  	    var _buffer = [];
  	    var _length = 0;

  	    var _this = {};

  	    _this.getBuffer = function() {
  	      return _buffer;
  	    };

  	    _this.getAt = function(index) {
  	      var bufIndex = Math.floor(index / 8);
  	      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
  	    };

  	    _this.put = function(num, length) {
  	      for (var i = 0; i < length; i += 1) {
  	        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
  	      }
  	    };

  	    _this.getLengthInBits = function() {
  	      return _length;
  	    };

  	    _this.putBit = function(bit) {

  	      var bufIndex = Math.floor(_length / 8);
  	      if (_buffer.length <= bufIndex) {
  	        _buffer.push(0);
  	      }

  	      if (bit) {
  	        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
  	      }

  	      _length += 1;
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // qrNumber
  	  //---------------------------------------------------------------------

  	  var qrNumber = function(data) {

  	    var _mode = QRMode.MODE_NUMBER;
  	    var _data = data;

  	    var _this = {};

  	    _this.getMode = function() {
  	      return _mode;
  	    };

  	    _this.getLength = function(buffer) {
  	      return _data.length;
  	    };

  	    _this.write = function(buffer) {

  	      var data = _data;

  	      var i = 0;

  	      while (i + 2 < data.length) {
  	        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
  	        i += 3;
  	      }

  	      if (i < data.length) {
  	        if (data.length - i == 1) {
  	          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
  	        } else if (data.length - i == 2) {
  	          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
  	        }
  	      }
  	    };

  	    var strToNum = function(s) {
  	      var num = 0;
  	      for (var i = 0; i < s.length; i += 1) {
  	        num = num * 10 + chatToNum(s.charAt(i) );
  	      }
  	      return num;
  	    };

  	    var chatToNum = function(c) {
  	      if ('0' <= c && c <= '9') {
  	        return c.charCodeAt(0) - '0'.charCodeAt(0);
  	      }
  	      throw 'illegal char :' + c;
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // qrAlphaNum
  	  //---------------------------------------------------------------------

  	  var qrAlphaNum = function(data) {

  	    var _mode = QRMode.MODE_ALPHA_NUM;
  	    var _data = data;

  	    var _this = {};

  	    _this.getMode = function() {
  	      return _mode;
  	    };

  	    _this.getLength = function(buffer) {
  	      return _data.length;
  	    };

  	    _this.write = function(buffer) {

  	      var s = _data;

  	      var i = 0;

  	      while (i + 1 < s.length) {
  	        buffer.put(
  	          getCode(s.charAt(i) ) * 45 +
  	          getCode(s.charAt(i + 1) ), 11);
  	        i += 2;
  	      }

  	      if (i < s.length) {
  	        buffer.put(getCode(s.charAt(i) ), 6);
  	      }
  	    };

  	    var getCode = function(c) {

  	      if ('0' <= c && c <= '9') {
  	        return c.charCodeAt(0) - '0'.charCodeAt(0);
  	      } else if ('A' <= c && c <= 'Z') {
  	        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
  	      } else {
  	        switch (c) {
  	        case ' ' : return 36;
  	        case '$' : return 37;
  	        case '%' : return 38;
  	        case '*' : return 39;
  	        case '+' : return 40;
  	        case '-' : return 41;
  	        case '.' : return 42;
  	        case '/' : return 43;
  	        case ':' : return 44;
  	        default :
  	          throw 'illegal char :' + c;
  	        }
  	      }
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // qr8BitByte
  	  //---------------------------------------------------------------------

  	  var qr8BitByte = function(data) {

  	    var _mode = QRMode.MODE_8BIT_BYTE;
  	    var _bytes = qrcode.stringToBytes(data);

  	    var _this = {};

  	    _this.getMode = function() {
  	      return _mode;
  	    };

  	    _this.getLength = function(buffer) {
  	      return _bytes.length;
  	    };

  	    _this.write = function(buffer) {
  	      for (var i = 0; i < _bytes.length; i += 1) {
  	        buffer.put(_bytes[i], 8);
  	      }
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // qrKanji
  	  //---------------------------------------------------------------------

  	  var qrKanji = function(data) {

  	    var _mode = QRMode.MODE_KANJI;

  	    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
  	    if (!stringToBytes) {
  	      throw 'sjis not supported.';
  	    }
  	    !function(c, code) {
  	      // self test for sjis support.
  	      var test = stringToBytes(c);
  	      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
  	        throw 'sjis not supported.';
  	      }
  	    }('\u53cb', 0x9746);

  	    var _bytes = stringToBytes(data);

  	    var _this = {};

  	    _this.getMode = function() {
  	      return _mode;
  	    };

  	    _this.getLength = function(buffer) {
  	      return ~~(_bytes.length / 2);
  	    };

  	    _this.write = function(buffer) {

  	      var data = _bytes;

  	      var i = 0;

  	      while (i + 1 < data.length) {

  	        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

  	        if (0x8140 <= c && c <= 0x9FFC) {
  	          c -= 0x8140;
  	        } else if (0xE040 <= c && c <= 0xEBBF) {
  	          c -= 0xC140;
  	        } else {
  	          throw 'illegal char at ' + (i + 1) + '/' + c;
  	        }

  	        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

  	        buffer.put(c, 13);

  	        i += 2;
  	      }

  	      if (i < data.length) {
  	        throw 'illegal char at ' + (i + 1);
  	      }
  	    };

  	    return _this;
  	  };

  	  //=====================================================================
  	  // GIF Support etc.
  	  //

  	  //---------------------------------------------------------------------
  	  // byteArrayOutputStream
  	  //---------------------------------------------------------------------

  	  var byteArrayOutputStream = function() {

  	    var _bytes = [];

  	    var _this = {};

  	    _this.writeByte = function(b) {
  	      _bytes.push(b & 0xff);
  	    };

  	    _this.writeShort = function(i) {
  	      _this.writeByte(i);
  	      _this.writeByte(i >>> 8);
  	    };

  	    _this.writeBytes = function(b, off, len) {
  	      off = off || 0;
  	      len = len || b.length;
  	      for (var i = 0; i < len; i += 1) {
  	        _this.writeByte(b[i + off]);
  	      }
  	    };

  	    _this.writeString = function(s) {
  	      for (var i = 0; i < s.length; i += 1) {
  	        _this.writeByte(s.charCodeAt(i) );
  	      }
  	    };

  	    _this.toByteArray = function() {
  	      return _bytes;
  	    };

  	    _this.toString = function() {
  	      var s = '';
  	      s += '[';
  	      for (var i = 0; i < _bytes.length; i += 1) {
  	        if (i > 0) {
  	          s += ',';
  	        }
  	        s += _bytes[i];
  	      }
  	      s += ']';
  	      return s;
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // base64EncodeOutputStream
  	  //---------------------------------------------------------------------

  	  var base64EncodeOutputStream = function() {

  	    var _buffer = 0;
  	    var _buflen = 0;
  	    var _length = 0;
  	    var _base64 = '';

  	    var _this = {};

  	    var writeEncoded = function(b) {
  	      _base64 += String.fromCharCode(encode(b & 0x3f) );
  	    };

  	    var encode = function(n) {
  	      if (n < 0) ; else if (n < 26) {
  	        return 0x41 + n;
  	      } else if (n < 52) {
  	        return 0x61 + (n - 26);
  	      } else if (n < 62) {
  	        return 0x30 + (n - 52);
  	      } else if (n == 62) {
  	        return 0x2b;
  	      } else if (n == 63) {
  	        return 0x2f;
  	      }
  	      throw 'n:' + n;
  	    };

  	    _this.writeByte = function(n) {

  	      _buffer = (_buffer << 8) | (n & 0xff);
  	      _buflen += 8;
  	      _length += 1;

  	      while (_buflen >= 6) {
  	        writeEncoded(_buffer >>> (_buflen - 6) );
  	        _buflen -= 6;
  	      }
  	    };

  	    _this.flush = function() {

  	      if (_buflen > 0) {
  	        writeEncoded(_buffer << (6 - _buflen) );
  	        _buffer = 0;
  	        _buflen = 0;
  	      }

  	      if (_length % 3 != 0) {
  	        // padding
  	        var padlen = 3 - _length % 3;
  	        for (var i = 0; i < padlen; i += 1) {
  	          _base64 += '=';
  	        }
  	      }
  	    };

  	    _this.toString = function() {
  	      return _base64;
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // base64DecodeInputStream
  	  //---------------------------------------------------------------------

  	  var base64DecodeInputStream = function(str) {

  	    var _str = str;
  	    var _pos = 0;
  	    var _buffer = 0;
  	    var _buflen = 0;

  	    var _this = {};

  	    _this.read = function() {

  	      while (_buflen < 8) {

  	        if (_pos >= _str.length) {
  	          if (_buflen == 0) {
  	            return -1;
  	          }
  	          throw 'unexpected end of file./' + _buflen;
  	        }

  	        var c = _str.charAt(_pos);
  	        _pos += 1;

  	        if (c == '=') {
  	          _buflen = 0;
  	          return -1;
  	        } else if (c.match(/^\s$/) ) {
  	          // ignore if whitespace.
  	          continue;
  	        }

  	        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
  	        _buflen += 6;
  	      }

  	      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
  	      _buflen -= 8;
  	      return n;
  	    };

  	    var decode = function(c) {
  	      if (0x41 <= c && c <= 0x5a) {
  	        return c - 0x41;
  	      } else if (0x61 <= c && c <= 0x7a) {
  	        return c - 0x61 + 26;
  	      } else if (0x30 <= c && c <= 0x39) {
  	        return c - 0x30 + 52;
  	      } else if (c == 0x2b) {
  	        return 62;
  	      } else if (c == 0x2f) {
  	        return 63;
  	      } else {
  	        throw 'c:' + c;
  	      }
  	    };

  	    return _this;
  	  };

  	  //---------------------------------------------------------------------
  	  // gifImage (B/W)
  	  //---------------------------------------------------------------------

  	  var gifImage = function(width, height) {

  	    var _width = width;
  	    var _height = height;
  	    var _data = new Array(width * height);

  	    var _this = {};

  	    _this.setPixel = function(x, y, pixel) {
  	      _data[y * _width + x] = pixel;
  	    };

  	    _this.write = function(out) {

  	      //---------------------------------
  	      // GIF Signature

  	      out.writeString('GIF87a');

  	      //---------------------------------
  	      // Screen Descriptor

  	      out.writeShort(_width);
  	      out.writeShort(_height);

  	      out.writeByte(0x80); // 2bit
  	      out.writeByte(0);
  	      out.writeByte(0);

  	      //---------------------------------
  	      // Global Color Map

  	      // black
  	      out.writeByte(0x00);
  	      out.writeByte(0x00);
  	      out.writeByte(0x00);

  	      // white
  	      out.writeByte(0xff);
  	      out.writeByte(0xff);
  	      out.writeByte(0xff);

  	      //---------------------------------
  	      // Image Descriptor

  	      out.writeString(',');
  	      out.writeShort(0);
  	      out.writeShort(0);
  	      out.writeShort(_width);
  	      out.writeShort(_height);
  	      out.writeByte(0);

  	      //---------------------------------
  	      // Local Color Map

  	      //---------------------------------
  	      // Raster Data

  	      var lzwMinCodeSize = 2;
  	      var raster = getLZWRaster(lzwMinCodeSize);

  	      out.writeByte(lzwMinCodeSize);

  	      var offset = 0;

  	      while (raster.length - offset > 255) {
  	        out.writeByte(255);
  	        out.writeBytes(raster, offset, 255);
  	        offset += 255;
  	      }

  	      out.writeByte(raster.length - offset);
  	      out.writeBytes(raster, offset, raster.length - offset);
  	      out.writeByte(0x00);

  	      //---------------------------------
  	      // GIF Terminator
  	      out.writeString(';');
  	    };

  	    var bitOutputStream = function(out) {

  	      var _out = out;
  	      var _bitLength = 0;
  	      var _bitBuffer = 0;

  	      var _this = {};

  	      _this.write = function(data, length) {

  	        if ( (data >>> length) != 0) {
  	          throw 'length over';
  	        }

  	        while (_bitLength + length >= 8) {
  	          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
  	          length -= (8 - _bitLength);
  	          data >>>= (8 - _bitLength);
  	          _bitBuffer = 0;
  	          _bitLength = 0;
  	        }

  	        _bitBuffer = (data << _bitLength) | _bitBuffer;
  	        _bitLength = _bitLength + length;
  	      };

  	      _this.flush = function() {
  	        if (_bitLength > 0) {
  	          _out.writeByte(_bitBuffer);
  	        }
  	      };

  	      return _this;
  	    };

  	    var getLZWRaster = function(lzwMinCodeSize) {

  	      var clearCode = 1 << lzwMinCodeSize;
  	      var endCode = (1 << lzwMinCodeSize) + 1;
  	      var bitLength = lzwMinCodeSize + 1;

  	      // Setup LZWTable
  	      var table = lzwTable();

  	      for (var i = 0; i < clearCode; i += 1) {
  	        table.add(String.fromCharCode(i) );
  	      }
  	      table.add(String.fromCharCode(clearCode) );
  	      table.add(String.fromCharCode(endCode) );

  	      var byteOut = byteArrayOutputStream();
  	      var bitOut = bitOutputStream(byteOut);

  	      // clear code
  	      bitOut.write(clearCode, bitLength);

  	      var dataIndex = 0;

  	      var s = String.fromCharCode(_data[dataIndex]);
  	      dataIndex += 1;

  	      while (dataIndex < _data.length) {

  	        var c = String.fromCharCode(_data[dataIndex]);
  	        dataIndex += 1;

  	        if (table.contains(s + c) ) {

  	          s = s + c;

  	        } else {

  	          bitOut.write(table.indexOf(s), bitLength);

  	          if (table.size() < 0xfff) {

  	            if (table.size() == (1 << bitLength) ) {
  	              bitLength += 1;
  	            }

  	            table.add(s + c);
  	          }

  	          s = c;
  	        }
  	      }

  	      bitOut.write(table.indexOf(s), bitLength);

  	      // end code
  	      bitOut.write(endCode, bitLength);

  	      bitOut.flush();

  	      return byteOut.toByteArray();
  	    };

  	    var lzwTable = function() {

  	      var _map = {};
  	      var _size = 0;

  	      var _this = {};

  	      _this.add = function(key) {
  	        if (_this.contains(key) ) {
  	          throw 'dup key:' + key;
  	        }
  	        _map[key] = _size;
  	        _size += 1;
  	      };

  	      _this.size = function() {
  	        return _size;
  	      };

  	      _this.indexOf = function(key) {
  	        return _map[key];
  	      };

  	      _this.contains = function(key) {
  	        return typeof _map[key] != 'undefined';
  	      };

  	      return _this;
  	    };

  	    return _this;
  	  };

  	  var createDataURL = function(width, height, getPixel) {
  	    var gif = gifImage(width, height);
  	    for (var y = 0; y < height; y += 1) {
  	      for (var x = 0; x < width; x += 1) {
  	        gif.setPixel(x, y, getPixel(x, y) );
  	      }
  	    }

  	    var b = byteArrayOutputStream();
  	    gif.write(b);

  	    var base64 = base64EncodeOutputStream();
  	    var bytes = b.toByteArray();
  	    for (var i = 0; i < bytes.length; i += 1) {
  	      base64.writeByte(bytes[i]);
  	    }
  	    base64.flush();

  	    return 'data:image/gif;base64,' + base64;
  	  };

  	  //---------------------------------------------------------------------
  	  // returns qrcode function.

  	  return qrcode;
  	}();

  	// multibyte support
  	!function() {

  	  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
  	    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
  	    function toUTF8Array(str) {
  	      var utf8 = [];
  	      for (var i=0; i < str.length; i++) {
  	        var charcode = str.charCodeAt(i);
  	        if (charcode < 0x80) utf8.push(charcode);
  	        else if (charcode < 0x800) {
  	          utf8.push(0xc0 | (charcode >> 6),
  	              0x80 | (charcode & 0x3f));
  	        }
  	        else if (charcode < 0xd800 || charcode >= 0xe000) {
  	          utf8.push(0xe0 | (charcode >> 12),
  	              0x80 | ((charcode>>6) & 0x3f),
  	              0x80 | (charcode & 0x3f));
  	        }
  	        // surrogate pair
  	        else {
  	          i++;
  	          // UTF-16 encodes 0x10000-0x10FFFF by
  	          // subtracting 0x10000 and splitting the
  	          // 20 bits of 0x0-0xFFFFF into two halves
  	          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
  	            | (str.charCodeAt(i) & 0x3ff));
  	          utf8.push(0xf0 | (charcode >>18),
  	              0x80 | ((charcode>>12) & 0x3f),
  	              0x80 | ((charcode>>6) & 0x3f),
  	              0x80 | (charcode & 0x3f));
  	        }
  	      }
  	      return utf8;
  	    }
  	    return toUTF8Array(s);
  	  };

  	}();

  	(function (factory) {
  	  {
  	      module.exports = factory();
  	  }
  	}(function () {
  	    return qrcode;
  	})); 
  } (qrcode));

  var qrcodeExports = qrcode.exports;
  var qrGenerator = /*@__PURE__*/getDefaultExportFromCjs(qrcodeExports);

  const QRCode$1 = ({
    value = 'https://reactjs.org/',
    ecLevel = 'M',
    enableCORS = false,
    size = 150,
    quietZone = 10,
    bgColor = '#FFFFFF',
    fgColor = '#000000',
    logoOpacity = 1,
    qrStyle = 'squares',
    logoImage = "",
    logoWidth = "",
    logoHeight = "",
    onQrDraw
  }) => {
    const canvasRef = React.useRef();
    const utf16to8 = str => {
      let out = '',
        i,
        c;
      const len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007F) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | c >> 12 & 0x0F);
          out += String.fromCharCode(0x80 | c >> 6 & 0x3F);
          out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        } else {
          out += String.fromCharCode(0xC0 | c >> 6 & 0x1F);
          out += String.fromCharCode(0x80 | c >> 0 & 0x3F);
        }
      }
      return out;
    };
    const drawPositioningPattern = (cellSize, offset, row, col, length, ctx) => {
      for (let r = -1; r <= 7; r++) {
        if (!(row + r <= -1 || length <= row + r)) {
          for (let c = -1; c <= 7; c++) {
            if (!(col + c <= -1 || length <= col + c) && 0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
              const w = Math.ceil((row + r + 1) * cellSize) - Math.floor((row + r) * cellSize);
              const h = Math.ceil((col + c + 1) * cellSize) - Math.floor((col + c) * cellSize);
              ctx.fillStyle = fgColor;
              ctx.fillRect(Math.round((row + r) * cellSize) + offset, Math.round((col + c) * cellSize) + offset, w, h);
            }
          }
        }
      }
    };
    React.useEffect(() => {
      if (canvasRef.current) {
        update();
      }
      if (value) {
        update();
      }
    }, [canvasRef.current, value]);
    const update = () => {
      const qrCode = qrGenerator(0, ecLevel);
      qrCode.addData(utf16to8(value));
      qrCode.make();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const canvasSize = +size + 2 * +quietZone;
      const length = qrCode.getModuleCount();
      const cellSize = size / length;
      const scale = window.devicePixelRatio || 1;
      canvas.height = canvas.width = canvasSize * scale;
      ctx.scale(scale, scale);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      const offset = +quietZone;
      if (qrStyle === 'dots') {
        ctx.fillStyle = fgColor;
        const radius = cellSize / 2;
        for (let row = 0; row < length; row++) {
          for (let col = 0; col < length; col++) {
            if (qrCode.isDark(row, col)) {
              ctx.beginPath();
              ctx.arc(Math.round(col * cellSize) + radius + offset, Math.round(row * cellSize) + radius + offset, radius / 100 * 75, 0, 2 * Math.PI, false);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
        drawPositioningPattern(cellSize, offset, 0, 0, length, ctx);
        drawPositioningPattern(cellSize, offset, length - 7, 0, length, ctx);
        drawPositioningPattern(cellSize, offset, 0, length - 7, length, ctx);
      } else {
        for (let row = 0; row < length; row++) {
          for (let col = 0; col < length; col++) {
            if (qrCode.isDark(row, col)) {
              ctx.fillStyle = fgColor;
              const w = Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize);
              const h = Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize);
              ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h);
            }
          }
        }
      }
      if (logoImage) {
        const image = new Image();
        if (enableCORS) {
          image.crossOrigin = 'Anonymous';
        }
        image.onload = () => {
          const dwidth = logoWidth || size * 0.2;
          const dheight = logoHeight || dwidth;
          const dx = (size - dwidth) / 2;
          const dy = (size - dheight) / 2;
          image.width = dwidth;
          image.height = dheight;
          ctx.save();
          ctx.globalAlpha = logoOpacity;
          ctx.drawImage(image, dx + offset, dy + offset, dwidth, dheight);
          ctx.restore();
        };
        image.src = logoImage;
      }
      onQrDraw && onQrDraw({
        cellSize
      });
    };
    return /*#__PURE__*/React.createElement("canvas", {
      id: "react-qrcode-logo",
      height: +size + 2 * +quietZone,
      width: +size + 2 * +quietZone,
      style: {
        height: +size + 2 * +quietZone + 'px',
        width: +size + 2 * +quietZone + 'px'
      },
      ref: canvasRef
    });
  };

  function useStripeForm(products, gateway, isAPM) {
    const [stripeData, setStripeData] = React.useState({
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
    const isVisibleStripeForm = gateway === 'STRIPE' && !!countries.length;
    const isExtendedStripeForm = React.useMemo(() => isAPM || countries.includes('IN'), [countries, isAPM, gateway]);
    let isStripeFormValid;
    if (isExtendedStripeForm) {
      isStripeFormValid = stripeData.name && stripeData.surname && stripeData.address_line1 && stripeData.address_city && stripeData.address_country && stripeData.address_postal_code && stripeData.address_state;
    } else {
      isStripeFormValid = stripeData.name && stripeData.surname;
    }
    return {
      stripeData,
      setStripeData,
      isVisibleStripeForm,
      isStripeFormValid,
      isExtendedStripeForm
    };
  }

  function useUpdateInvoice({
    config,
    gateway,
    APM,
    payPalEmailDelivery,
    isVisibleStripeForm = false,
    isExtendedStripeForm = false,
    stripeData = {},
    getInvoice,
    setLoader,
    onUpdateInvoice,
    onShowMessage,
    onSuccess,
    onFail,
    invoiceId,
    invoice
  }) {
    const handleUpdateInvoice = React.useCallback(() => {
      const data = {
        uniqid: invoiceId,
        gateway: gateway
      };
      const custom_fields = {};
      if (isVisibleStripeForm) {
        custom_fields.name = stripeData.name;
        custom_fields.surname = stripeData.surname;
      }
      if (isVisibleStripeForm && isExtendedStripeForm) {
        data.name = stripeData.name;
        data.surname = stripeData.surname;
        data.address_line1 = stripeData.address_line1;
        data.address_city = stripeData.address_city;
        data.address_country = stripeData.address_country;
        data.address_postal_code = stripeData.address_postal_code;
        data.address_state = stripeData.address_state;
      }
      data.custom_fields = JSON.stringify({
        custom_fields
      });
      const forcePayPal = invoice.shop_force_paypal_email_delivery;
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
      setLoader(true);
      onUpdateInvoice(data).then(response => {
        const {
          status
        } = response;
        if (status === 200) {
          onSuccess && onSuccess({
            type: 'invoice',
            invoice
          });
          return getInvoice();
        } else {
          throw response;
        }
      }).catch(error => {
        onShowMessage({
          type: 'error',
          text: error ? error.error || error.message : 'Server error!'
        });
        onFail && onFail();
      }).finally(() => setLoader(false));
    }, [APM, config, gateway, invoice, invoiceId, payPalEmailDelivery, isVisibleStripeForm, isExtendedStripeForm, stripeData, onShowMessage, onUpdateInvoice, getInvoice]);
    return [handleUpdateInvoice];
  }

  function useInvoicePayments(invoice) {
    return React.useMemo(() => {
      let payments = [];
      if (invoice.gateways_available && invoice.gateways_available.length) {
        payments = (invoice.gateways_available || []).filter(opt => opt);
        if (payments.includes('STRIPE')) {
          payments = payments.filter(option => option !== 'PAYPAL_CREDIT_CARD');
        } else if (payments.includes('PAYPAL') && +invoice.shop_paypal_credit_card) {
          payments.push('PAYPAL_CREDIT_CARD');
        }
      }
      return payments;
    }, [invoice.gateways_available, invoice.shop_paypal_credit_card]);
  }

  const cryptoOptionsWithChain = ["BITCOIN", "BINANCE_COIN", "LITECOIN", "TRON", "USDC:BEP20", "USDC:ERC20", "USDC:MATIC", "USDT:BEP20", "USDT:TRC20", "USDT:ERC20", "USDT:MATIC", "PLZ:BEP20", "PLZ:TRC20", "POLYGON", "ETHEREUM", "CRONOS", "BITCOIN_CASH", "CONCORDIUM", "MONERO", "BITCOIN_LN", "NANO", "SOLANA", "RIPPLE", "WETH:ERC20", "WETH:MATIC", "PEPE:ERC20", "APE:ERC20", "SHIB:ERC20", "SHIB:MATIC", "SHIB:BEP20", "DAI:ERC20", "DAI:MATIC", "DAI:BEP20"];

  function isCrypto(gateway) {
    return ['BITCOIN', 'LITECOIN', 'TRON', 'BINANCE_COIN', 'POLYGON', 'PLZ', 'USDC', 'USDT', 'ETHEREUM', 'CRONOS', 'BITCOIN_CASH', 'MONERO', 'BITCOIN_LN', 'CONCORDIUM', 'NANO', 'SOLANA', 'RIPPLE'].includes(gateway);
  }
  const chain = gateway => {
    switch (gateway) {
      case 'BITCOIN':
        return 'BTC chain';
      case 'LITECOIN':
        return 'LTC chain';
      case 'TRON':
        return 'TRON chain';
      case 'BITCOIN_CASH':
        return 'BCH chain';
      case 'ETHEREUM':
        return 'ERC20 chain';
      case 'CRONOS':
        return 'CRO chain';
      case 'USDC:BEP20':
        return 'BEP20 chain';
      case 'USDC:ERC20':
        return 'ERC20 chain';
      case 'USDC:MATIC':
        return 'Polygon chain';
      case 'USDT:BEP20':
        return 'BEP20 chain';
      case 'USDT:ERC20':
        return 'ERC20 chain';
      case 'USDT:TRC20':
        return 'TRC20 chain';
      case 'USDT:MATIC':
        return 'Polygon chain';
      case 'PLZ:BEP20':
        return 'BEP20 chain';
      case 'PLZ:TRC20':
        return 'TRC20 chain';
      case 'POLYGON':
        return 'Polygon chain';
      case "DAI:BEP20":
        return "BEP20 chain";
      case "DAI:ERC20":
        return "ERC20 chain";
      case "DAI:MATIC":
        return "POLYGON chain";
      case "SHIB:BEP20":
        return "BEP20 chain";
      case "SHIB:ERC20":
        return "ERC20 chain";
      case "SHIB:MATIC":
        return "POLYGON chain";
      case "APE:ERC20":
        return "ERC20 chain";
      case "PEPE:ERC20":
        return "ERC20 chain";
      case "WETH:ERC20":
        return "ERC20 chain";
      case "WETH:MATIC":
        return "POLYGON chain";
      case 'NANO':
        return 'XNO chain';
      case 'MONERO':
        return 'XMR chain';
      case 'CONCORDIUM':
        return '';
      case 'BITCOIN_LN':
        return 'BTC LN chain';
      case 'SOLANA':
        return 'SOL chain';
      case 'RIPPLE':
        return 'XRP chain';
      case 'BINANCE_COIN':
        return 'BSC chain';
      default:
        return '';
    }
  };

  const initialValue$2 = {
    config: {},
    settings: {},
    theme: {},
    invoiceId: null,
    invoiceInfo: {},
    onGetInvoice: () => {},
    onUpdateInvoice: () => {},
    onCompleteInvoice: () => {},
    onToggleShowProductInfo: () => {},
    onValidateRecaptcha: () => {},
    onPostCashAppIdentifier: () => {},
    onGetStripeLink: () => {},
    onGetProductStripeLink: () => {},
    onShowMessage: () => {},
    sellixI18Next: {
      t: phrase => phrase
    }
  };
  const InvoiceDetailsContext = /*#__PURE__*/React.createContext(initialValue$2);

  const STATUSES = {
    COMPLETED: 'COMPLETED',
    VOIDED: 'VOIDED',
    REVERSED: 'REVERSED',
    REFUNDED: 'REFUNDED',
    PENDING: 'PENDING',
    CUSTOMER_DISPUTE_ONGOING: 'CUSTOMER_DISPUTE_ONGOING',
    WAITING_FOR_CONFIRMATIONS: 'WAITING_FOR_CONFIRMATIONS',
    PARTIAL: 'PARTIAL',
    WAITING_SHOP_ACTION: 'WAITING_SHOP_ACTION',
    PROCESSING: 'PROCESSING'
  };
  const InvoiceStatus = ({
    status,
    gateway,
    created_at,
    showHhMmSs,
    manualSuccess
  }) => {
    const pathname = window.location.pathname;
    const [time, setTime] = React.useState([0, 0, 0, 0]);
    const crypto = isCrypto(gateway);
    const isSubscription = pathname.includes('subscription');
    const use30min = crypto && !isSubscription;
    const {
      i18n
    } = useI18nContext();
    React.useEffect(() => {
      let interval = setInterval(() => {
        let startDate = moment(created_at * 1000);
        let endDate = use30min ? startDate.clone().add(30, 'minutes') : startDate.clone().add(4, 'hours');
        let currentDate = moment();
        let diff = moment.duration(endDate.diff(currentDate));
        if (diff.hours() <= 0 && diff.minutes() <= 0 && diff.seconds() <= 0) {
          setTime([0, 0, 0]);
        } else {
          setTime([diff.hours(), diff.minutes(), diff.seconds()]);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, [created_at, use30min]);
    if (status === STATUSES.PENDING) {
      if (showHhMmSs) {
        let h = time[0];
        let m = time[1];
        let s = time[2];
        return `${(h > 9 ? h : '0' + h) || '00'}:${m > 9 ? m : '0' + m || '00'}:${s > 9 ? s : '0' + s || '00'}`;
      }
      if (time[0] > 0) {
        let h = time[0];
        let m = time[1];
        return `${(h > 9 ? h : '0' + h) || '00'}:${m > 9 ? m : '0' + m || '00'}`;
      } else {
        let m = time[0] * 60 + time[1];
        let s = time[2];
        return `${(m > 9 ? m : '0' + m) || '00'}:${s > 9 ? s : '0' + s || '00'}`;
      }
    } else if (status === STATUSES.COMPLETED || manualSuccess) return i18n.t('shop.invoice.invoiceDetails.statuses.completed.short');else if (status === STATUSES.VOIDED) return i18n.t('shop.invoice.invoiceDetails.statuses.voided.short');else if (status === STATUSES.REVERSED) return i18n.t('shop.invoice.invoiceDetails.statuses.reversed.short');else if (status === STATUSES.REFUNDED) return i18n.t('shop.invoice.invoiceDetails.statuses.refunded.short');else if (status === STATUSES.CUSTOMER_DISPUTE_ONGOING) return i18n.t('shop.invoice.invoiceDetails.statuses.customerDispute.short');else if (status === STATUSES.WAITING_FOR_CONFIRMATIONS) return i18n.t('shop.invoice.invoiceDetails.statuses.waitingConfirmations.short');else if (status === STATUSES.PARTIAL) return i18n.t('shop.invoice.invoiceDetails.statuses.partial.short');else if (status === STATUSES.WAITING_SHOP_ACTION) return i18n.t('shop.invoice.invoiceDetails.statuses.waitingShopAction.short');else if (status === STATUSES.PROCESSING) return i18n.t('shop.invoice.invoiceDetails.statuses.processing.short');else return '';
  };

  var ChangeGateway = (({
    updateGateway
  }) => {
    const {
      i18n
    } = useI18nContext();
    let [more, setMore] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "change-gateway-button"
    }, /*#__PURE__*/React.createElement("span", {
      className: "change-gateway-button-title unselectable",
      onClick: () => setMore(!more)
    }, /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center justify-content-center w-100"
    }, more ? i18n.t('shop.invoice.invoiceDetails.gateway.changeButtonHide') : i18n.t('shop.invoice.invoiceDetails.gateway.changeButtonShow'), /*#__PURE__*/React.createElement("i", {
      className: `fa-regular fa-chevron-${more ? 'up' : 'down'}`,
      style: {
        marginLeft: 10
      }
    }))), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: more
    }, /*#__PURE__*/React.createElement("div", {
      className: "pt-2"
    }, /*#__PURE__*/React.createElement(CustomButton, {
      onClick: updateGateway.bind(undefined, null)
    }, i18n.t('shop.invoice.invoiceDetails.gateway.changeButtonTitle')))));
  });

  const InfoSlider = ({
    isBinance,
    infoPanel,
    invoice,
    close
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: `slide-up ${infoPanel ? 'open' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "slide-up-title"
    }, i18n.t('shop.invoice.invoiceDetails.modes.qr.infoSlider.pleaseSend'), ' ', /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(InvoiceStatus, _extends$1({}, invoice, {
      showHhMmSs: true
    })))), /*#__PURE__*/React.createElement("div", {
      className: "slide-up-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "slide-up-body-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.infoSlider.totalPrice'), ":"), /*#__PURE__*/React.createElement("span", null, isBinance ? invoice.total : invoice.total_display, " ", isBinance ? 'BUSD' : invoice.currency)), isBinance ? null : /*#__PURE__*/React.createElement("div", {
      className: "slide-up-body-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.infoSlider.exchangeRate'), ":"), /*#__PURE__*/React.createElement("span", null, invoice.crypto_exchange_rate, " USD")), isBinance ? null : /*#__PURE__*/React.createElement("div", {
      className: "slide-up-body-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.infoSlider.subtotal'), ":"), /*#__PURE__*/React.createElement("span", null, Number(invoice.crypto_amount).toFixed(8), " ", config.PAYMENT_OPTS[invoice.gateway])), isBinance ? null : /*#__PURE__*/React.createElement("div", {
      className: "slide-up-body-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.infoSlider.amount'), ":"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, ((invoice.crypto_amount || 0) - (invoice.crypto_received || 0)).toFixed(8)), " ", config.PAYMENT_OPTS[invoice.gateway])))), /*#__PURE__*/React.createElement("div", {
      className: "slide-up-overlay",
      onClick: close
    }));
  };

  var checkMarkIcon = 'data:image/svg+xml;base64,dmFyIGltZyA9ICJkYXRhOmltYWdlL3N2Zyt4bWwsJTNjc3ZnIHdpZHRoPSc4cHgnIGhlaWdodD0nOHB4JyB2aWV3Qm94PScwIDAgOCA4JyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM2UgJTNjZyUzZSAlM2Nwb2x5Z29uIGZpbGw9J3doaXRlJyBwb2ludHM9JzMgNS4zOSAxLjYxIDQgMS4xMzY2NjY2NyA0LjQ3IDMgNi4zMzMzMzMzMyA3IDIuMzMzMzMzMzMgNi41MyAxLjg2MzMzMzMzJy8lM2UgJTNjL2clM2UlM2Mvc3ZnJTNlIjsKICBleHBvcnQgZGVmYXVsdCBpbWc7';

  var LinkSlider = (({
    linkPanel,
    invoice,
    close
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const [copied, setCopied] = React.useState(false);
    React.useEffect(() => {
      if (linkPanel) {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }
    }, [linkPanel]);
    const Copy = () => /*#__PURE__*/React.createElement("svg", {
      width: 20,
      height: 20,
      viewBox: `0 0 ${20} ${20}`
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.6666667,0.666666667 L2.66666667,0.666666667 C1.93333333,0.666666667 1.33333333,1.26666667 1.33333333,2 L1.33333333,11.3333333 L2.66666667,11.3333333 L2.66666667,2 L10.6666667,2 L10.6666667,0.666666667 L10.6666667,0.666666667 Z M12.6666667,3.33333333 L5.33333333,3.33333333 C4.6,3.33333333 4,3.93333333 4,4.66666667 L4,14 C4,14.7333333 4.6,15.3333333 5.33333333,15.3333333 L12.6666667,15.3333333 C13.4,15.3333333 14,14.7333333 14,14 L14,4.66666667 C14,3.93333333 13.4,3.33333333 12.6666667,3.33333333 L12.6666667,3.33333333 Z M12.6666667,14 L5.33333333,14 L5.33333333,4.66666667 L12.6666667,4.66666667 L12.6666667,14 L12.6666667,14 Z",
      fill: "#989BA0"
    }));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: `slide-down ${linkPanel ? 'open' : ''} ${copied ? 'show-copy' : ''}`
    }, /*#__PURE__*/React.createElement("h5", {
      className: "slide-down-title"
    }, invoice.gateway === 'BITCOIN_LN' ? 'Payment Request' : `${config.PAYMENT_FULL_NAME[invoice.gateway]} Address`), /*#__PURE__*/React.createElement(Clipboard, {
      text: invoice.crypto_address,
      onCopy: () => setCopied(true),
      className: "slide-down-body"
    }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, invoice.crypto_address), /*#__PURE__*/React.createElement(Copy, null), /*#__PURE__*/React.createElement("div", {
      className: "slide-down-copy"
    }, /*#__PURE__*/React.createElement("img", {
      src: checkMarkIcon,
      height: 16,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.copied')))))), /*#__PURE__*/React.createElement("div", {
      className: "slide-down-overlay",
      onClick: close
    }));
  });

  var QRCode = (({
    onClick,
    invoice
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const [qrCellSize, setQrCellSize] = React.useState(0);
    if (!invoice || !invoice.gateway || invoice && !(invoice.crypto_uri || invoice.cashapp_qrcode)) {
      return null;
    }
    let {
      crypto_uri,
      cashapp_qrcode,
      gateway
    } = invoice;
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      className: "qr-wrapper"
    }, /*#__PURE__*/React.createElement(QRCode$1, {
      size: 220,
      value: crypto_uri || cashapp_qrcode,
      bgColor: "white",
      qrStyle: "dots",
      fgColor: "#0A1730",
      ecLevel: gateway === 'BITCOIN_CASH' ? 'H' : 'Q',
      onQrDraw: ({
        cellSize
      }) => {
        if (cellSize !== qrCellSize) {
          setQrCellSize(cellSize);
        }
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS[gateway],
      className: `qr-logo ${gateway}`,
      width: qrCellSize * 11,
      style: {
        padding: qrCellSize
      },
      alt: i18n.t('shop.invoice.invoiceDetails.modes.qr.qrShouldBeThere')
    }));
  });

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var VIEWBOX_WIDTH = 100;
  var VIEWBOX_HEIGHT = 100;
  var VIEWBOX_HEIGHT_HALF = 50;
  var VIEWBOX_CENTER_X = 50;
  var VIEWBOX_CENTER_Y = 50;

  function Path(_a) {
      var className = _a.className, counterClockwise = _a.counterClockwise, dashRatio = _a.dashRatio, pathRadius = _a.pathRadius, strokeWidth = _a.strokeWidth, style = _a.style;
      return (React.createElement("path", { className: className, style: Object.assign({}, style, getDashStyle({ pathRadius: pathRadius, dashRatio: dashRatio, counterClockwise: counterClockwise })), d: getPathDescription({
              pathRadius: pathRadius,
              counterClockwise: counterClockwise,
          }), strokeWidth: strokeWidth, fillOpacity: 0 }));
  }
  function getPathDescription(_a) {
      var pathRadius = _a.pathRadius, counterClockwise = _a.counterClockwise;
      var radius = pathRadius;
      var rotation = counterClockwise ? 1 : 0;
      return "\n      M " + VIEWBOX_CENTER_X + "," + VIEWBOX_CENTER_Y + "\n      m 0,-" + radius + "\n      a " + radius + "," + radius + " " + rotation + " 1 1 0," + 2 * radius + "\n      a " + radius + "," + radius + " " + rotation + " 1 1 0,-" + 2 * radius + "\n    ";
  }
  function getDashStyle(_a) {
      var counterClockwise = _a.counterClockwise, dashRatio = _a.dashRatio, pathRadius = _a.pathRadius;
      var diameter = Math.PI * 2 * pathRadius;
      var gapLength = (1 - dashRatio) * diameter;
      return {
          strokeDasharray: diameter + "px " + diameter + "px",
          strokeDashoffset: (counterClockwise ? -gapLength : gapLength) + "px",
      };
  }

  var CircularProgressbar = (function (_super) {
      __extends(CircularProgressbar, _super);
      function CircularProgressbar() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      CircularProgressbar.prototype.getBackgroundPadding = function () {
          if (!this.props.background) {
              return 0;
          }
          return this.props.backgroundPadding;
      };
      CircularProgressbar.prototype.getPathRadius = function () {
          return VIEWBOX_HEIGHT_HALF - this.props.strokeWidth / 2 - this.getBackgroundPadding();
      };
      CircularProgressbar.prototype.getPathRatio = function () {
          var _a = this.props, value = _a.value, minValue = _a.minValue, maxValue = _a.maxValue;
          var boundedValue = Math.min(Math.max(value, minValue), maxValue);
          return (boundedValue - minValue) / (maxValue - minValue);
      };
      CircularProgressbar.prototype.render = function () {
          var _a = this.props, circleRatio = _a.circleRatio, className = _a.className, classes = _a.classes, counterClockwise = _a.counterClockwise, styles = _a.styles, strokeWidth = _a.strokeWidth, text = _a.text;
          var pathRadius = this.getPathRadius();
          var pathRatio = this.getPathRatio();
          return (React.createElement("svg", { className: classes.root + " " + className, style: styles.root, viewBox: "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT, "data-test-id": "CircularProgressbar" },
              this.props.background ? (React.createElement("circle", { className: classes.background, style: styles.background, cx: VIEWBOX_CENTER_X, cy: VIEWBOX_CENTER_Y, r: VIEWBOX_HEIGHT_HALF })) : null,
              React.createElement(Path, { className: classes.trail, counterClockwise: counterClockwise, dashRatio: circleRatio, pathRadius: pathRadius, strokeWidth: strokeWidth, style: styles.trail }),
              React.createElement(Path, { className: classes.path, counterClockwise: counterClockwise, dashRatio: pathRatio * circleRatio, pathRadius: pathRadius, strokeWidth: strokeWidth, style: styles.path }),
              text ? (React.createElement("text", { className: classes.text, style: styles.text, x: VIEWBOX_CENTER_X, y: VIEWBOX_CENTER_Y }, text)) : null));
      };
      CircularProgressbar.defaultProps = {
          background: false,
          backgroundPadding: 0,
          circleRatio: 1,
          classes: {
              root: 'CircularProgressbar',
              trail: 'CircularProgressbar-trail',
              path: 'CircularProgressbar-path',
              text: 'CircularProgressbar-text',
              background: 'CircularProgressbar-background',
          },
          counterClockwise: false,
          className: '',
          maxValue: 100,
          minValue: 0,
          strokeWidth: 8,
          styles: {
              root: {},
              trail: {},
              path: {},
              text: {},
              background: {},
          },
          text: '',
      };
      return CircularProgressbar;
  }(React.Component));

  var Progress = (({
    invoice,
    setInfoPanel
  }) => {
    const pathname = window.location.pathname;
    const [time, setTime] = React.useState([]);
    const crypto = isCrypto(invoice.gateway);
    const isSubscription = pathname.includes('subscription');
    const use30min = crypto && !isSubscription;
    const [alert, setAlert] = React.useState(false);
    const isPartial = invoice.status === 'PARTIAL';
    React.useEffect(() => {
      let interval = setInterval(() => {
        let startDate = moment(invoice.created_at * 1000);
        let endDate = use30min ? startDate.clone().add(30, 'minutes') : startDate.clone().add(4, 'hours');
        let currentDate = moment();
        let diff = moment.duration(endDate.diff(currentDate));
        setTime([diff.hours(), diff.minutes(), diff.seconds(), endDate.diff(currentDate)]);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);
    const progressRed = time[3] && time[3] < 15 * 1000 * 60;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: `qr-mode-progress ${isPartial ? 'partial' : null}`,
      onClick: () => {
        if (isPartial) {
          setAlert(true);
        }
      }
    }, isPartial ? null : /*#__PURE__*/React.createElement("i", {
      className: `qr-mode-progress-overlay ${progressRed && 'red'}`,
      onClick: () => setInfoPanel(true)
    }), /*#__PURE__*/React.createElement(CircularProgressbar, {
      value: time[3] / 1000 / (30 * 60) * 100,
      text: /*#__PURE__*/React.createElement(InvoiceStatus, _extends$1({}, invoice, {
        isPartial: isPartial
      })),
      className: `${progressRed ? 'red' : ''} ${isPartial ? 'partial' : null}`,
      counterClockwise: true,
      strokeWidth: 8
    })), /*#__PURE__*/React.createElement(AlertPartial, {
      openModal: alert,
      closeModal: () => setAlert(false),
      invoice: invoice
    }));
  });

  var Partial = 'data:image/svg+xml;base64,dmFyIGltZyA9ICJkYXRhOmltYWdlL3N2Zyt4bWwsJTNjc3ZnIHdpZHRoPScxMicgaGVpZ2h0PScxMicgdmlld0JveD0nMCAwIDEyIDEyJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNlICUzY3BhdGggZD0nTTguNjY2NzMgMi4wMDg5NUM3Ljg3NzM4IDEuNDgxNTEgNi45NDkzNSAxLjIgNiAxLjJDNS4zNjk2NSAxLjIgNC43NDU0OCAxLjMyNDE2IDQuMTYzMTIgMS41NjUzOEMzLjU4MDc2IDEuODA2NiAzLjA1MTYxIDIuMTYwMTcgMi42MDU4OSAyLjYwNTg5QzIuMTYwMTYgMy4wNTE2MSAxLjgwNjYgMy41ODA3NiAxLjU2NTM4IDQuMTYzMTJDMS4zMjQxNSA0Ljc0NTQ4IDEuMiA1LjM2OTY1IDEuMiA2QzEuMiA2Ljk0OTM1IDEuNDgxNTEgNy44NzczOCAyLjAwODk1IDguNjY2NzNDMi41MzYzOCA5LjQ1NjA5IDMuMjg2MDMgMTAuMDcxMyA0LjE2MzEyIDEwLjQzNDZDNS4wNDAyIDEwLjc5NzkgNi4wMDUzMiAxMC44OTMgNi45MzY0MyAxMC43MDc4QzcuODY3NTQgMTAuNTIyNiA4LjcyMjgyIDEwLjA2NTQgOS4zOTQxMSA5LjM5NDExQzEwLjA2NTQgOC43MjI4MiAxMC41MjI2IDcuODY3NTQgMTAuNzA3OCA2LjkzNjQzQzEwLjg5MyA2LjAwNTMyIDEwLjc5NzkgNS4wNDAyIDEwLjQzNDYgNC4xNjMxMkMxMC4wNzEzIDMuMjg2MDMgOS40NTYwOSAyLjUzNjM4IDguNjY2NzMgMi4wMDg5NVpNNiAwQzcuMTg2NjkgMCA4LjM0NjcyIDAuMzUxODk0IDkuMzMzNDIgMS4wMTExOEMxMC4zMjAxIDEuNjcwNDcgMTEuMDg5MSAyLjYwNzU0IDExLjU0MzMgMy43MDM5QzExLjk5NzQgNC44MDAyNSAxMi4xMTYyIDYuMDA2NjUgMTEuODg0NyA3LjE3MDU0QzExLjY1MzIgOC4zMzQ0MyAxMS4wODE4IDkuNDAzNTIgMTAuMjQyNiAxMC4yNDI2QzkuNDAzNTIgMTEuMDgxOCA4LjMzNDQyIDExLjY1MzIgNy4xNzA1NCAxMS44ODQ3QzYuMDA2NjUgMTIuMTE2MiA0LjgwMDI1IDExLjk5NzQgMy43MDM5IDExLjU0MzNDMi42MDc1NCAxMS4wODkxIDEuNjcwNDcgMTAuMzIwMSAxLjAxMTE4IDkuMzMzNDJDMC4zNTE4OTMgOC4zNDY3MiAwIDcuMTg2NjkgMCA2QzAgNS4yMTIwNyAwLjE1NTE5NCA0LjQzMTg1IDAuNDU2NzIyIDMuNzAzOUMwLjc1ODI1IDIuOTc1OTQgMS4yMDAyMSAyLjMxNDUxIDEuNzU3MzYgMS43NTczNkMyLjMxNDUxIDEuMjAwMjEgMi45NzU5NCAwLjc1ODI1MSAzLjcwMzkgMC40NTY3MjNDNC40MzE4NSAwLjE1NTE5NSA1LjIxMjA3IDAgNiAwWk02IDIuNEM1Ljk3NzUxIDIuNCA1Ljk1NTA2IDIuNDAwMjEgNS45MzI2NSAyLjQwMDYyQzUuNjAxMzQgMi40MDY3MiA1LjMzNzcgMi42ODAyNSA1LjM0Mzc5IDMuMDExNTZDNS4zNDk4OSAzLjM0Mjg3IDUuNjIzNDIgMy42MDY1MSA1Ljk1NDc0IDMuNjAwNDJDNS45Njk3OCAzLjYwMDE0IDUuOTg0ODcgMy42IDYgMy42QzYuMDE1MTMgMy42IDYuMDMwMjIgMy42MDAxNCA2LjA0NTI2IDMuNjAwNDJDNi4zNzY1OCAzLjYwNjUxIDYuNjUwMTEgMy4zNDI4NyA2LjY1NjIgMy4wMTE1NkM2LjY2MjMgMi42ODAyNSA2LjM5ODY2IDIuNDA2NzIgNi4wNjczNSAyLjQwMDYyQzYuMDQ0OTQgMi40MDAyMSA2LjAyMjQ5IDIuNCA2IDIuNFpNOC40OTc1OSAzLjQwNzNDOC4yNTg5NiAzLjE3NzM4IDcuODc5MTMgMy4xODQ0NCA3LjY0OTIxIDMuNDIzMDdDNy40MTkyOSAzLjY2MTcgNy40MjYzNSA0LjA0MTUzIDcuNjY0OTggNC4yNzE0NUM3LjY4NjU2IDQuMjkyMjUgNy43MDc3NSA0LjMxMzQ0IDcuNzI4NTUgNC4zMzUwMkM3Ljk1ODQ3IDQuNTczNjUgOC4zMzgzIDQuNTgwNzEgOC41NzY5MyA0LjM1MDc5QzguODE1NTYgNC4xMjA4NyA4LjgyMjYyIDMuNzQxMDQgOC41OTI3IDMuNTAyNDFDOC41NjE1OSAzLjQ3MDEyIDguNTI5ODggMy40Mzg0MSA4LjQ5NzU5IDMuNDA3M1pNNC4zMzUwMiA0LjI3MTQ1QzQuNTczNjUgNC4wNDE1MyA0LjU4MDcxIDMuNjYxNyA0LjM1MDc5IDMuNDIzMDdDNC4xMjA4NyAzLjE4NDQ0IDMuNzQxMDQgMy4xNzczOCAzLjUwMjQxIDMuNDA3M0MzLjQ3MDEyIDMuNDM4NDEgMy40Mzg0MSAzLjQ3MDEyIDMuNDA3MyAzLjUwMjQxQzMuMTc3MzggMy43NDEwNCAzLjE4NDQ0IDQuMTIwODcgMy40MjMwNyA0LjM1MDc5QzMuNjYxNyA0LjU4MDcxIDQuMDQxNTMgNC41NzM2NSA0LjI3MTQ1IDQuMzM1MDJDNC4yOTIyNSA0LjMxMzQ0IDQuMzEzNDQgNC4yOTIyNSA0LjMzNTAyIDQuMjcxNDVaTTkuNTk5MzggNS45MzI2NUM5LjU5MzI4IDUuNjAxMzQgOS4zMTk3NSA1LjMzNzcgOC45ODg0NCA1LjM0Mzc5QzguNjU3MTMgNS4zNDk4OSA4LjM5MzQ5IDUuNjIzNDIgOC4zOTk1OCA1Ljk1NDc0QzguMzk5ODYgNS45Njk3OCA4LjQgNS45ODQ4NyA4LjQgNkM4LjQgNi4wMTUxMyA4LjM5OTg2IDYuMDMwMjIgOC4zOTk1OCA2LjA0NTI2QzguMzkzNDkgNi4zNzY1OCA4LjY1NzEzIDYuNjUwMTEgOC45ODg0NCA2LjY1NjJDOS4zMTk3NSA2LjY2MjMgOS41OTMyOCA2LjM5ODY2IDkuNTk5MzggNi4wNjczNUM5LjU5OTc5IDYuMDQ0OTQgOS42IDYuMDIyNDkgOS42IDZDOS42IDUuOTc3NTEgOS41OTk3OSA1Ljk1NTA2IDkuNTk5MzggNS45MzI2NVpNMy42MDA0MiA1Ljk1NDc0QzMuNjA2NTEgNS42MjM0MiAzLjM0Mjg3IDUuMzQ5ODkgMy4wMTE1NiA1LjM0MzhDMi42ODAyNSA1LjMzNzcgMi40MDY3MiA1LjYwMTM0IDIuNDAwNjIgNS45MzI2NUMyLjQwMDIxIDUuOTU1MDYgMi40IDUuOTc3NTEgMi40IDZDMi40IDYuMDIyNDkgMi40MDAyMSA2LjA0NDk0IDIuNDAwNjIgNi4wNjczNUMyLjQwNjcyIDYuMzk4NjYgMi42ODAyNSA2LjY2MjMgMy4wMTE1NiA2LjY1NjIxQzMuMzQyODcgNi42NTAxMSAzLjYwNjUxIDYuMzc2NTggMy42MDA0MiA2LjA0NTI2QzMuNjAwMTQgNi4wMzAyMiAzLjYgNi4wMTUxMyAzLjYgNkMzLjYgNS45ODQ4NyAzLjYwMDE0IDUuOTY5NzggMy42MDA0MiA1Ljk1NDc0Wk00LjI3MTQ1IDcuNjY0OThDNC4wNDE1MyA3LjQyNjM1IDMuNjYxNyA3LjQxOTI5IDMuNDIzMDcgNy42NDkyMUMzLjE4NDQ0IDcuODc5MTMgMy4xNzczOCA4LjI1ODk2IDMuNDA3MyA4LjQ5NzU5QzMuNDM4NDEgOC41Mjk4OCAzLjQ3MDEyIDguNTYxNTkgMy41MDI0MSA4LjU5MjdDMy43NDEwNCA4LjgyMjYyIDQuMTIwODcgOC44MTU1NiA0LjM1MDc5IDguNTc2OTNDNC41ODA3MSA4LjMzODMgNC41NzM2NSA3Ljk1ODQ3IDQuMzM1MDIgNy43Mjg1NUM0LjMxMzQ0IDcuNzA3NzUgNC4yOTIyNSA3LjY4NjU2IDQuMjcxNDUgNy42NjQ5OFpNOC41OTI3IDguNDk3NTlDOC44MjI2MiA4LjI1ODk2IDguODE1NTYgNy44NzkxMyA4LjU3NjkzIDcuNjQ5MjFDOC4zMzgzIDcuNDE5MjkgNy45NTg0NyA3LjQyNjM1IDcuNzI4NTUgNy42NjQ5OEM3LjcwNzc1IDcuNjg2NTYgNy42ODY1NiA3LjcwNzc1IDcuNjY0OTggNy43Mjg1NUM3LjQyNjM1IDcuOTU4NDcgNy40MTkyOSA4LjMzODMgNy42NDkyMSA4LjU3NjkzQzcuODc5MTMgOC44MTU1NiA4LjI1ODk2IDguODIyNjIgOC40OTc1OSA4LjU5MjdDOC41Mjk4OCA4LjU2MTU5IDguNTYxNTkgOC41Mjk4OCA4LjU5MjcgOC40OTc1OVpNNS45NTQ3NCA4LjM5OTU4QzUuNjIzNDIgOC4zOTM0OSA1LjM0OTg5IDguNjU3MTMgNS4zNDM4IDguOTg4NDRDNS4zMzc3IDkuMzE5NzUgNS42MDEzNCA5LjU5MzI4IDUuOTMyNjUgOS41OTkzOEM1Ljk1NTA2IDkuNTk5NzkgNS45Nzc1MSA5LjYgNiA5LjZDNi4wMjI0OSA5LjYgNi4wNDQ5NCA5LjU5OTc5IDYuMDY3MzUgOS41OTkzOEM2LjM5ODY2IDkuNTkzMjggNi42NjIzIDkuMzE5NzUgNi42NTYyMSA4Ljk4ODQ0QzYuNjUwMTEgOC42NTcxMyA2LjM3NjU4IDguMzkzNDkgNi4wNDUyNiA4LjM5OTU4QzYuMDMwMjIgOC4zOTk4NiA2LjAxNTEzIDguNCA2IDguNEM1Ljk4NDg3IDguNCA1Ljk2OTc4IDguMzk5ODYgNS45NTQ3NCA4LjM5OTU4WicgZmlsbD0nJTIzMUJCQkYzJy8lM2UlM2Mvc3ZnJTNlIjsKICBleHBvcnQgZGVmYXVsdCBpbWc7';

  const busdIcon = 'https://cdn.sellix.io/static/gateways/busd.png';
  const QRMODE = ({
    isBinance,
    invoice,
    updateGateway
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config,
      theme
    } = React.useContext(InvoiceDetailsContext);
    const [infoPanel, setInfoPanel] = React.useState(false);
    const [linkPanel, setLinkPanel] = React.useState(false);
    const Copy = () => /*#__PURE__*/React.createElement("svg", {
      width: 16,
      height: 16,
      viewBox: `0 0 ${16} ${16}`
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10.6666667,0.666666667 L2.66666667,0.666666667 C1.93333333,0.666666667 1.33333333,1.26666667 1.33333333,2 L1.33333333,11.3333333 L2.66666667,11.3333333 L2.66666667,2 L10.6666667,2 L10.6666667,0.666666667 L10.6666667,0.666666667 Z M12.6666667,3.33333333 L5.33333333,3.33333333 C4.6,3.33333333 4,3.93333333 4,4.66666667 L4,14 C4,14.7333333 4.6,15.3333333 5.33333333,15.3333333 L12.6666667,15.3333333 C13.4,15.3333333 14,14.7333333 14,14 L14,4.66666667 C14,3.93333333 13.4,3.33333333 12.6666667,3.33333333 L12.6666667,3.33333333 Z M12.6666667,14 L5.33333333,14 L5.33333333,4.66666667 L12.6666667,4.66666667 L12.6666667,14 L12.6666667,14 Z",
      fill: "#000"
    }));
    if (invoice.status === 'WAITING_FOR_CONFIRMATIONS') {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: `qr-mode ${invoice.gateway}`
    }, isBinance ? /*#__PURE__*/React.createElement("div", {
      className: "qr-mode-message",
      style: {
        lineHeight: '1.25rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.qr.title.binance.0'), ' ', /*#__PURE__*/React.createElement("a", {
      href: "https://accounts.binance.com/en/register?ref=395915096",
      target: "_blank"
    }, i18n.t('shop.invoice.invoiceDetails.modes.qr.title.binance.1')), ' ', i18n.t('shop.invoice.invoiceDetails.modes.qr.title.binance.2')), /*#__PURE__*/React.createElement(Alert$1, {
      className: "d-flex mt-2 mb-0",
      skipTitle: true,
      small: true,
      text: i18n.t('shop.invoice.invoiceDetails.modes.qr.title.binanceAlert')
    })) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "qr-mode-message"
    }, i18n.t('shop.invoice.invoiceDetails.modes.qr.title.common.0')), /*#__PURE__*/React.createElement("div", {
      className: "qr-mode-message-chain"
    }, "We only support crypto transactions through the", i18n.t('shop.invoice.invoiceDetails.modes.qr.title.common.1'), ' ', /*#__PURE__*/React.createElement("span", {
      className: `qr-mode-message-badge ${invoice.gateway}`
    }, invoice.gateway === 'USDC' || invoice.gateway === 'USDT' || invoice.gateway === 'PLZ' ? `${invoice.blockchain} chain` : chain(invoice.gateway)), i18n.t('shop.invoice.invoiceDetails.modes.qr.title.common.2'))), invoice.status === 'PARTIAL' && /*#__PURE__*/React.createElement("span", {
      className: "badge badge-partial mt-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: Partial,
      alt: ""
    }), /*#__PURE__*/React.createElement(InvoiceStatus, invoice)), /*#__PURE__*/React.createElement("div", {
      className: `qr-mode-container ${invoice.gateway} ${theme.isDark ? 'mt-3' : 'mt-0'}`
    }, isBinance ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      className: "w-100",
      src: invoice.binance_qrcode,
      alt: ""
    })) : null, /*#__PURE__*/React.createElement("div", {
      className: "qr-mode-header"
    }, isBinance ? null : /*#__PURE__*/React.createElement(Clipboard, {
      text: invoice.crypto_address
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => setLinkPanel(true),
      "data-tooltip-location": "right",
      "data-tooltip": `Copy ${config.PAYMENT_FULL_NAME[invoice.gateway]} Address`
    }, /*#__PURE__*/React.createElement(Copy, null))), isBinance ? /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--lightFontColor)'
      },
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("img", {
      className: "mr-2",
      style: {
        width: '1.5rem',
        height: '1.5rem'
      },
      src: busdIcon,
      alt: ""
    }), " BUSD ", invoice.total) : /*#__PURE__*/React.createElement("div", {
      className: "qr-mode-title"
    }, ((invoice.crypto_amount || 0) - (invoice.crypto_received || 0)).toFixed(8), " ", config.PAYMENT_OPTS[invoice.gateway]), /*#__PURE__*/React.createElement(Progress, {
      invoice: invoice,
      setInfoPanel: setInfoPanel
    })), isBinance && invoice.binance_checkout_url ? /*#__PURE__*/React.createElement("div", {
      className: "w-100"
    }, /*#__PURE__*/React.createElement("a", {
      href: invoice.binance_checkout_url,
      target: "_blank"
    }, /*#__PURE__*/React.createElement(CustomButton, {
      className: "w-100 mt-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "mr-3 fa-regular fa-up-right-from-square"
    }), i18n.t('shop.invoice.invoiceDetails.modes.qr.payOn'), ' ', "Binance.com"))) : null, /*#__PURE__*/React.createElement(Clipboard, {
      text: invoice.crypto_address
    }, /*#__PURE__*/React.createElement(QRCode, {
      onClick: () => setLinkPanel(true),
      invoice: invoice
    })), /*#__PURE__*/React.createElement(LinkSlider, {
      invoice: invoice,
      linkPanel: linkPanel,
      close: () => setLinkPanel(false)
    }), /*#__PURE__*/React.createElement(InfoSlider, {
      isBinance: isBinance,
      infoPanel: infoPanel,
      invoice: invoice,
      close: () => setInfoPanel(false)
    })), invoice.status !== 'WAITING_FOR_CONFIRMATIONS' && /*#__PURE__*/React.createElement(ChangeGateway, {
      updateGateway: updateGateway
    }));
  };

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
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    let paypalTest = ['BANCONTACT', 'EPS', 'GIROPAY', 'IDEAL', 'SEPA', 'SOFORT', 'PRZELEWY24', 'BLIK', 'MERCADOPAGO', 'MYBANK', 'TRUSTLY'];
    let stripeTest = ['BANCONTACT', 'EPS', 'GIROPAY', 'IDEAL', 'SEPA', 'SOFORT', 'PRZELEWY24', 'AFTERPAY_CLEARPAY', 'ALIPAY', 'AU_BECS_DEBIT', 'BOLETO', 'FPX', 'GRABPAY', 'KLARNA', 'OXXO', 'WECHAT_PAY', 'CASH_APP'];
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
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: stripeAvailable.length ? config.PAYMENT_ICONS.STRIPE_EXTRA[stripeAvailable[0]] : config.PAYMENT_ICONS.PAYPAL_EXTRA[payPalAvailable[0]],
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.banking.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, payPalAvailable.map(v => config.PAYMENT_FULL_NAME.PAYPAL_EXTRA[v]).join(', '), payPalAvailable.length ? ', ' : '', stripeAvailable.map(v => config.PAYMENT_FULL_NAME.STRIPE_EXTRA[v]).join(', '))), !isOne ? deep === 'extra' && isOne === false ? null : /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons"
    }, payPalAvailable.map((v, key) => /*#__PURE__*/React.createElement("img", {
      key: key,
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA[v],
      alt: "",
      className: "rectangle"
    })), stripeAvailable.map((v, key) => /*#__PURE__*/React.createElement("img", {
      key: key,
      src: config.PAYMENT_ICONS.STRIPE_EXTRA[v],
      alt: "",
      className: "rectangle"
    }))) : null), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: deep === 'extra' && isOne === false
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-list"
    }, payPalAvailable.map((v, key) => /*#__PURE__*/React.createElement("div", {
      key: key,
      className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
      onClick: () => setGateway('PAYPAL', v)
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA[v],
      alt: "",
      className: "rectangle"
    }), config.PAYMENT_FULL_NAME.PAYPAL_EXTRA[v])), stripeAvailable.map((v, key) => /*#__PURE__*/React.createElement("div", {
      key: key,
      className: `gateway-list-item ${gateway === 'STRIPE' && APM === v ? 'active' : ''}`,
      onClick: () => setGateway('STRIPE', v)
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.STRIPE_EXTRA[v],
      alt: "",
      className: "rectangle"
    }), config.PAYMENT_FULL_NAME.STRIPE_EXTRA[v])))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const Crypto$2 = ({
    crypto,
    deep,
    setDeep,
    setGateway,
    gateway,
    isMarketplace,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    let [PLZModal, showPLZModal] = React.useState(false);
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
    let isBEP20PLZ = crypto.includes('PLZ:BEP20');
    let isTRC20PLZ = crypto.includes('PLZ:TRC20');
    let isERC20USDC = crypto.includes('USDC:ERC20');
    let isBEP20USDC = crypto.includes('USDC:BEP20');
    let isMATICUSDC = crypto.includes('USDC:MATIC');
    let isERC20USDT = crypto.includes('USDT:ERC20');
    let isBEP20USDT = crypto.includes('USDT:BEP20');
    let isTRC20USDT = crypto.includes('USDT:TRC20');
    let isMATICUSDT = crypto.includes('USDT:MATIC');
    let bothChainUSDC = [isERC20USDC, isBEP20USDC, isMATICUSDC].filter(i => i).length > 1;
    let bothChainUSDT = [isERC20USDT, isBEP20USDT, isTRC20USDT, isMATICUSDT].filter(i => i).length > 1;
    let bothChainPLZ = [isBEP20PLZ, isTRC20PLZ].filter(i => i).length > 1;
    const isActive = crypto.includes(gateway);
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''} is-crypto`
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'} ${crypto.includes(gateway) ? 'active' : ''}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS[crypto[0]],
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, isOne && crypto[0].includes('PLZ') ? /*#__PURE__*/React.createElement(React.Fragment, null, "PLZ ", /*#__PURE__*/React.createElement("br", null)) : '', isOne && crypto[0].includes('USDC') ? /*#__PURE__*/React.createElement(React.Fragment, null, "USDC ", /*#__PURE__*/React.createElement("br", null)) : '', isOne && crypto[0].includes('USDT') ? /*#__PURE__*/React.createElement(React.Fragment, null, "USDT ", /*#__PURE__*/React.createElement("br", null)) : '', isOne && (isBEP20USDT || isBEP20USDC || isBEP20PLZ) && 'Binance Smart Chain (BEP20)', isOne && (isERC20USDT || isERC20USDC) && 'Ethereum Chain (ERC20)', isOne && (isTRC20USDT || isTRC20USDT || isTRC20PLZ) && 'Tron Chain (TRC20)', isOne && (isMATICUSDT || isMATICUSDC) && 'Polygon Chain (MATIC)', !isOne ? /*#__PURE__*/React.createElement(React.Fragment, null, i18n.t('shop.checkout.purchaseDetails.gateways.crypto.title'), /*#__PURE__*/React.createElement("br", null)) : '', isOne && !crypto[0].includes('USDC') && !crypto[0].includes('USDT') && !crypto[0].includes('PLZ') ? /*#__PURE__*/React.createElement(React.Fragment, null, config.PAYMENT_FULL_NAME[crypto[0]], /*#__PURE__*/React.createElement("br", null)) : ''), !isOne ? deep === 'crypto' ? null : /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, !isOne && crypto.map(v => bothChainUSDC && v.includes('USDC') || bothChainUSDT && v.includes('USDT') || bothChainPLZ && v.includes('PLZ') ? '' : /*#__PURE__*/React.createElement("span", null, config.PAYMENT_FULL_NAME[v], " ")), !isOne && bothChainUSDC && /*#__PURE__*/React.createElement("span", null, "USDC "), !isOne && bothChainUSDT && /*#__PURE__*/React.createElement("span", null, "USDT "), !isOne && bothChainPLZ && /*#__PURE__*/React.createElement("span", null, "PLZ ")) : /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.crypto.subtitle'))), !isOne ? deep === 'crypto' && isOne === false ? null : /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons"
    }, crypto.map((v, key) => {
      if (bothChainUSDC && v.includes('USDC')) {
        return '';
      } else if (bothChainUSDT && v.includes('USDT')) {
        return '';
      } else if (bothChainPLZ && v.includes('PLZ')) {
        return '';
      } else {
        return /*#__PURE__*/React.createElement("img", {
          key: key,
          src: config.PAYMENT_ICONS[v],
          alt: ""
        });
      }
    }), bothChainUSDC && /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS['USDC'],
      alt: ""
    }), bothChainUSDT && /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS['USDT'],
      alt: ""
    }), bothChainPLZ && /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS['PLZ'],
      alt: ""
    })) : null), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: deep === 'crypto' && isOne === false
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-list"
    }, crypto.filter(v => v !== 'USDC:ERC20').filter(v => v !== 'USDC:BEP20').filter(v => v !== 'USDC:MATIC').filter(v => v !== 'USDT:ERC20').filter(v => v !== 'USDT:TRC20').filter(v => v !== 'USDT:BEP20').filter(v => v !== 'USDT:MATIC').filter(v => v !== 'PLZ:BEP20').filter(v => v !== 'PLZ:TRC20').map((v, key) => {
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        className: `gateway-list-item ${gateway === v ? 'active' : ''}`,
        onClick: () => {
          setGateway(v);
          showUSDCModal(false);
          showUSDTModal(false);
          showPLZModal(false);
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS[v],
        alt: ""
      }), v === 'BINANCE_COIN' ? /*#__PURE__*/React.createElement("span", null, config.PAYMENT_FULL_NAME[v], /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, "(BNB)")) : v === 'BITCOIN_LN' ? /*#__PURE__*/React.createElement("span", null, config.PAYMENT_FULL_NAME.BITCOIN, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "(Lightning Network)")) : config.PAYMENT_FULL_NAME[v]);
    }), /*#__PURE__*/React.createElement(USDC, {
      USDCModal: USDCModal,
      showUSDCModal: data => {
        showUSDCModal(data);
        showUSDTModal(false);
        showPLZModal(false);
      },
      crypto: crypto,
      gateway: gateway,
      setGateway: setGateway,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(USDT, {
      USDTModal: USDTModal,
      showUSDTModal: data => {
        showUSDTModal(data);
        showUSDCModal(false);
        showPLZModal(false);
      },
      crypto: crypto,
      gateway: gateway,
      setGateway: setGateway,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(PLZ, {
      PLZModal: PLZModal,
      showPLZModal: data => {
        showPLZModal(data);
        showUSDTModal(false);
        showUSDCModal(false);
      },
      crypto: crypto,
      gateway: gateway,
      setGateway: setGateway,
      config: config,
      components: components
    }))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const USDC = ({
    USDCModal,
    showUSDCModal,
    gateway,
    setGateway,
    crypto,
    config,
    components
  }) => {
    let isERC20 = crypto.includes('USDC:ERC20');
    let isBEP20 = crypto.includes('USDC:BEP20');
    let isMATIC = crypto.includes('USDC:MATIC');
    let bothChain = [isERC20, isBEP20, isMATIC].filter(i => i).length > 1;
    let onClick = () => {
      if (bothChain) {
        showUSDCModal(true);
      } else {
        if (crypto.includes('USDC:ERC20')) {
          setGateway('USDC:ERC20');
        } else if (crypto.includes('USDC:BEP20')) {
          setGateway('USDC:BEP20');
        } else {
          setGateway('USDC:MATIC');
        }
      }
    };
    let items = [];
    if (isBEP20) {
      items.push({
        type: 'BEP20',
        title: 'Binance Smart Chain',
        full: 'USDC:BEP20'
      });
    }
    if (isERC20) {
      items.push({
        type: 'ERC20',
        title: 'Binance Smart Chain',
        full: 'USDC:ERC20'
      });
    }
    if (isMATIC) {
      items.push({
        type: 'MATIC',
        title: 'Polygon Chain',
        full: 'USDC:MATIC'
      });
    }
    if (crypto.includes('USDC:ERC20') || crypto.includes('USDC:BEP20') || crypto.includes('USDC:MATIC')) {
      return /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === 'USDC:BEP20' || gateway === 'USDC:ERC20' || gateway === 'USDC:MATIC' ? 'active' : ''} ${USDCModal ? 'w-100 d-flex flex-column align-items-start' : ''}`,
        onClick: onClick
      }, bothChain ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDC")) : isBEP20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDC (BEP20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Binance Smart Chain"))) : isERC20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDC (ERC20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Ethereum Chain"))) : isMATIC ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDC'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDC (MATIC) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Polygon Chain"))) : null, /*#__PURE__*/React.createElement("div", {
        className: "gateway-list-item-extended"
      }, USDCModal && items.map(({
        type,
        title,
        full
      }) => /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === full ? 'active' : ''} `,
        onClick: () => setGateway(full)
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDC']
      }), /*#__PURE__*/React.createElement("span", null, type, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, title))))));
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
    config,
    components
  }) => {
    let isERC20 = crypto.includes('USDT:ERC20');
    let isBEP20 = crypto.includes('USDT:BEP20');
    let isTRC20 = crypto.includes('USDT:TRC20');
    let isMATIC = crypto.includes('USDT:MATIC');
    let bothChain = [isERC20, isBEP20, isTRC20, isMATIC].filter(i => i).length > 1;
    let onClick = () => {
      if (bothChain) {
        showUSDTModal(true);
      } else {
        if (crypto.includes('USDT:ERC20')) {
          setGateway('USDT:ERC20');
        } else if (crypto.includes('USDT:BEP20')) {
          setGateway('USDT:BEP20');
        } else if (crypto.includes('USDT:TRC20')) {
          setGateway('USDT:TRC20');
        } else {
          setGateway('USDT:MATIC');
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
    if (isMATIC) {
      items.push({
        type: 'MATIC',
        title: 'Polygon Chain',
        full: 'USDT:MATIC'
      });
    }
    if (crypto.includes('USDT:ERC20') || crypto.includes('USDT:BEP20') || crypto.includes('USDT:TRC20') || crypto.includes('USDT:MATIC')) {
      return /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === 'USDT:BEP20' || gateway === 'USDT:ERC20' || gateway === 'USDT:TRC20' || gateway === 'USDT:MATIC' ? 'active' : ''} ${USDTModal ? 'w-100 d-flex flex-column align-items-start' : ''}`,
        onClick: onClick
      }, bothChain ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDT")) : isBEP20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDT (BEP20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Binance Smart Chain"))) : isERC20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDT (ERC20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Ethereum Chain"))) : isTRC20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDT (TRC20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Tron Chain"))) : isMATIC ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "USDT (MATIC) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Polygon Chain"))) : null, /*#__PURE__*/React.createElement("div", {
        className: "gateway-list-item-extended"
      }, USDTModal && items.map(({
        type,
        title,
        full
      }) => /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === full ? 'active' : ''} `,
        onClick: () => setGateway(full)
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['USDT']
      }), /*#__PURE__*/React.createElement("span", null, type, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, title))))));
    } else {
      return null;
    }
  };
  const PLZ = ({
    PLZModal,
    showPLZModal,
    gateway,
    setGateway,
    crypto,
    config,
    components
  }) => {
    let isBEP20 = crypto.includes('PLZ:BEP20');
    let isTRC20 = crypto.includes('PLZ:TRC20');
    let bothChain = [isBEP20, isTRC20].filter(i => i).length > 1;
    let onClick = () => {
      if (bothChain) {
        showPLZModal(true);
      } else {
        if (crypto.includes('PLZ:BEP20')) {
          setGateway('PLZ:BEP20');
        } else if (crypto.includes('PLZ:TRC20')) {
          setGateway('PLZ:TRC20');
        }
      }
    };
    let items = [];
    if (isBEP20) {
      items.push({
        type: 'BEP20',
        title: 'Binance Smart Chain',
        full: 'PLZ:BEP20'
      });
    }
    if (isTRC20) {
      items.push({
        type: 'TRC20',
        title: 'Tron Chain',
        full: 'PLZ:TRC20'
      });
    }
    if (crypto.includes('PLZ:BEP20') || crypto.includes('PLZ:TRC20')) {
      return /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === 'PLZ:BEP20' || gateway === 'PLZ:TRC20' ? 'active' : ''} ${PLZModal ? 'w-100 d-flex flex-column align-items-start' : ''}`,
        onClick: onClick
      }, bothChain ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['PLZ'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "PLZ")) : isBEP20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['PLZ'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "PLZ (BEP20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Binance Smart Chain"))) : isTRC20 ? /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['PLZ'],
        alt: ""
      }), /*#__PURE__*/React.createElement("span", null, "PLZ (TRC20) ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "Tron Chain"))) : null, /*#__PURE__*/React.createElement("div", {
        className: "gateway-list-item-extended"
      }, PLZModal && items.map(({
        type,
        title,
        full
      }) => /*#__PURE__*/React.createElement("div", {
        className: `gateway-list-item ${gateway === full ? 'active' : ''} `,
        onClick: () => setGateway(full)
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['PLZ']
      }), /*#__PURE__*/React.createElement("span", null, type, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, title))))));
    } else {
      return null;
    }
  };
  const PayPal$1 = ({
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
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
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
    let isActive = isOne && gateway === 'PAYPAL' && !APM || gateway === 'PAYPAL' && (!APM || APM === 'CREDIT' || APM === 'PAYLATER') || gateway === 'PAYPAL_CREDIT_CARD';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''} ${payPalAvailable.includes(gateway) && !APM ? 'active' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex ${isOne ? 'flex-row-reverse justify-content-between' : 'flex-wrap'}`,
      onClick: onClick
    }, isOne && /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.paypal.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, isOne ? i18n.t('shop.checkout.purchaseDetails.gateways.paypal.subtitle') : i18n.t('shop.checkout.purchaseDetails.gateways.paypal.paypal'), payPalAvailable.map(v => {
      if (v === 'CARD' && !hideCredit) {
        return `, ${i18n.t('shop.checkout.purchaseDetails.gateways.paypal.creditCardAndPaypal')}`;
      } else if (v === 'PAYLATER') {
        return `, ${i18n.t('shop.checkout.purchaseDetails.gateways.paypal.payLater')}`;
      } else if (v === 'CREDIT') {
        return `, ${i18n.t('shop.checkout.purchaseDetails.gateways.paypal.paypalCredit')}`;
      } else {
        return '';
      }
    }))), !isOne ? deep === 'paypal' && isOne === false ? null : /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL,
      alt: ""
    }), hideCredit ? null : /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.CARD,
      alt: ""
    })) : null), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: deep === 'paypal' && isOne === false
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-list"
    }, payPalAvailable.map((v, key) => {
      if (v === 'CARD' && !hideCredit) {
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL_CREDIT_CARD' ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL_CREDIT_CARD')
        }, /*#__PURE__*/React.createElement("img", {
          src: config.PAYMENT_ICONS.CARD,
          alt: ""
        }), i18n.t('shop.checkout.purchaseDetails.gateways.paypal.creditCardAndPaypal'));
      } else if (v === 'PAYLATER') {
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL', v)
        }, /*#__PURE__*/React.createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), i18n.t('shop.checkout.purchaseDetails.gateways.paypal.payLater'));
      } else if (v === 'CREDIT') {
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && APM === v ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL', v)
        }, /*#__PURE__*/React.createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), i18n.t('shop.checkout.purchaseDetails.gateways.paypal.paypalCredit'));
      } else if (v === 'PAYPAL') {
        return /*#__PURE__*/React.createElement("div", {
          key: key,
          className: `gateway-list-item ${gateway === 'PAYPAL' && !APM ? 'active' : ''}`,
          onClick: () => setGateway('PAYPAL')
        }, /*#__PURE__*/React.createElement("img", {
          src: config.PAYMENT_ICONS.PAYPAL,
          alt: ""
        }), i18n.t('shop.checkout.purchaseDetails.gateways.paypal.paypal'));
      }
    }))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const Stripe$1 = ({
    APM,
    isStripe,
    gateway,
    setGateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
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
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('STRIPE');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.stripe.title'), ' ', currentBrowser === 'chrome' ? `, ${i18n.t('shop.checkout.purchaseDetails.gateways.stripe.browserPays.google')}` : currentBrowser === 'safari' ? `, ${i18n.t('shop.checkout.purchaseDetails.gateways.stripe.browserPays.apple')}` : ''), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.stripe.message', {
      browserPay: currentBrowser === 'chrome' ? i18n.t('shop.checkout.purchaseDetails.gateways.stripe.browserPays.google') : currentBrowser === 'safari' ? i18n.t('shop.checkout.purchaseDetails.gateways.stripe.browserPays.apple') : i18n.t('shop.checkout.purchaseDetails.gateways.stripe.browserPays.googleOrApple')
    })), /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.VISA,
      alt: "",
      className: "rectangle"
    }), /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.MASTERCARD,
      alt: "",
      className: "rectangle"
    }), /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.AMERICANEXPRESS,
      alt: "",
      className: "rectangle",
      style: {
        width: '2rem',
        marginLeft: '-0.5rem'
      }
    }), currentBrowser === 'chrome' ? /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.GOOGLEPAY,
      alt: "",
      className: "rectangle",
      style: {
        width: '1.5rem',
        marginLeft: -5
      }
    }) : null, currentBrowser === 'safari' ? /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.APPLEPAY,
      alt: "",
      className: "rectangle",
      style: {
        width: '2rem',
        marginLeft: -9
      }
    }) : null), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const Skrill$1 = ({
    isSkrill,
    gateway,
    setGateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (!isSkrill) {
      return null;
    }
    const isActive = gateway === 'SKRILL';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('SKRILL');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.SKRILL,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.skrill.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.skrill.subtitle')))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const CashApp$1 = ({
    isCashApp,
    gateway,
    setGateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (!isCashApp) {
      return null;
    }
    const isActive = gateway === 'CASH_APP';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('CASH_APP');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.CASH_APP,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.cashApp.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.cashApp.subtitle')))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const PerfectMoney$1 = ({
    isPerfectMoney,
    gateway,
    setGateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (!isPerfectMoney) {
      return null;
    }
    const isActive = gateway === 'PERFECT_MONEY';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('PERFECT_MONEY');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PERFECT_MONEY,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.perfectMoney.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.perfectMoney.subtitle')))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const Venmo = ({
    payPalAvailable,
    setGateway,
    APM,
    gateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (!payPalAvailable.includes('VENMO')) {
      return null;
    }
    const isActive = gateway === 'PAYPAL' && APM === 'VENMO';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('PAYPAL', 'VENMO');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `d-flex flex-row-reverse justify-content-between `
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PAYPAL_EXTRA.VENMO,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.venmo.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.venmo.subtitle')))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };
  const Binance = ({
    isSubscription,
    isBinance,
    setGateway,
    gateway,
    setDeep,
    config,
    components
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (!isBinance || isSubscription) {
      return null;
    }
    const isActive = gateway === 'BINANCE';
    return /*#__PURE__*/React.createElement("div", {
      className: `${isActive ? 'active' : ''}`,
      onClick: () => {
        setGateway('BINANCE');
        setDeep();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-row-reverse justify-content-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gateway-icons big"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.BINANCE,
      alt: ""
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "gateway-title"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.binance.title')), /*#__PURE__*/React.createElement("div", {
      className: "gateway-subtitle isBinancePay"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.binance.subtitle.0'), ' ', /*#__PURE__*/React.createElement("a", {
      href: "https://accounts.binance.com/en/register?ref=395915096",
      target: "_blank"
    }, i18n.t('shop.checkout.purchaseDetails.gateways.binance.subtitle.1')), ' ', i18n.t('shop.checkout.purchaseDetails.gateways.binance.subtitle.2')))), isActive && components.PriceDetailsComponent && /*#__PURE__*/React.createElement(components.PriceDetailsComponent, null));
  };

  const GatewaySelector = ({
    type,
    config,
    cartProducts,
    productInfo,
    invoiceInfo,
    paymentOptions,
    isSubscription,
    components = {},
    gateway,
    APM,
    setGateway,
    appliedCoupon
  }) => {
    const {
      i18n
    } = useI18nContext();
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
    const isPayPal = paymentOptions.includes('PAYPAL') && (!isSubscription || isSubscription && !appliedCoupon);
    const isStripe = paymentOptions.includes('STRIPE');
    const isPayPalCreditCardAvailable = paymentOptions.includes('PAYPAL_CREDIT_CARD');
    const isCrypto = paymentOptions.filter(i => cryptoOptionsWithChain.includes(i));
    return /*#__PURE__*/React.createElement("div", {
      className: "gateway-container unselectable"
    }, /*#__PURE__*/React.createElement(Crypto$2, {
      crypto: isCrypto,
      isMarketplace: isMarketplace,
      setGateway: setGateway,
      gateway: gateway,
      deep: deep,
      setDeep: () => setDeep(deep === 'crypto' ? null : 'crypto'),
      APM: APM,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(Binance, {
      isSubscription: isSubscription,
      isBinance: isBinance,
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep(deep === 'binance' ? null : 'binance'),
      deep: deep,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(Stripe$1, {
      isStripe: isStripe,
      gateway: gateway,
      setGateway: setGateway,
      setDeep: () => setDeep(deep === 'stripe' ? null : 'stripe'),
      APM: APM,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(PayPal$1, {
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
      components: components
    }), /*#__PURE__*/React.createElement(Banking, {
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
      components: components
    }), /*#__PURE__*/React.createElement(Venmo, {
      isPayPal: isPayPal,
      payPalAvailable: payPalAvailable,
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep(deep === 'venmo' ? null : 'venmo'),
      deep: deep,
      APM: APM,
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(CashApp$1, {
      isCashApp: paymentOptions.includes('CASH_APP'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('cashapp'),
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(PerfectMoney$1, {
      isPerfectMoney: paymentOptions.includes('PERFECT_MONEY'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('perfect_money'),
      config: config,
      components: components
    }), /*#__PURE__*/React.createElement(Skrill$1, {
      isSkrill: paymentOptions.includes('SKRILL'),
      setGateway: setGateway,
      gateway: gateway,
      setDeep: () => setDeep('skrill'),
      config: config,
      components: components
    }), isStripe && (APM === 'KLARNA' || APM === 'AFTERPAY_CLEARPAY' || APM === 'SOFORT') && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '.7rem',
        borderColor: '#fcab0a',
        borderWidth: 2,
        background: '#fcab0a29'
      }
    }, i18n.t('shop.checkout.purchaseDetails.gateways.stripe.processingPeriodMessage', {
      paymentName: config.PAYMENT_FULL_NAME.STRIPE_EXTRA[APM]
    })));
  };

  const FULL_FIELDS$1 = [{
    name: "name",
    placeholder: "Name",
    required: "Name is required"
  }, {
    name: "surname",
    placeholder: "Surname",
    required: "Surname is required"
  }, {
    name: "address_line1",
    placeholder: "Address",
    required: "Address is required"
  }, {
    name: "address_city",
    placeholder: "City",
    required: "City is required"
  }, {
    name: "address_country",
    placeholder: "Country",
    required: "Country is required",
    isAddress: true
  }, {
    name: "address_postal_code",
    placeholder: "Postal Code",
    required: "Postal Code is required"
  }, {
    name: "address_state",
    placeholder: "State",
    required: "State is required"
  }];
  const FIELDS$1 = [{
    name: "name",
    placeholder: "Name",
    required: "Name is required"
  }, {
    name: "surname",
    placeholder: "Surname",
    required: "Surname is required"
  }];

  const initialValue$1 = {
    keys: [],
    getParam: (name, defaultValue) => {}
  };
  const DefaultParamsContext = /*#__PURE__*/React.createContext(initialValue$1);
  const useDefaultParamsContext = () => React.useContext(DefaultParamsContext);

  function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  const Input = ({
    name,
    placeholder,
    required,
    form,
    setForm,
    stripeData,
    setStripeData,
    touched,
    setTouched
  }) => /*#__PURE__*/React.createElement("div", {
    className: `${name === 'address_line1' ? 'w-100' : ''}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: name,
    onChange: e => {
      setForm({
        ...form,
        [name]: e.target.value
      });
      setStripeData({
        ...stripeData,
        [name]: e.target.value
      });
    },
    onBlur: () => setTouched({
      ...touched,
      [name]: true
    }),
    value: form[name],
    placeholder: placeholder,
    className: `sellix-input ${!form[name] && touched[name] ? 'is-invalid' : ''}`
  }), !form[name] && touched[name] && /*#__PURE__*/React.createElement("div", {
    className: "text-left invalid-feedback"
  }, required));
  const Select = ({
    config,
    name,
    placeholder,
    required,
    form,
    setForm,
    stripeData,
    setStripeData,
    touched,
    setTouched
  }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "select-container"
  }, /*#__PURE__*/React.createElement("select", {
    className: `select sellix-select ${!stripeData[name] && touched[name] ? "is-invalid" : ""}`,
    name: name,
    value: form[name],
    placeholder: placeholder,
    onChange: e => {
      setForm({
        ...form,
        [name]: e.target.value
      });
      setStripeData({
        ...stripeData,
        [name]: e.target.value
      });
    },
    onBlur: () => setTouched({
      ...touched,
      [name]: true
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    hidden: true
  }, placeholder), config.COUNTRIES.map(({
    label,
    value
  }) => /*#__PURE__*/React.createElement("option", {
    value: value,
    key: value
  }, label)))), !form[name] && touched[name] && /*#__PURE__*/React.createElement("div", {
    className: "text-left invalid-feedback"
  }, required));
  const StripeForm = ({
    i18n,
    config,
    stripeData,
    setStripeData,
    isExtendedStripeForm,
    isVisibleStripeForm = true,
    // it needs just for compatibility with old widgets for passing translation keys
    translationConfig = {}
  }) => {
    const {
      getParam
    } = useDefaultParamsContext();
    let requiredForm = {
      name: '',
      surname: ''
    };
    if (isExtendedStripeForm) {
      requiredForm.address_line1 = '';
      requiredForm.address_city = '';
      requiredForm.address_country = '';
      requiredForm.address_postal_code = '';
      requiredForm.address_state = '';
    }
    let [form, setForm] = React.useState(requiredForm);
    let [touched, setTouched] = React.useState(requiredForm);
    let fields = isExtendedStripeForm ? translationConfig.FULL_FIELDS || FULL_FIELDS$1 : translationConfig.FIELDS || FIELDS$1;
    const updateForm = React.useCallback(() => {
      if (getParam('stripeData')) {
        let dataForm = {};
        try {
          dataForm = JSON.parse(b64DecodeUnicode(getParam('stripeData')));
        } catch (e) {
          // encode error
        }
        const newFields = {};
        let hasNewFields = false;
        Object.keys(form).forEach(fld => {
          if (dataForm[fld]) {
            newFields[fld] = dataForm[fld];
            hasNewFields = true;
          }
        });
        if (hasNewFields) {
          setForm({
            ...form,
            ...newFields
          });
          setStripeData({
            ...stripeData,
            ...newFields
          });
        }
      }
    }, [getParam]);
    React.useEffect(() => {
      updateForm();
    }, [updateForm]);
    if (!isVisibleStripeForm) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "stripe-form-container mt-2 mb-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sellix-label"
    }, i18n.t(translationConfig.title || 'Details requested by Stripe')), /*#__PURE__*/React.createElement("div", {
      className: "stripe-form"
    }, fields.map(({
      name,
      placeholder,
      isAddress,
      required
    }, key) => {
      if (isAddress) {
        return /*#__PURE__*/React.createElement("div", {
          className: "w-100"
        }, /*#__PURE__*/React.createElement("label", {
          className: "sellix-label"
        }, i18n.t(placeholder)), /*#__PURE__*/React.createElement(Select, {
          key: key,
          config: config,
          name: name,
          placeholder: i18n.t(placeholder),
          required: i18n.t(required),
          form: form,
          setForm: setForm,
          stripeData: stripeData,
          setStripeData: setStripeData,
          touched: touched,
          setTouched: setTouched
        }));
      } else {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
          className: "sellix-label"
        }, i18n.t(placeholder)), /*#__PURE__*/React.createElement(Input, {
          key: key,
          name: name,
          placeholder: i18n.t(placeholder),
          required: i18n.t(required),
          form: form,
          setForm: setForm,
          stripeData: stripeData,
          setStripeData: setStripeData,
          touched: touched,
          setTouched: setTouched
        }));
      }
    })));
  };

  const FULL_FIELDS = [{
    name: 'name',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.name.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.name.isRequired'
  }, {
    name: 'surname',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.surname.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.surname.isRequired'
  }, {
    name: 'address_line1',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.address.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.address.isRequired'
  }, {
    name: 'address_city',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.city.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.city.isRequired'
  }, {
    name: 'address_country',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.country.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.country.isRequired',
    isAddress: true
  }, {
    name: 'address_postal_code',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.postalCode.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.postalCode.isRequired'
  }, {
    name: 'address_state',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.state.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.state.isRequired'
  }];
  const FIELDS = [{
    name: 'name',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.name.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.name.isRequired'
  }, {
    name: 'surname',
    placeholder: 'shop.checkout.purchaseDetails.stripeForm.fields.surname.title',
    required: 'shop.checkout.purchaseDetails.stripeForm.fields.surname.isRequired'
  }];
  var STRIPE_FORM_TRANSLATION_CONFIG = {
    title: 'shop.checkout.purchaseDetails.stripeForm.title',
    FIELDS,
    FULL_FIELDS
  };

  const Gateway = props => {
    const {
      i18n
    } = useI18nContext();
    const {
      config,
      theme,
      invoiceId,
      onUpdateInvoice,
      onShowMessage
    } = React.useContext(InvoiceDetailsContext);
    let {
      invoice,
      getInvoice,
      onChangeGateway,
      updateGateway
    } = props;
    const [gateway, setGateway] = React.useState(invoice.gateway);
    const [APM, setAPM] = React.useState(null);
    const [sending, setSending] = React.useState(false);
    const [payPalEmailDelivery, setPayPalEmailDelivery] = React.useState(false);
    const paymentOptions = useInvoicePayments(invoice);
    const {
      stripeData,
      setStripeData,
      isVisibleStripeForm,
      isStripeFormValid,
      isExtendedStripeForm
    } = useStripeForm([invoice], gateway, APM);
    const [handleUpdateInvoice] = useUpdateInvoice({
      config,
      gateway,
      APM,
      payPalEmailDelivery,
      isVisibleStripeForm,
      isExtendedStripeForm,
      stripeData,
      getInvoice,
      setLoader: setSending,
      onUpdateInvoice,
      onShowMessage,
      invoiceId,
      invoice
    });
    if (props.invoice.status !== 'PENDING') {
      return null;
    }
    if (invoice.status === 'COMPLETED' || invoice.status === 'VOIDED') {
      return null;
    }
    const disabledPayButton = !gateway || isVisibleStripeForm && !isStripeFormValid;
    return /*#__PURE__*/React.createElement(React.Fragment, null, paymentOptions.length ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "sellix-payment-methods"
    }, /*#__PURE__*/React.createElement(GatewaySelector, {
      type: "invoice",
      config: config,
      theme: theme,
      invoiceInfo: invoice,
      paymentOptions: paymentOptions,
      isSubscription: invoice.type === 'PRODUCT_SUBSCRIPTION',
      gateway: gateway,
      APM: APM,
      setGateway: (gateway, APM) => {
        onChangeGateway(gateway);
        setGateway(gateway);
        setAPM(APM);
      }
    })), /*#__PURE__*/React.createElement("div", null, gateway === 'PAYPAL' && !invoice.shop_force_paypal_email_delivery && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sellix-checkbox"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "paypal_email_delivery",
      checked: payPalEmailDelivery,
      onChange: e => {
        setPayPalEmailDelivery(e.target.checked);
      }
    }), /*#__PURE__*/React.createElement("label", {
      className: "sellix-label",
      htmlFor: "paypal_email_delivery",
      style: {
        color: 'var(--lightFontColor)'
      }
    }, i18n.t('shop.invoice.invoiceDetails.gateway.deliverPaypal'))))), /*#__PURE__*/React.createElement("div", null, isVisibleStripeForm && /*#__PURE__*/React.createElement(StripeForm, {
      i18n: i18n,
      config: config,
      isExtendedStripeForm: isExtendedStripeForm,
      stripeData: stripeData,
      setStripeData: setStripeData,
      translationConfig: STRIPE_FORM_TRANSLATION_CONFIG
    })), /*#__PURE__*/React.createElement("div", {
      className: "sellix-product-footer d-flex"
    }, invoice.gateway && /*#__PURE__*/React.createElement(CustomButton, {
      className: "button-ghost back",
      onClick: () => {
        onChangeGateway(invoice.gateway);
        updateGateway(invoice.gateway);
      }
    }, i18n.t('shop.invoice.invoiceDetails.gateway.back')), /*#__PURE__*/React.createElement(CustomButton, {
      disabled: disabledPayButton,
      className: `${!invoice.gateway ? 'w-100' : ''} next`,
      onClick: handleUpdateInvoice
    }, sending ? /*#__PURE__*/React.createElement(Index, null) : i18n.t('shop.invoice.invoiceDetails.gateway.update')))) : /*#__PURE__*/React.createElement("div", {
      className: "sellix-product-details"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "sellix-product-title text-left"
    }, i18n.t('shop.invoice.invoiceDetails.gateway.noAvailablePaymentMethods')))));
  };

  function redirectForLocalTest(toSubdomain, pathname, host) {
    let subList = host.split('.');
    let currentSubdomain = host.split('.')[1] && host.split('.')[1] !== 'com:3000' ? host.split('.')[0] : '';
    if (currentSubdomain === toSubdomain) {
      return pathname;
    } else {
      if (toSubdomain) {
        if (currentSubdomain) {
          subList.shift();
          return `http://${toSubdomain}.local-test-sellix.com:8080${pathname}`;
        } else {
          return `http://${toSubdomain}.local-test-sellix.com:8080${pathname}`;
        }
      } else {
        if (currentSubdomain) {
          subList.shift();
          return `http://local-test-sellix.com:3000${pathname}`;
        } else {
          return `http://local-test-sellix.com:3000${pathname}`;
        }
      }
    }
  }
  function redirectForStaging(toSubdomain, pathname, host) {
    let subList = host.split('.');
    let currentSubdomain = host.split('.')[1] ? host.split('.')[1] === 'gg' || host.split('.')[1] === 'io' ? '' : host.split('.')[0] : '';
    if (currentSubdomain === toSubdomain) {
      return pathname;
    } else {
      if (toSubdomain) {
        if (currentSubdomain) {
          subList.shift();
          return `https://${toSubdomain}.${subList.join('.')}${pathname}`;
        } else {
          return `https://${toSubdomain}.${subList.join('.')}${pathname}`;
        }
      } else {
        if (currentSubdomain) {
          subList.shift();
          return `https://${subList.join('.')}${pathname}`;
        } else {
          return `https://${subList.join('.')}${pathname}`;
        }
      }
    }
  }
  function linkToSubdomain(toSubdomain, pathname) {
    let host = window && window.location ? window.location.host : '';
    let localTestSellix = host.includes('local-test-sellix');
    let isStaging = host.includes('sellix.') || host.includes('mysellix.');
    if (localTestSellix) {
      return redirectForLocalTest(toSubdomain, pathname, host);
    } else if (isStaging) {
      return redirectForStaging(toSubdomain, pathname, host);
    }
  }

  const Status = ({
    text
  }) => /*#__PURE__*/React.createElement("span", {
    className: "text-right sellix-order-details-status"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sk-spinner sk-spinner-pulse"
  }), text);
  const CryptoReceived = ({
    invoice
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const {
      gateway,
      crypto_received,
      cashapp_partial_amount_received
    } = invoice;
    if (gateway === 'PAYPAL' || gateway === 'PERFECT_MONEY' || gateway === 'SKRILL' || gateway === 'STRIPE') {
      return null;
    } else if (gateway === 'CASH_APP') {
      if (cashapp_partial_amount_received) {
        return /*#__PURE__*/React.createElement("div", {
          className: "sellix-order-details-item mb-0"
        }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.received')), /*#__PURE__*/React.createElement("span", null, "$", cashapp_partial_amount_received ? Number(cashapp_partial_amount_received).toFixed(8) : 0));
      } else {
        return null;
      }
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: "sellix-order-details-item mb-0"
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.received')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS[gateway],
        className: "mr-1",
        width: "15",
        height: "15",
        alt: ''
      }), crypto_received ? Number(crypto_received).toFixed(8) : 0));
    }
  };
  var OrderDetail = (({
    invoice,
    manualSuccess
  }) => {
    const {
      i18n
    } = useI18nContext();
    const pathname = window.location.pathname;
    if (invoice.status === 'VOIDED') {
      return null;
    }
    const {
      status,
      developer_return_url,
      crypto_confirmations_needed,
      crypto_transactions
    } = invoice;
    const isKindOfSuccess = invoice.status === STATUSES.COMPLETED || invoice.status === STATUSES.VOIDED || invoice.status === STATUSES.REVERSED || invoice.status === STATUSES.REFUNDED || manualSuccess;
    let text = '';
    if (isKindOfSuccess) {
      if (pathname.indexOf('/payments') > -1) {
        if (developer_return_url) {
          window.location = developer_return_url;
        }
      }
    } else {
      switch (status) {
        case STATUSES.PENDING:
          text = i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.pending');
          break;
        case STATUSES.WAITING_FOR_CONFIRMATIONS:
          text = `${i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.confirmation')} (${((crypto_transactions || []).slice(-1)[0] || {}).confirmations}/${crypto_confirmations_needed || 0})`;
          break;
        case STATUSES.PARTIAL:
          text = i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.partial');
          break;
        case STATUSES.WAITING_SHOP_ACTION:
          text = i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.waiting');
          break;
        case STATUSES.PROCESSING:
          text = i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.statuses.processing');
          break;
        default:
          text = '';
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details unselectable"
    }, !text ? null : /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details-item"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.status')), /*#__PURE__*/React.createElement(Status, {
      text: text
    })), /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details-item"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.shop')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
      href: "/",
      target: "_blank",
      className: "color-white"
    }, invoice.name))), /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details-item"
    }, /*#__PURE__*/React.createElement("span", null, invoice.type === 'SUBSCRIPTION' ? i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.months') : i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.quantity')), /*#__PURE__*/React.createElement("span", null, invoice.quantity)), invoice.type === 'SUBSCRIPTION' ? null : /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details-item"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.email')), /*#__PURE__*/React.createElement("span", null, invoice.customer_email)), /*#__PURE__*/React.createElement("div", {
      className: "sellix-order-details-item"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.orderDetails.titles.created')), /*#__PURE__*/React.createElement("span", null, moment(invoice.created_at * 1000).format('hh:mm:ss DD/MM/YYYY'))), /*#__PURE__*/React.createElement(CryptoReceived, {
      invoice: invoice
    }));
  });

  const Addon = ({
    addons,
    currency,
    isEmbed
  }) => {
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    return /*#__PURE__*/React.createElement("div", {
      className: isEmbed ? 'mb-2' : ''
    }, addons.map(({
      title,
      price_conversions,
      id
    }) => /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row",
      key: id
    }, /*#__PURE__*/React.createElement("span", {
      className: "pl-3",
      style: {
        fontWeight: 300,
        lineHeight: '1.5rem'
      }
    }, title), isEmbed ? /*#__PURE__*/React.createElement("span", null, config.CURRENCY_LIST[currency], price_conversions[currency]) : /*#__PURE__*/React.createElement("div", null, config.CURRENCY_LIST[currency], price_conversions[currency]))));
  };
  var Addons = (({
    isEmbed,
    product_id,
    currency,
    products,
    addons
  }) => {
    const {
      i18n
    } = useI18nContext();
    addons = addons || {};
    let isCart = Object.keys(addons).length > 1;
    if (!Object.keys(addons).length) {
      return null;
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.addonsTitle')), /*#__PURE__*/React.createElement("div", null)), products && products.length && isCart ? products.map(({
      uniqid
    }) => addons[uniqid] ? /*#__PURE__*/React.createElement(Addon, {
      currency: currency,
      addons: addons[uniqid]
    }) : null) : addons[product_id] ? /*#__PURE__*/React.createElement(Addon, {
      isEmbed: isEmbed,
      currency: currency,
      addons: addons[product_id]
    }) : null);
  });

  const PerfectMoney = ({
    perfectmoney_id,
    name,
    uniqid,
    total_display,
    currency
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    return /*#__PURE__*/React.createElement("div", {
      className: "perfectmoney"
    }, /*#__PURE__*/React.createElement("form", {
      id: "pm-form",
      className: "w-100",
      action: "https://perfectmoney.is/api/step1.asp",
      target: "_blank",
      method: "POST"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYEE_ACCOUNT",
      value: perfectmoney_id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYEE_NAME",
      value: name
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYMENT_ID",
      value: uniqid
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYMENT_AMOUNT",
      value: total_display
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYMENT_UNITS",
      value: currency
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "STATUS_URL",
      value: "https://api.sellix.io/v1/invoices/perfectmoney"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYMENT_URL",
      value: `https://sellix.io/invoice/${uniqid}`
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "PAYMENT_URL_METHOD",
      value: "LINK"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "NOPAYMENT_URL",
      value: `https://sellix.io/invoice/${uniqid}`
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "NOPAYMENT_URL_METHOD",
      value: "LINK"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "SUGGESTED_MEMO",
      value: ""
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "INTERFACE_LANGUAGE",
      value: "en_US"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "BAGGAGE_FIELDS",
      value: "IDENT"
    }), /*#__PURE__*/React.createElement(CustomButton, {
      type: "submit",
      name: "PAYMENT_METHOD",
      value: i18n.t('shop.invoice.invoiceDetails.modes.default.payments.perfectMoney.payButton.value'),
      className: "perfectmoney-button",
      id: "pm-button"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.PERFECT_MONEY,
      alt: ""
    }), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.perfectMoney.payButton.title'))));
  };

  const PayPalIcon = () => /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      width: 70,
      marginTop: ".75rem"
    },
    width: "101px",
    height: "32",
    viewBox: "0 0 101 32",
    preserveAspectRatio: "xMinYMin meet"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#003087",
    d: "M 12.237 2.8 L 4.437 2.8 C 3.937 2.8 3.437 3.2 3.337 3.7 L 0.237 23.7 C 0.137 24.1 0.437 24.4 0.837 24.4 L 4.537 24.4 C 5.037 24.4 5.537 24 5.637 23.5 L 6.437 18.1 C 6.537 17.6 6.937 17.2 7.537 17.2 L 10.037 17.2 C 15.137 17.2 18.137 14.7 18.937 9.8 C 19.237 7.7 18.937 6 17.937 4.8 C 16.837 3.5 14.837 2.8 12.237 2.8 Z M 13.137 10.1 C 12.737 12.9 10.537 12.9 8.537 12.9 L 7.337 12.9 L 8.137 7.7 C 8.137 7.4 8.437 7.2 8.737 7.2 L 9.237 7.2 C 10.637 7.2 11.937 7.2 12.637 8 C 13.137 8.4 13.337 9.1 13.137 10.1 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#003087",
    d: "M 35.437 10 L 31.737 10 C 31.437 10 31.137 10.2 31.137 10.5 L 30.937 11.5 L 30.637 11.1 C 29.837 9.9 28.037 9.5 26.237 9.5 C 22.137 9.5 18.637 12.6 17.937 17 C 17.537 19.2 18.037 21.3 19.337 22.7 C 20.437 24 22.137 24.6 24.037 24.6 C 27.337 24.6 29.237 22.5 29.237 22.5 L 29.037 23.5 C 28.937 23.9 29.237 24.3 29.637 24.3 L 33.037 24.3 C 33.537 24.3 34.037 23.9 34.137 23.4 L 36.137 10.6 C 36.237 10.4 35.837 10 35.437 10 Z M 30.337 17.2 C 29.937 19.3 28.337 20.8 26.137 20.8 C 25.037 20.8 24.237 20.5 23.637 19.8 C 23.037 19.1 22.837 18.2 23.037 17.2 C 23.337 15.1 25.137 13.6 27.237 13.6 C 28.337 13.6 29.137 14 29.737 14.6 C 30.237 15.3 30.437 16.2 30.337 17.2 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#003087",
    d: "M 55.337 10 L 51.637 10 C 51.237 10 50.937 10.2 50.737 10.5 L 45.537 18.1 L 43.337 10.8 C 43.237 10.3 42.737 10 42.337 10 L 38.637 10 C 38.237 10 37.837 10.4 38.037 10.9 L 42.137 23 L 38.237 28.4 C 37.937 28.8 38.237 29.4 38.737 29.4 L 42.437 29.4 C 42.837 29.4 43.137 29.2 43.337 28.9 L 55.837 10.9 C 56.137 10.6 55.837 10 55.337 10 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#009cde",
    d: "M 67.737 2.8 L 59.937 2.8 C 59.437 2.8 58.937 3.2 58.837 3.7 L 55.737 23.6 C 55.637 24 55.937 24.3 56.337 24.3 L 60.337 24.3 C 60.737 24.3 61.037 24 61.037 23.7 L 61.937 18 C 62.037 17.5 62.437 17.1 63.037 17.1 L 65.537 17.1 C 70.637 17.1 73.637 14.6 74.437 9.7 C 74.737 7.6 74.437 5.9 73.437 4.7 C 72.237 3.5 70.337 2.8 67.737 2.8 Z M 68.637 10.1 C 68.237 12.9 66.037 12.9 64.037 12.9 L 62.837 12.9 L 63.637 7.7 C 63.637 7.4 63.937 7.2 64.237 7.2 L 64.737 7.2 C 66.137 7.2 67.437 7.2 68.137 8 C 68.637 8.4 68.737 9.1 68.637 10.1 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#009cde",
    d: "M 90.937 10 L 87.237 10 C 86.937 10 86.637 10.2 86.637 10.5 L 86.437 11.5 L 86.137 11.1 C 85.337 9.9 83.537 9.5 81.737 9.5 C 77.637 9.5 74.137 12.6 73.437 17 C 73.037 19.2 73.537 21.3 74.837 22.7 C 75.937 24 77.637 24.6 79.537 24.6 C 82.837 24.6 84.737 22.5 84.737 22.5 L 84.537 23.5 C 84.437 23.9 84.737 24.3 85.137 24.3 L 88.537 24.3 C 89.037 24.3 89.537 23.9 89.637 23.4 L 91.637 10.6 C 91.637 10.4 91.337 10 90.937 10 Z M 85.737 17.2 C 85.337 19.3 83.737 20.8 81.537 20.8 C 80.437 20.8 79.637 20.5 79.037 19.8 C 78.437 19.1 78.237 18.2 78.437 17.2 C 78.737 15.1 80.537 13.6 82.637 13.6 C 83.737 13.6 84.537 14 85.137 14.6 C 85.737 15.3 85.937 16.2 85.737 17.2 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#009cde",
    d: "M 95.337 3.3 L 92.137 23.6 C 92.037 24 92.337 24.3 92.737 24.3 L 95.937 24.3 C 96.437 24.3 96.937 23.9 97.037 23.4 L 100.237 3.5 C 100.337 3.1 100.037 2.8 99.637 2.8 L 96.037 2.8 C 95.637 2.8 95.437 3 95.337 3.3 Z"
  }));
  const PayPal = ({
    gateway,
    paypal_order_id,
    type,
    paypal_subscription_id,
    paypal_apm,
    paypal_subscription_link,
    total,
    currency,
    name
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config,
      theme
    } = React.useContext(InvoiceDetailsContext);
    const isSubscription = type === 'PRODUCT_SUBSCRIPTION';
    const wait = React.useRef(null);
    const ref = React.useRef(null);
    const [warning, setWarning] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isPayPalLoaded, setIsPayPalLoaded] = React.useState(1);
    React.useEffect(() => {
      let interval = null;
      if (!window.paypal) {
        interval = setInterval(() => {
          setIsPayPalLoaded(Math.random());
          setIsPayPalLoaded(false);
        }, 1000);
      } else {
        setIsPayPalLoaded(false);
        clearInterval(interval);
      }
      return () => {
        clearInterval(interval);
      };
    }, [window && window.paypal, isPayPalLoaded]);
    React.useEffect(() => {
      if (window.paypal) {
        let element = document.getElementById('paypal-button-container');
        if (element) {
          element.innerHTML = '';
        }
        let options = {
          fundingSource: paypal_apm,
          onError: e => console.error(e),
          clientId: config.PAYPAL_CLIENT_ID,
          enableFunding: paypal_apm,
          amount: total,
          currency: currency,
          intent: 'capture',
          commit: true,
          onClick: () => setTimeout(() => wait.current.classList.add('d-flex'), 30000),
          style: {
            layout: 'horizontal',
            shape: 'rect',
            label: 'paypal',
            tagline: 'false',
            color: theme.isDark ? 'black' : 'white'
          }
        };
        let button = window.paypal.Buttons(isSubscription ? {
          ...options,
          vault: true,
          createSubscription: () => paypal_subscription_id
        } : {
          ...options,
          createOrder: () => paypal_order_id,
          vault: false
        });
        button.render('#paypal-button-container');
      }
    }, [window && window.paypal, paypal_apm, gateway, theme]);
    React.useEffect(() => {
      if (ref.current && ref.current.innerHTML) {
        setIsLoaded(true);
      }
    }, [ref.current && ref.current.innerHTML]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: `invoice-waiting-alert  w-100 ${theme.isDark ? 'dark' : 'light'}`,
      ref: wait
    }, /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Index, null), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.title')), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, paypal_apm ? i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.messageAPM') : i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.message'), ' ', !warning && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--buttonColor)',
        textDecoration: 'underline',
        cursor: 'pointer'
      },
      onClick: () => setWarning(true)
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.somethingWrong.title')), "?")), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: warning
    }, /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.somethingWrong.message.0'), ' ', /*#__PURE__*/React.createElement("a", {
      href: `https://${name}.sellix.io/contact`,
      target: "_blank"
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.somethingWrong.message.1')), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.alreadyPaid.somethingWrong.message.2'))))), paypal_subscription_link ? /*#__PURE__*/React.createElement("a", {
      href: paypal_subscription_link,
      target: "_blank",
      className: "sellix-subscription-paypal"
    }, /*#__PURE__*/React.createElement(CustomButton, {
      className: "w-100 mb-1",
      style: {
        backgroundColor: "white"
      }
    }, /*#__PURE__*/React.createElement(PayPalIcon, null))) : /*#__PURE__*/React.createElement("div", {
      className: `paypal-btn ${theme.isDark ? 'dark' : 'light'}`
    }, /*#__PURE__*/React.createElement("div", {
      id: "paypal-button-container",
      style: {
        height: isLoaded ? 45 : 0
      },
      ref: ref
    }), isLoaded ? null : /*#__PURE__*/React.createElement("div", {
      className: "d-flex w-100 align-items-center justify-content-center",
      style: {
        height: 45
      }
    }, /*#__PURE__*/React.createElement(Index, null))), /*#__PURE__*/React.createElement("span", {
      className: "sellix-note mt-1 d-flex justify-content-center"
    }, isLoaded || !isPayPalLoaded ? i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.notes.isLoaded') : i18n.t('shop.invoice.invoiceDetails.modes.default.payments.paypal.notes.loading'))));
  };

  var SkrillLinkIcon = 'data:image/svg+xml;base64,dmFyIGltZyA9ICJkYXRhOmltYWdlL3N2Zyt4bWwsJTNjJTNmeG1sIHZlcnNpb249JzEuMCcgJTNmJTNlJTNjc3ZnIHhtbG5zOnNrZXRjaD0naHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgaGVpZ2h0PScxMDBweCcgdmVyc2lvbj0nMS4xJyB2aWV3Qm94PScwIDAgMTYwIDEwMCcgd2lkdGg9JzE2MHB4JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnJTNlICUzY3RpdGxlLyUzZSAlM2NkZWZzLyUzZSAlM2NnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnJTNlICUzY2cgaWQ9J3NrcmlsbCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTEuMDAwMDAwJTJjIDAuMDAwMDAwKSclM2UgJTNjcGF0aCBkPSdNMTQ5JTJjMS4wMTE0NjY4N2UtMDYgQzE0MSUyYzEuNzY2NDQ1ODhlLTA2IDU2LjMwMDc4MTIlMmMtMS42MDMxODM3M2UtMDYgOSUyYzEuMDExNDY2ODdlLTA2IEM1JTJjMS4yMzI1NzUzMmUtMDYgMSUyYzQuMDAwMDAxMDEgMSUyYzguMDAwMDAxMDEgTDElMmM4OC4wMDAwMDEgQzAuOTk5OTk5NTM3JTJjOTYuMDAwMDAxIDUlMmMxMDAuMDAwMDAxIDEzJTJjMTAwLjAwMDAwMSBDNTcuNjIzMjA5NiUyYzEwMC4wMDAwMDEgMTQxJTJjMTAwLjAwMDAwMiAxNDklMmMxMDAuMDAwMDAxIEMxNTclMmMxMDAuMDAwMDAxIDE2MSUyYzk2LjAwMDAwMSAxNjElMmM4OC4wMDAwMDEgTDE2MSUyYzEyLjAwMDAwMSBDMTYxJTJjNC4wMDAwMDEwMSAxNTclMmMxLjAxMTQ2Njg3ZS0wNiAxNDklMmMxLjAxMTQ2Njg3ZS0wNiBaIE0xNDklMmMxLjAxMTQ2Njg3ZS0wNicgZmlsbD0nJTIzNkEzNDk0JyBpZD0nUmVjdGFuZ2xlLTEnLyUzZSAlM2NwYXRoIGQ9J00xMTAuNjYzMDQxJTJjNjEuNDI4ODg4NyBDMTEzLjY0MDI1OSUyYzYxLjQyODg4ODcgMTE2LjA1MzQyMSUyYzYzLjc5NDg3NzEgMTE2LjA1MzQyMSUyYzY2LjcxMzAyNDIgQzExNi4wNTM0MjElMmM2OS42MzE3MzkzIDExMy42NDAyNTklMmM3MiAxMTAuNjYzMDQxJTJjNzIgQzEwNy42ODkyOTglMmM3MiAxMDUuMjc3Mjk0JTJjNjkuNjMxNzM5MyAxMDUuMjc3Mjk0JTJjNjYuNzEzMDI0MiBDMTA1LjI3NzI5NCUyYzYzLjc5NDg3NzEgMTA3LjY4OTI5OCUyYzYxLjQyODg4ODcgMTEwLjY2MzA0MSUyYzYxLjQyODg4ODcgQzExMC42NjMwNDElMmM2MS40Mjg4ODg3IDEwNy42ODkyOTglMmM2MS40Mjg4ODg3IDExMC42NjMwNDElMmM2MS40Mjg4ODg3IEwxMTAuNjYzMDQxJTJjNjEuNDI4ODg4NyBMMTEwLjY2MzA0MSUyYzYxLjQyODg4ODcgWiBNNjkuMzc5MjYyNiUyYzU4LjU3NjA2OSBDNjkuMTM2NjE0NCUyYzU3Ljk3NjE5MjkgNjcuMzg1OTU3JTJjNTMuMTI1NDkwNiA2My4xNTIwNjQ4JTJjNDguMDk4MTIwMiBMNjMuMTUyMDY0OCUyYzY5LjU5NDgxNTEgTDUxLjg3MDk1MTUlMmM2Ny40MDcxOTg5IEw1MS44NzA5NTE1JTJjMjguNDQzNjU4MyBMNjMuMTUyMDY0OCUyYzI4LjQ0MzY1ODMgTDYzLjE1MjA2NDglMmM0MC40ODc3NjA4IEM2Ni40MTk0MTgxJTJjMzUuNjgwNzk5NCA2OC4wMzI4MjU4JTJjMjguNDQzNjU4MyA2OC4wMzI4MjU4JTJjMjguNDQzNjU4MyBMODEuNTQ1MjYlMmMyOC40NDM2NTgzIEM4MC4yMDg2NjgxJTJjMzMuODkzNjY4NyA3NC4zNjE5NDczJTJjNDMuOTQ0NDMzIDc0LjM2MTk0NzMlMmM0My45NDQ0MzMgQzc5LjYwOTI4NjUlMmM1MC40NzAzNTc0IDgxLjkxNDE1NDclMmM1Ny40MjM0NjYyIDgyLjI4MDczMyUyYzU4LjU3NjA2OSBMNjkuMzc5MjYyNiUyYzU4LjU3NjA2OSBMNjkuMzc5MjYyNiUyYzU4LjU3NjA2OSBMNjkuMzc5MjYyNiUyYzU4LjU3NjA2OSBMNjkuMzc5MjYyNiUyYzU4LjU3NjA2OSBaIE05OS4wMzczNTU5JTJjNTguOTgyMjM1MSBDODguOTMyOTk5MyUyYzU4LjY2NDExOSA4My44MDM3OTkxJTJjNTQuMjE3MzEwNSA4My44MDM3OTkxJTJjNDUuMzc3NjU5NiBMODMuODAzNzk5MSUyYzI4LjQ0MzY1ODMgTDk0LjgyNzIwNzMlMmMyOC40NDM2NTgzIEw5NC44MjcyMDczJTJjNDIuMjUyNzM3IEM5NC44MjcyMDczJTJjNDcuNTQ2NTI5NiA5NS41MzM3MjQ3JTJjNDkuODE1Mzc5MSAxMDEuOTM2OTczJTJjNTAuMDMxMjQzNSBMMTAxLjkzNjk3MyUyYzU4LjgyNzE1MzUgQzEwMC44NTkyNDQlMmM1OS4wNTE1Mzg5IDk5LjAzNzM1NTklMmM1OC45ODIyMzUxIDk5LjAzNzM1NTklMmM1OC45ODIyMzUxIEw5OS4wMzczNTU5JTJjNTguOTgyMjM1MSBMOTkuMDM3MzU1OSUyYzU4Ljk4MjIzNTEgTDk5LjAzNzM1NTklMmM1OC45ODIyMzUxIFogTTMyLjk1MTM0MyUyYzU0LjI4NTQ3ODIgQzMxLjU2OTU4MDMlMmM1NC4zNzQ2NjQzIDI4LjM3MDU2MjMlMmM1NC41NzY4OTUzIDI4LjM3MDU2MjMlMmM1Ny40MDE4Nzk4IEMyOC4zNzA1NjIzJTJjNjAuODEwODM0NSAzMi45NzYyNDQ4JTJjNjAuODEwODM0NSAzNC43MDM3Mzc3JTJjNjAuODEwODM0NSBDMzcuNzQxMTgzMiUyYzYwLjgxMDgzNDUgNDEuNjc1MDk1MSUyYzU5LjkzMDkwMjcgNDQuNDg0MzcwMyUyYzU5LjEwNjY0MTIgQzQ0LjQ4NDM3MDMlMmM1OS4xMDY2NDEyIDQ2LjA1MTQ0OSUyYzU4LjU2NDcwNzcgNDcuMzg0NTY2MiUyYzU4LjAwOTE0MDcgTDQ3LjUwOTA3NTQlMmM1Ny45NzYxOTI5IEw0Ny41MDkwNzU0JTJjNjcuMzEyMzMyMiBMNDcuMzM4ODE2MyUyYzY3LjM2MTc1MzggQzQ0LjAyMzM5NjclMmM2OC40OTk1ODY5IDQwLjE2ODI0NDElMmM2OS41OTQ4MTUxIDMzLjAyMDgzNjUlMmM2OS41OTQ4MTUxIEMyMC42OTczMjA0JTJjNjkuNTk0ODE1MSAxNi4zMzA4MTE1JTJjNjIuNTUyNTIwMSAxNi4zMzA4MTE1JTJjNTYuNTE5MTA3NiBDMTYuMzMwODExNSUyYzUzLjA0MTQxNzEgMTcuODQ5ODIzOCUyYzQ0Ljg1Njc0NDUgMzEuOTYzOTU2JTJjNDMuOTEyNjIxNCBDMzMuMTYwNDAyNiUyYzQzLjg0MDQ3NzIgMzYuMzM1MDk3OSUyYzQzLjY2MTUzNjkgMzYuMzM1MDk3OSUyYzQwLjc0MTY4NTYgQzM2LjMzNTA5NzklMmMzOC4zMzEzODgxIDMzLjczNjA0MDUlMmMzNi45MTAwOTA5IDI5LjM2Mzc0MDQlMmMzNi45MTAwOTA5IEMyNC41NzIxNjI4JTJjMzYuOTEwMDkwOSAxOS45MjQyMDUxJTJjMzguMTA4NzA2OSAxNy4xMDEwMzEyJTJjMzkuMjQ1NDAzOCBMMTcuMTAxMDMxMiUyYzI5LjYyOTc3NjkgQzIxLjMyNzM5NDklMmMyOC41NDMwNjk2IDI2LjA5MTc1NDMlMmMyOCAzMS42NzU1NTc5JTJjMjggQzQzLjcyNTE1MzclMmMyOCA0OS4xMjE5MDQlMmMzNC42NjMzOTYgNDkuMTIxOTA0JTJjNDEuMjY3MTQ1MiBDNDkuMTIxOTA0JTJjNDguNzU0ODAyNyA0My4wODI5MTc4JTJjNTMuNjE5MTM4NiAzMi45NTEzNDMlMmM1NC4yODU0NzgyIEMzMi45NTEzNDMlMmM1NC4yODU0NzgyIDQzLjA4MjkxNzglMmM1My42MTkxMzg2IDMyLjk1MTM0MyUyYzU0LjI4NTQ3ODIgTDMyLjk1MTM0MyUyYzU0LjI4NTQ3ODIgTDMyLjk1MTM0MyUyYzU0LjI4NTQ3ODIgWiBNMTA1LjE5ODUzNSUyYzI4LjQ0MzY1ODMgTDExNi4xMzI3NiUyYzI4LjQ0MzY1ODMgTDExNi4xMzI3NiUyYzU4LjU0MTk4NTEgTDEwNS4xOTg1MzUlMmM1OC41NDE5ODUxIEwxMDUuMTk4NTM1JTJjMjguNDQzNjU4MyBMMTA1LjE5ODUzNSUyYzI4LjQ0MzY1ODMgTDEwNS4xOTg1MzUlMmMyOC40NDM2NTgzIEwxMDUuMTk4NTM1JTJjMjguNDQzNjU4MyBaIE0xMzYuNzIxMzcxJTJjNjcuNjc1ODkzNCBMMTM2LjcyMTM3MSUyYzI4LjQ0MzY1ODMgTDE0Ny42NTczMzMlMmMyOC40NDM2NTgzIEwxNDcuNjU3MzMzJTJjNjkuNTk0ODE1MSBMMTM2LjcyMTM3MSUyYzY3LjY3NTg5MzQgTDEzNi43MjEzNzElMmM2Ny42NzU4OTM0IEwxMzYuNzIxMzcxJTJjNjcuNjc1ODkzNCBMMTM2LjcyMTM3MSUyYzY3LjY3NTg5MzQgWiBNMTIwLjc2NDUwMiUyYzY3LjY3NTg5MzQgTDEzMS42OTAwNCUyYzY5LjU5NDgxNTEgTDEzMS42OTAwNCUyYzI4LjQ0MzY1ODMgTDEyMC43NjQ1MDIlMmMyOC40NDM2NTgzIEwxMjAuNzY0NTAyJTJjNjcuNjc1ODkzNCBMMTIwLjc2NDUwMiUyYzY3LjY3NTg5MzQgWiBNMTIwLjc2NDUwMiUyYzY3LjY3NTg5MzQnIGZpbGw9J3doaXRlJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSg4MS45OTQwNzIlMmMgNTAuMDAwMDAwKSBzY2FsZSgxJTJjIC0xKSB0cmFuc2xhdGUoLTgxLjk5NDA3MiUyYyAtNTAuMDAwMDAwKSAnLyUzZSAlM2MvZyUzZSAlM2MvZyUzZSUzYy9zdmclM2UiOwogIGV4cG9ydCBkZWZhdWx0IGltZzs=';

  const Skrill = ({
    skrill_link
  }) => /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    href: skrill_link,
    className: "skrill-button",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    src: SkrillLinkIcon,
    height: "45",
    alt: ""
  }));

  var pure$1 = {};

  Object.defineProperty(pure$1, '__esModule', { value: true });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var V3_URL = 'https://js.stripe.com/v3';
  var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
  var EXISTING_SCRIPT_MESSAGE = 'loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used';
  var findScript = function findScript() {
    var scripts = document.querySelectorAll("script[src^=\"".concat(V3_URL, "\"]"));

    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];

      if (!V3_URL_REGEX.test(script.src)) {
        continue;
      }

      return script;
    }

    return null;
  };

  var injectScript = function injectScript(params) {
    var queryString = params && !params.advancedFraudSignals ? '?advancedFraudSignals=false' : '';
    var script = document.createElement('script');
    script.src = "".concat(V3_URL).concat(queryString);
    var headOrBody = document.head || document.body;

    if (!headOrBody) {
      throw new Error('Expected document.body not to be null. Stripe.js requires a <body> element.');
    }

    headOrBody.appendChild(script);
    return script;
  };

  var registerWrapper = function registerWrapper(stripe, startTime) {
    if (!stripe || !stripe._registerWrapper) {
      return;
    }

    stripe._registerWrapper({
      name: 'stripe-js',
      version: "1.54.1",
      startTime: startTime
    });
  };

  var stripePromise = null;
  var loadScript = function loadScript(params) {
    // Ensure that we only attempt to load Stripe.js at most once
    if (stripePromise !== null) {
      return stripePromise;
    }

    stripePromise = new Promise(function (resolve, reject) {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        // Resolve to null when imported server side. This makes the module
        // safe to import in an isomorphic code base.
        resolve(null);
        return;
      }

      if (window.Stripe && params) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      }

      if (window.Stripe) {
        resolve(window.Stripe);
        return;
      }

      try {
        var script = findScript();

        if (script && params) {
          console.warn(EXISTING_SCRIPT_MESSAGE);
        } else if (!script) {
          script = injectScript(params);
        }

        script.addEventListener('load', function () {
          if (window.Stripe) {
            resolve(window.Stripe);
          } else {
            reject(new Error('Stripe.js not available'));
          }
        });
        script.addEventListener('error', function () {
          reject(new Error('Failed to load Stripe.js'));
        });
      } catch (error) {
        reject(error);
        return;
      }
    });
    return stripePromise;
  };
  var initStripe = function initStripe(maybeStripe, args, startTime) {
    if (maybeStripe === null) {
      return null;
    }

    var stripe = maybeStripe.apply(undefined, args);
    registerWrapper(stripe, startTime);
    return stripe;
  }; // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

  var validateLoadParams = function validateLoadParams(params) {
    var errorMessage = "invalid load parameters; expected object of shape\n\n    {advancedFraudSignals: boolean}\n\nbut received\n\n    ".concat(JSON.stringify(params), "\n");

    if (params === null || _typeof(params) !== 'object') {
      throw new Error(errorMessage);
    }

    if (Object.keys(params).length === 1 && typeof params.advancedFraudSignals === 'boolean') {
      return params;
    }

    throw new Error(errorMessage);
  };

  var loadParams;
  var loadStripeCalled = false;
  var loadStripe = function loadStripe() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    loadStripeCalled = true;
    var startTime = Date.now();
    return loadScript(loadParams).then(function (maybeStripe) {
      return initStripe(maybeStripe, args, startTime);
    });
  };

  loadStripe.setLoadParameters = function (params) {
    // we won't throw an error if setLoadParameters is called with the same values as before
    if (loadStripeCalled && loadParams) {
      var validatedParams = validateLoadParams(params);
      var parameterKeys = Object.keys(validatedParams);
      var sameParameters = parameterKeys.reduce(function (previousValue, currentValue) {
        var _loadParams;

        return previousValue && params[currentValue] === ((_loadParams = loadParams) === null || _loadParams === void 0 ? void 0 : _loadParams[currentValue]);
      }, true);

      if (sameParameters) {
        return;
      }
    }

    if (loadStripeCalled) {
      throw new Error('You cannot change load parameters after calling loadStripe');
    }

    loadParams = validateLoadParams(params);
  };

  pure$1.loadStripe = loadStripe;

  var pure = pure$1;

  var reactStripe_umd = {exports: {}};

  (function (module, exports) {
  	(function (global, factory) {
  	  factory(exports, React) ;
  	}(commonjsGlobal, (function (exports, React) {
  	  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;

  	  function ownKeys(object, enumerableOnly) {
  	    var keys = Object.keys(object);

  	    if (Object.getOwnPropertySymbols) {
  	      var symbols = Object.getOwnPropertySymbols(object);

  	      if (enumerableOnly) {
  	        symbols = symbols.filter(function (sym) {
  	          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  	        });
  	      }

  	      keys.push.apply(keys, symbols);
  	    }

  	    return keys;
  	  }

  	  function _objectSpread2(target) {
  	    for (var i = 1; i < arguments.length; i++) {
  	      var source = arguments[i] != null ? arguments[i] : {};

  	      if (i % 2) {
  	        ownKeys(Object(source), true).forEach(function (key) {
  	          _defineProperty(target, key, source[key]);
  	        });
  	      } else if (Object.getOwnPropertyDescriptors) {
  	        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  	      } else {
  	        ownKeys(Object(source)).forEach(function (key) {
  	          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
  	        });
  	      }
  	    }

  	    return target;
  	  }

  	  function _typeof(obj) {
  	    "@babel/helpers - typeof";

  	    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
  	      _typeof = function (obj) {
  	        return typeof obj;
  	      };
  	    } else {
  	      _typeof = function (obj) {
  	        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  	      };
  	    }

  	    return _typeof(obj);
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

  	  function _slicedToArray(arr, i) {
  	    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  	  }

  	  function _arrayWithHoles(arr) {
  	    if (Array.isArray(arr)) return arr;
  	  }

  	  function _iterableToArrayLimit(arr, i) {
  	    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  	    if (_i == null) return;
  	    var _arr = [];
  	    var _n = true;
  	    var _d = false;

  	    var _s, _e;

  	    try {
  	      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
  	        _arr.push(_s.value);

  	        if (i && _arr.length === i) break;
  	      }
  	    } catch (err) {
  	      _d = true;
  	      _e = err;
  	    } finally {
  	      try {
  	        if (!_n && _i["return"] != null) _i["return"]();
  	      } finally {
  	        if (_d) throw _e;
  	      }
  	    }

  	    return _arr;
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

  	  function _nonIterableRest() {
  	    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  	  }

  	  function createCommonjsModule(fn, module) {
  	  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  	  }

  	  /**
  	   * Copyright (c) 2013-present, Facebook, Inc.
  	   *
  	   * This source code is licensed under the MIT license found in the
  	   * LICENSE file in the root directory of this source tree.
  	   */

  	  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
  	  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  	  function emptyFunction() {}

  	  function emptyFunctionWithReset() {}

  	  emptyFunctionWithReset.resetWarningCache = emptyFunction;

  	  var factoryWithThrowingShims = function () {
  	    function shim(props, propName, componentName, location, propFullName, secret) {
  	      if (secret === ReactPropTypesSecret_1) {
  	        // It is still safe when called from React.
  	        return;
  	      }

  	      var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
  	      err.name = 'Invariant Violation';
  	      throw err;
  	    }
  	    shim.isRequired = shim;

  	    function getShim() {
  	      return shim;
  	    }
  	    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.

  	    var ReactPropTypes = {
  	      array: shim,
  	      bool: shim,
  	      func: shim,
  	      number: shim,
  	      object: shim,
  	      string: shim,
  	      symbol: shim,
  	      any: shim,
  	      arrayOf: getShim,
  	      element: shim,
  	      elementType: shim,
  	      instanceOf: getShim,
  	      node: shim,
  	      objectOf: getShim,
  	      oneOf: getShim,
  	      oneOfType: getShim,
  	      shape: getShim,
  	      exact: getShim,
  	      checkPropTypes: emptyFunctionWithReset,
  	      resetWarningCache: emptyFunction
  	    };
  	    ReactPropTypes.PropTypes = ReactPropTypes;
  	    return ReactPropTypes;
  	  };

  	  var propTypes = createCommonjsModule(function (module) {
  	  /**
  	   * Copyright (c) 2013-present, Facebook, Inc.
  	   *
  	   * This source code is licensed under the MIT license found in the
  	   * LICENSE file in the root directory of this source tree.
  	   */
  	  {
  	    // By explicitly using `prop-types` you are opting into new production behavior.
  	    // http://fb.me/prop-types-in-prod
  	    module.exports = factoryWithThrowingShims();
  	  }
  	  });

  	  var usePrevious = function usePrevious(value) {
  	    var ref = React.useRef(value);
  	    React.useEffect(function () {
  	      ref.current = value;
  	    }, [value]);
  	    return ref.current;
  	  };

  	  var isUnknownObject = function isUnknownObject(raw) {
  	    return raw !== null && _typeof(raw) === 'object';
  	  };
  	  var isPromise = function isPromise(raw) {
  	    return isUnknownObject(raw) && typeof raw.then === 'function';
  	  }; // We are using types to enforce the `stripe` prop in this lib,
  	  // but in an untyped integration `stripe` could be anything, so we need
  	  // to do some sanity validation to prevent type errors.

  	  var isStripe = function isStripe(raw) {
  	    return isUnknownObject(raw) && typeof raw.elements === 'function' && typeof raw.createToken === 'function' && typeof raw.createPaymentMethod === 'function' && typeof raw.confirmCardPayment === 'function';
  	  };

  	  var PLAIN_OBJECT_STR = '[object Object]';
  	  var isEqual = function isEqual(left, right) {
  	    if (!isUnknownObject(left) || !isUnknownObject(right)) {
  	      return left === right;
  	    }

  	    var leftArray = Array.isArray(left);
  	    var rightArray = Array.isArray(right);
  	    if (leftArray !== rightArray) return false;
  	    var leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  	    var rightPlainObject = Object.prototype.toString.call(right) === PLAIN_OBJECT_STR;
  	    if (leftPlainObject !== rightPlainObject) return false; // not sure what sort of special object this is (regexp is one option), so
  	    // fallback to reference check.

  	    if (!leftPlainObject && !leftArray) return left === right;
  	    var leftKeys = Object.keys(left);
  	    var rightKeys = Object.keys(right);
  	    if (leftKeys.length !== rightKeys.length) return false;
  	    var keySet = {};

  	    for (var i = 0; i < leftKeys.length; i += 1) {
  	      keySet[leftKeys[i]] = true;
  	    }

  	    for (var _i = 0; _i < rightKeys.length; _i += 1) {
  	      keySet[rightKeys[_i]] = true;
  	    }

  	    var allKeys = Object.keys(keySet);

  	    if (allKeys.length !== leftKeys.length) {
  	      return false;
  	    }

  	    var l = left;
  	    var r = right;

  	    var pred = function pred(key) {
  	      return isEqual(l[key], r[key]);
  	    };

  	    return allKeys.every(pred);
  	  };

  	  var extractAllowedOptionsUpdates = function extractAllowedOptionsUpdates(options, prevOptions, immutableKeys) {
  	    if (!isUnknownObject(options)) {
  	      return null;
  	    }

  	    return Object.keys(options).reduce(function (newOptions, key) {
  	      var isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);

  	      if (immutableKeys.includes(key)) {
  	        if (isUpdated) {
  	          console.warn("Unsupported prop change: options.".concat(key, " is not a mutable property."));
  	        }

  	        return newOptions;
  	      }

  	      if (!isUpdated) {
  	        return newOptions;
  	      }

  	      return _objectSpread2(_objectSpread2({}, newOptions || {}), {}, _defineProperty({}, key, options[key]));
  	    }, null);
  	  };

  	  var INVALID_STRIPE_ERROR = 'Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.'; // We are using types to enforce the `stripe` prop in this lib, but in a real
  	  // integration `stripe` could be anything, so we need to do some sanity
  	  // validation to prevent type errors.

  	  var validateStripe = function validateStripe(maybeStripe) {
  	    if (maybeStripe === null || isStripe(maybeStripe)) {
  	      return maybeStripe;
  	    }

  	    throw new Error(INVALID_STRIPE_ERROR);
  	  };

  	  var parseStripeProp = function parseStripeProp(raw) {
  	    if (isPromise(raw)) {
  	      return {
  	        tag: 'async',
  	        stripePromise: Promise.resolve(raw).then(validateStripe)
  	      };
  	    }

  	    var stripe = validateStripe(raw);

  	    if (stripe === null) {
  	      return {
  	        tag: 'empty'
  	      };
  	    }

  	    return {
  	      tag: 'sync',
  	      stripe: stripe
  	    };
  	  };

  	  var ElementsContext = /*#__PURE__*/React.createContext(null);
  	  ElementsContext.displayName = 'ElementsContext';
  	  var parseElementsContext = function parseElementsContext(ctx, useCase) {
  	    if (!ctx) {
  	      throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
  	    }

  	    return ctx;
  	  };
  	  var CartElementContext = /*#__PURE__*/React.createContext(null);
  	  CartElementContext.displayName = 'CartElementContext';
  	  var parseCartElementContext = function parseCartElementContext(ctx, useCase) {
  	    if (!ctx) {
  	      throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
  	    }

  	    return ctx;
  	  };
  	  /**
  	   * The `Elements` provider allows you to use [Element components](https://stripe.com/docs/stripe-js/react#element-components) and access the [Stripe object](https://stripe.com/docs/js/initializing) in any nested component.
  	   * Render an `Elements` provider at the root of your React app so that it is available everywhere you need it.
  	   *
  	   * To use the `Elements` provider, call `loadStripe` from `@stripe/stripe-js` with your publishable key.
  	   * The `loadStripe` function will asynchronously load the Stripe.js script and initialize a `Stripe` object.
  	   * Pass the returned `Promise` to `Elements`.
  	   *
  	   * @docs https://stripe.com/docs/stripe-js/react#elements-provider
  	   */

  	  var Elements = function Elements(_ref) {
  	    var rawStripeProp = _ref.stripe,
  	        options = _ref.options,
  	        children = _ref.children;
  	    var parsed = React.useMemo(function () {
  	      return parseStripeProp(rawStripeProp);
  	    }, [rawStripeProp]);

  	    var _React$useState = React.useState(null),
  	        _React$useState2 = _slicedToArray(_React$useState, 2),
  	        cart = _React$useState2[0],
  	        setCart = _React$useState2[1];

  	    var _React$useState3 = React.useState(null),
  	        _React$useState4 = _slicedToArray(_React$useState3, 2),
  	        cartState = _React$useState4[0],
  	        setCartState = _React$useState4[1]; // For a sync stripe instance, initialize into context


  	    var _React$useState5 = React.useState(function () {
  	      return {
  	        stripe: parsed.tag === 'sync' ? parsed.stripe : null,
  	        elements: parsed.tag === 'sync' ? parsed.stripe.elements(options) : null
  	      };
  	    }),
  	        _React$useState6 = _slicedToArray(_React$useState5, 2),
  	        ctx = _React$useState6[0],
  	        setContext = _React$useState6[1];

  	    React.useEffect(function () {
  	      var isMounted = true;

  	      var safeSetContext = function safeSetContext(stripe) {
  	        setContext(function (ctx) {
  	          // no-op if we already have a stripe instance (https://github.com/stripe/react-stripe-js/issues/296)
  	          if (ctx.stripe) return ctx;
  	          return {
  	            stripe: stripe,
  	            elements: stripe.elements(options)
  	          };
  	        });
  	      }; // For an async stripePromise, store it in context once resolved


  	      if (parsed.tag === 'async' && !ctx.stripe) {
  	        parsed.stripePromise.then(function (stripe) {
  	          if (stripe && isMounted) {
  	            // Only update Elements context if the component is still mounted
  	            // and stripe is not null. We allow stripe to be null to make
  	            // handling SSR easier.
  	            safeSetContext(stripe);
  	          }
  	        });
  	      } else if (parsed.tag === 'sync' && !ctx.stripe) {
  	        // Or, handle a sync stripe instance going from null -> populated
  	        safeSetContext(parsed.stripe);
  	      }

  	      return function () {
  	        isMounted = false;
  	      };
  	    }, [parsed, ctx, options]); // Warn on changes to stripe prop

  	    var prevStripe = usePrevious(rawStripeProp);
  	    React.useEffect(function () {
  	      if (prevStripe !== null && prevStripe !== rawStripeProp) {
  	        console.warn('Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.');
  	      }
  	    }, [prevStripe, rawStripeProp]); // Apply updates to elements when options prop has relevant changes

  	    var prevOptions = usePrevious(options);
  	    React.useEffect(function () {
  	      if (!ctx.elements) {
  	        return;
  	      }

  	      var updates = extractAllowedOptionsUpdates(options, prevOptions, ['clientSecret', 'fonts']);

  	      if (updates) {
  	        ctx.elements.update(updates);
  	      }
  	    }, [options, prevOptions, ctx.elements]); // Attach react-stripe-js version to stripe.js instance

  	    React.useEffect(function () {
  	      var anyStripe = ctx.stripe;

  	      if (!anyStripe || !anyStripe._registerWrapper || !anyStripe.registerAppInfo) {
  	        return;
  	      }

  	      anyStripe._registerWrapper({
  	        name: 'react-stripe-js',
  	        version: "1.16.5"
  	      });

  	      anyStripe.registerAppInfo({
  	        name: 'react-stripe-js',
  	        version: "1.16.5",
  	        url: 'https://stripe.com/docs/stripe-js/react'
  	      });
  	    }, [ctx.stripe]);
  	    return /*#__PURE__*/React.createElement(ElementsContext.Provider, {
  	      value: ctx
  	    }, /*#__PURE__*/React.createElement(CartElementContext.Provider, {
  	      value: {
  	        cart: cart,
  	        setCart: setCart,
  	        cartState: cartState,
  	        setCartState: setCartState
  	      }
  	    }, children));
  	  };
  	  Elements.propTypes = {
  	    stripe: propTypes.any,
  	    options: propTypes.object
  	  };
  	  var useElementsContextWithUseCase = function useElementsContextWithUseCase(useCaseMessage) {
  	    var ctx = React.useContext(ElementsContext);
  	    return parseElementsContext(ctx, useCaseMessage);
  	  };
  	  var useCartElementContextWithUseCase = function useCartElementContextWithUseCase(useCaseMessage) {
  	    var ctx = React.useContext(CartElementContext);
  	    return parseCartElementContext(ctx, useCaseMessage);
  	  };
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#useelements-hook
  	   */

  	  var useElements = function useElements() {
  	    var _useElementsContextWi = useElementsContextWithUseCase('calls useElements()'),
  	        elements = _useElementsContextWi.elements;

  	    return elements;
  	  };
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#usestripe-hook
  	   */

  	  var useStripe = function useStripe() {
  	    var _useElementsContextWi2 = useElementsContextWithUseCase('calls useStripe()'),
  	        stripe = _useElementsContextWi2.stripe;

  	    return stripe;
  	  };
  	  /**
  	   * @docs https://stripe.com/docs/payments/checkout/cart-element
  	   */

  	  var useCartElement = function useCartElement() {
  	    var _useCartElementContex = useCartElementContextWithUseCase('calls useCartElement()'),
  	        cart = _useCartElementContex.cart;

  	    return cart;
  	  };
  	  /**
  	   * @docs https://stripe.com/docs/payments/checkout/cart-element
  	   */

  	  var useCartElementState = function useCartElementState() {
  	    var _useCartElementContex2 = useCartElementContextWithUseCase('calls useCartElementState()'),
  	        cartState = _useCartElementContex2.cartState;

  	    return cartState;
  	  };
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#elements-consumer
  	   */

  	  var ElementsConsumer = function ElementsConsumer(_ref2) {
  	    var children = _ref2.children;
  	    var ctx = useElementsContextWithUseCase('mounts <ElementsConsumer>'); // Assert to satisfy the busted React.FC return type (it should be ReactNode)

  	    return children(ctx);
  	  };
  	  ElementsConsumer.propTypes = {
  	    children: propTypes.func.isRequired
  	  };

  	  var useAttachEvent = function useAttachEvent(element, event, cb) {
  	    var cbDefined = !!cb;
  	    var cbRef = React.useRef(cb); // In many integrations the callback prop changes on each render.
  	    // Using a ref saves us from calling element.on/.off every render.

  	    React.useEffect(function () {
  	      cbRef.current = cb;
  	    }, [cb]);
  	    React.useEffect(function () {
  	      if (!cbDefined || !element) {
  	        return function () {};
  	      }

  	      var decoratedCb = function decoratedCb() {
  	        if (cbRef.current) {
  	          cbRef.current.apply(cbRef, arguments);
  	        }
  	      };

  	      element.on(event, decoratedCb);
  	      return function () {
  	        element.off(event, decoratedCb);
  	      };
  	    }, [cbDefined, event, element, cbRef]);
  	  };

  	  var capitalized = function capitalized(str) {
  	    return str.charAt(0).toUpperCase() + str.slice(1);
  	  };

  	  var createElementComponent = function createElementComponent(type, isServer) {
  	    var displayName = "".concat(capitalized(type), "Element");

  	    var ClientElement = function ClientElement(_ref) {
  	      var id = _ref.id,
  	          className = _ref.className,
  	          _ref$options = _ref.options,
  	          options = _ref$options === void 0 ? {} : _ref$options,
  	          onBlur = _ref.onBlur,
  	          onFocus = _ref.onFocus,
  	          onReady = _ref.onReady,
  	          onChange = _ref.onChange,
  	          onEscape = _ref.onEscape,
  	          onClick = _ref.onClick,
  	          onLoadError = _ref.onLoadError,
  	          onLoaderStart = _ref.onLoaderStart,
  	          onNetworksChange = _ref.onNetworksChange,
  	          onCheckout = _ref.onCheckout,
  	          onLineItemClick = _ref.onLineItemClick,
  	          onConfirm = _ref.onConfirm,
  	          onCancel = _ref.onCancel,
  	          onShippingAddressChange = _ref.onShippingAddressChange,
  	          onShippingRateChange = _ref.onShippingRateChange;

  	      var _useElementsContextWi = useElementsContextWithUseCase("mounts <".concat(displayName, ">")),
  	          elements = _useElementsContextWi.elements;

  	      var _React$useState = React.useState(null),
  	          _React$useState2 = _slicedToArray(_React$useState, 2),
  	          element = _React$useState2[0],
  	          setElement = _React$useState2[1];

  	      var elementRef = React.useRef(null);
  	      var domNode = React.useRef(null);

  	      var _useCartElementContex = useCartElementContextWithUseCase("mounts <".concat(displayName, ">")),
  	          setCart = _useCartElementContex.setCart,
  	          setCartState = _useCartElementContex.setCartState; // For every event where the merchant provides a callback, call element.on
  	      // with that callback. If the merchant ever changes the callback, removes
  	      // the old callback with element.off and then call element.on with the new one.


  	      useAttachEvent(element, 'blur', onBlur);
  	      useAttachEvent(element, 'focus', onFocus);
  	      useAttachEvent(element, 'escape', onEscape);
  	      useAttachEvent(element, 'click', onClick);
  	      useAttachEvent(element, 'loaderror', onLoadError);
  	      useAttachEvent(element, 'loaderstart', onLoaderStart);
  	      useAttachEvent(element, 'networkschange', onNetworksChange);
  	      useAttachEvent(element, 'lineitemclick', onLineItemClick);
  	      useAttachEvent(element, 'confirm', onConfirm);
  	      useAttachEvent(element, 'cancel', onCancel);
  	      useAttachEvent(element, 'shippingaddresschange', onShippingAddressChange);
  	      useAttachEvent(element, 'shippingratechange', onShippingRateChange);
  	      var readyCallback;

  	      if (type === 'cart') {
  	        readyCallback = function readyCallback(event) {
  	          setCartState(event);
  	          onReady && onReady(event);
  	        };
  	      } else if (onReady) {
  	        if (type === 'payButton') {
  	          // Passes through the event, which includes visible PM types
  	          readyCallback = onReady;
  	        } else {
  	          // For other Elements, pass through the Element itself.
  	          readyCallback = function readyCallback() {
  	            onReady(element);
  	          };
  	        }
  	      }

  	      useAttachEvent(element, 'ready', readyCallback);
  	      var changeCallback = type === 'cart' ? function (event) {
  	        setCartState(event);
  	        onChange && onChange(event);
  	      } : onChange;
  	      useAttachEvent(element, 'change', changeCallback);
  	      var checkoutCallback = type === 'cart' ? function (event) {
  	        setCartState(event);
  	        onCheckout && onCheckout(event);
  	      } : onCheckout;
  	      useAttachEvent(element, 'checkout', checkoutCallback);
  	      React.useLayoutEffect(function () {
  	        if (elementRef.current === null && elements && domNode.current !== null) {
  	          var newElement = elements.create(type, options);

  	          if (type === 'cart' && setCart) {
  	            // we know that elements.create return value must be of type StripeCartElement if type is 'cart',
  	            // we need to cast because typescript is not able to infer which overloaded method is used based off param type
  	            setCart(newElement);
  	          } // Store element in a ref to ensure it's _immediately_ available in cleanup hooks in StrictMode


  	          elementRef.current = newElement; // Store element in state to facilitate event listener attachment

  	          setElement(newElement);
  	          newElement.mount(domNode.current);
  	        }
  	      }, [elements, options, setCart]);
  	      var prevOptions = usePrevious(options);
  	      React.useEffect(function () {
  	        if (!elementRef.current) {
  	          return;
  	        }

  	        var updates = extractAllowedOptionsUpdates(options, prevOptions, ['paymentRequest']);

  	        if (updates) {
  	          elementRef.current.update(updates);
  	        }
  	      }, [options, prevOptions]);
  	      React.useLayoutEffect(function () {
  	        return function () {
  	          if (elementRef.current) {
  	            elementRef.current.destroy();
  	            elementRef.current = null;
  	          }
  	        };
  	      }, []);
  	      return /*#__PURE__*/React.createElement("div", {
  	        id: id,
  	        className: className,
  	        ref: domNode
  	      });
  	    }; // Only render the Element wrapper in a server environment.


  	    var ServerElement = function ServerElement(props) {
  	      // Validate that we are in the right context by calling useElementsContextWithUseCase.
  	      useElementsContextWithUseCase("mounts <".concat(displayName, ">"));
  	      useCartElementContextWithUseCase("mounts <".concat(displayName, ">"));
  	      var id = props.id,
  	          className = props.className;
  	      return /*#__PURE__*/React.createElement("div", {
  	        id: id,
  	        className: className
  	      });
  	    };

  	    var Element = isServer ? ServerElement : ClientElement;
  	    Element.propTypes = {
  	      id: propTypes.string,
  	      className: propTypes.string,
  	      onChange: propTypes.func,
  	      onBlur: propTypes.func,
  	      onFocus: propTypes.func,
  	      onReady: propTypes.func,
  	      onEscape: propTypes.func,
  	      onClick: propTypes.func,
  	      onLoadError: propTypes.func,
  	      onLoaderStart: propTypes.func,
  	      onNetworksChange: propTypes.func,
  	      onCheckout: propTypes.func,
  	      onLineItemClick: propTypes.func,
  	      onConfirm: propTypes.func,
  	      onCancel: propTypes.func,
  	      onShippingAddressChange: propTypes.func,
  	      onShippingRateChange: propTypes.func,
  	      options: propTypes.object
  	    };
  	    Element.displayName = displayName;
  	    Element.__elementType = type;
  	    return Element;
  	  };

  	  var isServer = typeof window === 'undefined';
  	  /**
  	   * Requires beta access:
  	   * Contact [Stripe support](https://support.stripe.com/) for more information.
  	   *
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var AuBankAccountElement = createElementComponent('auBankAccount', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var CardElement = createElementComponent('card', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var CardNumberElement = createElementComponent('cardNumber', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var CardExpiryElement = createElementComponent('cardExpiry', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var CardCvcElement = createElementComponent('cardCvc', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var FpxBankElement = createElementComponent('fpxBank', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var IbanElement = createElementComponent('iban', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var IdealBankElement = createElementComponent('idealBank', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var P24BankElement = createElementComponent('p24Bank', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var EpsBankElement = createElementComponent('epsBank', isServer);
  	  var PaymentElement = createElementComponent('payment', isServer);
  	  /**
  	   * Requires beta access:
  	   * Contact [Stripe support](https://support.stripe.com/) for more information.
  	   *
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var PayButtonElement = createElementComponent('payButton', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var PaymentRequestButtonElement = createElementComponent('paymentRequestButton', isServer);
  	  /**
  	   * Requires beta access:
  	   * Contact [Stripe support](https://support.stripe.com/) for more information.
  	   *
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var LinkAuthenticationElement = createElementComponent('linkAuthentication', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var AddressElement = createElementComponent('address', isServer);
  	  /**
  	   * @deprecated
  	   * Use `AddressElement` instead.
  	   *
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var ShippingAddressElement = createElementComponent('shippingAddress', isServer);
  	  /**
  	   * Requires beta access:
  	   * Contact [Stripe support](https://support.stripe.com/) for more information.
  	   *
  	   * @docs https://stripe.com/docs/elements/cart-element
  	   */

  	  var CartElement = createElementComponent('cart', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var PaymentMethodMessagingElement = createElementComponent('paymentMethodMessaging', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var AffirmMessageElement = createElementComponent('affirmMessage', isServer);
  	  /**
  	   * @docs https://stripe.com/docs/stripe-js/react#element-components
  	   */

  	  var AfterpayClearpayMessageElement = createElementComponent('afterpayClearpayMessage', isServer);

  	  exports.AddressElement = AddressElement;
  	  exports.AffirmMessageElement = AffirmMessageElement;
  	  exports.AfterpayClearpayMessageElement = AfterpayClearpayMessageElement;
  	  exports.AuBankAccountElement = AuBankAccountElement;
  	  exports.CardCvcElement = CardCvcElement;
  	  exports.CardElement = CardElement;
  	  exports.CardExpiryElement = CardExpiryElement;
  	  exports.CardNumberElement = CardNumberElement;
  	  exports.CartElement = CartElement;
  	  exports.Elements = Elements;
  	  exports.ElementsConsumer = ElementsConsumer;
  	  exports.EpsBankElement = EpsBankElement;
  	  exports.FpxBankElement = FpxBankElement;
  	  exports.IbanElement = IbanElement;
  	  exports.IdealBankElement = IdealBankElement;
  	  exports.LinkAuthenticationElement = LinkAuthenticationElement;
  	  exports.P24BankElement = P24BankElement;
  	  exports.PayButtonElement = PayButtonElement;
  	  exports.PaymentElement = PaymentElement;
  	  exports.PaymentMethodMessagingElement = PaymentMethodMessagingElement;
  	  exports.PaymentRequestButtonElement = PaymentRequestButtonElement;
  	  exports.ShippingAddressElement = ShippingAddressElement;
  	  exports.useCartElement = useCartElement;
  	  exports.useCartElementState = useCartElementState;
  	  exports.useElements = useElements;
  	  exports.useStripe = useStripe;

  	  Object.defineProperty(exports, '__esModule', { value: true });

  	}))); 
  } (reactStripe_umd, reactStripe_umd.exports));

  var reactStripe_umdExports = reactStripe_umd.exports;

  const Alert = ({
    name,
    wait
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      theme
    } = React.useContext(InvoiceDetailsContext);
    const [warning, setWarning] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: `invoice-waiting-alert  w-100 ${theme.isDark ? 'dark' : 'light'}`,
      ref: wait
    }, /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(Index, null), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.title')), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.message'), ' ', !warning && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--buttonColor)',
        textDecoration: 'underline',
        cursor: 'pointer'
      },
      onClick: () => setWarning(true)
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.somethingWrong.title')), "?")), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: warning
    }, /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.somethingWrong.message.0'), ' ', /*#__PURE__*/React.createElement("a", {
      href: `https://${name}.sellix.io/contact`,
      target: "_blank"
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.somethingWrong.message.1')), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.alreadyPaid.somethingWrong.message.2')))));
  };

  const BrowserNotice = () => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const [warning, showWarning] = React.useState(false);
    const [currentBrowser, setBrowser] = React.useState('');
    React.useEffect(() => {
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        setBrowser('chrome');
      } else if (navigator.userAgent.indexOf('Safari') > -1) {
        setBrowser('safari');
      }
    }, []);
    if (!currentBrowser) {
      return null;
    }
    const titleText = currentBrowser === 'chrome' ? i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.browserNotice.browsers.chrome.title') : i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.browserNotice.browsers.other.title');
    const moreText = currentBrowser === 'chrome' ? i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.browserNotice.browsers.chrome.message') : i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.browserNotice.browsers.chrome.message');
    return /*#__PURE__*/React.createElement("p", {
      className: "stripe-pay-note"
    }, /*#__PURE__*/React.createElement("span", null, currentBrowser === 'chrome' ? /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.GOOGLEPAY,
      alt: "",
      className: "stripe-pay-note-google"
    }) : /*#__PURE__*/React.createElement("img", {
      src: config.CARDS.APPLEPAY,
      alt: "",
      className: "stripe-pay-note-apple"
    }), titleText, " \xA0", !warning && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--buttonColor)',
        textDecoration: 'underline',
        cursor: 'pointer'
      },
      onClick: () => showWarning(true)
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.browserNotice.moreInfo'))), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: warning
    }, /*#__PURE__*/React.createElement("div", null, moreText)), /*#__PURE__*/React.createElement("img", {
      src: "https://cdn.sellix.io/static/gateways/stripe-badge-white.png",
      width: 300,
      style: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '5%'
      },
      alt: "",
      className: "stripe-badge"
    }));
  };

  const Stripe = ({
    isEmbed,
    invoice,
    onSuccess
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      theme
    } = React.useContext(InvoiceDetailsContext);
    const stripe = reactStripe_umdExports.useStripe();
    const elements = reactStripe_umdExports.useElements();
    const {
      stripe_apm
    } = invoice;
    const wait = React.useRef(null);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isSent, setSent] = React.useState(false);
    const [isFormReady, setFormReady] = React.useState(false);
    const [error, setError] = React.useState(null);
    const handleSubmit = React.useCallback(async event => {
      event.preventDefault();
      setSent(true);
      let redirect_url = window && window.location && window.location.href;
      if (isEmbed) {
        if (invoice.product && invoice.product.redirect_link) {
          redirect_url = invoice.product.redirect_link;
        } else {
          redirect_url = document.referrer;
        }
      }
      if (!stripe || !elements) {
        setSent(false);
        setError(i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.isNotReadyError'));
        return;
      }
      stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: redirect_url
        }
      }).then(result => {
        if (result.error) {
          setSent(false);
          setError(result.error.message);
        } else {
          setSent(false);
          setIsSuccess(true);
          onSuccess && onSuccess();
        }
      });
    }, [isSent, stripe, elements]);
    const onSubmit = () => {
      if (!stripe) ; else {
        if (wait.current) {
          setTimeout(() => wait.current.classList.add('d-flex'), 30000);
        }
      }
    };
    if (isSuccess) {
      return '';
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Alert, _extends$1({}, invoice, {
      wait: wait
    })), /*#__PURE__*/React.createElement("form", {
      onSubmit: handleSubmit,
      style: isSent ? {
        opacity: .3
      } : {},
      className: "w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: `stripe-form-wrapper ${theme.isDark ? 'dark' : 'light'} ${isFormReady ? '' : 'stripe-loading'}`
    }, !isFormReady ? /*#__PURE__*/React.createElement(Index, null) : null, /*#__PURE__*/React.createElement(reactStripe_umdExports.PaymentElement, {
      onReady: e => {
        setFormReady(true);
      }
    })), /*#__PURE__*/React.createElement("p", {
      className: "stripe-error text-red"
    }, error || ''), /*#__PURE__*/React.createElement(CustomButton, {
      type: "submit",
      className: "w-100",
      disabled: isSent || !stripe,
      onClick: onSubmit
    }, isSent ? /*#__PURE__*/React.createElement(Index, null) : i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.continue')), stripe_apm ? null : /*#__PURE__*/React.createElement(BrowserNotice, null)));
  };

  const StripeFormContainer = props => {
    const {
      i18n
    } = useI18nContext();
    const {
      config,
      theme,
      onGetStripeLink,
      onGetProductStripeLink,
      onShowMessage
    } = React.useContext(InvoiceDetailsContext);
    const {
      stripe_apm,
      stripe_user_id,
      type,
      uniqid,
      stripe_client_secret
    } = props.invoice;
    const [url, setURL] = React.useState('');
    const [ready, setReady] = React.useState(false);
    const [error, setError] = React.useState('');
    const [stripePromise, setStripePromise] = React.useState(pure.loadStripe(config.STRIPE_PUBLIC_KEY, {
      stripeAccount: stripe_user_id
    }));
    const wait = React.useRef(null);
    React.useEffect(() => {
      if (stripe_client_secret) {
        setStripePromise(pure.loadStripe(config.STRIPE_PUBLIC_KEY, {
          stripeAccount: stripe_user_id
        }));
      }
    }, [config.STRIPE_PUBLIC_KEY, stripe_client_secret, stripe_user_id]);
    React.useEffect(() => {
      if (type === 'SUBSCRIPTION') {
        onGetStripeLink(uniqid).then(res => {
          if (res.status === 200) {
            setURL(res.data.url);
          } else {
            throw res;
          }
        }).catch(error => {
          onShowMessage({
            type: 'error',
            text: (error ? error.error || error.message : '') || i18n.t('shop.shared.titles.serverError')
          });
        });
      }
      if (type === 'PRODUCT_SUBSCRIPTION') {
        onGetProductStripeLink(uniqid).then(res => {
          if (res.status === 200) {
            setURL(res.data.url);
            setError('');
          } else if (res.status === 400 && res?.log?.message.startsWith('No such price')) {
            setError(i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.noSuchPrice'));
          } else {
            throw res;
          }
        }).catch(error => {
          onShowMessage({
            type: 'error',
            text: (error ? error.error || error.message : '') || i18n.t('shop.shared.titles.serverError')
          });
        });
      }
    }, [type, uniqid, onGetProductStripeLink, onGetStripeLink]);
    const onSubmit = () => {
      if (!url) {
        return;
      }
      if (wait.current) {
        setTimeout(() => wait.current.classList.add('d-flex'), 30000);
      }
      window.open(url, '_blank');
    };
    const rules = theme.isDark ? {
      '.Input, .Block': {
        backgroundColor: '#0a1730',
        border: '1.5px solid #233453',
        boxShadow: 'none',
        fontSizeBase: '14px'
      }
    } : {
      '.Input, .Block': {
        color: '#3f4a60',
        backgroundColor: 'white',
        border: '1.5px solid #e8e8e8',
        boxShadow: 'none',
        fontSizeBase: '14px',
        webkitTextFillColor: ''
      }
    };
    const variables = theme.isDark ? {
      colorPrimary: '#5F40E5',
      colorText: 'white',
      colorDanger: '#dc3545',
      colorTextPlaceholder: '#b4aebc',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontWeight: '500',
      fontSizeBase: '14px',
      borderRadius: '7px',
      colorBackground: '#0a1730'
    } : {
      colorPrimary: '#5F40E5',
      colorText: '#0A1730',
      colorDanger: '#dc3545',
      colorTextPlaceholder: '#989ba0',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontWeight: '500',
      fontSizeBase: '14px',
      borderRadius: '7px',
      colorBackground: 'white'
    };
    const options = {
      clientSecret: stripe_client_secret,
      appearance: {
        theme: 'stripe',
        variables: variables,
        rules: rules
      }
    };
    stripePromise.then(() => {
      setReady(true);
    }).catch(() => {
      setReady(false);
    });
    if (type === 'SUBSCRIPTION' || type === 'PRODUCT_SUBSCRIPTION') {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Alert, _extends$1({}, props.invoice, {
        wait: wait
      })), /*#__PURE__*/React.createElement("div", {
        onClick: onSubmit,
        className: "stripe-subscription-button"
      }, /*#__PURE__*/React.createElement("img", {
        src: config.PAYMENT_ICONS['STRIPE'],
        alt: ""
      }), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.payNow')), /*#__PURE__*/React.createElement("p", {
        className: "stripe-error text-red"
      }, error || ''));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: "stripe-form"
      }, ready ? /*#__PURE__*/React.createElement(reactStripe_umdExports.Elements, {
        stripe: stripePromise,
        options: options
      }, /*#__PURE__*/React.createElement(Stripe, props)) : /*#__PURE__*/React.createElement(Index, null), (stripe_apm === 'klarna' || stripe_apm === 'afterpay_clearpay' || stripe_apm === 'sofort') && /*#__PURE__*/React.createElement(Alert$1, {
        className: "mt-2 mb-2",
        skipTitle: true,
        small: true,
        blue: true,
        text: /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.stripe.message', {
          paymentName: config.PAYMENT_FULL_NAME.STRIPE_EXTRA[config.STRIPE_APM_PARSE[stripe_apm]]
        }))
      }));
    }
  };

  const Crypto$1 = ({
    crypto_uri,
    cashapp_qrcode,
    gateway,
    crypto_address,
    crypto_amount,
    crypto_received
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const [openQRModal, setQRModal] = React.useState(false);
    const [openClip, setOpenClip] = React.useState(false);
    const copyToClipboard = () => {
      setOpenClip(true);
      setTimeout(() => {
        setOpenClip(false);
      }, 1000);
    };
    const Copy = ({
      size,
      box
    }) => /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: `0 0 ${box} ${box}`,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 4C4.44772 4 4 4.44772 4 5V16C4 16.5523 4.44772 17 5 17H16C16.5523 17 17 16.5523 17 16V5C17 4.44772 16.5523 4 16 4H5ZM8 20V19H18C18.5523 19 19 18.5523 19 18V8H20C20.5523 8 21 8.44772 21 9V20C21 20.5523 20.5523 21 20 21H9C8.44772 21 8 20.5523 8 20Z"
    }));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Clipboard, {
      text: ((crypto_amount || 0) - (crypto_received || 0)).toFixed(8),
      onCopy: () => copyToClipboard()
    }, /*#__PURE__*/React.createElement("span", {
      className: "default-mode-exactly unselectable"
    }, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.sendTo.0'), ' ', /*#__PURE__*/React.createElement("span", {
      className: "default-mode-exactly-badge"
    }, ((crypto_amount || 0) - (crypto_received || 0)).toFixed(8)), config.PAYMENT_OPTS[gateway], ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.sendTo.1'))), /*#__PURE__*/React.createElement("div", {
      className: `default-mode-wallet ${openQRModal ? 'show' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `default-mode-copied ${openClip ? 'show' : ''} unselectable`
    }, /*#__PURE__*/React.createElement("img", {
      src: checkMarkIcon,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.copied'))), /*#__PURE__*/React.createElement(Clipboard, {
      text: crypto_address || '',
      onCopy: () => copyToClipboard()
    }, /*#__PURE__*/React.createElement("span", {
      className: "default-mode-wallet-clipboard"
    }, /*#__PURE__*/React.createElement("span", null, crypto_address || ''), /*#__PURE__*/React.createElement(Copy, {
      size: 20,
      box: 20
    }))), /*#__PURE__*/React.createElement("div", {
      className: `default-mode-container ${openQRModal ? 'open' : ''} ${gateway}`
    }, /*#__PURE__*/React.createElement(QRCode, {
      invoice: {
        crypto_uri,
        cashapp_qrcode,
        gateway
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "default-mode-wallet-footer"
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => setQRModal(!openQRModal)
    }, openQRModal ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-link"
    }), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.showHash')) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-qrcode"
    }), ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.qrCode'))), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.payments.crypto.payWallet'))));
  };

  const PaymentForm = ({
    invoice
  }) => {
    let {
      gateway,
      status
    } = invoice;
    if (gateway === 'PAYPAL' || gateway === 'SKRILL' || gateway === 'PERFECT_MONEY' || gateway === 'STRIPE') {
      return null;
    }
    if (status === 'PENDING' || status === 'PARTIAL') {
      return /*#__PURE__*/React.createElement(Crypto$1, invoice);
    } else {
      return null;
    }
  };
  const Product = ({
    type,
    subscription,
    name,
    product_id,
    product,
    products,
    developer_title
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (type === 'SHOPPING_CART') {
      return /*#__PURE__*/React.createElement("div", {
        className: "default-mode-row",
        style: {
          alignItems: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.cart')), /*#__PURE__*/React.createElement("div", {
        className: "text-right",
        style: {
          lineHeight: '1.5rem'
        }
      }, products.map((product, key) => {
        return /*#__PURE__*/React.createElement("div", {
          key: key
        }, /*#__PURE__*/React.createElement("a", {
          key: key,
          target: "_blank",
          href: linkToSubdomain(name, `/product/${product.uniqid}`)
        }, product.uniqid ? (product || {}).title : product.developer_title), " ", /*#__PURE__*/React.createElement("br", null));
      })));
    } else if (type === 'SUBSCRIPTION') {
      return /*#__PURE__*/React.createElement("div", {
        className: "default-mode-row"
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.product')), /*#__PURE__*/React.createElement("div", {
        className: "text-right",
        style: {
          lineHeight: '1rem'
        }
      }, /*#__PURE__*/React.createElement("a", {
        href: undefined
      }, subscription.name, ' ', i18n.t('shop.invoice.invoiceDetails.modes.default.subscription'))));
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: "default-mode-row"
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.product')), /*#__PURE__*/React.createElement("div", {
        className: "text-right",
        style: {
          lineHeight: '1rem'
        }
      }, /*#__PURE__*/React.createElement("a", {
        target: "_blank",
        href: linkToSubdomain(name, `/product/${product_id}`)
      }, product_id ? (product || {}).title : developer_title)));
    }
  };
  const InvoiceID = ({
    uniqid
  }) => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.invoice')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement(Clipboard, {
      text: uniqid
    }, /*#__PURE__*/React.createElement("span", null, uniqid))));
  };
  const Timer = ({
    invoice,
    manualSuccess
  }) => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.timerTitle')), /*#__PURE__*/React.createElement("div", {
      className: "default-mode-timer"
    }, /*#__PURE__*/React.createElement(InvoiceStatus, _extends$1({}, invoice, {
      showHhMmSs: true,
      manualSuccess: manualSuccess
    }))));
  };
  const Chain = ({
    gateway,
    blockchain
  }) => {
    const {
      i18n
    } = useI18nContext();
    if (gateway === 'USDC' || gateway === 'USDT' || gateway === 'PLZ') {
      return /*#__PURE__*/React.createElement("div", {
        className: "default-mode-row"
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.blockchain')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, blockchain)));
    }
    if (!chain(gateway)) {
      return null;
    } else {
      return /*#__PURE__*/React.createElement("div", {
        className: "default-mode-row"
      }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.blockchain')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, chain(gateway))));
    }
  };
  const Crypto = ({
    gateway,
    crypto_amount
  }) => {
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    if (gateway === 'PAYPAL' || gateway === 'PERFECT_MONEY' || gateway === 'STRIPE' || gateway === 'SKRILL') {
      return null;
    }
    const gatewayName = gateway || '';
    const title = gatewayName.toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row"
    }, /*#__PURE__*/React.createElement("span", null, title.split('_').join(' ')), !(gateway === 'PAYPAL' || gateway === 'PERFECT_MONEY' || gateway === 'SKRILL' || gateway === 'STRIPE') && /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS[gateway],
      className: "mr-1",
      width: 15,
      height: 15,
      alt: ""
    }), Number(crypto_amount).toFixed(8) || 0));
  };
  const Price = ({
    total_conversions,
    total_display,
    currency
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    return /*#__PURE__*/React.createElement("div", {
      className: "default-mode-row"
    }, /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.default.price')), /*#__PURE__*/React.createElement("div", null, config.CURRENCY_LIST[currency] || '$', total_conversions[currency] || 0));
  };
  const ChainNote = ({
    gateway,
    blockchain
  }) => {
    useI18nContext();
    return null;
  };
  const Default = ({
    invoice,
    manualSuccess,
    setManualSuccess,
    updateGateway
  }) => {
    return /*#__PURE__*/React.createElement("div", {
      className: `default-mode ${invoice.gateway}`
    }, /*#__PURE__*/React.createElement(InvoiceID, invoice), /*#__PURE__*/React.createElement(Product, invoice), /*#__PURE__*/React.createElement(Addons, invoice), /*#__PURE__*/React.createElement(Price, invoice), /*#__PURE__*/React.createElement(Crypto, invoice), /*#__PURE__*/React.createElement(Chain, invoice), /*#__PURE__*/React.createElement(Timer, {
      manualSuccess: manualSuccess,
      invoice: invoice
    }), /*#__PURE__*/React.createElement(ChainNote, invoice), invoice.status !== 'WAITING_FOR_CONFIRMATIONS' && /*#__PURE__*/React.createElement("hr", {
      className: "default-mode-divider my-4"
    }), /*#__PURE__*/React.createElement(PaymentForm, {
      invoice: invoice
    }), invoice.gateway === 'PAYPAL' && invoice.status === 'PENDING' && /*#__PURE__*/React.createElement(PayPal, invoice), invoice.gateway === 'PERFECT_MONEY' && invoice.status === 'PENDING' && /*#__PURE__*/React.createElement(PerfectMoney, invoice), invoice.gateway === 'STRIPE' && invoice.status === 'PENDING' && /*#__PURE__*/React.createElement(StripeFormContainer, {
      invoice: invoice,
      onSuccess: setManualSuccess
    }), invoice.gateway === 'SKRILL' && invoice.status === 'PENDING' && /*#__PURE__*/React.createElement(Skrill, invoice), /*#__PURE__*/React.createElement("hr", {
      className: "default-mode-divider my-4"
    }), invoice.status !== 'VOIDED' && invoice.status !== 'REVERSED' && invoice.status !== 'REFUNDED' && invoice.status !== 'CUSTOMER_DISPUTE_ONGOING' && /*#__PURE__*/React.createElement(OrderDetail, {
      invoice: invoice,
      manualSuccess: manualSuccess
    }), invoice.status !== 'WAITING_FOR_CONFIRMATIONS' && /*#__PURE__*/React.createElement(ChangeGateway, {
      updateGateway: updateGateway
    }));
  };

  const Copy = ({
    id,
    onClick
  }) => /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: `0 0 ${16} ${16}`,
    id: id,
    onClick: () => onClick && onClick(),
    className: "cashapp-mode-copy-icon"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10.6666667,0.666666667 L2.66666667,0.666666667 C1.93333333,0.666666667 1.33333333,1.26666667 1.33333333,2 L1.33333333,11.3333333 L2.66666667,11.3333333 L2.66666667,2 L10.6666667,2 L10.6666667,0.666666667 L10.6666667,0.666666667 Z M12.6666667,3.33333333 L5.33333333,3.33333333 C4.6,3.33333333 4,3.93333333 4,4.66666667 L4,14 C4,14.7333333 4.6,15.3333333 5.33333333,15.3333333 L12.6666667,15.3333333 C13.4,15.3333333 14,14.7333333 14,14 L14,4.66666667 C14,3.93333333 13.4,3.33333333 12.6666667,3.33333333 L12.6666667,3.33333333 Z M12.6666667,14 L5.33333333,14 L5.33333333,4.66666667 L12.6666667,4.66666667 L12.6666667,14 L12.6666667,14 Z",
    fill: "#000"
  }));
  const Slide = ({
    showSlide,
    showCopied,
    cashapp_cashtag,
    copyToClipboard
  }) => {
    const {
      i18n
    } = useI18nContext();
    return /*#__PURE__*/React.createElement("div", {
      className: `cashapp-mode-qr-slide ${showSlide && 'open'} ${showCopied && 'show-copy'}`
    }, /*#__PURE__*/React.createElement("h5", null, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.cashTagTitle')), /*#__PURE__*/React.createElement(Clipboard, {
      text: cashapp_cashtag,
      onCopy: copyToClipboard
    }, /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-qr-slide-content"
    }, /*#__PURE__*/React.createElement("span", null, cashapp_cashtag), /*#__PURE__*/React.createElement(Copy, null), /*#__PURE__*/React.createElement("div", {
      className: "copy-mode"
    }, /*#__PURE__*/React.createElement("img", {
      src: checkMarkIcon,
      height: 16,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.copied'))))));
  };
  const CashAppMain = ({
    invoice,
    next
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config
    } = React.useContext(InvoiceDetailsContext);
    const [showSlide, setSlide] = React.useState(false);
    const [showCopied, setCopied] = React.useState(false);
    let closeInfo = React.useCallback(() => {
      setSlide(false);
    }, []);
    const copyToClipboard = () => {
      setTimeout(() => {
        if (!showCopied) {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        }
      }, 300);
    };
    let {
      cashapp_note,
      cashapp_cashtag,
      currency,
      total_display,
      cashapp_partial_amount_received
    } = invoice;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-text unselectable"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.one.0'), /*#__PURE__*/React.createElement("br", null), i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.one.1'), ' ', /*#__PURE__*/React.createElement("b", null, config.CURRENCY_LIST[currency] || '$', ((total_display || 0) - (cashapp_partial_amount_received || 0)).toFixed(2)), i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.one.2')), /*#__PURE__*/React.createElement(Clipboard, {
      text: cashapp_note,
      onCopy: copyToClipboard
    }, /*#__PURE__*/React.createElement("div", {
      className: `cashapp-mode-note ${showCopied ? 'show-copy' : ''}`
    }, cashapp_note, /*#__PURE__*/React.createElement(Copy, null), /*#__PURE__*/React.createElement("div", {
      className: "copy-mode unselectable"
    }, /*#__PURE__*/React.createElement("img", {
      src: checkMarkIcon,
      height: 16,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.copied'))))), /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-text unselectable"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.two'), /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
      className: "cashapp"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-qr"
    }, /*#__PURE__*/React.createElement(Clipboard, {
      text: cashapp_cashtag,
      onCopy: copyToClipboard
    }, /*#__PURE__*/React.createElement(QRCode, {
      onClick: () => setSlide(true),
      invoice: invoice
    }))), /*#__PURE__*/React.createElement(Slide, {
      showSlide: showSlide,
      showCopied: showCopied,
      cashapp_cashtag: cashapp_cashtag,
      copyToClipboard: copyToClipboard
    }), showSlide && /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-qr-slide-overlay",
      onClick: closeInfo
    })), /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-text mb-2 mt-1 unselectable"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.three')), /*#__PURE__*/React.createElement(Clipboard, {
      text: cashapp_cashtag,
      onCopy: copyToClipboard,
      className: "cashapp-mode-note"
    }, cashapp_cashtag, /*#__PURE__*/React.createElement(Copy, {
      onClick: () => setSlide(true),
      "data-tooltip": i18n.t('shop.invoice.invoiceDetails.modes.cashApp.copyCashTagTooltip')
    })), /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-text unselectable"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.messages.four')), /*#__PURE__*/React.createElement(CustomButton, {
      className: "cashapp-mode-button",
      size: "small",
      onClick: next,
      iconName: "arrow"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.next')));
  };

  const CashApp = ({
    invoice,
    back,
    setTimeUp,
    timeUp,
    time
  }) => {
    const {
      i18n
    } = useI18nContext();
    const {
      config,
      onPostCashAppIdentifier,
      onShowMessage
    } = React.useContext(InvoiceDetailsContext);
    let [identifier, setIdentifier] = React.useState('#');
    let [sending, setSending] = React.useState(false);
    let {
      currency,
      total_display,
      cashapp_partial_amount_received
    } = invoice;
    let approvePayment = React.useCallback(() => {
      setSending(true);
      onPostCashAppIdentifier({
        identifier,
        invoice_id: invoice.uniqid
      }).then(res => res.status === 200 ? onShowMessage({
        type: 'success',
        text: res.message
      }) : onShowMessage({
        type: 'error',
        text: res.message
      })).catch(error => {
        onShowMessage({
          type: 'error',
          text: (error ? error.error || error.message : '') || i18n.t('shop.shared.titles.serverError')
        });
      }).finally(() => setSending(false));
    }, [identifier]);
    return /*#__PURE__*/React.createElement("div", {
      className: "cashapp"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-header-back"
    }, /*#__PURE__*/React.createElement("i", {
      className: "cashapp-mode-header-next fa-solid fa-left",
      onClick: back,
      style: {
        fontSize: 20
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-header-title"
    }, currency, " ", ((total_display || 0) - (cashapp_partial_amount_received || 0)).toFixed(2)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "cashapp"
    }, timeUp && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "cashapp-mode-text"
    }, /*#__PURE__*/React.createElement("b", null, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.timeUp.title'))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex my-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cashapp-mode-text"
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.timeUp.message.0'), ' ', i18n.t('shop.invoice.invoiceDetails.modes.cashApp.timeUp.message.1'), ' ', /*#__PURE__*/React.createElement("b", null, "#ABC1234"), i18n.t('shop.invoice.invoiceDetails.modes.cashApp.timeUp.message.2'))), /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode-input"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: identifier,
      onChange: e => setIdentifier(e.target.value)
    }), /*#__PURE__*/React.createElement("button", {
      className: "cashapp-mode-send px-3",
      onClick: approvePayment
    }, sending ? /*#__PURE__*/React.createElement(Index, null) : /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-check",
      style: {
        fontSize: 20
      }
    }))))), !timeUp && /*#__PURE__*/React.createElement("p", {
      className: "cashapp-mode-countdown"
    }, /*#__PURE__*/React.createElement("img", {
      src: config.PAYMENT_ICONS.CASH_APP,
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.notTimeUp.title'), /*#__PURE__*/React.createElement("br", null), i18n.t('shop.invoice.invoiceDetails.modes.cashApp.notTimeUp.secondsRemaining', {
      seconds: time < 10 ? `0${Math.round(time)}` : Math.round(time)
    }), /*#__PURE__*/React.createElement("span", {
      className: "cashapp-mode-small",
      onClick: () => setTimeUp(true)
    }, i18n.t('shop.invoice.invoiceDetails.modes.cashApp.notTimeUp.manualReview')))));
  };

  const CASHAPPMODE = ({
    invoice,
    getInvoice,
    updateGateway
  }) => {
    let [next, setNext] = React.useState(false);
    let [firstMove, setFirstMove] = React.useState(false);
    let [time, setTime] = React.useState(120);
    let [timeUp, setTimeUp] = React.useState(false);
    React.useEffect(() => {
      if (invoice.created_at) {
        let diff = moment.duration(moment().diff(moment(invoice.created_at * 1000)));
        setTime(diff.asSeconds());
      }
    }, [invoice]);
    React.useEffect(() => {
      if (!firstMove) {
        setFirstMove(true);
        timeCountDown();
      }
    }, [firstMove]);
    React.useEffect(() => {
      const diff = moment.duration(moment().diff(moment(invoice.created_at * 1000)));
      if (diff.asMinutes() > 10 || diff.asSeconds() > 120) {
        setTimeUp(true);
      }
    }, []);
    const timeCountDown = React.useCallback(() => {
      let duration = moment.duration(time * 1000, 'milliseconds');
      let interval = 1000;
      let countdown = setInterval(() => {
        duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
        setTime(duration.asSeconds());
        if (!(duration.asSeconds() % 10)) {
          getInvoice(true);
        }
        if (duration.asSeconds() <= 0) {
          setTimeUp(true);
          clearInterval(countdown);
        }
      }, interval);
    }, [time]);
    return /*#__PURE__*/React.createElement("div", {
      className: "cashapp-mode"
    }, invoice.status === 'PARTIAL' && /*#__PURE__*/React.createElement("span", {
      className: "cashapp-mode-partial"
    }, /*#__PURE__*/React.createElement("img", {
      src: Partial,
      alt: "",
      className: "mr-1"
    }), " ", /*#__PURE__*/React.createElement(InvoiceStatus, invoice)), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: !next
    }, /*#__PURE__*/React.createElement(CashAppMain, {
      next: () => setNext(true),
      invoice: invoice
    })), /*#__PURE__*/React.createElement(Collapse$1, {
      isOpened: next
    }, /*#__PURE__*/React.createElement(CashApp, {
      back: () => setNext(false),
      invoice: invoice,
      time: time,
      timeUp: timeUp,
      setTimeUp: setTimeUp
    })), !next && /*#__PURE__*/React.createElement(ChangeGateway, {
      updateGateway: updateGateway
    }));
  };

  const initialValue = {
    i18n: {
      t: phrase => phrase
    }
  };

  function I18nProvider({
    children,
    i18n
  }) {
    return /*#__PURE__*/React.createElement(I18nContext.Provider, {
      value: {
        i18n: i18n || initialValue.i18n
      }
    }, children);
  }

  const InternalInvoice = () => {
    const {
      i18n
    } = useI18nContext();
    const {
      invoiceId,
      invoiceInfo,
      onGetInvoice,
      onCompleteInvoice,
      onToggleShowProductInfo,
      onShowMessage
    } = React.useContext(InvoiceDetailsContext);
    const pathname = window.location.pathname;
    const [manualSuccess, setManualSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [invoice, setInvoice] = React.useState(invoiceInfo);
    const [alert, setAlert] = React.useState(true);
    const [gateway, setGateway] = React.useState(0);
    const [editedGateway, setEditedGateway] = React.useState();
    const isSubscription = pathname.includes('subscription');
    pathname.includes('discover');
    const isQrMode = false;
    const isCashAppMode = invoice.gateway === 'CASH_APP' && (invoice.status === 'PENDING' || invoice.status === 'PARTIAL' || invoice.status === 'WAITING_SHOP_ACTION');
    invoice.type === 'SHOPPING_CART';
    const isBinance = invoice.gateway === 'BINANCE';
    const isBTCLN = invoice.gateway === 'BITCOIN_LN';
    invoice.gateway === 'CONCORDIUM';
    const {
      status,
      void_details
    } = invoice;
    const showGatewaySelector = React.useMemo(() => !gateway && gateway !== 0, [gateway]);
    const showInvoiceDetails = React.useMemo(() => !!gateway && (status === 'PENDING' || status === 'PARTIAL' || status === 'WAITING_FOR_CONFIRMATIONS'), [gateway, status]);
    const showGatewayFeeAlert = React.useMemo(() => !!editedGateway && !!invoice.gateway && editedGateway !== invoice.gateway, [invoice, editedGateway]);
    const getInvoice = React.useCallback((isTimer = false) => {
      return onGetInvoice(invoiceId).then(({
        data: {
          invoice
        }
      }) => {
        if (!isTimer) {
          setGateway(invoice.gateway);
        }
        setInvoice(invoice);
        if (['COMPLETED', 'VOIDED', 'REVERSED', 'REFUNDED'].includes(invoice.status) || manualSuccess) {
          clearInterval();
        }
        if (invoice.status === 'COMPLETED' || manualSuccess) {
          if (isSubscription) {
            onCompleteInvoice && onCompleteInvoice({
              type: 'subscription',
              invoiceId
            });
          } else {
            onCompleteInvoice && onCompleteInvoice({
              type: 'product',
              invoiceId
            });
          }
        }
      }).catch(error => {
        onShowMessage({
          type: 'error',
          text: (error ? error.error || error.message : '') || i18n.t('shop.shared.titles.serverError')
        });
      }).finally(() => setLoading(false));
    }, [invoiceId, manualSuccess, isSubscription, onGetInvoice, onShowMessage]);
    React.useEffect(() => {
      document.title = i18n.t('shop.invoice.invoiceDetails.pageTitle', {
        invoiceId: invoiceId
      });
      let interval = setInterval(() => getInvoice(true), 10000);
      getInvoice();
      return () => {
        clearInterval(interval);
      };
    }, [invoiceId, manualSuccess, getInvoice]);
    const invoiceStatusTitle = React.useMemo(() => {
      return !gateway && gateway !== 0 ? i18n.t('shop.invoice.invoiceDetails.statuses.title.selectPayment') : status === 'CUSTOMER_DISPUTE_ONGOING' ? i18n.t('shop.invoice.invoiceDetails.statuses.title.customerDispute') : status === 'VOIDED' ? i18n.t('shop.invoice.invoiceDetails.statuses.title.voided') : status === 'PROCESSING' ? i18n.t('shop.invoice.invoiceDetails.statuses.title.processing') : status === 'REVERSED' ? i18n.t('shop.invoice.invoiceDetails.statuses.title.reversed') : status === 'REFUNDED' ? i18n.t('shop.invoice.invoiceDetails.statuses.title.refunded') : status === 'WAITING_SHOP_ACTION' && isCashAppMode ? i18n.t('shop.invoice.invoiceDetails.statuses.title.waitingShopAction') : '';
    }, [gateway, isCashAppMode, status]);
    if (loading || !Object.keys(invoice).length) {
      return /*#__PURE__*/React.createElement("div", {
        className: "sellix-invoice-details",
        style: {
          minHeight: 700
        }
      }, /*#__PURE__*/React.createElement(Loader, null));
    } else {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "sellix-invoice-details"
      }, /*#__PURE__*/React.createElement("div", {
        className: "sellix-invoice-header"
      }, /*#__PURE__*/React.createElement("div", {
        className: `${status === 'VOIDED' && void_details ? 'd-flex justify-content-between' : ''} sellix-invoice-title`
      }, status === 'WAITING_FOR_CONFIRMATIONS' && isQrMode ? /*#__PURE__*/React.createElement("span", {
        style: {
          marginTop: '1.25rem',
          textAlign: 'center',
          width: '100%'
        }
      }, i18n.t('shop.invoice.invoiceDetails.awaitingConfirmation'), ' ', "(", isCashAppMode ? null : (((invoice.crypto_transactions || []).slice(-1)[0] || {}).confirmations || '0') + '/' + (invoice.crypto_confirmations_needed || 0), ")") : !(!gateway && gateway !== 0) || status !== 'CUSTOMER_DISPUTE_ONGOING' || status !== 'VOIDED' || status !== 'REVERSED' || status !== 'REFUNDED' || status !== 'WAITING_SHOP_ACTION' ? /*#__PURE__*/React.createElement("span", null, status === 'PROCESSING' ? i18n.t('shop.invoice.invoiceDetails.processing') : i18n.t('shop.invoice.invoiceDetails.paymentDetails')) : invoiceStatusTitle, status === 'VOIDED' && void_details === 'PRODUCT_SOLD_OUT' && /*#__PURE__*/React.createElement("span", {
        className: `badge badge-cancelled ml-2`
      }, i18n.t('shop.invoice.invoiceDetails.productSoldOut')), status === 'VOIDED' && void_details === 'CART_PRODUCTS_SOLD_OUT' && /*#__PURE__*/React.createElement("span", {
        className: `badge badge-cancelled ml-2`
      }, i18n.t('shop.invoice.invoiceDetails.cartSoldOut')), showGatewayFeeAlert && /*#__PURE__*/React.createElement("span", {
        className: "sellix-tooltip sellix-invoice-gataway-fee-warning",
        "data-tooltip-html": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.gateway.gatewayChanged.0')), /*#__PURE__*/React.createElement("div", null, i18n.t('shop.invoice.invoiceDetails.gateway.gatewayChanged.1'))),
        "data-tooltip-id": "gateway-fee-warning-tooltip"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-circle-exclamation fa-regular fa-xs"
      }), /*#__PURE__*/React.createElement(q, {
        id: "gateway-fee-warning-tooltip",
        className: "sellix-invoice-gataway-fee-warning-tooltip",
        place: "right",
        float: false
      })))), /*#__PURE__*/React.createElement(Collapse$1, {
        isOpened: showGatewaySelector
      }, /*#__PURE__*/React.createElement(Gateway, {
        invoice: invoice,
        getInvoice: getInvoice,
        updateGateway: setGateway,
        onChangeGateway: gateway => setEditedGateway(gateway)
      })), /*#__PURE__*/React.createElement(Collapse$1, {
        isOpened: showInvoiceDetails,
        name: "invoice"
      }, /*#__PURE__*/React.createElement("div", null, isCashAppMode ? /*#__PURE__*/React.createElement(CASHAPPMODE, {
        getInvoice: getInvoice,
        invoice: invoice,
        updateGateway: setGateway
      }) : isBinance || isBTCLN || isQrMode ? /*#__PURE__*/React.createElement(QRMODE, {
        isBinance: isBinance,
        invoice: invoice,
        updateGateway: setGateway
      }) : /*#__PURE__*/React.createElement(Default, {
        invoice: invoice,
        updateGateway: setGateway,
        manualSuccess: manualSuccess,
        setManualSuccess: () => setManualSuccess(true)
      }))), /*#__PURE__*/React.createElement("div", {
        className: "sellix-invoice-info"
      }, status === 'PARTIAL' && alert && /*#__PURE__*/React.createElement(AlertPartial, {
        openModal: alert,
        closeModal: () => setAlert(false),
        invoice: invoice
      }), status === 'CUSTOMER_DISPUTE_ONGOING' && /*#__PURE__*/React.createElement(AlertDispute, null), status === 'VOIDED' && /*#__PURE__*/React.createElement(AlertCanceled, null), status === 'REVERSED' && /*#__PURE__*/React.createElement(AlertCanceled, {
        reversed: true
      }), status === 'REFUNDED' && /*#__PURE__*/React.createElement(AlertCanceled, {
        refunded: true
      }), status === 'WAITING_FOR_CONFIRMATIONS' && isQrMode && /*#__PURE__*/React.createElement(AlertAwait, invoice), status === 'WAITING_SHOP_ACTION' && isCashAppMode && /*#__PURE__*/React.createElement(AlertAwait, _extends$1({
        isCashApp: true
      }, invoice)), status === 'PROCESSING' && /*#__PURE__*/React.createElement(AlertProcessing, {
        invoice: invoice
      }))));
    }
  };
  const InvoiceDetails = ({
    config,
    settings,
    theme,
    invoiceId,
    invoiceInfo,
    onGetInvoice,
    onUpdateInvoice,
    onCompleteInvoice,
    onToggleShowProductInfo,
    onValidateRecaptcha,
    onGetProductStripeLink,
    onShowMessage,
    sellixI18Next
  }) => {
    return /*#__PURE__*/React.createElement(InvoiceDetailsContext.Provider, {
      value: {
        config: config || initialValue$2.config,
        settings: settings || initialValue$2.settings,
        theme: theme || initialValue$2.theme,
        invoiceId: invoiceId || initialValue$2.invoiceId,
        invoiceInfo: invoiceInfo || initialValue$2.invoiceInfo,
        onGetInvoice: onGetInvoice || initialValue$2.onGetInvoice,
        onUpdateInvoice: onUpdateInvoice || initialValue$2.onUpdateInvoice,
        onCompleteInvoice: onCompleteInvoice || initialValue$2.onCompleteInvoice,
        onToggleShowProductInfo: onToggleShowProductInfo || invoiceInfo.onToggleShowProductInfo,
        onValidateRecaptcha: onValidateRecaptcha || initialValue$2.onValidateRecaptcha,
        onGetProductStripeLink: onGetProductStripeLink || initialValue$2.onGetProductStripeLink,
        onShowMessage: onShowMessage || initialValue$2.onShowMessage
      }
    }, /*#__PURE__*/React.createElement(I18nProvider, {
      i18n: sellixI18Next
    }, /*#__PURE__*/React.createElement(InternalInvoice, null)));
  };

  exports.InvoiceDetails = InvoiceDetails;

  return exports;

})({}, React, ReactDOM, moment);
