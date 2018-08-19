import { isPlainObject, isString, isPrimitive } from './utils';

export default ({ processor, className }) => {
  const cloneReplacedObject = object => {
    if (!isPlainObject(object)) {
      return object;
    }
    const result = Object.create(Object.getPrototypeOf(object));
    Object.keys(object).forEach(key => {
      const value = object[key];

      if (isPlainObject(value)) {
        const data = cloneReplacedObject(value);
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

  const doCloneReplacedObject = object => {
    const data = cloneReplacedObject(object);

    if (data && data.__replaced___) {
      data.attrs = data.attrs || {};
      data.class = data.class || {};

      data.class[className] = true;
      data.class[className + '--extras'] = true;
      data.attrs['data-i18n-devtools'] = JSON.stringify(data.__replaced___);
      delete data.__replaced___;
    }
    return data;
  };

  const cloneReplacedChild = (h, child) => {
    const tag = child.tag;

    // if (child.children) {
    //   return h(tag, doCloneReplacedObject(child.data), cloneReplacedChildren(h, child.children));
    // }

    if (!tag) {
      const match = processor.parse(isPrimitive(child) ? child : child.text);
      if (!match.length) {
        return child;
      }
      return match
        .map(m => {
          switch (m.type) {
            case 'text':
              return m.value;
            case 'mark':
              return h(
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
                [m.data.value]
              );
            default:
              break;
          }
        })
        .filter(v => !!v);
    }

    return child;
  };

  const cloneReplacedChildren = (h, children) => {
    if (!Array.isArray(children) || !children.length) {
      return children;
    }
    let clonedChildren = [];
    children.forEach(child => {
      clonedChildren = clonedChildren.concat(cloneReplacedChild(h, child));
    });

    return clonedChildren;
  };

  return ({ vm, createElement, args }) => {
    let [tag, data, children] = args;
    const h = createElement.bind(vm);
    if (Array.isArray(data)) {
      children = data;
      data = undefined;
    } else if (isPrimitive(data)) {
      children = [data];
      data = undefined;
    }

    return h(tag, doCloneReplacedObject(data), cloneReplacedChildren(h, children));
  };
};
