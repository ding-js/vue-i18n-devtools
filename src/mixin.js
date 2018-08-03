import { debounce } from 'throttle-debounce';
import { escapeRegExp } from './utils';

const findTextNodes = (children, node, nodes) => {
  if (node && typeof node.nodeType === 'number') {
    if (children.length) {
      for (let child of children) {
        console.log(child.contains(node));
        if (child.contains(node)) {
          return;
        }
      }
    }

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (node.childNodes.length) {
          Array.prototype.forEach.call(node.childNodes, n => findTextNodes(children, n, nodes));
        }
        break;
      case Node.TEXT_NODE:
        nodes.push(node);
        break;
      default:
        break;
    }
  }

  return nodes;
};

const tmpElement = document.createElement('div');

export default ({ startTag, endTag }) => {
  const regexp = new RegExp(`${escapeRegExp(startTag)}([\\s\\S]+?)${escapeRegExp(endTag)}`, 'g');
  const hasRegexp = new RegExp(regexp.source);

  const replaceTextNode = vm => {
    if (vm.$el) {
      const children = vm.$children.map(v => v.$el).filter(v => !!v);
      const textNodes = findTextNodes(children, vm.$el, []);
      textNodes.forEach(node => {
        const parent = node.parentElement;
        const text = node.textContent;

        if (!parent || !hasRegexp.test(text)) {
          return;
        }

        tmpElement.innerHTML = text.replace(regexp, (string, data) => {
          const [key, value] = data.split('|');

          if (!key) {
            return string;
          }

          return `<data value="${key}">${value}</data>`;
        });

        Array.prototype.forEach.call(tmpElement.childNodes, n => {
          parent.insertBefore(n, node);
        });

        parent.removeChild(node);
      });
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
