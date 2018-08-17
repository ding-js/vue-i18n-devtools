import Processor from '../src/processor';

const defaultOptions = {
  startTag: '<% ',
  endTag: ' %>'
};

it('init', () => {
  const p = new Processor(defaultOptions);

  expect(p.options).toEqual(defaultOptions);
  expect(p.regexp.source).toBe('<% ([\\s\\S]+?) %>');
  expect(p.regexp.source).toBe(p.hasRegexp.source);
});

it('serialize', () => {
  const p = new Processor(defaultOptions);

  expect(p.serialize('key', 'value')).toBe('<% key|value %>');
});

it('parse', () => {
  const p = new Processor(defaultOptions);

  expect(p.parse('<% key|value %>')).toEqual([
    { data: { key: 'key', value: 'value' }, type: 'mark', value: 'key|value' }
  ]);

  expect(p.parse('<% key|val|ue %>')).toEqual([
    { data: { key: 'key', value: 'val|ue' }, type: 'mark', value: 'key|val|ue' }
  ]);

  expect(p.parse('before<% key|value %>after')).toEqual([
    { type: 'text', value: 'before' },
    { data: { key: 'key', value: 'value' }, type: 'mark', value: 'key|value' },
    { type: 'text', value: 'after' }
  ]);

  // 暂时无法正确判断这种情况，考虑传入 i18n 实例校验 key/value 是否匹配
  expect(p.parse('<% <% key|value %> %>')).toEqual([
    { data: { key: '<% key', value: 'value' }, type: 'mark', value: '<% key|value' },
    { type: 'text', value: ' %>' }
  ]);

  expect(p.parse('<% key&value %>')).toEqual([]);
  expect(p.parse('< % key|value %>')).toEqual([]);
  expect(p.parse('<% key|value % >')).toEqual([]);
});
