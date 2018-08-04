import mixin from './mixin';
let t;

const defaultOptions = {
  i18n: null,
  startTag: '<% ',
  endTag: ' %>',
  props: ['value'],
  attrs: ['placeholder', 'title'],
  className: 'i18n-devtools__mark'
};

export default {
  install(Vue, options) {
    const { i18n, startTag, endTag, props, attrs, className } = {
      ...defaultOptions,
      ...options
    };
    if (!i18n || !i18n._translate) return;
    const extras = [];

    props.forEach(p => extras.push({ type: 'prop', name: p }));
    attrs.forEach(a => extras.push({ type: 'attr', name: a }));

    t = i18n._translate;
    i18n._translate = function() {
      const result = t.apply(this, arguments);
      return startTag + arguments[3] + '|' + result + endTag;
    };
    Vue.mixin(
      mixin({
        startTag,
        endTag,
        extras,
        className
      })
    );
  }
};
