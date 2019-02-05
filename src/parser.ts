import sax from 'sax';
import { create, createDeclaration, createElement } from './builder';
import { Declaration, Document, Element, Node } from './type';

const appendChild = (element: Element, child: Node): Element => {
  return replaceChildren(element, element.children.concat([child]));
};

const replaceChildren = (element: Element, children: Node[]): Element => {
  return createElement(element.name, element.attributes, children);
};

const parse = (s: string): Promise<Document> => {
  return new Promise((resolvePromise, reject) => {
    const stack: Array<{ element: Element; isSelfClosing: boolean; }> = [];
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
      const item = stack.pop();
      if (typeof item === 'undefined') return; // ignore
      const { element, isSelfClosing } = item;
      const newElement = appendChild(element, cdataBuffer);
      stack.push({ element: newElement, isSelfClosing });
      cdataBuffer = null;
    };
    parser.onclosetag = (tagName: string): void => {
      const item = stack.pop();
      if (typeof item === 'undefined' || item.element.name !== tagName)
        return reject(new Error('assertion error'));
      const newElement = item.isSelfClosing || item.element.children.length > 0
        ? item.element
        : replaceChildren(item.element, ['']);
      const parentItem = stack.pop();
      if (typeof parentItem === 'undefined')
        rootElement = newElement;
      else {
        const {
          element: parentElement,
          isSelfClosing: parentIsSelfClosing
        } = parentItem;
        stack.push({
          element: appendChild(parentElement, newElement),
          isSelfClosing: parentIsSelfClosing
        });
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
      stack.push({ element: newElement, isSelfClosing: tag.isSelfClosing });
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
      const item = stack.pop();
      if (typeof item === 'undefined') return; // ignore
      const { element, isSelfClosing } = item;
      const newElement = appendChild(element, text);
      stack.push({ element: newElement, isSelfClosing });
    };

    parser.write(s).close();
  });
};

export { parse };
