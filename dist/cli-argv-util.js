//! cli-argv-util v1.2.5 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

import { execSync } from 'node:child_process';
import fs from 'fs';
import slash from 'slash';
const cliArgvUtil = {
    parse(validFlags) {
        const toCamel = (token) => token.replace(/-./g, char => char[1].toUpperCase());
        const toEntry = (pair) => [toCamel(pair[0]), pair[1]];
        const toPair = (flag) => flag.replace(/^--/, '').split('=');
        const args = cliArgvUtil.unquoteArgs(process.argv.slice(2));
        const pairs = args.filter(arg => /^--/.test(arg)).map(toPair);
        const flagMap = Object.fromEntries(pairs.map(toEntry));
        const onEntries = validFlags.map(flag => [toCamel(flag), toCamel(flag) in flagMap]);
        const invalidFlag = pairs.find(pair => !validFlags.includes(pair[0]))?.[0] ?? null;
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
    run(packageJson, posix) {
        const name = Object.keys(packageJson.bin).sort()[0];
        const command = process.platform === 'win32' ? posix.replaceAll('\\ ', '" "') : posix;
        return execSync(command.replace(name, 'node bin/cli.js'), { stdio: 'inherit' });
    },
    readFolder(folder) {
        return fs.readdirSync(folder, { recursive: true }).map(file => slash(String(file))).sort();
    },
    unquoteArgs(args) {
        const unquote = (builder, nextArg) => {
            const arg = nextArg.replace(/^'/, '').replace(/'$/, '');
            const last = builder[1].length - 1;
            if (builder[0])
                builder[1][last] = builder[1][last] + ' ' + arg;
            else
                builder[1].push(arg);
            const quoteMode = (/^'/.test(nextArg) || builder[0]) && !/'$/.test(nextArg);
            return [quoteMode, builder[1]];
        };
        return args.reduce(unquote, [false, []])[1];
    },
};
export { cliArgvUtil };
