import { Processor, replaceChildNode } from './utils';
import warp from './wrap';
let translate;
let render;
let directive;

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
    const processor = new Processor({ startTag, endTag, className });
    const extras = [];

    translate = i18n._translate;
    render = Vue.prototype._render;
    directive = Vue.directive('t');

    i18n._translate = function() {
      const result = translate.apply(this, arguments);
      return processor.serialize(arguments[3], result);
    };

    Vue.prototype._render = function() {
      const vnode = render.apply(this._renderProxy, arguments);

      return warp({
        vm: this,
        vnode,
        extras,
        processor
      });
    };

    Vue.directive('t', {
      bind(el) {
        directive.bind.apply(null, arguments);
        replaceChildNode(el, undefined, el._vt, processor);
      },
      update(el) {
        directive.update.apply(null, arguments);
        replaceChildNode(el, undefined, el._vt, processor);
      }
    });
  }
};
