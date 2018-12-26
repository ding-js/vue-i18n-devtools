import Vue from 'vue';
import VueI18n from 'vue-i18n';
import List from './components/List';
import Action from './components/Action';
import messages from './i18n/locales';

Vue.use(VueI18n);

if (window.__VUE_I18N_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_I18N_DEVTOOLS_GLOBAL_HOOK__.init(Vue, VueI18n);
}

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

new Vue({
  i18n,
  el: '#devtools',
  render(h) {
    return (
      <div>
        <Action />
        <h2>Devtools output</h2>
        <List title="functional" />
      </div>
    );
  }
});
