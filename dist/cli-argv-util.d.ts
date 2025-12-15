//! cli-argv-util v1.4.0 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

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
    message: string;
};
export type Result = {
    flagMap: StringFlagMap;
    flagOn: BooleanFlagMap;
    invalidFlag: string | null;
    invalidFlagMsg: string | null;
    params: string[];
    paramCount: number;
};
declare const cliArgvUtil: {
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
