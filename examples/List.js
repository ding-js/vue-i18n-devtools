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
        <li>Text node: {this.$t('node')} - {this.$t('node')} too</li>
        <li data-custom-attribute={this.$t('customAttribute')} v-t="customAttribute" />
        <li v-t="specialCharacters" />
        <li v-t="html" />
        <li>
          <label v-t="form.select" />
          <select name="select">
            <option value="0">{this.$t('form.options.0')}</option>
            <option value="1">{this.$t('form.options.1')}</option>
            <option value="2">{this.$t('form.options.2')}</option>
          </select>
        </li>
        <li>
          <input type="text" readonly placeholder={this.$t('form.placeholder')} />
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
