import { Cache } from "../../collections/cache";
import { StateObject } from "../../collections/stateful";
import { IConnection, IOptions } from "../../comms/connection";
import { exists } from "../../util/object";
import { parseXSD, XSDSchema } from "../../util/SAXParser";
import { DFULogicalFile } from "../services/WsDFU";
import { ECLResult, ECLSchemas, Service, WUResultRequest, WUResultResponse } from "../services/WsWorkunits";

export interface ECLResultEx extends ECLResult {
    Wuid: string;
    ResultViews: any[];
}
export class Result extends StateObject<ECLResultEx & DFULogicalFile, ECLResultEx | DFULogicalFile> implements ECLResultEx {
    protected connection: Service;
    protected xsdSchema: XSDSchema;

    get properties(): ECLResult { return this.get(); }
    get Wuid(): string { return this.get("Wuid"); }
    get Name(): string { return this.get("Name"); }
    get Sequence(): number { return this.get("Sequence"); }
    get Value(): string { return this.get("Value"); }
    get Link(): string { return this.get("Link"); }
    get FileName(): string { return this.get("FileName"); }
    get IsSupplied(): boolean { return this.get("IsSupplied"); }
    get ShowFileContent() { return this.get("ShowFileContent"); }
    get Total(): number { return this.get("Total"); }
    get ECLSchemas(): ECLSchemas { return this.get("ECLSchemas"); }
    get NodeGroup(): string { return this.get("NodeGroup"); }
    get ResultViews(): any[] { return this.get("ResultViews"); }

    constructor(optsConnection: IOptions | IConnection | Service, wuid: string, eclResult: ECLResult, resultViews: any[]) {
        super();
        if (optsConnection instanceof Service) {
            this.connection = optsConnection;
        } else {
            this.connection = new Service(optsConnection);
        }
        this.set({
            Wuid: wuid,
            ResultViews: resultViews,
            ...eclResult
        });
    }

    isComplete() {
        return this.Total !== -1;
    }

    fetchXMLSchema(): Promise<XSDSchema> {
        if (this.xsdSchema) {
            return Promise.resolve(this.xsdSchema);
        }
        return this.WUResult().then((response) => {
            if (exists("Result.XmlSchema.xml", response)) {
                this.xsdSchema = parseXSD(response.Result.XmlSchema.xml);
                return this.xsdSchema;
            }
            return this;
        });
    }

    fetchRows(from: number = 0, to: number = -1): Promise<any[]> {
        return this.WUResult(from, to, true).then((response) => {
            if (exists("Result.Row", response)) {
                return response.Result.Row;
            }
            return [];
        });
    }

    protected WUResult(start: number = 0, count: number = 1, suppressXmlSchema: boolean = false): Promise<WUResultResponse> {
        const request: WUResultRequest = <WUResultRequest>{};
        if (this.Wuid && this.Sequence !== undefined) {
            request.Wuid = this.Wuid;
            request.Sequence = this.Sequence;
        } else if (this.Name && this.NodeGroup) {
            request.LogicalName = this.Name;
            request.Cluster = this.NodeGroup;
        } else if (this.Name) {
            request.LogicalName = this.Name;
        }
        request.Start = start;
        request.Count = count;
        request.SuppressXmlSchema = suppressXmlSchema;
        return this.connection.WUResult(request).then((response) => {
            return response;
        });
    }
}

export class ResultCache extends Cache<ECLResult, Result> {
    constructor() {
        super((obj) => {
            return Cache.hash([obj.Sequence, obj.Name, obj.FileName]);
        });
    }
}
