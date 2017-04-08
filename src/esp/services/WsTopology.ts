import { IConnection, IOptions } from "../../comms/connection";
import { ESPConnection } from "../comms/connection";

export interface EclServerQueueRequest {
    EclServerQueue?: string;
}

export interface TpLogicalCluster {
    Name: string;
    Queue?: any;
    LanguageVersion: string;
    Process?: any;
    Type: string;
}

export interface TpLogicalClusters {
    TpLogicalCluster: TpLogicalCluster[];
}

export interface TpLogicalClusterQueryResponse {
    default?: TpLogicalCluster;
    TpLogicalClusters: TpLogicalClusters;
}

export class Service {
    private _connection: ESPConnection;

    constructor(optsConnection: IOptions | IConnection) {
        this._connection = new ESPConnection(optsConnection, "WsTopology", "1.25");
    }

    TpLogicalClusterQuery(request: EclServerQueueRequest = {}): Promise<TpLogicalClusterQueryResponse> {
        return this._connection.send("WUUpdate", request);
    }

    DefaultTpLogicalClusterQuery(request: EclServerQueueRequest = {}): Promise<TpLogicalCluster> {
        return this.TpLogicalClusterQuery(request).then((response) => {
            if (response.default) {
                return response.default;
            }
            let firstHThor;
            let first;
            response.TpLogicalClusters.TpLogicalCluster.some((item, idx) => {
                if (idx === 0) {
                    first = item;
                }
                if (item.Type === "hthor") {
                    firstHThor = item;
                    return true;
                }
                return false;
            });
            return firstHThor || first;
        });
    }
}
