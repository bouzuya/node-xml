import { Declaration, Document, Element, Node } from './type';

const create = (
  declaration: Declaration,
  rootElement: Element
): Document => {
  return { declaration, rootElement };
};

const createDeclaration = (
  version: string,
  encoding?: string,
  standalone?: boolean
): Declaration => {
  return {
    ...(typeof encoding === 'undefined' ? {} : { encoding }),
    ...(typeof standalone === 'undefined' ? {} : { standalone }),
    version
  };
};

const createElement = (
  name: string,
  attributes: { [name: string]: string; },
  children: Node[]
): Element => {
  return { attributes, children, name };
};

export { create, createDeclaration, createElement };
