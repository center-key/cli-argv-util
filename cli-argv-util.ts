// cli-argv-util ~~ MIT License

import { execSync } from 'node:child_process';

export type StringFlagMap =  { [flag: string]: string | undefined };
export type BooleanFlagMap = { [flag: string]: boolean };
export type Result = {
   flagMap:        StringFlagMap,   //map of flag values for each user supplied flag
   flagOn:         BooleanFlagMap,  //map of the enabled status for all valid flags
   invalidFlag:    string | null,   //name of the first invalid flag
   invalidFlagMsg: string | null,   //error message for the invalid flag
   params:         string[],        //array of parameter values supplied by the user
   paramCount:     number,          //number of parameters supplied by the user
   };

const cliArgvUtil = {

   parse(validFlags: string[]): Result {
      const toCamel =     (token: string) =>  token.replace(/-./g, char => char[1]!.toUpperCase());  //example: 'no-map' --> 'noMap'
      const toEntry =     (pair: string[]) => [toCamel(pair[0]!), pair[1]];      //example: ['no-map'] --> ['noMap', undefined]
      const toPair =      (flag: string) =>   flag.replace(/^--/, '').split('=');  //example: '--cd=build' --> ['cd', 'build']
      const args =        process.argv.slice(2);
      const pairs =       args.filter(arg => /^--/.test(arg)).map(toPair);
      const flagMap =     Object.fromEntries(pairs.map(toEntry));
      const onEntries =   validFlags.map(flag => [toCamel(flag), toCamel(flag) in flagMap]);
      const invalidFlag = pairs.find(pair => !validFlags.includes(pair[0]!))?.[0] ?? null;
      const helpMsg =     '\nValid flags are --' + validFlags.join(' --');
      const params =      args.filter(arg => !/^--/.test(arg));
      return {
         flagMap:        flagMap,
         flagOn:         Object.fromEntries(onEntries),
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

   };

export { cliArgvUtil };
