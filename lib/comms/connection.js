import * as tslib_1 from "tslib";
import { scopedLogger } from "../util/logging";
import { join } from "../util/url";
var logger = scopedLogger("comms/connection.ts");
export var RequestType;
(function (RequestType) {
    RequestType[RequestType["POST"] = 0] = "POST";
    RequestType[RequestType["GET"] = 1] = "GET";
    RequestType[RequestType["JSONP"] = 2] = "JSONP";
})(RequestType || (RequestType = {}));
export var ResponseType;
(function (ResponseType) {
    ResponseType[ResponseType["JSON"] = 0] = "JSON";
    ResponseType[ResponseType["TEXT"] = 1] = "TEXT";
})(ResponseType || (ResponseType = {}));
var DefaultOptions = {
    type: RequestType.POST,
    baseUrl: "",
    userID: "",
    password: "",
    rejectUnauthorized: false,
    timeoutSecs: 60
};
//  Polyfill helpers  ---
var _nodeRequest = null;
export function initNodeRequest(nodeRequest) {
    _nodeRequest = nodeRequest;
}
var _d3Request = null;
export function initD3Request(d3Request) {
    _d3Request = d3Request;
}
var Connection = (function () {
    function Connection(opts) {
        this.opts(opts);
    }
    Connection.prototype.serialize = function (obj, prefix) {
        var _this = this;
        if (prefix === void 0) { prefix = ""; }
        if (prefix) {
            prefix += ".";
        }
        if (typeof obj !== "object") {
            return encodeURIComponent(obj);
        }
        var str = [];
        var _loop_1 = function (key) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] instanceof Array) {
                    //  Specific to ESP - but no REST standard exists...
                    var includeItemCount_1 = false;
                    obj[key].forEach(function (row, i) {
                        if (typeof row === "object") {
                            includeItemCount_1 = true;
                            str.push(_this.serialize(row, prefix + encodeURIComponent(key + "." + i)));
                        }
                        else {
                            str.push(prefix + encodeURIComponent(key + "_i" + i) + "=" + _this.serialize(row));
                        }
                    });
                    if (includeItemCount_1) {
                        str.push(prefix + encodeURIComponent(key + ".itemcount") + "=" + obj[key].length);
                    }
                }
                else if (typeof obj[key] === "object") {
                    str.push(this_1.serialize(obj[key], prefix + encodeURIComponent(key)));
                }
                else {
                    str.push(prefix + encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                }
            }
        };
        var this_1 = this;
        for (var key in obj) {
            _loop_1(key);
        }
        return str.join("&");
    };
    Connection.prototype.deserialize = function (body) {
        return JSON.parse(body);
    };
    Connection.prototype.nodeRequestSend = function (verb, action, request, responseType) {
        var _this = this;
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        return new Promise(function (resolve, reject) {
            var options = {
                method: verb,
                uri: join(_this._opts.baseUrl, action),
                auth: {
                    user: _this._opts.userID,
                    pass: _this._opts.password,
                    sendImmediately: true
                },
                username: _this._opts.userID,
                password: _this._opts.password,
                timeout: _this._opts.timeoutSecs * 1000
            };
            //  Older ESP versions were not case insensitive  ---
            var oldESPAuth = "Basic " + btoa(_this._opts.userID + ":" + _this._opts.password);
            switch (verb) {
                case "GET":
                    options.headers = {
                        Authorization: oldESPAuth
                    };
                    options.uri += "?" + _this.serialize(request);
                    break;
                case "POST":
                    options.headers = {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": oldESPAuth
                    };
                    options.rejectUnauthorized = _this._opts.rejectUnauthorized;
                    options.body = _this.serialize(request);
                    break;
                default:
            }
            _nodeRequest(options, function (err, resp, body) {
                if (err) {
                    reject(new Error(err));
                }
                else if (resp && resp.statusCode === 200) {
                    resolve(responseType === ResponseType.JSON ? _this.deserialize(body) : body);
                }
                else {
                    reject(new Error(body));
                }
            });
        });
    };
    Connection.prototype.d3Send = function (verb, action, request, responseType) {
        var _this = this;
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        return new Promise(function (resolve, reject) {
            var options = {
                method: verb,
                uri: join(_this._opts.baseUrl, action),
                auth: {
                    user: _this._opts.userID,
                    pass: _this._opts.password,
                    sendImmediately: true
                },
                username: _this._opts.userID,
                password: _this._opts.password
            };
            switch (verb) {
                case "GET":
                    options.uri += "?" + _this.serialize(request);
                    break;
                case "POST":
                    options.headers = {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded"
                    };
                    options.rejectUnauthorized = _this._opts.rejectUnauthorized;
                    options.body = _this.serialize(request);
                    break;
                default:
            }
            var xhr = _d3Request(options.uri)
                .timeout(_this._opts.timeoutSecs * 1000);
            if (verb === "POST") {
                xhr
                    .header("X-Requested-With", "XMLHttpRequest")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Origin", null);
            }
            xhr
                .send(verb, options.body, function (err, resp) {
                if (err) {
                    reject(new Error(err));
                }
                else if (resp && resp.status === 200) {
                    resolve(responseType === ResponseType.JSON ? _this.deserialize(resp.responseText) : resp.responseText);
                }
                else {
                    reject(new Error(resp.responseText));
                }
            });
        });
    };
    Connection.prototype.post = function (action, request, responseType) {
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        if (_nodeRequest) {
            return this.nodeRequestSend("POST", action, request, responseType);
        }
        else if (_d3Request) {
            return this.d3Send("POST", action, request, responseType);
        }
        throw new Error("No transport");
    };
    Connection.prototype.get = function (action, request, responseType) {
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        if (_nodeRequest) {
            return this.nodeRequestSend("GET", action, request, responseType);
        }
        else if (_d3Request) {
            return this.d3Send("GET", action, request, responseType);
        }
        throw new Error("No transport");
    };
    Connection.prototype.jsonp = function (action, request, responseType) {
        var _this = this;
        if (request === void 0) { request = {}; }
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        return new Promise(function (resolve, reject) {
            var respondedTimeout = _this._opts.timeoutSecs * 1000;
            var respondedTick = 5000;
            var callbackName = "jsonp_callback_" + Math.round(Math.random() * 999999);
            var context = _this;
            window[callbackName] = function (response) {
                respondedTimeout = 0;
                doCallback();
                resolve(responseType === ResponseType.JSON && typeof response === "string" ? context.deserialize(response) : response);
            };
            var script = document.createElement("script");
            var url = join(_this._opts.baseUrl, action);
            url += url.indexOf("?") >= 0 ? "&" : "?";
            script.src = url + "jsonp=" + callbackName + "&" + _this.serialize(request);
            document.body.appendChild(script);
            var progress = setInterval(function () {
                if (respondedTimeout <= 0) {
                    clearInterval(progress);
                }
                else {
                    respondedTimeout -= respondedTick;
                    if (respondedTimeout <= 0) {
                        clearInterval(progress);
                        logger.error("Request timeout:  " + script.src);
                        doCallback();
                        reject(Error("Request timeout:  " + script.src));
                    }
                    else {
                        logger.debug("Request pending (" + respondedTimeout / 1000 + " sec):  " + script.src);
                    }
                }
            }, respondedTick);
            function doCallback() {
                delete window[callbackName];
                document.body.removeChild(script);
            }
        });
    };
    Connection.prototype.opts = function (_) {
        if (arguments.length === 0)
            return this._opts;
        this._opts = tslib_1.__assign({}, DefaultOptions, _);
        return this;
    };
    Connection.prototype.send = function (action, request, responseType) {
        if (responseType === void 0) { responseType = ResponseType.JSON; }
        switch (this._opts.type) {
            case RequestType.JSONP:
                return this.jsonp(action, request, responseType);
            case RequestType.GET:
                return this.get(action, request, responseType);
            case RequestType.POST:
            default:
                return this.post(action, request, responseType);
        }
    };
    Connection.prototype.clone = function () {
        return new Connection(this.opts());
    };
    return Connection;
}());
export { Connection };
export var createConnection = function (opts) {
    return new Connection(opts);
};
export function setTransportFactory(newFunc) {
    var retVal = createConnection;
    createConnection = newFunc;
    return retVal;
}
//# sourceMappingURL=connection.js.map