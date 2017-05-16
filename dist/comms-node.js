'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nodeRequest = require('request');
var tslib_1 = require('tslib');
var safeBuffer = require('safe-buffer');

/**
 * A generic Stack
 */
var Stack = (function () {
    function Stack() {
        this.stack = [];
    }
    /**
     * Push element onto the stack
     *
     * @param e - element to push
     */
    Stack.prototype.push = function (e) {
        this.stack.push(e);
        return e;
    };
    /**
     * Pop element off the stack
     */
    Stack.prototype.pop = function () {
        return this.stack.pop();
    };
    /**
     * Top item on the stack
     *
     * @returns Top element on the stack
     */
    Stack.prototype.top = function () {
        return this.stack.length ? this.stack[this.stack.length - 1] : undefined;
    };
    /**
     * Depth of stack
     *
     * @returns Depth
     */
    Stack.prototype.depth = function () {
        return this.stack.length;
    };
    return Stack;
}());

var root = new Function("try{return global;}catch(e){return window;}")();

var isNode = new Function("try{return this===global;}catch(e){return false;}");

var Level;
(function (Level) {
    Level[Level["debug"] = 0] = "debug";
    Level[Level["info"] = 1] = "info";
    Level[Level["notice"] = 2] = "notice";
    Level[Level["warning"] = 3] = "warning";
    Level[Level["error"] = 4] = "error";
    Level[Level["critical"] = 5] = "critical";
    Level[Level["alert"] = 6] = "alert";
    Level[Level["emergency"] = 7] = "emergency";
})(Level || (Level = {}));
var colours = {
    debug: "cyan",
    info: "green",
    notice: "grey",
    warning: "blue",
    errpr: "red",
    critical: "magenta",
    alert: "magenta",
    emergency: "magenta"
};
var Logging = (function () {
    function Logging() {
        this._levelStack = new Stack();
        this._level = Level.error;
        this._filter = "";
    }
    Logging.Instance = function () {
        return this._instance || (this._instance = new this());
    };
    Logging.prototype.stringify = function (obj) {
        var cache = [];
        return JSON.stringify(obj, function (_key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        }, 2);
    };
    Logging.prototype.log = function (level, id, msg) {
        if (level < this._level)
            return;
        if (this._filter && this._filter !== id)
            return;
        var d = new Date();
        var n = d.toISOString();
        if (typeof msg !== "string") {
            msg = this.stringify(msg);
        }
        if (isNode) {
            // tslint:disable-next-line:no-console
            console.log("[" + n + "] " + Level[level].toUpperCase() + " " + id + ":  " + msg);
        }
        else {
            // tslint:disable-next-line:no-console
            console.log("[" + n + "] %c" + Level[level].toUpperCase() + "%c " + id + ":  " + msg, "color:" + colours[Level[level]], "");
        }
    };
    Logging.prototype.debug = function (id, msg) {
        this.log(Level.debug, id, msg);
    };
    Logging.prototype.info = function (id, msg) {
        this.log(Level.info, id, msg);
    };
    Logging.prototype.notice = function (id, msg) {
        this.log(Level.notice, id, msg);
    };
    Logging.prototype.warning = function (id, msg) {
        this.log(Level.warning, id, msg);
    };
    Logging.prototype.error = function (id, msg) {
        this.log(Level.error, id, msg);
    };
    Logging.prototype.critical = function (id, msg) {
        this.log(Level.critical, id, msg);
    };
    Logging.prototype.alert = function (id, msg) {
        this.log(Level.alert, id, msg);
    };
    Logging.prototype.emergency = function (id, msg) {
        this.log(Level.emergency, id, msg);
    };
    Logging.prototype.level = function (_) {
        if (!arguments.length)
            return this._level;
        this._level = _;
        return this;
    };
    Logging.prototype.pushLevel = function (_) {
        this._levelStack.push(this._level);
        this._level = _;
        return this;
    };
    Logging.prototype.popLevel = function () {
        this._level = this._levelStack.pop();
        return this;
    };
    Logging.prototype.filter = function (_) {
        if (!arguments.length)
            return this._filter;
        this._filter = _;
        return this;
    };
    return Logging;
}());
var logger$1 = Logging.Instance();
var ScopedLogging = (function () {
    function ScopedLogging(scopeID) {
        this._scopeID = scopeID;
    }
    ScopedLogging.prototype.debug = function (msg) {
        logger$1.debug(this._scopeID, msg);
    };
    ScopedLogging.prototype.info = function (msg) {
        logger$1.info(this._scopeID, msg);
    };
    ScopedLogging.prototype.notice = function (msg) {
        logger$1.notice(this._scopeID, msg);
    };
    ScopedLogging.prototype.warning = function (msg) {
        logger$1.warning(this._scopeID, msg);
    };
    ScopedLogging.prototype.error = function (msg) {
        logger$1.error(this._scopeID, msg);
    };
    ScopedLogging.prototype.critical = function (msg) {
        logger$1.critical(this._scopeID, msg);
    };
    ScopedLogging.prototype.alert = function (msg) {
        logger$1.alert(this._scopeID, msg);
    };
    ScopedLogging.prototype.emergency = function (msg) {
        logger$1.emergency(this._scopeID, msg);
    };
    ScopedLogging.prototype.pushLevel = function (_) {
        logger$1.pushLevel(_);
        return this;
    };
    ScopedLogging.prototype.popLevel = function () {
        logger$1.popLevel();
        return this;
    };
    return ScopedLogging;
}());
function scopedLogger(scopeID, filter) {
    if (filter === void 0) { filter = true; }
    if (filter) {
        logger$1.filter(scopeID);
    }
    return new ScopedLogging(scopeID);
}

