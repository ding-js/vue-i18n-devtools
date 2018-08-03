export default {
  name: 'ListTitle',
  props: {
    title: String
  },
  render() {
    return <h2>{this.title}</h2>;
  }
};
