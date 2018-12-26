import Vue from 'vue';
import VueI18n from 'vue-i18n';
import List from './components/List';
import messages from './i18n/locales';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
});

new Vue({
  i18n,
  el: '#origin',
  render(h) {
    return (
      <div>
        <h2>Origin output</h2>
        <List title="functional" />
      </div>
    );
  }
});

document.addEventListener('change', e => {
  const target = e.target;
  if (target.tagName === 'INPUT' && target.type === 'radio' && target.name === 'language') {
    i18n.locale = target.value;
  }
});
