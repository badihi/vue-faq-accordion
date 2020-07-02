(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue2-transitions')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue2-transitions'], factory) :
  (global = global || self, factory(global.VueFaqAccordion = {}, global.vue2Transitions));
}(this, (function (exports, vue2Transitions) { 'use strict';

  //

  var script = {
    name: 'VueFaqAccordion',

    components: {
      CollapseTransition: vue2Transitions.CollapseTransition
    },

    data: function data () {
      return {
        activeTab: '',
        activeQuestionIndex: null,
        showAccordion: true
      }
    },

    props: {
      /**
       * Array of items
       * Object style {questionProperty: string, answerProperty: string, tabName: string}
       * You can change object keys names using other props (questionProperty, answerProperty, tabName)
       */
      items: {
        type: Array,
        required: true
      },
      /**
       * Key name of object in items array for specifying title of question
       */
      questionProperty: {
        type: String,
        default: 'title'
      },
      /**
       * Key name of object in items array for specifying content text of open question
       */
      answerProperty: {
        type: String,
        default: 'value'
      },
      /**
       * Key name of object in items array for specifying navigation tab name
       */
      tabName: {
        type: String,
        default: 'category'
      },
      /**
       * Color for hover and active tab/question
       * possible values: 'red', '#F00', 'rgb(255, 0, 0)'
       */
      activeColor: {
        type: String,
        default: '#D50000'
      },
      /**
       * Color for borders
       */
      borderColor: {
        type: String,
        default: '#9E9E9E'
      },
      /**
       * Color for fonts
       */
      fontColor: {
        type: String,
        default: '#000000'
      },
      /**
       * Opened by default tabName (category)
       */
      initialTab: {
        type: String,
        default: null
      },
      /**
       * Opened by default question
       * All closed by default
       */
      initialQuestionIndex: {
        type: Number,
        default: null
      }
    },

    computed: {
      categories: function categories () {
        var this$1 = this;

        var uniqueCategories = this.items
          .map(function (item) { return item[this$1.tabName]; })
          .filter(function (category, index, categories) { return categories.indexOf(category) === index; });
        this.activeTab = this.initialTab || uniqueCategories[0];
        this.activeQuestionIndex = this.initialQuestionIndex || null;
        return uniqueCategories
      },
      categoryItems: function categoryItems () {
        var this$1 = this;

        return this.items
          .filter(function (item) { return item[this$1.tabName] === this$1.activeTab; })
      },
      hasNavigation: function hasNavigation () {
        return !!this.categories[0]
      }
    },

    methods: {
      makeActive: function makeActive (itemIndex) {
        this.activeQuestionIndex = this.activeQuestionIndex === itemIndex ? null : itemIndex;
        this.$emit('itemSelect', { itemIndex: itemIndex });
      },
      generateButtonClasses: function generateButtonClasses (buttonIndex) {
        return [
          'accordion__toggle-button',
          this.activeQuestionIndex === buttonIndex
            ? 'accordion__toggle-button_active'
            : null
        ]
      },
      generateQuestionClasses: function generateQuestionClasses (questionIndex) {
        return [
          'accordion__title',
          this.activeQuestionIndex === questionIndex
            ? 'accordion__title_active'
            : null
        ]
      },
      makeActiveCategory: function makeActiveCategory (category, categoryIndex) {
        var this$1 = this;

        if (this.activeTab === category) { return }

        this.showAccordion = false;
        this.activeTab = category;
        this.activeQuestionIndex = null;
        setTimeout( function () {
          this$1.$emit('categorySelect', { categoryIndex: categoryIndex });
          this$1.showAccordion = true;
        }, 300 );
      },
      generateCategoryClasses: function generateCategoryClasses (category) {
        return [
          'faq__nav-item',
          this.activeTab === category
            ? 'faq__nav-item_active'
            : null
        ]
      }
    },

    mounted: function mounted () {
      this.$refs.rootEl.style.setProperty('--active-color', this.activeColor);
      this.$refs.rootEl.style.setProperty('--border-color', this.borderColor);
      this.$refs.rootEl.style.setProperty('--font-color', this.fontColor);
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
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
      var hook;
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
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
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
                  { style.element.setAttribute('media', css.media); }
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
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("section", { ref: "rootEl", staticClass: "faq" }, [
      _c(
        "div",
        { staticClass: "faq-wrapper" },
        [
          _vm.hasNavigation
            ? _c(
                "nav",
                { staticClass: "faq__nav" },
                _vm._l(_vm.categories, function(category, i) {
                  return _c("div", {
                    key: "category-" + i,
                    class: _vm.generateCategoryClasses(category),
                    domProps: { innerHTML: _vm._s(category) },
                    on: {
                      click: function($event) {
                        return _vm.makeActiveCategory(category, i)
                      }
                    }
                  })
                }),
                0
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "transition",
            { attrs: { name: "accordion-fade-slide", mode: "out-in" } },
            [
              _vm.showAccordion
                ? _c(
                    "div",
                    { staticClass: "accordion" },
                    _vm._l(_vm.categoryItems, function(item, i) {
                      return _c(
                        "div",
                        {
                          key: "accordion-item-" + i,
                          staticClass: "accordion__item"
                        },
                        [
                          _c(
                            "div",
                            {
                              class: _vm.generateQuestionClasses(i),
                              on: {
                                click: function($event) {
                                  return _vm.makeActive(i)
                                }
                              }
                            },
                            [
                              _c("p", {
                                staticClass: "accordion__title-text",
                                domProps: {
                                  innerHTML: _vm._s(item[_vm.questionProperty])
                                }
                              }),
                              _vm._v(" "),
                              _c("button", {
                                class: _vm.generateButtonClasses(i)
                              })
                            ]
                          ),
                          _vm._v(" "),
                          _c("collapse-transition", [
                            i === _vm.activeQuestionIndex
                              ? _c("div", [
                                  _c(
                                    "div",
                                    { staticClass: "accordion__value" },
                                    [
                                      _vm._t(
                                        "default",
                                        [
                                          _c("div", {
                                            domProps: {
                                              innerHTML: _vm._s(
                                                item[_vm.answerProperty]
                                              )
                                            }
                                          })
                                        ],
                                        null,
                                        item
                                      )
                                    ],
                                    2
                                  )
                                ])
                              : _vm._e()
                          ])
                        ],
                        1
                      )
                    }),
                    0
                  )
                : _vm._e()
            ]
          )
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-6658d8f5_0", { source: "*[data-v-6658d8f5] {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\nbutton[data-v-6658d8f5] {\n  border: none;\n  background: none;\n  outline: none;\n}\n.faq[data-v-6658d8f5] {\n  width: 100%;\n  padding: 0 10px;\n}\n.faq-wrapper[data-v-6658d8f5] {\n  max-width: 825px;\n}\n.faq__title[data-v-6658d8f5] {\n  text-align: center;\n  margin-bottom: 25px;\n}\n.faq__nav[data-v-6658d8f5] {\n  display: flex;\n  justify-content: space-between;\n  border: 2px solid var(--border-color);\n  border-radius: 5px;\n}\n.faq__nav-item[data-v-6658d8f5] {\n  height: 60px;\n  flex: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-right: 2px solid var(--border-color);\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.3s;\n  text-align: center;\n  user-select: none;\n  color: var(--font-color);\n}\n.faq__nav-item_active[data-v-6658d8f5] {\n  color: var(--active-color);\n}\n.faq__nav-item[data-v-6658d8f5]:hover {\n  color: var(--active-color);\n}\n.faq__nav-item[data-v-6658d8f5]:last-child {\n  border-right: none;\n}\n.faq__accordion[data-v-6658d8f5] {\n  min-height: 250px;\n}\n.accordion-fade-slide-enter-active[data-v-6658d8f5], .accordion-fade-slide-leave-active[data-v-6658d8f5] {\n  transition: all 0.3s;\n}\n.accordion-fade-slide-enter[data-v-6658d8f5] {\n  transform: translateY(-25px);\n  opacity: 0;\n}\n.accordion-fade-slide-leave-to[data-v-6658d8f5] {\n  transform: translateY(25px);\n  opacity: 0;\n}\n.accordion[data-v-6658d8f5] {\n  border: 2px solid var(--border-color);\n  border-radius: 5px;\n  margin-top: 15px;\n}\n.accordion__item[data-v-6658d8f5] {\n  border-bottom: 2px solid var(--border-color);\n}\n.accordion__item[data-v-6658d8f5]:last-child {\n  border-bottom: none;\n}\n.accordion__title[data-v-6658d8f5] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 25px;\n  cursor: pointer;\n  transition: all 0.3s;\n  color: var(--font-color);\n}\n.accordion__title_active[data-v-6658d8f5] {\n  color: var(--active-color);\n}\n.accordion__title[data-v-6658d8f5]:hover {\n  color: var(--active-color);\n}\n.accordion__title:hover .accordion__toggle-button[data-v-6658d8f5]::before, .accordion__title:hover .accordion__toggle-button[data-v-6658d8f5]::after {\n  background: var(--active-color);\n}\n.accordion__title-text[data-v-6658d8f5] {\n  margin-right: 10px;\n}\n.accordion__value[data-v-6658d8f5] {\n  padding: 0 25px 25px 25px;\n  text-align: left;\n  color: var(--font-color);\n}\n.accordion__toggle-button[data-v-6658d8f5] {\n  position: relative;\n  width: 16px;\n  height: 16px;\n  transition: all 0.3s;\n  transform-origin: 50% 50%;\n  padding-left: 16px;\n  cursor: pointer;\n}\n.accordion__toggle-button[data-v-6658d8f5]::before, .accordion__toggle-button[data-v-6658d8f5]::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  transition: all 0.3s;\n  background: black;\n}\n.accordion__toggle-button[data-v-6658d8f5]::before {\n  transform: rotate(90deg);\n}\n.accordion__toggle-button_active[data-v-6658d8f5] {\n  transform: rotate(45deg);\n}\n.accordion__toggle-button_active[data-v-6658d8f5]::before, .accordion__toggle-button_active[data-v-6658d8f5]::after {\n  background: var(--active-color);\n}\n\n/*# sourceMappingURL=vue-faq-accordion.vue.map */", map: {"version":3,"sources":["C:\\Users\\Ahmad\\Documents\\Airline\\repo\\vue-faq-accordion\\src\\vue-faq-accordion.vue","vue-faq-accordion.vue"],"names":[],"mappings":"AAqMA;EACA,sBAAA;EACA,SAAA;EACA,UAAA;ACpMA;ADuMA;EACA,YAAA;EACA,gBAAA;EACA,aAAA;ACpMA;ADuMA;EACA,WAAA;EACA,eAAA;ACpMA;ADsMA;EACA,gBAAA;ACpMA;ADuMA;EACA,kBAAA;EACA,mBAAA;ACrMA;ADwMA;EACA,aAAA;EACA,8BAAA;EACA,qCAAA;EACA,kBAAA;ACtMA;ADyMA;EACA,YAAA;EACA,OAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,2CAAA;EACA,eAAA;EACA,gBAAA;EACA,oBAAA;EACA,kBAAA;EACA,iBAAA;EACA,wBAAA;ACvMA;ADyMA;EACA,0BAAA;ACvMA;AD0MA;EACA,0BAAA;ACxMA;AD2MA;EACA,kBAAA;ACzMA;AD6MA;EACA,iBAAA;AC3MA;ADgNA;EAEA,oBAAA;AC9MA;ADgNA;EACA,4BAAA;EACA,UAAA;AC9MA;ADgNA;EACA,2BAAA;EACA,UAAA;AC9MA;ADkNA;EACA,qCAAA;EACA,kBAAA;EACA,gBAAA;AC/MA;ADiNA;EACA,4CAAA;AC/MA;ADiNA;EACA,mBAAA;AC/MA;ADmNA;EACA,aAAA;EACA,8BAAA;EACA,mBAAA;EACA,aAAA;EACA,eAAA;EACA,oBAAA;EACA,wBAAA;ACjNA;ADmNA;EACA,0BAAA;ACjNA;ADoNA;EACA,0BAAA;AClNA;ADqNA;EAEA,+BAAA;ACpNA;ADyNA;EACA,kBAAA;ACvNA;AD2NA;EACA,yBAAA;EACA,gBAAA;EACA,wBAAA;ACzNA;AD4NA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,oBAAA;EACA,yBAAA;EACA,kBAAA;EACA,eAAA;AC1NA;AD4NA;EAEA,WAAA;EACA,kBAAA;EACA,OAAA;EACA,WAAA;EACA,WAAA;EACA,oBAAA;EACA,iBAAA;AC3NA;AD8NA;EACA,wBAAA;AC5NA;AD+NA;EACA,wBAAA;AC7NA;AD+NA;EAEA,+BAAA;AC9NA;;AAEA,gDAAgD","file":"vue-faq-accordion.vue","sourcesContent":["<template>\r\n<section class=\"faq\" ref=\"rootEl\">\r\n  <div class=\"faq-wrapper\">\r\n    <nav v-if=\"hasNavigation\" class=\"faq__nav\">\r\n      <div\r\n        v-for=\"(category, i) in categories\"\r\n        :key=\"`category-${i}`\"\r\n        v-html=\"category\"\r\n        :class=\"generateCategoryClasses(category)\"\r\n        @click=\"makeActiveCategory(category, i)\"\r\n      ></div>\r\n    </nav>\r\n\r\n    <transition name=\"accordion-fade-slide\" mode=\"out-in\">\r\n      <div v-if=\"showAccordion\" class=\"accordion\">\r\n        <div\r\n          class=\"accordion__item\"\r\n          v-for=\"(item, i) in categoryItems\"\r\n          :key=\"`accordion-item-${i}`\"\r\n        >\r\n          <div :class=\"generateQuestionClasses(i)\" @click=\"makeActive(i)\">\r\n            <p class=\"accordion__title-text\" v-html=\"item[questionProperty]\"></p>\r\n            <button :class=\"generateButtonClasses(i)\"></button>\r\n          </div>\r\n            <collapse-transition>\r\n              <div v-if=\"i === activeQuestionIndex\">\r\n                  <div class=\"accordion__value\">\r\n                    <slot v-bind=\"item\">\r\n                      <div v-html=\"item[answerProperty]\"></div>\r\n                    </slot>\r\n                  </div>\r\n              </div>\r\n            </collapse-transition>\r\n        </div>\r\n      </div>\r\n    </transition>\r\n  </div>\r\n</section>\r\n</template>\r\n\r\n<script>\r\n  import { CollapseTransition } from 'vue2-transitions'\r\n\r\n  export default {\r\n    name: 'VueFaqAccordion',\r\n\r\n    components: {\r\n      CollapseTransition\r\n    },\r\n\r\n    data () {\r\n      return {\r\n        activeTab: '',\r\n        activeQuestionIndex: null,\r\n        showAccordion: true\r\n      }\r\n    },\r\n\r\n    props: {\r\n      /**\r\n       * Array of items\r\n       * Object style {questionProperty: string, answerProperty: string, tabName: string}\r\n       * You can change object keys names using other props (questionProperty, answerProperty, tabName)\r\n       */\r\n      items: {\r\n        type: Array,\r\n        required: true\r\n      },\r\n      /**\r\n       * Key name of object in items array for specifying title of question\r\n       */\r\n      questionProperty: {\r\n        type: String,\r\n        default: 'title'\r\n      },\r\n      /**\r\n       * Key name of object in items array for specifying content text of open question\r\n       */\r\n      answerProperty: {\r\n        type: String,\r\n        default: 'value'\r\n      },\r\n      /**\r\n       * Key name of object in items array for specifying navigation tab name\r\n       */\r\n      tabName: {\r\n        type: String,\r\n        default: 'category'\r\n      },\r\n      /**\r\n       * Color for hover and active tab/question\r\n       * possible values: 'red', '#F00', 'rgb(255, 0, 0)'\r\n       */\r\n      activeColor: {\r\n        type: String,\r\n        default: '#D50000'\r\n      },\r\n      /**\r\n       * Color for borders\r\n       */\r\n      borderColor: {\r\n        type: String,\r\n        default: '#9E9E9E'\r\n      },\r\n      /**\r\n       * Color for fonts\r\n       */\r\n      fontColor: {\r\n        type: String,\r\n        default: '#000000'\r\n      },\r\n      /**\r\n       * Opened by default tabName (category)\r\n       */\r\n      initialTab: {\r\n        type: String,\r\n        default: null\r\n      },\r\n      /**\r\n       * Opened by default question\r\n       * All closed by default\r\n       */\r\n      initialQuestionIndex: {\r\n        type: Number,\r\n        default: null\r\n      }\r\n    },\r\n\r\n    computed: {\r\n      categories () {\r\n        const uniqueCategories = this.items\r\n          .map(item => item[this.tabName])\r\n          .filter((category, index, categories) => categories.indexOf(category) === index)\r\n        this.activeTab = this.initialTab || uniqueCategories[0]\r\n        this.activeQuestionIndex = this.initialQuestionIndex || null\r\n        return uniqueCategories\r\n      },\r\n      categoryItems () {\r\n        return this.items\r\n          .filter(item => item[this.tabName] === this.activeTab)\r\n      },\r\n      hasNavigation () {\r\n        return !!this.categories[0]\r\n      }\r\n    },\r\n\r\n    methods: {\r\n      makeActive (itemIndex) {\r\n        this.activeQuestionIndex = this.activeQuestionIndex === itemIndex ? null : itemIndex\r\n        this.$emit('itemSelect', { itemIndex })\r\n      },\r\n      generateButtonClasses (buttonIndex) {\r\n        return [\r\n          'accordion__toggle-button',\r\n          this.activeQuestionIndex === buttonIndex\r\n            ? 'accordion__toggle-button_active'\r\n            : null\r\n        ]\r\n      },\r\n      generateQuestionClasses (questionIndex) {\r\n        return [\r\n          'accordion__title',\r\n          this.activeQuestionIndex === questionIndex\r\n            ? 'accordion__title_active'\r\n            : null\r\n        ]\r\n      },\r\n      makeActiveCategory (category, categoryIndex) {\r\n        if (this.activeTab === category) return\r\n\r\n        this.showAccordion = false\r\n        this.activeTab = category\r\n        this.activeQuestionIndex = null\r\n        setTimeout( () => {\r\n          this.$emit('categorySelect', { categoryIndex })\r\n          this.showAccordion = true\r\n        }, 300 )\r\n      },\r\n      generateCategoryClasses (category) {\r\n        return [\r\n          'faq__nav-item',\r\n          this.activeTab === category\r\n            ? 'faq__nav-item_active'\r\n            : null\r\n        ]\r\n      }\r\n    },\r\n\r\n    mounted () {\r\n      this.$refs.rootEl.style.setProperty('--active-color', this.activeColor)\r\n      this.$refs.rootEl.style.setProperty('--border-color', this.borderColor)\r\n      this.$refs.rootEl.style.setProperty('--font-color', this.fontColor)\r\n    }\r\n  }\r\n</script>\r\n\r\n<style lang=\"scss\" scoped>\r\n  * {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n  }\r\n\r\n  button {\r\n    border: none;\r\n    background: none;\r\n    outline: none;\r\n  }\r\n\r\n  .faq {\r\n    width: 100%;\r\n    padding: 0 10px;\r\n\r\n    &-wrapper {\r\n      max-width: 825px;\r\n    }\r\n\r\n    &__title {\r\n      text-align: center;\r\n      margin-bottom: 25px;\r\n    }\r\n\r\n    &__nav {\r\n      display: flex;\r\n      justify-content: space-between;\r\n      border: 2px solid var(--border-color);\r\n      border-radius: 5px;\r\n    }\r\n\r\n    &__nav-item {\r\n      height: 60px;\r\n      flex: 1;\r\n      display: flex;\r\n      justify-content: center;\r\n      align-items: center;\r\n      border-right: 2px solid var(--border-color);\r\n      cursor: pointer;\r\n      font-weight: 600;\r\n      transition: all 0.3s;\r\n      text-align: center;\r\n      user-select: none;\r\n      color: var(--font-color);\r\n\r\n      &_active {\r\n        color: var(--active-color);\r\n      }\r\n\r\n      &:hover {\r\n        color: var(--active-color);\r\n      }\r\n\r\n      &:last-child {\r\n        border-right: none;\r\n      }\r\n    }\r\n\r\n    &__accordion {\r\n      min-height: 250px;\r\n    }\r\n  }\r\n\r\n  .accordion-fade-slide {\r\n    &-enter-active,\r\n    &-leave-active {\r\n      transition: all 0.3s;\r\n    }\r\n    &-enter {\r\n      transform: translateY(-25px);\r\n      opacity: 0;\r\n    }\r\n    &-leave-to {\r\n      transform: translateY(25px);\r\n      opacity: 0;\r\n    }\r\n  }\r\n\r\n  .accordion {\r\n    border: 2px solid var(--border-color);\r\n    border-radius: 5px;\r\n    margin-top: 15px;\r\n\r\n    &__item {\r\n      border-bottom: 2px solid var(--border-color);\r\n\r\n      &:last-child {\r\n        border-bottom: none;\r\n      }\r\n    }\r\n\r\n    &__title {\r\n      display: flex;\r\n      justify-content: space-between;\r\n      align-items: center;\r\n      padding: 25px;\r\n      cursor: pointer;\r\n      transition: all 0.3s;\r\n      color: var(--font-color);\r\n\r\n      &_active {\r\n        color: var(--active-color);\r\n      }\r\n\r\n      &:hover {\r\n        color: var(--active-color);\r\n\r\n        .accordion__toggle-button {\r\n          &::before,\r\n          &::after {\r\n            background: var(--active-color);\r\n          }\r\n        }\r\n      }\r\n\r\n      &-text {\r\n        margin-right: 10px;\r\n      }\r\n    }\r\n\r\n    &__value {\r\n      padding: 0 25px 25px 25px;\r\n      text-align: left;\r\n      color: var(--font-color);\r\n    }\r\n\r\n    &__toggle-button {\r\n      position: relative;\r\n      width: 16px;\r\n      height: 16px;\r\n      transition: all 0.3s;\r\n      transform-origin: 50% 50%;\r\n      padding-left: 16px;\r\n      cursor: pointer;\r\n\r\n      &::before,\r\n      &::after {\r\n        content: '';\r\n        position: absolute;\r\n        left: 0;\r\n        width: 100%;\r\n        height: 2px;\r\n        transition: all 0.3s;\r\n        background: black;\r\n      }\r\n\r\n      &::before {\r\n        transform: rotate(90deg);\r\n      }\r\n\r\n      &_active {\r\n        transform: rotate(45deg);\r\n\r\n        &::before,\r\n        &::after {\r\n          background: var(--active-color);\r\n        }\r\n      }\r\n    }\r\n  }\r\n</style>\r\n","* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbutton {\n  border: none;\n  background: none;\n  outline: none;\n}\n\n.faq {\n  width: 100%;\n  padding: 0 10px;\n}\n.faq-wrapper {\n  max-width: 825px;\n}\n.faq__title {\n  text-align: center;\n  margin-bottom: 25px;\n}\n.faq__nav {\n  display: flex;\n  justify-content: space-between;\n  border: 2px solid var(--border-color);\n  border-radius: 5px;\n}\n.faq__nav-item {\n  height: 60px;\n  flex: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-right: 2px solid var(--border-color);\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.3s;\n  text-align: center;\n  user-select: none;\n  color: var(--font-color);\n}\n.faq__nav-item_active {\n  color: var(--active-color);\n}\n.faq__nav-item:hover {\n  color: var(--active-color);\n}\n.faq__nav-item:last-child {\n  border-right: none;\n}\n.faq__accordion {\n  min-height: 250px;\n}\n\n.accordion-fade-slide-enter-active, .accordion-fade-slide-leave-active {\n  transition: all 0.3s;\n}\n.accordion-fade-slide-enter {\n  transform: translateY(-25px);\n  opacity: 0;\n}\n.accordion-fade-slide-leave-to {\n  transform: translateY(25px);\n  opacity: 0;\n}\n\n.accordion {\n  border: 2px solid var(--border-color);\n  border-radius: 5px;\n  margin-top: 15px;\n}\n.accordion__item {\n  border-bottom: 2px solid var(--border-color);\n}\n.accordion__item:last-child {\n  border-bottom: none;\n}\n.accordion__title {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 25px;\n  cursor: pointer;\n  transition: all 0.3s;\n  color: var(--font-color);\n}\n.accordion__title_active {\n  color: var(--active-color);\n}\n.accordion__title:hover {\n  color: var(--active-color);\n}\n.accordion__title:hover .accordion__toggle-button::before, .accordion__title:hover .accordion__toggle-button::after {\n  background: var(--active-color);\n}\n.accordion__title-text {\n  margin-right: 10px;\n}\n.accordion__value {\n  padding: 0 25px 25px 25px;\n  text-align: left;\n  color: var(--font-color);\n}\n.accordion__toggle-button {\n  position: relative;\n  width: 16px;\n  height: 16px;\n  transition: all 0.3s;\n  transform-origin: 50% 50%;\n  padding-left: 16px;\n  cursor: pointer;\n}\n.accordion__toggle-button::before, .accordion__toggle-button::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  transition: all 0.3s;\n  background: black;\n}\n.accordion__toggle-button::before {\n  transform: rotate(90deg);\n}\n.accordion__toggle-button_active {\n  transform: rotate(45deg);\n}\n.accordion__toggle-button_active::before, .accordion__toggle-button_active::after {\n  background: var(--active-color);\n}\n\n/*# sourceMappingURL=vue-faq-accordion.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-6658d8f5";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent(
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

  // Import vue component

  // install function executed by Vue.use()
  function install(Vue) {
  	if (install.installed) { return; }
  	install.installed = true;
  	Vue.component('VueFaqAccordion', __vue_component__);
  }

  // Create module definition for Vue.use()
  var plugin = {
  	install: install,
  };

  // To auto-install when vue is found
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
  	GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue = global.Vue;
  }
  if (GlobalVue) {
  	GlobalVue.use(plugin);
  }

  // It's possible to expose named exports when writing components that can
  // also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
  // export const RollupDemoDirective = component;

  exports.default = __vue_component__;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
