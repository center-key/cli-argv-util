# cli-argv-util
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_Simple utility to parse command line parameters and flags (arguments vector)_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/cli-argv-util/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/cli-argv-util.svg)](https://www.npmjs.com/package/cli-argv-util)
[![Vulnerabilities](https://snyk.io/test/github/center-key/cli-argv-util/badge.svg)](https://snyk.io/test/github/center-key/cli-argv-util)
[![Build](https://github.com/center-key/cli-argv-util/workflows/build/badge.svg)](https://github.com/center-key/cli-argv-util/actions/workflows/run-spec-on-push.yaml)

**cli-argv-util** is called from your `bin/cli.js` file in order to read user
supplied information on the command line and return the flags and parameters
in an easy-to-use structure.

## A) Setup
Install package for node:
```shell
$ npm install cli-argv-util
```

## B) Usage
Place the following code in your **bin/cli.js** file
```javascript
import { cliArgvUtil } from 'cli-argv-util';

const validFlags = ['cd', 'find', 'no-summary'];
const cli = cliArgvUtil.parse(validFlags);
if (cliArgvUtil.invalidFlag)
   throw Error(cliArgvUtil.invalidFlagMsg);
```
For a real world example, see: [cli.js](https://github.com/center-key/copy-file-util/blob/main/bin/cli.js)

If your CLI tool is named `my-program` and a user runs it like:
```shell
$ my-program file.html --cd=src --no-summary file.png
```
the resulting `cli` object will be:
```javascript
{
   flagMap: {
      cd:        'src',
      noSummary: undefined,
      },
   flagOn: {
      cd:        true,
      find:      false,
      noSummary: true,
      },
   invalidFlag:    null,
   invalidFlagMsg: null,
   params:         ['file.html', 'file.png'],
}
```

## C) Results
The `cliArgvUtil.parse()` returns an object of type `Result`:
```typescript
export type StringFlagMap =  { [flag: string]: string | undefined };
export type BooleanFlagMap = { [flag: string]: boolean };
export type Result = {
   flagMap:        StringFlagMap,   //map of flag values for each user supplied flag
   flagOn:         BooleanFlagMap,  //map of the enabled status for all valid flags
   invalidFlag:    string | null,   //name of the first invalid flag
   invalidFlagMsg: string | null,   //error message for the invalid flag
   params:         string[],        //array of parameter values supplied by the user
   };
```
See the **TypeScript Declarations** at the top of [cli-argv-util.ts](cli-argv-util.ts) for documentation.

<br>

---
**CLI Build Tools**
   - 🎋 [add-dist-header](https://github.com/center-key/add-dist-header):&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [cli-argv-util](https://github.com/center-key/cli-argv-util):&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [copy-folder-util](https://github.com/center-key/copy-folder-util):&nbsp; _Recursively copy files from one folder to another folder_
   - 🔍 [replacer-util](https://github.com/center-key/replacer-util):&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [rev-web-assets](https://github.com/center-key/rev-web-assets):&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [run-scripts-util](https://github.com/center-key/run-scripts-util):&nbsp; _Organize npm scripts into named groups of easy to manage commands_
   - 🚦 [w3c-html-validator](https://github.com/center-key/w3c-html-validator):&nbsp; _Check the markup validity of HTML files using the W3C validator_

Feel free to submit questions at:<br>
[github.com/center-key/cli-argv-util/issues](https://github.com/center-key/cli-argv-util/issues)

[MIT License](LICENSE.txt)
