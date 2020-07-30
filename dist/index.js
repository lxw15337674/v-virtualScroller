(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}));
}(this, (function (exports) { 'use strict';

    function binarySearch(offset, list) {
        if (list.length === 0) {
            return 0;
        }
        var startIndex = 0, endIndex = list.length - 1, midIndex, startOffset, endOffset;
        while (startIndex <= endIndex) {
            midIndex = Math.floor((startIndex + endIndex) / 2);
            startOffset = list[midIndex - 1] || 0;
            endOffset = list[midIndex];
            if (midIndex === 0 && offset <= list[0]) {
                return 0;
            }
            if (startOffset > offset) {
                endIndex = midIndex - 1;
            }
            else if (startOffset === offset) {
                return midIndex - 1;
            }
            else if (startOffset <= offset && offset <= endOffset) {
                return midIndex;
            }
            else if (endOffset < offset) {
                startIndex = midIndex + 1;
            }
        }
        return list.length;
    }
    function findVisibleIndex(offset, visibleOffset, list) {
        var start = binarySearch(offset, list);
        var end = binarySearch(visibleOffset + offset, list);
        return {
            start: start,
            end: end,
        };
    }

    function total(array, start, end, key) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = -1; }
        if (!array) {
            return 0;
        }
        if (end === -1) {
            end = array.length;
        }
        return array.slice(start, end).reduce(function (total, item) {
            if (key) {
                return total + item[key];
            }
            else {
                return total + item;
            }
        }, 0);
    }

    //
    var uid = 0;
    var script = {
      name: 'dynamicScroller',
      props: {
        items: {
          type: Array,
          require: true,
          "default": []
        },
        direction: {
          type: String,
          "default": 'vertical',
          validator: function validator(value) {
            return ['vertical', 'horizontal'].includes(value);
          }
        }
      },
      data: function data() {
        return {
          pool: [],
          visibleIndex: {
            start: -1,
            end: -1
          }
        };
      },
      methods: {
        usedView: function usedView(viewIndex, itemsIndex) {
          var view = {},
              items = this.items,
              itemsPosition = this.itemsPosition;

          if (this.pool[viewIndex]) {
            view = this.pool[viewIndex];
            view.item = items[itemsIndex];
            view.index = itemsIndex;
            view.used = true;
            view.position = itemsPosition[itemsIndex - 1] || 0;
          } else {
            view = {
              item: this.items[itemsIndex],
              position: itemsPosition[itemsIndex - 1] || 0,
              index: itemsIndex,
              id: uid++,
              used: true
            };
            this.pool.push(view);
          }

          return view;
        },
        unusedView: function unusedView(view) {
          view.used = false;
          view.position = -9999;
        },
        updateVisibleItems: function updateVisibleItems() {
          var _this$visibleIndex = this.visibleIndex,
              start = _this$visibleIndex.start,
              end = _this$visibleIndex.end;
          var viewIndex = 0; //更新使用的view

          for (var i = start; i <= end; i++) {
            this.usedView(viewIndex, i);
            viewIndex++;
          } // 处理不使用的view


          for (var _i = viewIndex; _i < this.pool.length; _i++) {
            this.unusedView(this.pool[_i]);
          }
        },
        handleScroll: function handleScroll() {
          var offset;

          if (this.direction === 'vertical') {
            offset = this.$refs.scroller.scrollTop;
          } else {
            offset = this.$refs.scroller.scrollLeft;
          }

          this.$emit('scroll', offset);
          this.handleVisibilityChange();
        },
        handleVisibilityChange: function handleVisibilityChange() {
          var offset, clientSize;

          if (this.direction === 'vertical') {
            offset = this.$refs.scroller.scrollTop;
            clientSize = this.$refs.scroller.clientHeight;
          } else {
            offset = this.$refs.scroller.scrollLeft;
            clientSize = this.$refs.scroller.clientWidth;
          }

          var _scroll$findVisibleIn = findVisibleIndex(offset, clientSize, this.itemsPosition),
              start = _scroll$findVisibleIn.start,
              end = _scroll$findVisibleIn.end;

          this.visibleIndex.start = start;
          this.visibleIndex.end = end;
          this.updateVisibleItems();
        }
      },
      watch: {
        items: {
          deep: true,
          handler: function handler() {
            this.handleVisibilityChange();
          }
        }
      },
      computed: {
        tableSize: function tableSize() {
          if (this.direction === 'vertical') {
            return {
              minHeight: "".concat(total(this.items, 0, -1), "px"),
              width: '100%'
            };
          } else {
            return {
              height: '100%',
              minWidth: "".concat(total(this.items, 0, -1), "px")
            };
          }
        },
        //尺寸缓存
        itemsPosition: function itemsPosition() {
          var total = 0;
          return this.items.map(function (item) {
            total += item;
            return total;
          });
        }
      },
      mounted: function mounted() {
        window.addEventListener('resize', this.handleVisibilityChange);
      },
      beforeDestroy: function beforeDestroy() {
        window.removeEventListener('resize', this.handleVisibilityChange);
      }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    const isOldIE = typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
        return (id, style) => addStyle(id, style);
    }
    let HEAD;
    const styles = {};
    function addStyle(id, css) {
        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
        if (!style.ids.has(id)) {
            style.ids.add(id);
            let code = css.source;
            if (css.map) {
                // https://developer.chrome.com/devtools/docs/javascript-debugging
                // this makes source maps inside style tags work properly in Chrome
                code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
                // http://stackoverflow.com/a/26603875
                code +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                        ' */';
            }
            if (!style.element) {
                style.element = document.createElement('style');
                style.element.type = 'text/css';
                if (css.media)
                    style.element.setAttribute('media', css.media);
                if (HEAD === undefined) {
                    HEAD = document.head || document.getElementsByTagName('head')[0];
                }
                HEAD.appendChild(style.element);
            }
            if ('styleSheet' in style.element) {
                style.styles.push(code);
                style.element.styleSheet.cssText = style.styles
                    .filter(Boolean)
                    .join('\n');
            }
            else {
                const index = style.ids.size - 1;
                const textNode = document.createTextNode(code);
                const nodes = style.element.childNodes;
                if (nodes[index])
                    style.element.removeChild(nodes[index]);
                if (nodes.length)
                    style.element.insertBefore(textNode, nodes[index]);
                else
                    style.element.appendChild(textNode);
            }
        }
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _obj;
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          ref: "scroller",
          staticClass: "dynamicScroller",
          class: ((_obj = {}), (_obj["direction-" + _vm.direction] = true), _obj),
          on: {
            "&scroll": function($event) {
              return _vm.handleScroll($event)
            }
          }
        },
        [
          _vm._t("before"),
          _vm._v(" "),
          _c(
            "div",
            { ref: "wrapper", staticClass: "wrapper", style: _vm.tableSize },
            _vm._l(_vm.pool, function(view) {
              return _c(
                "div",
                {
                  key: view.id,
                  staticClass: "item-view",
                  class: _vm.direction,
                  style: {
                    transform:
                      "translate" +
                      (_vm.direction === "vertical" ? "Y" : "X") +
                      "(" +
                      view.position +
                      "px)"
                  }
                },
                [
                  _vm._t("default", null, {
                    size: view.item,
                    index: view.index,
                    active: view.used
                  })
                ],
                2
              )
            }),
            0
          )
        ],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-55550db2_0", { source: ".dynamicScroller[data-v-55550db2] {\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.dynamicScroller .item-view[data-v-55550db2] {\n  will-change: transform;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.direction-horizontal[data-v-55550db2] {\n  overflow-x: auto;\n  display: flex;\n}\n.direction-vertical[data-v-55550db2] {\n  overflow-y: auto;\n}\n", map: {"version":3,"sources":["C:\\Users\\lxw\\Desktop\\codework\\virtual-scroller\\src\\components\\virtual-scroller.vue","virtual-scroller.vue"],"names":[],"mappings":"AA8JA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;AC7JA;AD8JA;EACA,sBAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;AC5JA;AD6JA;EACA,gBAAA;EACA,aAAA;AC3JA;AD4JA;EACA,gBAAA;AC1JA","file":"virtual-scroller.vue","sourcesContent":["<template>\r\n    <div\r\n        class=\"dynamicScroller\"\r\n        :class=\"{ [`direction-${direction}`]: true }\"\r\n        ref=\"scroller\"\r\n        @scroll.passive=\"handleScroll\"\r\n    >\r\n        <slot name=\"before\"></slot>\r\n        <div class=\"wrapper\" ref=\"wrapper\" :style=\"tableSize\">\r\n            <div\r\n                class=\"item-view\"\r\n                :class=\"direction\"\r\n                v-for=\"view of pool\"\r\n                :key=\"view.id\"\r\n                :style=\"{\r\n                    transform: `translate${direction === 'vertical' ? 'Y' : 'X'}(${\r\n                        view.position\r\n                    }px)`,\r\n                }\"\r\n            >\r\n                <slot :size=\"view.item\" :index=\"view.index\" :active=\"view.used\"></slot>\r\n            </div>\r\n        </div>\r\n        <!-- <slot name=\"after\"></slot> -->\r\n    </div>\r\n</template>\r\n<script>\r\nimport * as scroll from '../utils/scroll.ts';\r\nimport * as math from '../utils/math.ts';\r\nlet uid = 0;\r\nexport default {\r\n    name: 'dynamicScroller',\r\n    props: {\r\n        items: {\r\n            type: Array,\r\n            require: true,\r\n            default: [],\r\n        },\r\n        direction: {\r\n            type: String,\r\n            default: 'vertical',\r\n            validator: (value) => ['vertical', 'horizontal'].includes(value),\r\n        },\r\n    },\r\n    data() {\r\n        return {\r\n            pool: [],\r\n            visibleIndex: {\r\n                start: -1,\r\n                end: -1,\r\n            },\r\n        };\r\n    },\r\n    methods: {\r\n        usedView(viewIndex, itemsIndex) {\r\n            let view = {},\r\n                { items, itemsPosition } = this;\r\n            if (this.pool[viewIndex]) {\r\n                view = this.pool[viewIndex];\r\n                view.item = items[itemsIndex];\r\n                view.index = itemsIndex;\r\n                view.used = true;\r\n                view.position = itemsPosition[itemsIndex - 1] || 0;\r\n            } else {\r\n                view = {\r\n                    item: this.items[itemsIndex],\r\n                    position: itemsPosition[itemsIndex - 1] || 0,\r\n                    index: itemsIndex,\r\n                    id: uid++,\r\n                    used: true,\r\n                };\r\n                this.pool.push(view);\r\n            }\r\n            return view;\r\n        },\r\n        unusedView(view) {\r\n            view.used = false;\r\n            view.position = -9999;\r\n        },\r\n        updateVisibleItems() {\r\n            let { start, end } = this.visibleIndex;\r\n            let viewIndex = 0;\r\n            //更新使用的view\r\n            for (let i = start; i <= end; i++) {\r\n                this.usedView(viewIndex, i);\r\n                viewIndex++;\r\n            }\r\n            // 处理不使用的view\r\n            for (let i = viewIndex; i < this.pool.length; i++) {\r\n                this.unusedView(this.pool[i]);\r\n            }\r\n        },\r\n        handleScroll() {\r\n            let offset;\r\n            if (this.direction === 'vertical') {\r\n                offset = this.$refs.scroller.scrollTop;\r\n            } else {\r\n                offset = this.$refs.scroller.scrollLeft;\r\n            }\r\n            this.$emit('scroll', offset);\r\n            this.handleVisibilityChange();\r\n        },\r\n        handleVisibilityChange() {\r\n            let offset, clientSize;\r\n            if (this.direction === 'vertical') {\r\n                offset = this.$refs.scroller.scrollTop;\r\n                clientSize = this.$refs.scroller.clientHeight;\r\n            } else {\r\n                offset = this.$refs.scroller.scrollLeft;\r\n                clientSize = this.$refs.scroller.clientWidth;\r\n            }\r\n            let { start, end } = scroll.findVisibleIndex(offset, clientSize, this.itemsPosition);\r\n            this.visibleIndex.start = start;\r\n            this.visibleIndex.end = end;\r\n            this.updateVisibleItems();\r\n        },\r\n    },\r\n    watch: {\r\n        items: {\r\n            deep: true,\r\n            handler() {\r\n                this.handleVisibilityChange();\r\n            },\r\n        },\r\n    },\r\n    computed: {\r\n        tableSize() {\r\n            if (this.direction === 'vertical') {\r\n                return {\r\n                    minHeight: `${math.total(this.items, 0, -1)}px`,\r\n                    width: '100%',\r\n                };\r\n            } else {\r\n                return {\r\n                    height: '100%',\r\n                    minWidth: `${math.total(this.items, 0, -1)}px`,\r\n                };\r\n            }\r\n        },\r\n        //尺寸缓存\r\n        itemsPosition() {\r\n            let total = 0;\r\n            return this.items.map((item) => {\r\n                total += item;\r\n                return total;\r\n            });\r\n        },\r\n    },\r\n    mounted() {\r\n        window.addEventListener('resize', this.handleVisibilityChange);\r\n    },\r\n    beforeDestroy() {\r\n        window.removeEventListener('resize', this.handleVisibilityChange);\r\n    },\r\n};\r\n</script>\r\n\r\n<style lang=\"stylus\" scoped>\r\n.dynamicScroller\r\n    position relative;\r\n    height 100%\r\n    width 100%\r\n    .item-view\r\n        will-change transform;\r\n        position absolute;\r\n        top 0;\r\n        left 0;\r\n.direction-horizontal\r\n    overflow-x auto\r\n    display: flex;\r\n.direction-vertical\r\n    overflow-y auto\r\n</style>\r\n",".dynamicScroller {\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.dynamicScroller .item-view {\n  will-change: transform;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.direction-horizontal {\n  overflow-x: auto;\n  display: flex;\n}\n.direction-vertical {\n  overflow-y: auto;\n}\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = "data-v-55550db2";
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        createInjector,
        undefined,
        undefined
      );

    //
    var uid$1 = 0;
    var script$1 = {
      name: 'virtual-scroller-table',
      props: {
        cols: {
          type: Array,
          require: true
        },
        rows: {
          type: Array,
          require: true
        }
      },
      components: {},
      data: function data() {
        return {
          rowsPool: [],
          colsPool: [],
          visibleRowsIndex: {
            start: -1,
            end: -1
          },
          visibleColsIndex: {
            start: -1,
            end: -1
          }
        };
      },
      methods: {
        usedView: function usedView(pool, viewIndex, items, itemsIndex, itemPosition) {
          var view = {};

          if (pool[viewIndex]) {
            var _itemPosition;

            view = pool[viewIndex];
            view.item = items[itemsIndex];
            view.index = itemsIndex;
            view.used = true;
            view.position = (_itemPosition = itemPosition === null || itemPosition === void 0 ? void 0 : itemPosition[itemsIndex - 1]) !== null && _itemPosition !== void 0 ? _itemPosition : 0;
          } else {
            var _itemPosition2;

            view = {
              item: items[itemsIndex],
              position: (_itemPosition2 = itemPosition === null || itemPosition === void 0 ? void 0 : itemPosition[itemsIndex - 1]) !== null && _itemPosition2 !== void 0 ? _itemPosition2 : 0,
              index: itemsIndex,
              id: uid$1++,
              used: true
            };
            pool.push(view);
          }

          return view;
        },
        unusedView: function unusedView(view) {
          view.item = undefined;
          view.used = false;
          view.position = -9999;
          view.index = -1;
        },
        updateVisibleItems: function updateVisibleItems(direction) {
          var start, end, pool, itemPosition, items;

          if (direction === 'vertical') {
            start = this.visibleRowsIndex.start;
            end = this.visibleRowsIndex.end;
            pool = this.rowsPool;
            itemPosition = this.rowsPosition;
            items = this.rows;
          } else {
            start = this.visibleColsIndex.start;
            end = this.visibleColsIndex.end;
            pool = this.colsPool;
            itemPosition = this.colsPosition;
            items = this.cols;
          }

          var viewIndex = 0; //更新使用的view

          for (var i = start; i <= end; i++) {
            this.usedView(pool, viewIndex, items, i, itemPosition);
            viewIndex++;
          } // 处理不使用的view


          for (var _i = viewIndex; _i < pool.length; _i++) {
            this.unusedView(pool[_i]);
          }
        },
        handleScroll: function handleScroll() {
          var scroller = this.$refs.scroller;
          this.$emit('scroll', {
            left: scroller.scrollLeft,
            top: scroller.scrollTop
          });
          this.handleVisibilityChange();
        },
        handleVisibilityChange: function handleVisibilityChange() {
          var scroller = this.$refs.scroller;
          this.visibleRowsIndex = findVisibleIndex(scroller.scrollTop, scroller.clientHeight, this.rowsPosition);
          this.visibleColsIndex = findVisibleIndex(scroller.scrollLeft, scroller.clientWidth, this.colsPosition);
        }
      },
      watch: {
        visibleRowsIndex: {
          deep: true,
          handler: function handler() {
            this.updateVisibleItems('vertical');
          }
        },
        visibleColsIndex: {
          deep: true,
          handler: function handler() {
            this.updateVisibleItems('horizontal');
          }
        },
        rows: {
          deep: true,
          handler: function handler() {
            this.handleVisibilityChange();
          }
        },
        cols: {
          deep: true,
          handler: function handler() {
            this.handleVisibilityChange();
          }
        }
      },
      computed: {
        tableSize: function tableSize() {
          return {
            height: "".concat(total(this.rows, 0, -1), "px"),
            width: "".concat(total(this.cols, 0, -1), "px")
          };
        },
        //长度缓存
        colsPosition: function colsPosition() {
          var total = 0;
          return this.cols.map(function (item) {
            total += item;
            return total;
          });
        },
        //高度缓存
        rowsPosition: function rowsPosition() {
          var total = 0;
          return this.rows.map(function (item) {
            total += item;
            return total;
          });
        }
      },
      mounted: function mounted() {
        window.addEventListener('resize', this.handleVisibilityChange);
      },
      beforeDestroy: function beforeDestroy() {
        window.removeEventListener('resize', this.handleVisibilityChange);
      }
    };

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          ref: "scroller",
          staticClass: "dynamicScroller",
          on: {
            "&scroll": function($event) {
              return _vm.handleScroll($event)
            }
          }
        },
        [
          _vm._t("before"),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "wrapper", style: _vm.tableSize },
            _vm._l(_vm.rowsPool, function(row) {
              return _c(
                "div",
                {
                  key: row.id,
                  staticClass: "row-view",
                  style: {
                    transform: "  translate(0," + row.position + "px)"
                  }
                },
                _vm._l(_vm.colsPool, function(col) {
                  return _c(
                    "div",
                    {
                      key: col.id,
                      staticClass: "col-view",
                      style: {
                        transform: "  translate(" + col.position + "px,0)"
                      }
                    },
                    [
                      _vm._t("default", null, {
                        rowIndex: row.index,
                        colIndex: col.index,
                        height: row.item,
                        width: col.item,
                        active: col.used
                      })
                    ],
                    2
                  )
                }),
                0
              )
            }),
            0
          )
        ],
        2
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = function (inject) {
        if (!inject) return
        inject("data-v-c425bd30_0", { source: ".dynamicScroller[data-v-c425bd30] {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  overflow: auto;\n}\n.dynamicScroller .col-view[data-v-c425bd30] {\n  will-change: transform;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.dynamicScroller .col-view[data-v-c425bd30],\n.dynamicScroller .row-view[data-v-c425bd30] {\n  will-change: transform;\n}\n", map: {"version":3,"sources":["C:\\Users\\lxw\\Desktop\\codework\\virtual-scroller\\src\\components\\virtual-scroller-table.vue","virtual-scroller-table.vue"],"names":[],"mappings":"AAqMA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;EACA,cAAA;ACpMA;ADqMA;EACA,sBAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;ACnMA;ADoMA;;EACA,sBAAA;ACjMA","file":"virtual-scroller-table.vue","sourcesContent":["<template>\r\n    <div class=\"dynamicScroller\" ref=\"scroller\" @scroll.passive=\"handleScroll\">\r\n        <slot name=\"before\"></slot>\r\n        <div class=\"wrapper\" :style=\"tableSize\">\r\n            <div\r\n                v-for=\"row of rowsPool\"\r\n                :key=\"row.id\"\r\n                class=\"row-view\"\r\n                :style=\"{\r\n                    transform: `  translate(0,${row.position}px)`,\r\n                }\"\r\n            >\r\n                <div\r\n                    v-for=\"col of colsPool\"\r\n                    :key=\"col.id\"\r\n                    :style=\"{\r\n                        transform: `  translate(${col.position}px,0)`,\r\n                    }\"\r\n                    class=\"col-view\"\r\n                >\r\n                    <slot\r\n                        :rowIndex=\"row.index\"\r\n                        :colIndex=\"col.index\"\r\n                        :height=\"row.item\"\r\n                        :width=\"col.item\"\r\n                        :active=\"col.used\"\r\n                    ></slot>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- <slot name=\"after\"></slot> -->\r\n    </div>\r\n</template>\r\n<script>\r\nimport * as scroll from '../utils/scroll.ts';\r\nimport * as math from '../utils/math.ts';\r\nlet uid = 0;\r\nexport default {\r\n    name: 'virtual-scroller-table',\r\n    props: {\r\n        cols: {\r\n            type: Array,\r\n            require: true,\r\n        },\r\n        rows: {\r\n            type: Array,\r\n            require: true,\r\n        },\r\n    },\r\n    components: {},\r\n    data() {\r\n        return {\r\n            rowsPool: [],\r\n            colsPool: [],\r\n            visibleRowsIndex: {\r\n                start: -1,\r\n                end: -1,\r\n            },\r\n            visibleColsIndex: {\r\n                start: -1,\r\n                end: -1,\r\n            },\r\n        };\r\n    },\r\n    methods: {\r\n        usedView(pool, viewIndex, items, itemsIndex, itemPosition) {\r\n            let view = {};\r\n            if (pool[viewIndex]) {\r\n                view = pool[viewIndex];\r\n                view.item = items[itemsIndex];\r\n                view.index = itemsIndex;\r\n                view.used = true;\r\n                view.position = itemPosition?.[itemsIndex - 1] ?? 0;\r\n            } else {\r\n                view = {\r\n                    item: items[itemsIndex],\r\n                    position: itemPosition?.[itemsIndex - 1] ?? 0,\r\n                    index: itemsIndex,\r\n                    id: uid++,\r\n                    used: true,\r\n                };\r\n                pool.push(view);\r\n            }\r\n            return view;\r\n        },\r\n        unusedView(view) {\r\n            view.item = undefined;\r\n            view.used = false;\r\n            view.position = -9999;\r\n            view.index = -1;\r\n        },\r\n        updateVisibleItems(direction) {\r\n            let start, end, pool, itemPosition, items;\r\n            if (direction === 'vertical') {\r\n                start = this.visibleRowsIndex.start;\r\n                end = this.visibleRowsIndex.end;\r\n                pool = this.rowsPool;\r\n                itemPosition = this.rowsPosition;\r\n                items = this.rows;\r\n            } else {\r\n                start = this.visibleColsIndex.start;\r\n                end = this.visibleColsIndex.end;\r\n                pool = this.colsPool;\r\n                itemPosition = this.colsPosition;\r\n                items = this.cols;\r\n            }\r\n            let viewIndex = 0;\r\n            //更新使用的view\r\n            for (let i = start; i <= end; i++) {\r\n                this.usedView(pool, viewIndex, items, i, itemPosition);\r\n                viewIndex++;\r\n            }\r\n            // 处理不使用的view\r\n            for (let i = viewIndex; i < pool.length; i++) {\r\n                this.unusedView(pool[i]);\r\n            }\r\n        },\r\n        handleScroll() {\r\n            let scroller = this.$refs.scroller;\r\n            this.$emit('scroll', { left: scroller.scrollLeft, top: scroller.scrollTop });\r\n            this.handleVisibilityChange();\r\n        },\r\n        handleVisibilityChange() {\r\n            let scroller = this.$refs.scroller;\r\n            this.visibleRowsIndex = scroll.findVisibleIndex(\r\n                scroller.scrollTop,\r\n                scroller.clientHeight,\r\n                this.rowsPosition,\r\n            );\r\n            this.visibleColsIndex = scroll.findVisibleIndex(\r\n                scroller.scrollLeft,\r\n                scroller.clientWidth,\r\n                this.colsPosition,\r\n            );\r\n        },\r\n    },\r\n\r\n    watch: {\r\n        visibleRowsIndex: {\r\n            deep: true,\r\n            handler() {\r\n                this.updateVisibleItems('vertical');\r\n            },\r\n        },\r\n        visibleColsIndex: {\r\n            deep: true,\r\n            handler() {\r\n                this.updateVisibleItems('horizontal');\r\n            },\r\n        },\r\n        rows: {\r\n            deep: true,\r\n            handler() {\r\n                this.handleVisibilityChange();\r\n            },\r\n        },\r\n        cols: {\r\n            deep: true,\r\n            handler() {\r\n                this.handleVisibilityChange();\r\n            },\r\n        },\r\n    },\r\n    computed: {\r\n        tableSize() {\r\n            return {\r\n                height: `${math.total(this.rows, 0, -1)}px`,\r\n                width: `${math.total(this.cols, 0, -1)}px`,\r\n            };\r\n        },\r\n        //长度缓存\r\n        colsPosition() {\r\n            let total = 0;\r\n            return this.cols.map((item) => {\r\n                total += item;\r\n                return total;\r\n            });\r\n        },\r\n        //高度缓存\r\n        rowsPosition() {\r\n            let total = 0;\r\n            return this.rows.map((item) => {\r\n                total += item;\r\n                return total;\r\n            });\r\n        },\r\n    },\r\n    mounted() {\r\n        window.addEventListener('resize', this.handleVisibilityChange);\r\n    },\r\n    beforeDestroy() {\r\n        window.removeEventListener('resize', this.handleVisibilityChange);\r\n    },\r\n};\r\n</script>\r\n\r\n<style lang=\"stylus\" scoped>\r\n.dynamicScroller\r\n    position relative;\r\n    height 100%\r\n    width 100%\r\n    overflow auto\r\n    .col-view\r\n        will-change: transform;\r\n        position: absolute;\r\n        top: 0;\r\n        left: 0;\r\n    .col-view,.row-view\r\n        will-change: transform;\r\n</style>\r\n",".dynamicScroller {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  overflow: auto;\n}\n.dynamicScroller .col-view {\n  will-change: transform;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.dynamicScroller .col-view,\n.dynamicScroller .row-view {\n  will-change: transform;\n}\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$1 = "data-v-c425bd30";
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        false,
        createInjector,
        undefined,
        undefined
      );

    var plugin = {
      install: function install(Vue) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        Vue.component("".concat(prefix, "VirtualScroller"), __vue_component__);
        Vue.component("".concat(prefix, "VirtualScrollerTable"), __vue_component__$1);
      }
    };

    exports.default = plugin;
    exports.virtualScroller = __vue_component__;
    exports.virtualScrollerTable = __vue_component__$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
