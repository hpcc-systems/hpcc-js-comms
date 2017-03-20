import { Cache } from "../../collections/cache";
import { StateObject } from "../../collections/stateful";
import { IConnection, IOptions } from "../../comms/connection";
import { PrimativeValueMap, XMLNode } from "../../util/SAXParser";
import { ECLGraph, Service } from "../services/WsWorkunits";
import { Timer } from "./Timer";

export interface ECLGraphEx extends ECLGraph {
    Wuid: string;
    Time: number;
}
export class Graph extends StateObject<ECLGraphEx, ECLGraphEx> implements ECLGraphEx {
    protected connection: Service;

    get properties(): ECLGraphEx { return this.get(); }
    get Wuid(): string { return this.get("Wuid"); }
    get Name(): string { return this.get("Name"); }
    get Label(): string { return this.get("Label"); }
    get Type(): string { return this.get("Type"); }
    get Complete(): boolean { return this.get("Complete"); }
    get WhenStarted(): Date { return this.get("WhenStarted"); }
    get WhenFinished(): Date { return this.get("WhenFinished"); }
    get Time(): number { return this.get("Time"); }

    constructor(optsConnection: IOptions | IConnection | Service, wuid: string, eclGraph: ECLGraph, eclTimers: Timer[]) {
        super();
        if (optsConnection instanceof Service) {
            this.connection = optsConnection;
        } else {
            this.connection = new Service(optsConnection);
        }
        let duration = 0;
        for (const eclTimer of eclTimers) {
            if (eclTimer.GraphName === eclGraph.Name && !eclTimer.HasSubGraphId) {
                duration = Math.round(eclTimer.Seconds * 1000) / 1000;
                break;
            }
        }
        this.set({ Wuid: wuid, Time: duration, ...eclGraph });
    }
}

export class GraphCache extends Cache<ECLGraph, Graph> {
    constructor() {
        super((obj) => {
            return Cache.hash([obj.Name]);
        });
    }
}

//  XGMML Graph ---

const ATTR_DEFINITION = "definition";

export interface IECLDefintion {
    id: string;
    file: string;
    line: number;
    column: number;
}

export class GraphItem {
    parent: Subgraph;
    id: string;
    attrs: PrimativeValueMap;
    constructor(parent: Subgraph, id: string, attrs: PrimativeValueMap) {
        this.parent = parent;
        this.id = id;
        this.attrs = attrs;
    }

    className(): "XGMMLGraph" | "Subgraph" | "Vertex" | "Edge" {
        return (<any>this.constructor).name;
    }

    hasECLDefinition(): boolean {
        return this.attrs[ATTR_DEFINITION] !== undefined;
    }

    getECLDefinition(): IECLDefintion {
        const match = /([a-z]:\\(?:[-\w\.\d]+\\)*(?:[-\w\.\d]+)?|(?:\/[\w\.\-]+)+)\((\d*),(\d*)\)/.exec(this.attrs[ATTR_DEFINITION]);
        if (match) {
            const [, _file, _row, _col] = match;
            _file.replace("/./", "/");
            return {
                id: this.id,
                file: _file,
                line: +_row,
                column: +_col
            };
        }
        throw `Bad definition:  ${this.attrs[ATTR_DEFINITION]}`;
    }
}

export class Subgraph extends GraphItem {
    subgraphs: Subgraph[] = [];
    subgraphsMap: { [key: string]: Subgraph } = {};
    vertices: Vertex[] = [];
    verticesMap: { [key: string]: Vertex } = {};
    edges: Edge[] = [];
    edgesMap: { [key: string]: Edge } = {};

    constructor(parent: Subgraph, id: string, attrs: PrimativeValueMap) {
        super(parent, id, attrs);
        if (parent) {  //  Only needed for root node
            parent.addSubgraph(this);
        }
    }

    addSubgraph(subgraph: Subgraph) {
        if (this.subgraphsMap[subgraph.id] !== undefined) {
            throw "Subgraph already exists";
        }
        this.subgraphsMap[subgraph.id] = subgraph;
        this.subgraphs.push(subgraph);
    }

    addVertex(vertex: Vertex) {
        if (this.verticesMap[vertex.id] !== undefined) {
            throw "Vertex already exists";
        }
        this.verticesMap[vertex.id] = vertex;
        this.vertices.push(vertex);
    }

    addEdge(edge: Edge) {
        if (this.edgesMap[edge.id] !== undefined) {
            throw "Edge already exists";
        }
        this.edgesMap[edge.id] = edge;
        this.edges.push(edge);
    }

