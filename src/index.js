import mixin from './mixin';
let t;

export default {
  install(Vue, { i18n, startTag = '<% ', endTag = ' %>' }) {
    if (!i18n || !i18n._translate) return;
    t = i18n._translate;
    i18n._translate = function() {
      const result = t.apply(this, arguments);
      return startTag + result + endTag;
    };
    Vue.mixin(
      mixin({
        startTag,
        endTag
      })
    );
  }
};
