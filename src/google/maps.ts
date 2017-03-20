import { Connection, IConnection, RequestType } from "../comms/connection";

export class GoogleMapsWebService {
    private _connection: IConnection;

    constructor(transport: IConnection = new Connection({ baseUrl: "https://maps.googleapis.com/maps/api", type: RequestType.GET })) {
        this._connection = transport;
    }

    geocode(address: string): Promise<any> {
        return this._connection.send("geocode/json", { address });
    }
}
