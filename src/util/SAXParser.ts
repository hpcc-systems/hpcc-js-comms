import { Stack } from "../collections/stack";
// import { DOMParser } from "../platform/node";

export type PrimativeValue = any;
export type PrimativeValueMap = { [key: string]: PrimativeValue };
export class XMLNode {
    name: string = "";
    attributes: PrimativeValueMap = {};
    children: XMLNode[] = [];
    content: string = "";

    constructor(name: string) {
        this.name = name;
    }

    appendAttribute(key: string, val: string) {
        this.attributes[key] = val;
    }

    appendContent(content: string) {
        this.content += content;
    }

    appendChild(child: XMLNode) {
        this.children.push(child);
    }
}

export class SAXStackParser {
    root: XMLNode;
    stack: Stack<XMLNode> = new Stack<XMLNode>();

    constructor() {
    }

    private walkDoc(node: Node) {
        this.startXMLNode(node);
        if (node.attributes) {
            for (let i = 0; i < node.attributes.length; ++i) {
                const attribute = node.attributes.item(i);
                this.attributes(attribute.nodeName, attribute.nodeValue);
            }
        }
        if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; ++i) {
                const childNode = node.childNodes.item(i);
                if (childNode.nodeType === childNode.TEXT_NODE) {
                    this.characters(childNode.nodeValue);
                } else {
                    this.walkDoc(childNode);
                }
            }
        }
        this.endXMLNode(node);
    }

    parse(xml: string) {
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(xml, "application/xml");
        this.startDocument();
        this.walkDoc(doc);
        this.endDocument();
    }

    //  Callbacks  ---
    startDocument() {
    }

    endDocument() {
    }

    startXMLNode(node: Node): XMLNode {
        const newNode = new XMLNode(node.nodeName);
        if (!this.stack.depth()) {
            this.root = newNode;
        } else {
            this.stack.top().appendChild(newNode);
        }
        return this.stack.push(newNode);
    }

    endXMLNode(_node: Node): XMLNode {
        return this.stack.pop();
    }

    attributes(key: string, val: any) {
        this.stack.top().appendAttribute(key, val);
    }

    characters(text: string) {
        this.stack.top().appendContent(text);
    }
}

export function xml2json(xml: string): XMLNode {
    const saxParser = new SAXStackParser();
    saxParser.parse(xml);
    return saxParser.root;
}

export class XSDNode {
    protected e?: XMLNode;

    constructor(e: XMLNode) {
        this.e = e;
    }
    fix() {
        delete this.e;
    }
}

export class XSDXMLNode extends XSDNode {
    name: string;
    type: string;
    private children: XSDXMLNode[] = [];

    constructor(e: XMLNode) {
        super(e);
    }

    append(child: XSDXMLNode) {
        this.children.push(child);
    }

    fix() {
        this.name = this.e.attributes["name"];
        this.type = this.e.attributes["type"];
        for (let i = this.children.length - 1; i >= 0; --i) {
            const row = this.children[i];
            if (row.name === "Row" && row.type === undefined) {
                this.children.push(...row.children);
                this.children.splice(i, 1);
            }
        }
        super.fix();
    }
}

export class XSDSimpleType extends XSDNode {
    name: string;
    type: string;
    maxLength: number;

    protected _restricition?: XMLNode;
    protected _maxLength?: XMLNode;

    constructor(e: XMLNode) {
        super(e);
    }

    append(e: XMLNode) {
        switch (e.name) {
            case "xs:restriction":
                this._restricition = e;
                break;
            case "xs:maxLength":
                this._maxLength = e;
                break;
            default:
        }
    }

    fix() {
        this.name = this.e.attributes["name"];
        this.type = this._restricition.attributes["base"];
        this.maxLength = +this._maxLength.attributes["value"];
        delete this._restricition;
        delete this._maxLength;
        super.fix();
    }
}

export class XSDSchema {
    root: XSDXMLNode;
    simpleTypes: { [name: string]: XSDSimpleType } = {};

    calcWidth(type: string, name: string) {
        let retVal: number = -1;

        switch (type) {
            case "xs:boolean":
                retVal = 5;
                break;
            case "xs:integer":
                retVal = 8;
                break;
            case "xs:nonNegativeInteger":
                retVal = 8;
                break;
            case "xs:double":
                retVal = 8;
                break;
            case "xs:string":
                retVal = 32;
                break;
            default:
                const numStr: string = "0123456789";
                const underbarPos: number = type.lastIndexOf("_");
                const length: number = underbarPos > 0 ? underbarPos : type.length;
                let i: number = length - 1;
                for (; i >= 0; --i) {
                    if (numStr.indexOf(type.charAt(i)) === -1)
                        break;
                }
                if (i + 1 < length) {
                    retVal = parseInt(type.substring(i + 1, length), 10);
                }
                if (type.indexOf("data") === 0) {
                    retVal *= 2;
                }
                break;
        }
        if (retVal < name.length)
            retVal = name.length;

        return retVal;
    }
}

class XSDParser extends SAXStackParser {
    schema: XSDSchema = new XSDSchema();
    simpleType: XSDSimpleType;
    simpleTypes: { [name: string]: XSDSimpleType } = {};

    xsdStack: Stack<XSDXMLNode> = new Stack<XSDXMLNode>();

    startXMLNode(node: Node): XMLNode {
        const e = super.startXMLNode(node);
        switch (e.name) {
            case "xs:element":
                const xsdXMLNode = new XSDXMLNode(e);
                if (!this.schema.root) {
                    this.schema.root = xsdXMLNode;
                } else if (this.xsdStack.depth()) {
                    this.xsdStack.top().append(xsdXMLNode);
                }
                this.xsdStack.push(xsdXMLNode);
                break;
            case "xs:simpleType":
                this.simpleType = new XSDSimpleType(e);
            default:
                break;
        }
        return e;
    }

    endXMLNode(node: Node): XMLNode {
        const e = this.stack.top();
        switch (e.name) {
            case "xs:element":
                const xsdXMLNode = this.xsdStack.pop();
                xsdXMLNode.fix();
                break;
            case "xs:simpleType":
                this.simpleType.fix();
                this.simpleTypes[this.simpleType.name] = this.simpleType;
                delete this.simpleType;
                break;
            default:
                if (this.simpleType) {
                    this.simpleType.append(e);
                }
        }
        return super.endXMLNode(node);
    }
}

export function parseXSD(xml: string): XSDSchema {
    const saxParser = new XSDParser();
    saxParser.parse(xml);
    return saxParser.schema;
}
