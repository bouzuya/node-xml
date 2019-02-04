interface Declaration {
  encoding?: string;
  standalone?: boolean;
  version: string;
}

interface Document {
  declaration: Declaration;
  rootElement: Element;
}

interface Element {
  attributes: { [name: string]: string; };
  children: Node[];
  name: string;
}

type Node = Element | Text;

type Text = string;

export { Declaration, Document, Element, Node, Text };
