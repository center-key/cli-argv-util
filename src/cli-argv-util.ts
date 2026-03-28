// cli-argv-util ~~ MIT License

// Imports
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import fs    from 'fs';
import path  from 'path';
import slash from 'slash';

// Types
export type StringFlagMap =  { [flag: string]: string | undefined };
export type BooleanFlagMap = { [flag: string]: boolean };
export type Ancestor = {
   common:  string,          //path of the lowest common ancestor folder
   source:  string,          //path of the source file relative to the ancestor folder
   target:  string,          //path of the target file relative to the ancestor folder
   renamed: boolean,         //true if the base filenames are different
   filename: string | null,  //base filename of the two files if they are identical
   message: string,          //color output in the format: "common: source -> target"
   };
export type Result = {
   flagMap:        StringFlagMap,   //map of unescaped flag values for each user supplied flag
   flagMapRaw:     StringFlagMap,   //map of flag values for each user supplied flag
   flagOn:         BooleanFlagMap,  //map of the enabled status for all valid flags
   invalidFlag:    string | null,   //name of the first invalid flag
   invalidFlagMsg: string | null,   //error message for the invalid flag
   paramCount:     number,          //number of parameters supplied by the user
   params:         string[],        //array of parameter values supplied by the user
   };
type Json = string | number | boolean | null | undefined | JsonObject | Json[];
type JsonObject = { [key: string]: Json };

