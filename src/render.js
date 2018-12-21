import { isPlainObject, isString } from './utils';

export default ({ processor, className, VNode }) => {
  function createModifiedNode(vnode) {
    if (!vnode.tag && vnode.text) {
      return createModifiedTextNode(vnode.text);
    }
    const modifiedData = createModifiedObject(vnode.data);
    const modifiedComponentOptions = createModifiedObject(vnode.componentOptions);
    const data = modifiedData.value;
    const componentOptions = modifiedComponentOptions.value;

    if ([modifiedData, modifiedComponentOptions].some(v => v.modified.length)) {
      const modifiedProps = [modifiedData, modifiedComponentOptions].reduce(
        (array, v) => array.concat(v.modified),
        []
      );

      const classNames = [className, `${className}--props`];
      // 添加 className
      if (!data.class) {
        data.class = classNames;
      } else if (isString(data.class)) {
        data.class += ' ' + classNames.join(' ');
      } else if (Array.isArray(data.class)) {
        data.class = data.class.concat(classNames);
      } else {
        classNames.forEach(n => (data.class[n] = true));
      }

      if (!data.attrs) {
        data.attrs = {};
      }

      // 添加被修改的属性信息
      data.attrs['data-i18n-devtools'] = JSON.stringify(modifiedProps);
    }

    if (componentOptions && componentOptions.children) {
      componentOptions.children = createModifiedNodes(componentOptions.children);
    }

    // clone vnode
    const modified = new VNode(
      vnode.tag,
      data,
      vnode.children ? createModifiedNodes(vnode.children) : undefined,
      vnode.text,
      vnode.elm,
      vnode.context,
      componentOptions,
      vnode.asyncFactory
    );

    modified.ns = vnode.ns
    modified.isStatic = vnode.isStatic
    modified.key = vnode.key
    modified.isComment = vnode.isComment
    modified.fnContext = vnode.fnContext
    modified.fnOptions = vnode.fnOptions
    modified.fnScopeId = vnode.fnScopeId
    modified.asyncMeta = vnode.asyncMeta
    // modified.isCloned = true

    return modified;
  }

  function createModifiedNodes(vnodes) {
    const len = vnodes.length;
    const res = [];
    for (let i = 0; i < len; i++) {
      const child = createModifiedNode(vnodes[i]);

      if (Array.isArray(child)) {
        // 当有匹配的文本节点，会返回一个数组
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
                class: [className, `${className}--text`],
                attrs: {
                  value: match.data.key
                }
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
