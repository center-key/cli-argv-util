//! cli-argv-util v1.0.1 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

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
};
export { cliArgvUtil };
