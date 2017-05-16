export declare enum Level {
    debug = 0,
    info = 1,
    notice = 2,
    warning = 3,
    error = 4,
    critical = 5,
    alert = 6,
    emergency = 7,
}
export declare class Logging {
    private static _instance;
    private _levelStack;
    private _level;
    private _filter;
    static Instance(): Logging;
    private constructor();
    private stringify(obj);
    log(level: Level, id: string, msg: string | object): void;
    debug(id: string, msg: string | object): void;
    info(id: string, msg: string | object): void;
    notice(id: string, msg: string | object): void;
    warning(id: string, msg: string | object): void;
    error(id: string, msg: string | object): void;
    critical(id: string, msg: string | object): void;
    alert(id: string, msg: string | object): void;
    emergency(id: string, msg: string | object): void;
    level(): Level;
    level(_: Level): this;
    pushLevel(_: Level): this;
    popLevel(): this;
    filter(): string;
    filter(_: string): this;
}
export declare const logger: Logging;
export declare class ScopedLogging {
    protected _scopeID: string;
    constructor(scopeID: string);
    debug(msg: string | object): void;
    info(msg: string | object): void;
    notice(msg: string | object): void;
    warning(msg: string | object): void;
    error(msg: string | object): void;
    critical(msg: string | object): void;
    alert(msg: string | object): void;
    emergency(msg: string | object): void;
    pushLevel(_: Level): this;
    popLevel(): this;
}
export declare function scopedLogger(scopeID: string, filter?: boolean): ScopedLogging;
