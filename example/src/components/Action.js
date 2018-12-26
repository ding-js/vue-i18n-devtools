export default {
  name: 'Action',
  render(h) {
    return (
      <div class="vue-i18n-devtools__action">
        {Object.keys(this.$i18n.messages).map(lang => (
          <label>
            {lang}
            <input
              type="radio"
              name="language"
              value={lang}
              checked={this.$i18n.locale === lang}
              onChange={() => {
                this.$i18n.locale = lang;
              }}
            />
          </label>
        ))}
      </div>
    );
  }
};
