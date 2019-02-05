import { test } from 'beater';
import assert from 'power-assert';
import { format } from '../src/formatter';

const category = '/formatter ';
const tests = [
  test(category + 'format', () => {
    assert.deepEqual(
      format({
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [], name: 'r' }
      }),
      [
        '<?xml version="1.0"?>',
        '<r/>'
      ].join('')
    );
    assert.deepEqual(
      format({
        declaration: { encoding: 'UTF-8', standalone: false, version: '1.0' },
        rootElement: {
          attributes: { a: 'b' },
          children: [
            {
              attributes: {},
              children: ['d'],
              name: 'c'
            }
          ],
          name: 'r'
        }
      }),
      [
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
        '<r a="b"><c>d</c></r>'
      ].join('')
    );
  }),
  test(category + 'format (self-closing tag)', () => {
    assert.deepEqual(
      format({
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [], name: 'r' }
      }),
      [
        '<?xml version="1.0"?>',
        '<r/>'
      ].join('')
    );
    assert.deepEqual(
      format({
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [''], name: 'r' }
      }),
      [
        '<?xml version="1.0"?>',
        '<r></r>'
      ].join('')
    );
  })
];

export { tests };
