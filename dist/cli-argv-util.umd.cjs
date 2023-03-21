//! cli-argv-util v1.0.1 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cliArgvUtil = void 0;
    const cliArgvUtil = {
        parse(validFlags) {
            var _a, _b;
            const toCamel = (token) => token.replace(/-./g, char => char[1].toUpperCase());
            const toEntry = (pair) => [toCamel(pair[0]), pair[1]];
            const toPair = (flag) => flag.replace(/^--/, '').split('=');
            const args = process.argv.slice(2);
            const pairs = args.filter(arg => /^--/.test(arg)).map(toPair);
            const flagMap = Object.fromEntries(pairs.map(toEntry));
            const onEntries = validFlags.map(flag => [toCamel(flag), toCamel(flag) in flagMap]);
            const invalidFlag = (_b = (_a = pairs.find(pair => !validFlags.includes(pair[0]))) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
            const helpMsg = '\nValid flags are --' + validFlags.join(' --');
            const params = args.filter(arg => !/^--/.test(arg));
            return {
                flagMap: flagMap,
                flagOn: Object.fromEntries(onEntries),
                invalidFlag: invalidFlag,
                invalidFlagMsg: invalidFlag ? 'Invalid flag: --' + invalidFlag + helpMsg : null,
                params: params,
                paramCount: params.length,
            };
        },
    };
    exports.cliArgvUtil = cliArgvUtil;
});
