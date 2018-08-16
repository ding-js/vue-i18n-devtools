const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = new RegExp(reRegExpChar.source);
const hasOwnProperty = Object.prototype.hasOwnProperty;

function getTag(value) {
  return Object.prototype.toString.call(value);
}

export function escapeRegExp(string) {
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
}

export function isEmpty(value) {
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return true;
}

export function isString(value) {
  return typeof value === 'string' || getTag(value) == '[object String]';
}

export function isPlainObject(value) {
  if (typeof value !== 'object' || getTag(value) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}

export function replaceChildNode(el, child, string, processor) {
  if (!el || !string) {
    return;
  }
  const match = processor.resolve(string);
  if (match.length) {
    if (!child && el.childNodes) {
      el.childNodes.forEach(v => el.removeChild(v));
    }
    const { className } = processor.options;
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

export class Processor {
  constructor(options) {
    const { startTag, endTag } = options;
    this.regexp = new RegExp(`${escapeRegExp(startTag)}([\\s\\S]+?)${escapeRegExp(endTag)}`, 'g');
    this.hasRegexp = new RegExp(this.regexp.source);
    this.options = options;
  }

  serialize(key, value) {
    const { startTag, endTag } = this.options;
    return startTag + key + '|' + value + endTag;
  }

  resolve(string) {
    const { regexp, hasRegexp } = this;
    if (typeof string !== 'string' || !hasRegexp.test(string)) {
      return [];
    }
    const results = [];
    let match;
    let prevIndex = 0;

    while ((match = regexp.exec(string)) !== null) {
      const mark = match[1] || '';
      const [key, value] = mark.split('|');

      if (typeof value === 'undefined') {
        // 刚好匹配的特殊字符
        continue;
      }

      if (match.index > prevIndex) {
        // 匹配内容前已有文本存在
        results.push({
          type: 'text',
          value: match.input.slice(prevIndex, match.index)
        });
      }

      results.push({
        type: 'mark',
        value: mark,
        data: {
          key,
          value
        }
      });

      prevIndex = regexp.lastIndex;
    }

    return results;
  }
}
