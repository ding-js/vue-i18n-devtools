import { escapeRegExp, isString } from './utils';

export default class Processor {
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
    if (!isString(string) || !hasRegexp.test(string)) {
      return [];
    }
    const results = [];
    let match;
    let prevIndex = 0;

    while ((match = regexp.exec(string)) !== null) {
      const mark = match[1] || '';
      const data = mark.split('|');

      if (data.length < 2) {
        // 刚好匹配的特殊字符
        continue;
      }

      const key = data[0];
      const value = data.slice(1).join('|'); // 避免 value 中含有 |

      if (match.index > prevIndex) {
        // 被翻译的文本前已有其他内容存在时，如字符串拼接
        // 普通文本
        results.push({
          type: 'text',
          value: match.input.slice(prevIndex, match.index)
        });
      }

      // 被翻译的文本
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
