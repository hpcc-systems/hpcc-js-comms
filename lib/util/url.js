import { trim } from "../util/string";
export function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var partialUrl = args.length && args[0].length && args[0].charAt(0) === "/";
    return (partialUrl ? "/" : "") + args.map(function (arg) {
        return trim(arg, "/");
    }).join("/");
}
//# sourceMappingURL=url.js.map