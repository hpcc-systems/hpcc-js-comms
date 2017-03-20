import { trim } from "../util/string";

export function join(...args: string[]): string {
    return args.map((arg) => {
        return trim(arg, "/");
    }).join("/");
}
