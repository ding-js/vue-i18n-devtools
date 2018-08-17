import Vue from 'vue';
import List from './components/List';
import i18n from './i18n';

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
