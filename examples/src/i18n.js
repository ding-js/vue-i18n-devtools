import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  zh: {
    functional: '函数式组件',
    directive: '使用指令',
    computed: '使用计算属性',
    customAttribute: '自定义 HTML 属性，如 data-custom-attribute',
    specialCharacters: '特殊字符: /\\~!@#$%^&*()_+\'"|{};<>?',
    html: 'HTML 转义: <h1>HTML</h1>',
    concat: {
      label: '字符串拼接',
      node: '我是第 {0} 个文本节点'
    },
    form: {
      select: '一些特殊的元素不会被高亮，如 <option>',
      options: {
        0: '选项 0',
        1: '选项 1',
        2: '选项 2'
      },
      placeholder: '输入框 placeholder'
    },
    component: '组件'
  },
  en: {
    functional: 'Functional component',
    devtools: 'Devtools',
    directive: 'Use v-t directive',
    computed: 'Use computed',
    customAttribute: 'Custom HTML attribute e.g. data-custom-attribute',
    specialCharacters: 'Special characters: /\\~!@#$%^&*()_+\'"|{};<>?',
    html: 'Escape HTML: <h1>HTML</h1>',
    concat: {
      label: 'String concatenation',
      node: "I'm No.{0} text node"
    },
    form: {
      select: 'Some special element will not be highlighted e.g. <option>',
      options: {
        0: 'option 0',
        1: 'option 1',
        2: 'option 2'
      },
      placeholder: 'Input placeholder'
    },
    component: 'Component'
  }
};

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;