const cliArgvUtil = {

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[replacer-util] ${message}`);
      },

   readPackageJson() {
      // Returns package.json as an object literal.
      const pkgFile = 'package.json';
      const getPkg =  () => <JsonObject>JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
      const pkg =     fs.existsSync(pkgFile) ? getPkg() : {};
      const fixHiddenKeys = (pkgObj: JsonObject) => {
         const unhide = (key: string) => {
            const newKey = key.replace(/[@./]/g, '-');
            if (!pkgObj[newKey])
               pkgObj[newKey] = pkgObj[key]!;
            };
         Object.keys(pkgObj).forEach(unhide);
         };
      if (pkg.dependencies)
         fixHiddenKeys(<JsonObject>pkg.dependencies);
      if (pkg.devDependencies)
         fixHiddenKeys(<JsonObject>pkg.devDependencies);
      if (!pkg.cliConfig && pkg.replacerConfig)  //DEPRECATED
         pkg.cliConfig = pkg.replacerConfig;     //backwards compatibility workaround
      return pkg;
      },

   escapers: [
      // Pairs of search patterns and their replacement characters.
      { regex: /{{apos}}/g,        char: "'" },
      { regex: /{{bang}}/g,        char: '!' },
      { regex: /{{close-curly}}/g, char: '}' },
      { regex: /{{equals}}/g,      char: '=' },
      { regex: /{{gt}}/g,          char: '>' },
      { regex: /{{hash}}/g,        char: '#' },
      { regex: /{{lt}}/g,          char: '<' },
      { regex: /{{open-curly}}/g,  char: '{' },
      { regex: /{{pipe}}/g,        char: '|' },
      { regex: /{{quote}}/g,       char: '"' },
      { regex: /{{semi}}/g,        char: ';' },
      { regex: /{{space}}/g,       char: ' ' },
      ],

   unescape(text: string, pkg: JsonObject): string {
      // Returns the text with all the escaped characters replaced and macros expanded.
      // Example:
      //    '{{hash}}{{space}}Allow{{space}}bots{{bang}}' --> '# Allow bots!'
      const macroPattern = /^{{macro:(.*)}}$/;
      const macros =       <JsonObject>((<JsonObject | undefined>pkg.cliConfig)?.macros ?? {});
      const macroName =    <keyof JsonObject>text.match(macroPattern)?.[1];
      const macroValue =   <string>macros[macroName];
      const expandedText = macroName ? macroValue : text;
      const missing =      macroName && !macroValue;
      cliArgvUtil.assert(!missing, `Macro "${macroName}" used but not defined in package.json`);
      const replace = (flagValue: string, escaper: typeof cliArgvUtil.escapers[number]) =>
         flagValue.replace(escaper.regex, escaper.char);
      return cliArgvUtil.escapers.reduce(replace, expandedText);
      },

   parse(validFlags: string[]): Result {
      const pkg =         cliArgvUtil.readPackageJson();
      const toCamel =     (token: string) =>  token.replace(/-./g, char => char[1]!.toUpperCase());  //example: 'no-map' --> 'noMap'
      const toEntry =     (pair: string[]) => [toCamel(pair[0]!), pair[1]];        //example: ['no-map'] --> ['noMap', undefined]
      const toPair =      (flag: string) =>   flag.replace(/^--/, '').split('=');  //example: '--cd=build' --> ['cd', 'build']
      const unescape =    (value?: string) => !value ? undefined : cliArgvUtil.unescape(value, pkg);
      const args =        cliArgvUtil.unquoteArgs(process.argv.slice(2));
      const pairs =       args.filter(arg => /^--/.test(arg)).map(toPair);
      const flagMapRaw =  <StringFlagMap>Object.fromEntries(pairs.map(toEntry));
      const flagEntries = Object.entries(flagMapRaw);
      const flagMap =     Object.fromEntries(flagEntries.map(pair => [pair[0], unescape(pair[1])]));
      const onEntries =   validFlags.map(flag => [toCamel(flag), toCamel(flag) in flagMapRaw]);
      const flagOn =      <BooleanFlagMap>Object.fromEntries(onEntries);
      const invalidFlag = pairs.find(pair => !validFlags.includes(pair[0]!))?.[0] ?? null;
      const helpMsg =     '\nValid flags are --' + validFlags.join(' --');
      const rawParams =   args.filter(arg => !/^--/.test(arg));
      const params =      rawParams.map(param => cliArgvUtil.unescape(param, pkg));
      return {
         flagMap:        flagMap,
         flagMapRaw:     flagMapRaw,
         flagOn:         flagOn,
         invalidFlag:    invalidFlag,
         invalidFlagMsg: invalidFlag ? 'Invalid flag: --' + invalidFlag + helpMsg : null,
         params:         params,
         paramCount:     params.length,
         };
      },

   run(packageJson: { [key: string]: unknown }, posix: string) {
      // Example usage:
      //    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      //    it('executing from the CLI copies the correct files', () => {
      //       cliArgvUtil.run(pkg, 'copy-folder source build');
      const name =    Object.keys(<string[]>packageJson.bin).sort()[0]!;
      const command = process.platform === 'win32' ? posix.replaceAll('\\ ', '" "') : posix;
      return execSync(command.replace(name, 'node bin/cli.js'), { stdio: 'inherit' });
      },


   readFolder(folder: string): string[] {
      return fs.readdirSync(folder, { recursive: true }).map(file => slash(String(file))).sort();
      },

   cleanPath(name: string): string {
      // Simple utility to return the normalized Unix version of a path.
      // Example: "abc\xyz\ " --> "abc/xyz"
      return slash(path.normalize(name)).trim().replace(/\/$/, '');
      },

   calcAncestor(sourceFile: string, targetFile: string): Ancestor {
      // Example:
      //    calcAncestor('aaa/bbb/logo.png', 'aaa/bbb/ccc/logo.png')
      // Returns:
      //    { common: 'aaa/bbb', source: 'logo.png', target: 'ccc/logo.png', renamed: true,
      //       filename: 'logo.png', message: 'aaa/bbb: logo.png -> ccc/' };
      const index =    Array.from(sourceFile).findIndex((char, i) => targetFile[i] !== char);
      const substr =   index === -1 ? sourceFile : sourceFile.substring(0, index);
      const common =   sourceFile.substring(0, substr.lastIndexOf('/'));
      const len =      common.length ? common.length + 1 : 0;
      const source =   sourceFile.substring(len);
      const target =   targetFile.substring(len);
      const intro =    common ? chalk.blue(common) + chalk.gray.bold(': ') : '';
      const renamed =  path.basename(sourceFile) !== path.basename(targetFile);
      const filename = renamed ? null : path.basename(sourceFile);
      const folder =   path.dirname(target);
      const dest =     renamed ? target : (folder === '.' ? filename : folder + '/');
      const message =  intro + chalk.white(source) + chalk.gray.bold(' → ') + chalk.green(dest);
      return { common, source, target, renamed, filename, message };
      },

   unquoteArgs(args: string[]): string[] {
      // A workaround to a Microsoft Windows flaw
      type ArgsBuilder = [quoteMode: boolean, args: string[]];
      const unquote = (builder: ArgsBuilder, nextArg: string): ArgsBuilder => {
         const arg =  nextArg.replace(/^'/, '').replace(/'$/, '');
         const last = builder[1].length - 1;
         if (builder[0])  //true only if running on Microsoft Windows
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
