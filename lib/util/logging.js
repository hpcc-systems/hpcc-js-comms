import { Stack } from "../collections/stack";
import { isNode } from "./platform";
export var Level;
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
export { Logging };
export var logger = Logging.Instance();
var ScopedLogging = (function () {
    function ScopedLogging(scopeID) {
        this._scopeID = scopeID;
    }
    ScopedLogging.prototype.debug = function (msg) {
        logger.debug(this._scopeID, msg);
    };
    ScopedLogging.prototype.info = function (msg) {
        logger.info(this._scopeID, msg);
    };
    ScopedLogging.prototype.notice = function (msg) {
        logger.notice(this._scopeID, msg);
    };
    ScopedLogging.prototype.warning = function (msg) {
        logger.warning(this._scopeID, msg);
    };
    ScopedLogging.prototype.error = function (msg) {
        logger.error(this._scopeID, msg);
    };
    ScopedLogging.prototype.critical = function (msg) {
        logger.critical(this._scopeID, msg);
    };
    ScopedLogging.prototype.alert = function (msg) {
        logger.alert(this._scopeID, msg);
    };
    ScopedLogging.prototype.emergency = function (msg) {
        logger.emergency(this._scopeID, msg);
    };
    ScopedLogging.prototype.pushLevel = function (_) {
        logger.pushLevel(_);
        return this;
    };
    ScopedLogging.prototype.popLevel = function () {
        logger.popLevel();
        return this;
    };
    return ScopedLogging;
}());
export { ScopedLogging };
export function scopedLogger(scopeID, filter) {
    if (filter === void 0) { filter = true; }
    if (filter) {
        logger.filter(scopeID);
    }
    return new ScopedLogging(scopeID);
}
//# sourceMappingURL=logging.js.map