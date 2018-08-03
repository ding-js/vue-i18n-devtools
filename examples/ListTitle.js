export default {
  name: 'ListTitle',
  functional: true,
  props: {
    title: String
  },
  render(h, ctx) {
    return <h2>Functional component: {ctx.props.title}</h2>;
  }
};
