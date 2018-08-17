import Vue from 'vue';
import VueI8nDevtools from '../../src';
import List from './components/List';
import Action from './components/Action';
import i18n from './i18n';

Vue.use(VueI8nDevtools, {
  i18n
});

new Vue({
  i18n,
  el: '#devtools',
  render(h) {
    return (
      <div>
        <Action />
        <h2>Use devtools</h2>
        <List title="functional" />
      </div>
    );
  }
});
