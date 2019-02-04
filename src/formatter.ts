import { Declaration, Document, Node } from './type';

const encodeAttributeValue = (s: string): string => {
  return s.split('\'').join('&apos;').split('"').join('&quot;');
};

const formatDeclaration = (declaration: Declaration): string => {
  const { encoding, standalone, version } = declaration;
  return `<?xml version="${version}"` +
    (typeof encoding === 'undefined' ? '' : ` encoding="${encoding}"`) +
    (
      typeof standalone === 'undefined'
        ? ''
        : ` standalone="${standalone ? 'yes' : 'no'}"`
    ) + '?>';
};

const formatNode = (node: Node): string => {
  if (typeof node === 'string') return node;
  const { attributes: as, children: cs, name: n } = node;
  const ns = Object.keys(as).sort();
  const v = encodeAttributeValue;
  return `<${n}` +
    (ns.length === 0 ? '' : ns.map((i) => ` ${i}="${v(as[i])}"`).join('')) +
    (
      cs.length === 0
        ? '/>'
        : `>${cs.map((i) => formatNode(i)).join('')}</${n}>`
    );
};

const format = (document: Document): string => {
  const { declaration, rootElement } = document;
  return formatDeclaration(declaration) + formatNode(rootElement);
};

export { format };
