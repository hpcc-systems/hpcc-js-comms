import { join } from "../util/url";

export enum RequestType {
    POST,
    GET,
    JSONP
}

export enum ResponseType {
    JSON,
    TEXT
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

//  Polyfill helpers  ---
let _nodeRequest: any = null;
export function initNodeRequest(nodeRequest: any) {
    _nodeRequest = nodeRequest;
}

let _d3Request: any = null;
export function initD3Request(d3Request: any) {
    _d3Request = d3Request;
}

export class Connection implements IConnection {
    protected _opts: IOptions = {
        type: RequestType.POST,
        baseUrl: "",
        userID: "",
        password: "",
        rejectUnauthorized: false,
        timeoutSecs: 60
    };

    constructor(opts: IOptions) {
        this.opts(opts);
    }

    protected serialize(obj: any, prefix: string = ""): string {
        if (prefix) {
            prefix += ".";
        }
        if (typeof obj !== "object") {
            return encodeURIComponent(obj);
        }

        const str: string[] = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] instanceof Array) {
                    //  Specific to ESP - but no REST standard exists...
                    let includeItemCount = false;
                    obj[key].forEach((row: any, i: number) => {
                        if (typeof row === "object") {
                            includeItemCount = true;
                            str.push(this.serialize(row, prefix + encodeURIComponent(`${key}.${i}`)));
                        } else {
                            str.push(prefix + encodeURIComponent(`${key}_i${i}`) + "=" + this.serialize(row));
                        }
                    });
                    if (includeItemCount) {
                        str.push(prefix + encodeURIComponent(`${key}.itemcount`) + "=" + obj[key].length);
                    }
                } else if (typeof obj[key] === "object") {
                    str.push(this.serialize(obj[key], prefix + encodeURIComponent(key)));
                } else {
                    str.push(prefix + encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                }
            }
        }
        return str.join("&");
    }

    deserialize(body: string) {
        return JSON.parse(body);
    }

    private nodeRequestSend(verb: "POST" | "GET", action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        return new Promise((resolve, reject) => {
            const options: any = {
                method: verb,
                uri: join(this._opts.baseUrl, action),
                auth: {
                    user: this._opts.userID,
                    pass: this._opts.password,
                    sendImmediately: true
                },
                username: this._opts.userID,
                password: this._opts.password,
                timeout: this._opts.timeoutSecs * 1000
            };
            switch (verb) {
                case "GET":
                    options.uri += "?" + this.serialize(request);
                    break;
                case "POST":
                    options.headers = {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded"
                    };
                    options.rejectUnauthorized = this._opts.rejectUnauthorized;
                    options.body = this.serialize(request);
                    break;
                default:
            }
            _nodeRequest(options, (err: any, resp: any, body: any) => {
                if (err) {
                    reject(new Error(err));
                } else if (resp && resp.statusCode === 200) {
                    resolve(responseType === ResponseType.JSON ? this.deserialize(body) : body);
                } else {
                    reject(new Error(body));
                }
            });
        });
    }

    private d3Send(verb: "POST" | "GET", action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        return new Promise((resolve, reject) => {
            const options: any = {
                method: verb,
                uri: join(this._opts.baseUrl, action),
                auth: {
                    user: this._opts.userID,
                    pass: this._opts.password,
                    sendImmediately: true
                },
                username: this._opts.userID,
                password: this._opts.password
            };
            switch (verb) {
                case "GET":
                    options.uri += "?" + this.serialize(request);
                    break;
                case "POST":
                    options.headers = {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded"
                    };
                    options.rejectUnauthorized = this._opts.rejectUnauthorized;
                    options.body = this.serialize(request);
                    break;
                default:
            }
            const xhr = _d3Request(options.uri);
            if (verb === "POST") {
                xhr
                    .header("X-Requested-With", "XMLHttpRequest")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Origin", null)
                    ;
            }
            xhr
                .send(verb, options.body, (err: any, req: any) => {
                    if (err) {
                        reject(new Error(err));
                    } else if (req && req.status === 200) {
                        resolve(responseType === ResponseType.JSON ? this.deserialize(req.responseText) : req.responseText);
                    } else {
                        reject(new Error(req.responseText));
                    }
                });
        });
    }

    post(action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        if (_nodeRequest) {
            return this.nodeRequestSend("POST", action, request, responseType);
        } else if (_d3Request) {
            return this.d3Send("POST", action, request, responseType);
        }
        throw new Error("No transport");
    }

    get(action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        if (_nodeRequest) {
            return this.nodeRequestSend("GET", action, request, responseType);
        } else if (_d3Request) {
            return this.d3Send("GET", action, request, responseType);
        }
        throw new Error("No transport");
    }

    jsonp(action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let respondedTimeout = this._opts.timeoutSecs * 1000;
            const respondedTick = 5000;
            const callbackName = "jsonp_callback_" + Math.round(Math.random() * 999999);
            const context = this;
            (window as any)[callbackName] = function (response: any) {
                respondedTimeout = 0;
                doCallback();
                resolve(responseType === ResponseType.JSON && typeof response === "string" ? context.deserialize(response) : response);
            };
            const script = document.createElement("script");
            let url = join(this._opts.baseUrl, action);
            url += url.indexOf("?") >= 0 ? "&" : "?";
            script.src = url + "jsonp=" + callbackName + "&" + this.serialize(request);
            document.body.appendChild(script);
            const progress = setInterval(function () {
                if (respondedTimeout <= 0) {
                    clearInterval(progress);
                } else {
                    respondedTimeout -= respondedTick;
                    if (respondedTimeout <= 0) {
                        clearInterval(progress);
                        // console.log("Request timeout:  " + script.src);
                        doCallback();
                        reject(Error("Request timeout:  " + script.src));
                    } else {
                        // console.log("Request pending (" + respondedTimeout / 1000 + " sec):  " + script.src);
                    }
                }
            }, respondedTick);

            function doCallback() {
                delete (window as any)[callbackName];
                document.body.removeChild(script);
            }
        });
    }

    //  IConnection  ---

    opts(_: Partial<IOptions>): this;
    opts(): IOptions;
    opts(_?: Partial<IOptions>): this | IOptions {
        if (arguments.length === 0) return this._opts;
        this._opts = { ...this._opts, ..._ };
        return this;
    }

    send(action: string, request: any, responseType: ResponseType = ResponseType.JSON): Promise<any> {
        switch (this._opts.type) {
            case RequestType.JSONP:
                return this.jsonp(action, request, responseType);
            case RequestType.GET:
                return this.get(action, request, responseType);
            case RequestType.POST:
            default:
                return this.post(action, request, responseType);
        }
    }

    clone() {
        return new Connection(this.opts());
    }
}

export type IConnectionFactory = (opts: IOptions) => IConnection;
export let createConnection: IConnectionFactory = function (opts: IOptions): IConnection {
    return new Connection(opts);
};

export function setTransportFactory(newFunc: IConnectionFactory): IConnectionFactory {
    const retVal = createConnection;
    createConnection = newFunc;
    return retVal;
}
