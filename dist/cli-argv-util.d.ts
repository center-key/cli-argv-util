//! cli-argv-util v1.5.1 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

export type StringFlagMap = {
    [flag: string]: string | undefined;
};
export type BooleanFlagMap = {
    [flag: string]: boolean;
};
export type Ancestor = {
    common: string;
    source: string;
    target: string;
    renamed: boolean;
    filename: string | null;
    message: string;
};
export type Result = {
    flagMap: StringFlagMap;
    flagMapRaw: StringFlagMap;
    flagOn: BooleanFlagMap;
    invalidFlag: string | null;
    invalidFlagMsg: string | null;
    paramCount: number;
    params: string[];
};
type Json = string | number | boolean | null | undefined | JsonObject | Json[];
type JsonObject = {
    [key: string]: Json;
};
declare const cliArgvUtil: {
    assert(ok: unknown, message: string | null): void;
    readPackageJson(): JsonObject;
    escapers: {
        regex: RegExp;
        char: string;
    }[];
    unescape(text: string, pkg: JsonObject): string;
    parse(validFlags: string[]): Result;
    run(packageJson: {
        [key: string]: unknown;
    }, posix: string): NonSharedBuffer;
    readFolder(folder: string): string[];
    cleanPath(name: string): string;
    calcAncestor(sourceFile: string, targetFile: string): Ancestor;
    unquoteArgs(args: string[]): string[];
};
export { cliArgvUtil };
