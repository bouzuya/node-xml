import { test } from 'beater';
import assert from 'power-assert';
import { parse } from '../src/parser';

const category = '/parser ';
const tests = [
  test(category + 'parse', async () => {
    assert.deepEqual(
      await parse([
        '<?xml version="1.0"?>',
        '<r/>'
      ].join('')),
      {
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [], name: 'r' }
      }
    );
    assert.deepEqual(
      await parse([
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
        '<r a="b"><c>d</c><![CDATA[e]]></r>'
      ].join('')),
      {
        declaration: { encoding: 'UTF-8', standalone: false, version: '1.0' },
        rootElement: {
          attributes: { a: 'b' },
          children: [
            { attributes: {}, children: ['d'], name: 'c' },
            'e'
          ],
          name: 'r'
        }
      }
    );
  }),
  test(category + 'parse (self-closing tag)', async () => {
    assert.deepEqual(
      await parse([
        '<?xml version="1.0"?>',
        '<r/>'
      ].join('')),
      {
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [], name: 'r' }
      }
    );
    assert.deepEqual(
      await parse([
        '<?xml version="1.0"?>',
        '<r></r>'
      ].join('')),
      {
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [''], name: 'r' }
      }
    );
  })
];

export { tests };
