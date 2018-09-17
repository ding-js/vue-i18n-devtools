import { isPlainObject, isString, isPrimitive } from './utils';

export default ({ processor, className, VNode }) => {
  function createModifiedNode(vnode) {
    if (!vnode.tag && vnode.text) {
      return createModifiedTextNode(vnode.text);
    }
    const [modifiedData, modifiedComponentOptions] = [vnode.data, vnode.componentOptions].map(
      createModifiedObject
    );
    const data = modifiedData.value;
    const componentOptions = modifiedComponentOptions.value;
    const modified = new VNode(
      vnode.tag,
      data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.context,
      componentOptions,
      vnode.asyncFactory
    );

    if (vnode.children) {
      modified.children = createModifiedNodes(vnode.children);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = createModifiedNodes(componentOptions.children);
    }

    return modified;
  }

  function createModifiedNodes(vnodes) {
    const len = vnodes.length;
    const res = [];
    for (let i = 0; i < len; i++) {
      const child = createModifiedNode(vnodes[i]);

      if (Array.isArray(child)) {
        child.forEach(v => res.push(v));
      } else {
        res.push(child);
      }
    }
    return res;
  }

  function createTextNode(text) {
    return new VNode(undefined, undefined, undefined, text);
  }

  function createModifiedTextNode(text) {
    const matches = processor.parse(text);

    if (!matches.length) {
      return createTextNode(text);
    }

    // 文本节点不可能是根节点，返回一个数组
    return matches
      .map(match => {
        switch (match.type) {
          case 'text':
            return createTextNode(match.value);
          case 'mark':
            return new VNode(
              'data',
              {
                class: [className, `${className}--text`]
              },
              undefined,
              match.data.value
            );
          default:
            return null;
        }
      })
      .filter(v => !!v);
  }

  const createModifiedObject = object => {
    if (!isPlainObject(object)) {
      return {
        modified: [],
        value: object
      };
    }
    const result = {
      modified: [],
      value: Object.create(Object.getPrototypeOf(object))
    };
    Object.keys(object).forEach(key => {
      const value = object[key];

      if (isPlainObject(value)) {
        const modifiedData = createModifiedObject(value);
        if (modifiedData.modified.length) {
          result.modified = result.modified.concat(modifiedData.modified);
        }
        result.value[key] = modifiedData.value;
      } else if (isString(value)) {
        const matches = processor.parse(value);
        if (matches.length) {
          const modified = [];
          result.value[key] = matches
            .map(match => {
              switch (match.type) {
                case 'text':
                  return match.value;
                case 'mark':
                  modified.push(match.data);
                  return match.data.value;
                default:
                  return '';
              }
            })
            .join('');
          if (modified.length) {
            result.modified = result.modified.concat(modified);
          }
        } else {
          result.value[key] = value;
        }
      } else {
        result.value[key] = value;
      }
    });
    return result;
  };

  return function(vnode) {
    return createModifiedNode.call(this, vnode, true);
  };
};
