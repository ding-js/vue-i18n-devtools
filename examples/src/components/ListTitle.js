export default {
  name: 'ListTitle',
  functional: true,
  props: {
    title: String
  },
  render(h, ctx) {
    return (
      <div>
        <h2>{ctx.parent.$t('functional')}</h2>
      </div>
    );
  }
};
