import { test } from 'beater';
import assert from 'power-assert';
import { create, createDeclaration, createElement } from '../src/builder';

const category = '/xml/builder ';
const tests = [
  test(category + 'createDeclaration', () => {
    assert.deepEqual(createDeclaration('1.0'), { version: '1.0' });
    assert.deepEqual(
      createDeclaration('1.0', 'UTF-8'),
      { encoding: 'UTF-8', version: '1.0' }
    );
    assert.deepEqual(
      createDeclaration('1.0', 'UTF-8', false),
      { encoding: 'UTF-8', standalone: false, version: '1.0' }
    );
  }),
  test(category + 'createElement', () => {
    assert.deepEqual(
      createElement('r', {}, []),
      { attributes: {}, children: [], name: 'r' }
    );
    assert.deepEqual(
      createElement('r', { a: 'b' }, []),
      { attributes: { a: 'b' }, children: [], name: 'r' }
    );
    assert.deepEqual(
      createElement('r', { a: 'b' }, ['c']),
      { attributes: { a: 'b' }, children: ['c'], name: 'r' }
    );
    assert.deepEqual(
      createElement('r', { a: 'b' }, [createElement('c', {}, [])]),
      {
        attributes: { a: 'b' },
        children: [
          {
            attributes: {},
            children: [],
            name: 'c'
          }
        ],
        name: 'r'
      }
    );
  }),
  test(category + 'create', () => {
    assert.deepEqual(
      create(
        createDeclaration('1.0'),
        createElement('r', {}, [])
      ),
      {
        declaration: { version: '1.0' },
        rootElement: { attributes: {}, children: [], name: 'r' }
      }
    );
  })
];

export { tests };
