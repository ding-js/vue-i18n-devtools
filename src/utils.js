const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = new RegExp(reRegExpChar.source);
const toString = Object.prototype.toString;

function getTag(value) {
  return toString.call(value);
}

export function escapeRegExp(string) {
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}

export function isString(value) {
  return typeof value === 'string' || getTag(value) === '[object String]';
}

export function isPlainObject(value) {
  if (typeof value !== 'object' || getTag(value) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  // {} -> Object -> null
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

export function replaceChildNode(el, child, string, processor, className) {
  if (!el || !string) {
    return;
  }
  const match = processor.parse(string);
  if (match.length) {
    if (!child && el.childNodes) {
      el.childNodes.forEach(v => el.removeChild(v));
    }
    match.forEach(m => {
      let node;
      switch (m.type) {
        case 'text':
          node = document.createTextNode(m.value);
          break;
        case 'mark':
          node = document.createElement('data');
          node.textContent = m.data.value;
          node.setAttribute('value', m.data.key);
          node.classList.add(className);
          node.classList.add(className + '--text');
          break;
        default:
          break;
      }

      if (node) {
        if (child) {
          el.insertBefore(child, node);
        } else {
          el.appendChild(node);
        }
      }
    });

    if (child) {
      el.removeChild(child);
    }
  }
}
