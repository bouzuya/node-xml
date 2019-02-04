import sax from 'sax';
import { create, createDeclaration, createElement } from './builder';
import { Declaration, Document, Element } from './type';

const parse = (s: string): Promise<Document> => {
  return new Promise((resolvePromise, reject) => {
    const stack: Element[] = [];
    let cdataBuffer: string | null = null;
    let declaration: Declaration | null = null;
    let rootElement: Element | null = null;
    const resolve = (): void => {
      if (declaration === null)
        return reject(new Error('declaration is null'));
      if (rootElement === null)
        return reject(new Error('rootElement is null'));
      resolvePromise(create(declaration, rootElement));
    };

    const parser = sax.parser(true, {});
    parser.oncdata = (cdata: string): void => {
      cdataBuffer = cdataBuffer === null ? cdata : cdataBuffer + cdata;
    };
    parser.onclosecdata = (): void => {
      if (cdataBuffer === null) return; // ignore empty cdata
      const element = stack.pop();
      if (typeof element === 'undefined') return; // ignore
      const { attributes, children, name } = element;
      const newElement = createElement(name, attributes, children.concat([cdataBuffer]));
      stack.push(newElement);
      cdataBuffer = null;
    };
    parser.onclosetag = (tagName: string): void => {
      const element = stack.pop();
      if (typeof element === 'undefined' || element.name !== tagName)
        return reject(new Error('assertion error'));
      const parentElement = stack.pop();
      if (typeof parentElement === 'undefined')
        rootElement = element;
      else {
        const { attributes, children, name } = parentElement;
        const newParentElement = createElement(name, attributes, children.concat([element]));
        stack.push(newParentElement);
      }
    };
    parser.onend = (): void => {
      resolve();
    };
    parser.onerror = (error: Error): void => {
      reject(error);
    };
    // parser.onopencdata = (): void => {};
    parser.onopentag = (tag: sax.Tag): void => {
      const newElement = createElement(tag.name, tag.attributes, []);
      stack.push(newElement);
    };
    parser.onprocessinginstruction = (node: { name: string; body: string }) => {
      if (node.name !== 'xml') return reject(new Error('not xml'));
      const versionMatches = node.body.match(/version="(1\.\d+)"/);
      if (versionMatches === null) return reject(new Error('no version'));
      const version = versionMatches[1];
      const encodingMatches = node.body.match(/encoding="(.*?)"/);
      const encoding = encodingMatches === null ? void 0 : encodingMatches[1];
      const standaloneMatches = node.body.match(/standalone="(yes|no)"/);
      const standalone = standaloneMatches === null
        ? void 0
        : standaloneMatches[1] === 'yes';
      declaration = createDeclaration(version, encoding, standalone);
    };
    parser.ontext = (text: string): void => {
      const element = stack.pop();
      if (typeof element === 'undefined') return; // ignore
      const { attributes, children, name } = element;
      const newElement = createElement(name, attributes, children.concat([text]));
      stack.push(newElement);
    };

    parser.write(s).close();
  });
};

export { parse };
