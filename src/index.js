import { replaceChildNode } from './utils';
import Processor from './processor';
import genRender from './render';
let _translate;
let _directive;
let _render;

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
    const processor = new Processor({ startTag, endTag });
    const render = genRender({ className, processor, VNode });
    _translate = i18n._translate;
    _directive = Vue.directive('t');
    _render = Vue.prototype._render;

    i18n._translate = function() {
      const result = _translate.apply(this, arguments);
      return processor.serialize(arguments[3], result);
    };

    Vue.prototype._render = function() {
      const vnode = _render.apply(this, arguments);
      return render.call(this, vnode);
    };

    // Vue.directive('t', {
    //   bind(el) {
    //     _directive.bind.apply(this, arguments);
    //     replaceChildNode(el, undefined, el._vt, processor, className);
    //   },
    //   update(el) {
    //     _directive.update.apply(this, arguments);
    //     replaceChildNode(el, undefined, el._vt, processor, className);
    //   }
    // });
  }
};
