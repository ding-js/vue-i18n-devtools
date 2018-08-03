import ListTitle from './ListTitle';

export default {
  name: 'List',
  props: {
    title: String
  },
  render(h) {
    return (
      <ul class="vue-i18n-devtools__list">
        <ListTitle title={this.$t(this.title)} />
        <li v-t="directive" />
        <li>{this.computedValue}</li>
        <li>Text node: {this.$t('node')}</li>
        <li data-custom-attribute={this.$t('customAttribute')} v-t="customAttribute" />
        <li v-t="specialCharacters" />
        <li>
          <input type="text" value={this.$t('value')} />
        </li>
        <li>
          <input type="text" readonly placeholder={this.$t('placeholder')} />
        </li>
      </ul>
    );
  },
  computed: {
    computedValue() {
      return this.$t('computed');
    }
  }
};
