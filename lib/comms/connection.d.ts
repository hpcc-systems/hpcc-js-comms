export declare enum RequestType {
    POST = 0,
    GET = 1,
    JSONP = 2,
}
export declare enum ResponseType {
    JSON = 0,
    TEXT = 1,
}
export interface IOptions {
    baseUrl: string;
    type?: RequestType;
    userID?: string;
    password?: string;
    rejectUnauthorized?: boolean;
    timeoutSecs?: number;
}
export interface IConnection {
    opts(_: Partial<IOptions>): this;
    opts(): IOptions;
    send(action: string, request: any, responseType?: ResponseType): Promise<any>;
    clone(): IConnection;
}
export declare function initNodeRequest(nodeRequest: any): void;
export declare function initD3Request(d3Request: any): void;
export declare class Connection implements IConnection {
    protected _opts: IOptions;
    constructor(opts: IOptions);
    protected serialize(obj: any, prefix?: string): string;
    deserialize(body: string): any;
    private nodeRequestSend(verb, action, request, responseType?);
    private d3Send(verb, action, request, responseType?);
    post(action: string, request: any, responseType?: ResponseType): Promise<any>;
    get(action: string, request: any, responseType?: ResponseType): Promise<any>;
    jsonp(action: string, request?: any, responseType?: ResponseType): Promise<any>;
    opts(_: Partial<IOptions>): this;
    opts(): IOptions;
    send(action: string, request: any, responseType?: ResponseType): Promise<any>;
    clone(): Connection;
}
export declare type IConnectionFactory = (opts: IOptions) => IConnection;
export declare let createConnection: IConnectionFactory;
export declare function setTransportFactory(newFunc: IConnectionFactory): IConnectionFactory;
