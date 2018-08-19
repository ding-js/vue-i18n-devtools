import { replaceChildNode } from './utils';
import Processor from './processor';
import genCreateElement from './create-element';
let _translate;
let _directive;
let _constructor;

const defaultOptions = {
  i18n: null,
  startTag: '<% ',
  endTag: ' %>',
  className: 'i18n-devtools__mark'
};

export default {
  install(Vue, options) {
    const { i18n, startTag, endTag, className } = {
      ...defaultOptions,
      ...options
    };
    if (!i18n || !i18n._translate) return;
    const VNode = new Vue().$createElement().constructor;
    console.dir(VNode);

    const processor = new Processor({ startTag, endTag });
    const h = genCreateElement({ className, processor });

    _translate = i18n._translate;
    _directive = Vue.directive('t');
    _constructor = VNode.constructor;

    i18n._translate = function() {
      const result = _translate.apply(this, arguments);
      return processor.serialize(arguments[3], result);
    };

    // VNode.constructor = function() {
    //   console.log(arguments);
    //   return _constructor.apply(this, arguments);
    // };

    // Vue.mixin({
    //   beforeCreate() {
    //     const vm = this;
    //     const createElement = vm.$createElement;
    //     vm.$createElement = function() {
    //       return h({
    //         vm,
    //         createElement,
    //         args: arguments
    //       });
    //     };
    //   }
    // });

    Vue.directive('t', {
      bind(el) {
        _directive.bind.apply(this, arguments);
        replaceChildNode(el, undefined, el._vt, processor, className);
      },
      update(el) {
        _directive.update.apply(this, arguments);
        replaceChildNode(el, undefined, el._vt, processor, className);
      }
    });
  }
};