function trim(str, char) {
    if (typeof char !== "string")
        return str;
    if (char.length === 0)
        return str;
    while (str.indexOf(char) === 0) {
        str = str.substring(1);
    }
    while (endsWith(str, char)) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}
function endsWith(origString, searchString, position) {
    var subjectString = origString.toString();
    if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}

function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var partialUrl = args.length && args[0].length && args[0].charAt(0) === "/";
    return (partialUrl ? "/" : "") + args.map(function (arg) {
        return trim(arg, "/");
    }).join("/");
}

var logger$$1 = scopedLogger("comms/connection.ts");

(function (RequestType) {
    RequestType[RequestType["POST"] = 0] = "POST";
    RequestType[RequestType["GET"] = 1] = "GET";
    RequestType[RequestType["JSONP"] = 2] = "JSONP";
})(exports.RequestType || (exports.RequestType = {}));

(function (ResponseType) {
    ResponseType[ResponseType["JSON"] = 0] = "JSON";
    ResponseType[ResponseType["TEXT"] = 1] = "TEXT";
})(exports.ResponseType || (exports.ResponseType = {}));
var DefaultOptions = {
    type: exports.RequestType.POST,
    baseUrl: "",
    userID: "",
    password: "",
    rejectUnauthorized: false,
    timeoutSecs: 60
};
//  Polyfill helpers  ---
var _nodeRequest = null;
function initNodeRequest(nodeRequest$$1) {
    _nodeRequest = nodeRequest$$1;
}
var _d3Request = null;

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
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
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
                    resolve(responseType === exports.ResponseType.JSON ? _this.deserialize(body) : body);
                }
                else {
                    reject(new Error(body));
                }
            });
        });
    };
    Connection.prototype.d3Send = function (verb, action, request, responseType) {
        var _this = this;
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
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
                    resolve(responseType === exports.ResponseType.JSON ? _this.deserialize(resp.responseText) : resp.responseText);
                }
                else {
                    reject(new Error(resp.responseText));
                }
            });
        });
    };
    Connection.prototype.post = function (action, request, responseType) {
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
        if (_nodeRequest) {
            return this.nodeRequestSend("POST", action, request, responseType);
        }
        else if (_d3Request) {
            return this.d3Send("POST", action, request, responseType);
        }
        throw new Error("No transport");
    };
    Connection.prototype.get = function (action, request, responseType) {
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
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
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
        return new Promise(function (resolve, reject) {
            var respondedTimeout = _this._opts.timeoutSecs * 1000;
            var respondedTick = 5000;
            var callbackName = "jsonp_callback_" + Math.round(Math.random() * 999999);
            var context = _this;
            window[callbackName] = function (response) {
                respondedTimeout = 0;
                doCallback();
                resolve(responseType === exports.ResponseType.JSON && typeof response === "string" ? context.deserialize(response) : response);
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
                        logger$$1.error("Request timeout:  " + script.src);
                        doCallback();
                        reject(Error("Request timeout:  " + script.src));
                    }
                    else {
                        logger$$1.debug("Request pending (" + respondedTimeout / 1000 + " sec):  " + script.src);
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
        if (responseType === void 0) { responseType = exports.ResponseType.JSON; }
        switch (this._opts.type) {
            case exports.RequestType.JSONP:
                return this.jsonp(action, request, responseType);
            case exports.RequestType.GET:
                return this.get(action, request, responseType);
            case exports.RequestType.POST:
            default:
                return this.post(action, request, responseType);
        }
    };
    Connection.prototype.clone = function () {
        return new Connection(this.opts());
    };
    return Connection;
}());

var version = "0.0.1";

//  XHR polyfill  ---
initNodeRequest(nodeRequest);
//  btoa polyfill  ---
if (typeof btoa === "undefined") {
    global.btoa = function (str) {
        return safeBuffer.Buffer.from(str || "", "utf8").toString("base64");
    };
}

exports.version = version;
exports.Connection = Connection;
//# sourceMappingURL=comms-node.js.map
