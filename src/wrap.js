import { isPlainObject, isString } from './utils';

const cloneReplacedObject = (VNode, object, processor) => {
  if (!isPlainObject(object)) {
    return object;
  }
  const result = Object.create(Object.getPrototypeOf(object));
  Object.keys(object).forEach(key => {
    const value = object[key];

    if (isPlainObject(value)) {
      const data = cloneReplacedObject(VNode, value, processor);
      if (data && data.__replaced___) {
        result.__replaced___ = (result.__replaced___ || []).concat(data.__replaced___);
        delete data.__replaced___;
      }
      result[key] = data;
    } else if (isString(value)) {
      const match = processor.parse(value);
      if (match.length) {
        const replaced = [];
        result[key] = match
          .map(m => {
            switch (m.type) {
              case 'text':
                return m.value;
              case 'mark':
                replaced.push(m.data);
                return m.data.value;
              default:
                return '';
            }
          })
          .join('');
        if (replaced.length) {
          result.__replaced___ = (result.__replaced___ || []).concat(replaced);
        }
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  });
  return result;
};

const doCloneReplacedObject = (VNode, object, processor) => {
  const data = cloneReplacedObject(VNode, object, processor);

  if (data && data.__replaced___) {
    const { className } = processor.options;
    data.attrs = data.attrs || {};
    data.class = data.class || {};

    data.class[className] = true;
    data.class[className + '--extras'] = true;
    data.attrs['data-i18n-devtools'] = JSON.stringify(data.__replaced___);
    delete data.__replaced___;
  }
  return data;
};

const cloneReplacedChild = (VNode, child, processor) => {
  if (child.children) {
    return new VNode(
      child.tag,
      doCloneReplacedObject(VNode, child.data, processor),
      cloneReplacedChildren(VNode, child.children, processor),
      child.text,
      child.elm,
      child.context,
      child.componentOptions,
      child.asyncFactory
    );
  }

  if (!child.tag && child.text) {
    const { className } = processor.options;
    const match = processor.parse(child.text);

    if (match.length) {
      return match
        .map(m => {
          switch (m.type) {
            case 'text':
              return new VNode(undefined, undefined, undefined, m.value);
            case 'mark':
              return new VNode(
                'data',
                {
                  class: {
                    [className]: true,
                    [className + '--text']: true
                  },
                  attrs: {
                    value: m.data.key
                  }
                },
                [new VNode(undefined, undefined, undefined, m.data.value)]
              );
            default:
              break;
          }
        })
        .filter(v => !!v);
    }
  }

  return new VNode(
    child.tag,
    doCloneReplacedObject(VNode, child.data, processor),
    child.children,
    child.text,
    child.elm,
    child.context,
    child.componentOptions,
    child.asyncFactory
  );
};

const cloneReplacedChildren = (VNode, children, processor) => {
  let clonedChildren = [];
  children.forEach(child => {
    clonedChildren = clonedChildren.concat(cloneReplacedChild(VNode, child, processor));
  });

  return clonedChildren;
};

const createReplacedElement = ({ vm, vnode, processor }) => {
  const VNode = vnode.__proto__.constructor;

  const children = Array.isArray(vnode.children)
    ? cloneReplacedChildren(VNode, vnode.children, processor)
    : vnode.children;

  return vm.$createElement(
    vnode.tag,
    doCloneReplacedObject(VNode, vnode.data, processor),
    children
  );
};

export default createReplacedElement;
