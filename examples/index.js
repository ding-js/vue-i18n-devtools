import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueI8nDevtools from '../src';
import List from './List';

Vue.use(VueI18n);

const messages = {
  zh: {},
  en: {
    functional: 'Functional component',
    devtools: 'Devtools',
    directive: 'Use v-t directive',
    computed: 'Use computed',
    node: "I'm a text node",
    customAttribute: 'Custom attribute',
    specialCharacters: 'special characters: /\\~!@#$%^&*()_+\'"',
    html: '<h1>html tag</h1>',
    form: {
      select: '<option> will not be highlighted',
      options: {
        0: 'option 0',
        1: 'option 1',
        2: 'option 2'
      },
      placeholder: 'Input placeholder'
    }
  }
};

const i18n = new VueI18n({
  locale: 'en',
  messages
});

Vue.use(VueI8nDevtools, {
  i18n,
  attrs: ['placeholder', 'title', 'data-custom-attribute']
});

new Vue({
  i18n,
  el: '#devtools',
  render: h => h(List, { props: { title: 'functional' } })
});
