export default {
  name: 'List',
  render(h) {
    return (
      <ul class="vue-i18n-devtools__list">
        <li v-t="directive" />
        <li>{this.computedValue}</li>
        <li>Text node: {this.$t('node')}</li>
        <li data-custom-attribute={this.$t('customAttribute')} v-t="customAttribute" />
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
