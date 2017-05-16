import { trim } from "../util/string";

export function join(...args: string[]): string {
    const partialUrl: boolean = args.length && args[0].length && args[0].charAt(0) === "/";
    return (partialUrl ? "/" : "") + args.map((arg) => {
        return trim(arg, "/");
    }).join("/");
}
