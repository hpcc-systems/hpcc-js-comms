import { StateObject } from "../../collections/stateful";
import { IConnection, IOptions } from "../../comms/connection";
import { ECLSourceFile, Service, } from "../services/WsWorkunits";

export interface ECLSourceFileEx extends ECLSourceFile {
    Wuid: string;
}

export class SourceFile extends StateObject<ECLSourceFileEx, ECLSourceFileEx> implements ECLSourceFileEx {
    protected connection: Service;

    get properties(): ECLSourceFile { return this.get(); }
    get Wuid(): string { return this.get("Wuid"); }
    get FileCluster(): string { return this.get("FileCluster"); }
    get Name(): string { return this.get("Name"); }
    get Count(): number { return this.get("Count"); }

    constructor(optsConnection: IOptions | IConnection | Service, wuid: string, eclSourceFile: ECLSourceFile) {
        super();
        if (optsConnection instanceof Service) {
            this.connection = optsConnection;
        } else {
            this.connection = new Service(optsConnection);
        }

        this.set({
            Wuid: wuid,
            ...eclSourceFile
        });
    }
}
