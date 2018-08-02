import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueI8nDevtools from '../src';
import List from './List';

Vue.use(VueI18n);

const messages = {
  zh: {},
  en: {
    directive: 'Use v-t directive',
    computed: 'Use computed',
    node: "I'm a text node",
    value: 'Input value',
    placeholder: 'Input placeholder',
    customAttribute: 'Custom attribute',
    specialCharacters: 'special characters: /\\~!@#$%^&*()_+\'"'
  }
};

const i18n = new VueI18n({
  locale: 'en',
  messages
});

Vue.use(VueI8nDevtools, { i18n });

new Vue({
  i18n,
  el: '#origin',
  render: h => h(List)
});

new Vue({
  i18n,
  el: '#devtools',
  render: h => h(List)
});
