// import { isEmpty } from './utils';

// const createdReplacedObject = data => {
//   const type = Object.prototype.toString
//     .call(data)
//     .slice(8, -1)
//     .toLowerCase();

//   switch (type) {
//     case 'string':
//       {
//         let match;
//         let prevIndex = 0;

//         while ((match = regexp.exec(text)) !== null) {
//           const mark = match[1];
//           const [key, value] = mark.split('|');

//           if (typeof value === 'undefined') {
//             continue;
//           }

//           if (match.index > prevIndex) {
//             const textNode = document.createTextNode(match.input.slice(prevIndex, match.index));
//             parent.insertBefore(textNode, node);
//           }
//           prevIndex = regexp.lastIndex;

//           const dataElement = document.createElement('data');
//           dataElement.textContent = value;
//           dataElement.classList.add(className);
//           dataElement.classList.add(`${className}--text`);
//           dataElement.setAttribute('value', key);
//           parent.insertBefore(dataElement, node);
//         }
//       }
//       break;
//     case 'object':
//     case 'array':
//     default:
//       return data;
//   }
// };

// const cloneReplacedVNode = (VNode, vnode) => {
//   const cloned = new VNode(
//     vnode.tag,
//     vnode.data,
//     vnode.children,
//     vnode.text,
//     vnode.elm,
//     vnode.context,
//     vnode.componentOptions,
//     vnode.asyncFactory
//   );
//   cloned.ns = vnode.ns;
//   cloned.isStatic = vnode.isStatic;
//   cloned.key = vnode.key;
//   cloned.isComment = vnode.isComment;
//   cloned.fnContext = vnode.fnContext;
//   cloned.fnOptions = vnode.fnOptions;
//   cloned.fnScopeId = vnode.fnScopeId;
//   cloned.isCloned = true;
//   return cloned;
// };

const cloneReplacedChild = (VNode, child, processor) => {
  if (child.children) {
    return new VNode(
      child.tag,
      child.data,
      cloneReplacedChildren(VNode, child.children, processor),
      child.text,
      child.elm,
      child.context,
      child.componentOptions,
      child.asyncFactory
    );
  }

  if (!child.tag && child.text) {
    const match = processor.resolve(child.text);

    if (match.length > 0) {
      return match
        .map(m => {
          switch (m.type) {
            case 'text':
              return new VNode(undefined, undefined, undefined, m.value);
            case 'mark':
              return new VNode('data', undefined, [
                new VNode(undefined, undefined, undefined, m.data.value)
              ]);
            default:
              break;
          }
        })
        .filter(v => !!v);
    }
  }

  return child;
};

const cloneReplacedChildren = (VNode, children, processor) => {
  let clonedChildren = [];
  children.forEach(child => {
    clonedChildren = clonedChildren.concat(cloneReplacedChild(VNode, child, processor));
  });

  return clonedChildren;
};

const createReplacedElement = ({ vm, vnode, processor, extras }) => {
  const VNode = vnode.__proto__.constructor;
  // if (vnode.data && vnode.data.attrs && !isEmpty(vnode.data.attrs)) {
  // }

  const children = Array.isArray(vnode.children)
    ? cloneReplacedChildren(VNode, vnode.children, processor)
    : vnode.children;

  return vm.$createElement(vnode.tag, vnode.data, children);
};

export default createReplacedElement;
