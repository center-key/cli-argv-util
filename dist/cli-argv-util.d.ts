//! cli-argv-util v1.2.5 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

export type StringFlagMap = {
    [flag: string]: string | undefined;
};
export type BooleanFlagMap = {
    [flag: string]: boolean;
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
    }, posix: string): Buffer;
    readFolder(folder: string): string[];
    unquoteArgs(args: string[]): string[];
};
export { cliArgvUtil };
