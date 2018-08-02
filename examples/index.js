import Vue from 'vue';
import VueI18n from 'vue-i18n';
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
    customAttribute: 'Custom attribute'
  }
};

const i18n = new VueI18n({
  locale: 'en',
  messages
});

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
