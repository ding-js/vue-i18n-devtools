import { debounce } from 'throttle-debounce';

export default ({ startTag, endTag }) => {
  const replaceTextNode = vm => {
    if (vm.$el) {
      console.log(vm.$el.innerHTML);
    }
  };
  return {
    beforeCreate() {
      this.$_debounceReplaceTextNode = debounce(0, () => replaceTextNode(this));
    },
    mounted() {
      this.$_debounceReplaceTextNode();
    },
    updated() {
      this.$_debounceReplaceTextNode();
    }
  };
};
