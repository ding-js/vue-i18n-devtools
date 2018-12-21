import ListTitle from './ListTitle';
import Button from './Button';

export default {
  name: 'List',
  props: {
    title: String
  },
  render(h) {
    return (
      <ul class="vue-i18n-devtools__list">
        <ListTitle title={this.$t(this.title)} handleOnClick={this.handleClick} />
        <li v-t="directive" onClick={this.handleClick} />
        <li onClick={this.handleClick}>{this.computedValue}</li>
        <li onClick={this.handleClick}>
          {this.$t('concat.label')}: {this.$t('concat.node', [1])} - {this.$t('concat.node', [2])}
          {' .'}
        </li>
        <li
          data-custom-attribute={this.$t('customAttribute')}
          v-t="customAttribute"
          onClick={this.handleClick}
        />
        <li v-t="specialCharacters" onClick={this.handleClick} />
        <li v-t="html" onClick={this.handleClick} />
        <li>
          <label v-t="form.select" onClick={this.handleClick} />
          <select name="select" onClick={this.handleClick}>
            <option value="0">{this.$t('form.options.0')}</option>
            <option value="1">{this.$t('form.options.1')}</option>
            <option value="2">{this.$t('form.options.2')}</option>
          </select>
        </li>
        <li>
          <input
            type="text"
            readonly
            placeholder={this.$t('form.placeholder')}
            onClick={this.handleClick}
          />
        </li>
        <li>
          <Button class="inherit-class-name" />
        </li>
      </ul>
    );
  },
  computed: {
    computedValue() {
      return this.$t('computed');
    }
  },
  methods: {
    handleClick() {
      console.log('click');
    }
  }
};
