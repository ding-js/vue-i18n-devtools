const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = new RegExp(reRegExpChar.source);
const hasOwnProperty = Object.prototype.hasOwnProperty;

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

export function replaceDirectiveNode(el, processor) {
  const match = processor.resolve(el._vt || '');
  if (el && match.length > 0) {
    // el.innerHTML = match.map(m => `<data>${m.data.value}</data>`).join('');
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