    getNearestDefinition(backwards: boolean = true): IECLDefintion {
        if (this.hasECLDefinition()) {
            return this.getECLDefinition();
        }
        if (backwards) {
            for (let i = this.vertices.length - 1; i >= 0; --i) {
                const vertex = this.vertices[i];
                if (vertex.hasECLDefinition()) {
                    return vertex.getECLDefinition();
                }
            }
        }
        let retVal: IECLDefintion;
        this.vertices.some((vertex) => {
            retVal = vertex.getNearestDefinition();
            if (retVal) {
                return true;
            }
            return false;
        });
        return retVal;
    }
}

export class Vertex extends GraphItem {
    label: string;
    inEdges: Edge[] = [];
    outEdges: Edge[] = [];

    constructor(parent: Subgraph, id: string, label: string, attrs: PrimativeValueMap) {
        super(parent, id, attrs);
        this.label = label;
        parent.addVertex(this);
    }

    getNearestDefinition(): IECLDefintion {
        if (this.hasECLDefinition()) {
            return this.getECLDefinition();
        }
        let retVal: IECLDefintion;
        this.inEdges.some((edge) => {
            retVal = edge.getNearestDefinition();
            if (retVal) {
                return true;
            }
            return false;
        });
        return retVal;
    }
}

export class XGMMLGraph extends Subgraph {
    allSubgraphs: { [key: string]: Subgraph } = {};
    allVertices: { [key: string]: Vertex } = {};
    allEdges: { [key: string]: Edge } = {};

    constructor(id: string) {
        super(null, id, {});
    }

    breakpointLocations(path?: string): IECLDefintion[] {
        const retVal: IECLDefintion[] = [];
        for (const key in this.allVertices) {
            if (this.allVertices.hasOwnProperty(key)) {
                const vertex = this.allVertices[key];
                if (vertex.hasECLDefinition()) {
                    const definition = vertex.getECLDefinition();
                    if (definition && !path || path === definition.file) {
                        retVal.push(definition);
                    }
                }
            }
        }
        return retVal.sort((l, r) => {
            return l.line - r.line;
        });
    }
}

export class Edge extends Subgraph {
    sourceID: string;
    source: Vertex;
    targetID: string;
    target: Vertex;

    constructor(parent: Subgraph, id: string, sourceID: string, targetID: string, attrs: PrimativeValueMap) {
        super(parent, id, attrs);
        this.sourceID = sourceID;
        this.targetID = targetID;
        parent.addEdge(this);
    }

    getNearestDefinition(): IECLDefintion {
        if (this.hasECLDefinition()) {
            return this.getECLDefinition();
        }
        return this.source.getNearestDefinition();
    }
}

type Callback = (tag: string, attributes: PrimativeValueMap, children: XMLNode[], _stack: XMLNode[]) => void;
function walkXmlJson(node: XMLNode, callback: Callback, stack?: XMLNode[]) {
    stack = stack || [];
    stack.push(node);
    callback(node.name, node.attributes, node.children, stack);
    node.children.forEach((childNode) => {
        walkXmlJson(childNode, callback, stack);
    });
    stack.pop();
}

function flattenAtt(nodes: XMLNode[]): PrimativeValueMap {
    const retVal: PrimativeValueMap = {};
    nodes.forEach((node: XMLNode) => {
        if (node.name === "att") {
            retVal[node.attributes["name"]] = node.attributes["value"];
        }
    });
    return retVal;
}

export function createXGMMLGraph(id: string, graphs: XMLNode): XGMMLGraph {
    const graph = new XGMMLGraph(id);
    const stack: Subgraph[] = [graph];
    walkXmlJson(graphs, (tag: string, attributes: PrimativeValueMap, children: XMLNode[], _stack) => {
        const top = stack[stack.length - 1];
        switch (tag) {
            case "graph":
                break;
            case "node":
                if (children.length && children[0].children.length && children[0].children[0].name === "graph") {
                    const subgraph = new Subgraph(top, `graph${attributes["id"]}`, flattenAtt(children));
                    graph.allSubgraphs[subgraph.id] = subgraph;
                    stack.push(subgraph);
                } else {
                    const vertex = new Vertex(top, attributes["id"], attributes["label"], flattenAtt(children));
                    graph.allVertices[vertex.id] = vertex;
                }
                break;
            case "edge":
                const edge = new Edge(top, attributes["id"], attributes["source"], attributes["target"], flattenAtt(children));
                graph.allEdges[edge.id] = edge;
                break;
            default:
        }
    });
    for (const key in graph.allEdges) {
        if (graph.allEdges.hasOwnProperty(key)) {
            const edge = graph.allEdges[key];
            try {
                edge.source = graph.allVertices[edge.sourceID];
                edge.target = graph.allVertices[edge.targetID];
                edge.source.outEdges.push(edge);
                edge.target.inEdges.push(edge);
            } catch (e) { }
        }
    }
    return graph;
}
