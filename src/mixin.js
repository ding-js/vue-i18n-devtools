import { debounce } from 'throttle-debounce';
import { escapeRegExp, isEmpty } from './utils';

const extrasMap = {
  prop: {
    get(node, name) {
      return node[name];
    },
    set(node, name, value) {
      node[name] = value;
    }
  },
  attr: {
    get(node, name) {
      return node.getAttribute(name);
    },
    set(node, name, value) {
      node.setAttribute(name, value);
    }
  }
};

const classifyNodes = (children, node, nodesMap) => {
  if (!node || typeof node.nodeType !== 'number') {
    return;
  }

  // ignore child components
  if (children.length) {
    for (let child of children) {
      if (child.contains(node)) {
        return;
      }
    }
  }
  if (!nodesMap[node.nodeType]) {
    nodesMap[node.nodeType] = [];
  }

  nodesMap[node.nodeType].push(node);

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (node.childNodes.length) {
        Array.prototype.forEach.call(node.childNodes, n => classifyNodes(children, n, nodesMap));
      }
      break;
    default:
      break;
  }
};

export default ({ startTag, endTag, extras, className }) => {
  const regexp = new RegExp(`${escapeRegExp(startTag)}([\\s\\S]+?)${escapeRegExp(endTag)}`, 'g');
  const hasRegexp = new RegExp(regexp.source);

  const replaceMarks = vm => {
    if (vm.$el) {
      const children = vm.$children.map(v => v.$el).filter(v => !!v);
      const nodesMap = {};

      classifyNodes(children, vm.$el, nodesMap);

      // replace text nodes
      (nodesMap[Node.TEXT_NODE] || []).forEach(node => {
        const parent = node.parentElement;
        const text = node.textContent;

        if (!parent || !hasRegexp.test(text)) {
          return;
        }

        let match;
        let prevIndex = 0;

        while ((match = regexp.exec(text)) !== null) {
          const mark = match[1];
          const [key, value] = mark.split('|');

          if (typeof value === 'undefined') {
            continue;
          }

          if (match.index > prevIndex) {
            const textNode = document.createTextNode(match.input.slice(prevIndex, match.index));
            parent.insertBefore(textNode, node);
          }
          prevIndex = regexp.lastIndex;

          const dataElement = document.createElement('data');
          dataElement.textContent = value;
          dataElement.classList.add(className);
          dataElement.classList.add(`${className}--text`);
          dataElement.setAttribute('value', key);
          parent.insertBefore(dataElement, node);
        }

        if (prevIndex < text.length) {
          const textNode = document.createTextNode(text.slice(prevIndex));
          parent.insertBefore(textNode, node);
        }

        parent.removeChild(node);
      });

      // replace props & attrs
      (nodesMap[Node.ELEMENT_NODE] || []).forEach(node => {
        const replaced = {};
        extras.forEach(e => {
          const action = extrasMap[e.type];
          const text = action.get(node, e.name);
          if (!text || typeof text !== 'string' || !hasRegexp.test(text)) {
            return;
          }
          action.set(
            node,
            e.name,
            text.replace(regexp, (string, mark) => {
              const [key, value] = mark.split('|');

              if (typeof value === 'undefined') {
                return string;
              }
              replaced[e.name] = { key, value, type: e.type };
              return value;
            })
          );
        });

        if (!isEmpty(replaced)) {
          node.setAttribute('data-i18n', JSON.stringify(replaced));
          node.classList.add(className);
          node.classList.add(`${className}--extras`);
        }
      });
    }
  };
  return {
    beforeCreate() {
      this.$_debounceReplaceMarks = debounce(0, () => replaceMarks(this));
    },
    mounted() {
      this.$_debounceReplaceMarks();
    },
    updated() {
      this.$_debounceReplaceMarks();
    }
  };
};
