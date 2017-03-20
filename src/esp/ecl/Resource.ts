import { StateObject } from "../../collections/stateful";
import { IConnection, IOptions } from "../../comms/connection";
import { Service } from "../services/WsWorkunits";

export interface ResourceEx {
    Wuid: string;
    URL: string;
    DisplayName: string;
    DisplayPath: string;
}

export class Resource extends StateObject<ResourceEx, ResourceEx> implements ResourceEx {
    protected connection: Service;

    get properties(): ResourceEx { return this.get(); }
    get Wuid(): string { return this.get("Wuid"); }
    get URL(): string { return this.get("URL"); }
    get DisplayName(): string { return this.get("DisplayName"); }
    get DisplayPath(): string { return this.get("DisplayPath"); }

    constructor(optsConnection: IOptions | IConnection | Service, wuid: string, url: string) {
        super();
        if (optsConnection instanceof Service) {
            this.connection = optsConnection;
        } else {
            this.connection = new Service(optsConnection);
        }

        const cleanedURL = url.split("\\").join("/");
        const urlParts = cleanedURL.split("/");
        const matchStr = "res/" + wuid + "/";
        let displayPath = "";
        let displayName = "";

        if (cleanedURL.indexOf(matchStr) === 0) {
            displayPath = cleanedURL.substr(matchStr.length);
            displayName = urlParts[urlParts.length - 1];
        }

        this.set({
            Wuid: wuid,
            URL: url,
            DisplayName: displayName,
            DisplayPath: displayPath
        });
    }
}
