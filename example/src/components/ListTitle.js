export default {
  name: 'ListTitle',
  functional: true,
  props: {
    title: String,
    handleOnClick: Function
  },
  render(h, ctx) {
    return (
      <div>
        <h2 onClick={ctx.props.handleOnClick}>{ctx.parent.$t('functional')}</h2>
      </div>
    );
  }
};
