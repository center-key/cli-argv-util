//! cli-argv-util v1.5.0 ~~ https://github.com/center-key/cli-argv-util ~~ MIT License

import { execSync } from 'node:child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import slash from 'slash';
const cliArgvUtil = {
    assert(ok, message) {
        if (!ok)
            throw new Error(`[replacer-util] ${message}`);
    },
    readPackageJson() {
        const pkgExists = fs.existsSync('package.json');
        const pkg = pkgExists ? JSON.parse(fs.readFileSync('package.json', 'utf-8')) : null;
        const fixHiddenKeys = (pkgObj) => {
            const unhide = (key) => {
                const newKey = key.replace(/[@./]/g, '-');
                if (!pkgObj[newKey])
                    pkgObj[newKey] = pkgObj[key];
            };
            Object.keys(pkgObj).forEach(unhide);
        };
        if (pkg?.dependencies)
            fixHiddenKeys(pkg.dependencies);
        if (pkg?.devDependencies)
            fixHiddenKeys(pkg.devDependencies);
        return pkg;
    },
    unescape(flags) {
        const escapers = [
            [/{{apos}}/g, "'"],
            [/{{bang}}/g, '!'],
            [/{{close-curly}}/g, '}'],
            [/{{equals}}/g, '='],
            [/{{gt}}/g, '>'],
            [/{{hash}}/g, '#'],
            [/{{lt}}/g, '<'],
            [/{{open-curly}}/g, '{'],
            [/{{pipe}}/g, '|'],
            [/{{quote}}/g, '"'],
            [/{{semi}}/g, ';'],
            [/{{space}}/g, ' '],
        ];
        const macroPattern = /^{{macro:(.*)}}$/;
        const flagEntries = Object.entries(flags);
        const usesMacros = flagEntries.some(entry => entry[1]?.match(macroPattern));
        const pkg = usesMacros ? cliArgvUtil.readPackageJson() : {};
        if (!pkg.cliConfig && pkg.replacerConfig)
            pkg.cliConfig = pkg.replacerConfig;
        const macros = pkg.cliConfig?.macros;
        const unescapeOne = (flagValue, escaper) => flagValue.replace(escaper[0], escaper[1]);
        const expandMacro = (flagValue) => {
            const macroName = flagValue.match(macroPattern)?.[1];
            const macroValue = macros?.[macroName];
            const missing = macroName && !macroValue;
            cliArgvUtil.assert(!missing, `Macro "${macroName}" used but not defined in package.json`);
            return macroName ? macroValue : flagValue;
        };
        const doReplacements = (flagValue) => !flagValue ? undefined : escapers.reduce(unescapeOne, expandMacro(flagValue));
        return Object.fromEntries(flagEntries.map(pair => [pair[0], doReplacements(pair[1])]));
    },
    parse(validFlags) {
        const toCamel = (token) => token.replace(/-./g, char => char[1].toUpperCase());
        const toEntry = (pair) => [toCamel(pair[0]), pair[1]];
        const toPair = (flag) => flag.replace(/^--/, '').split('=');
        const args = cliArgvUtil.unquoteArgs(process.argv.slice(2));
        const pairs = args.filter(arg => /^--/.test(arg)).map(toPair);
        const flagMap = Object.fromEntries(pairs.map(toEntry));
        const onEntries = validFlags.map(flag => [toCamel(flag), toCamel(flag) in flagMap]);
        const flagOn = Object.fromEntries(onEntries);
        const invalidFlag = pairs.find(pair => !validFlags.includes(pair[0]))?.[0] ?? null;
        const helpMsg = '\nValid flags are --' + validFlags.join(' --');
        const params = args.filter(arg => !/^--/.test(arg));
        return {
            flagMap: cliArgvUtil.unescape(flagMap),
            flagMapRaw: flagMap,
            flagOn: flagOn,
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
    cleanPath(name) {
        return slash(path.normalize(name)).trim().replace(/\/$/, '');
    },
    calcAncestor(sourceFile, targetFile) {
        const index = Array.from(sourceFile).findIndex((char, i) => targetFile[i] !== char);
        const substr = index === -1 ? sourceFile : sourceFile.substring(0, index);
        const common = sourceFile.substring(0, substr.lastIndexOf('/'));
        const len = common.length ? common.length + 1 : 0;
        const source = sourceFile.substring(len);
        const target = targetFile.substring(len);
        const intro = common ? chalk.blue(common) + chalk.gray.bold(': ') : '';
        const renamed = path.basename(sourceFile) !== path.basename(targetFile);
        const filename = renamed ? null : path.basename(sourceFile);
        const folder = path.dirname(target);
        const dest = renamed ? target : (folder === '.' ? filename : folder + '/');
        const message = intro + chalk.white(source) + chalk.gray.bold(' → ') + chalk.green(dest);
        return { common, source, target, renamed, filename, message };
    },
    unquoteArgs(args) {
        const unquote = (builder, nextArg) => {
            const arg = nextArg.replace(/^'/, '').replace(/'$/, '');
            const last = builder[1].length - 1;
            if (builder[0])
                builder[1][last] = `${builder[1][last]} ${arg}`;
            else
                builder[1].push(arg);
            const quoteMode = (/^'/.test(nextArg) || builder[0]) && !/'$/.test(nextArg);
            return [quoteMode, builder[1]];
        };
        return args.reduce(unquote, [false, []])[1];
    },
};
export { cliArgvUtil };
