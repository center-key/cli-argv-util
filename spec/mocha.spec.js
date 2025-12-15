// cli-argv-util
// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';
import fs from 'fs';

// Utilities
const mockCli = (line) => process.argv = ['node', 'mock.js', ...line.split(' ')];

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'cli-argv-util.d.ts',
         'cli-argv-util.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   it('is an object', () => {
      const actual =   { constructor: cliArgvUtil.constructor.name };
      const expected = { constructor: 'Object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct functions', () => {
      const module = cliArgvUtil;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['calcAncestor', 'function'],
         ['cleanPath',    'function'],
         ['parse',        'function'],
         ['readFolder',   'function'],
         ['run',          'function'],
         ['unquoteArgs',  'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Calling cliArgvUtil.parse()', () => {

   it('results in the correct CLI data', () => {
      const validFlags = ['flag1', 'flag2', 'flag3'];
      mockCli('file.html --flag1 file.png --flag3=three');
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {
            flag1: undefined,
            flag3: 'three',
            },
         flagOn: {
            flag1: true,
            flag2: false,
            flag3: true,
            },
         invalidFlag:    null,
         invalidFlagMsg: null,
         params:         ['file.html', 'file.png'],
         paramCount:     2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('with kebab flags results in the correct CLI data', () => {
      const validFlags = ['flag-one', 'flag-two', 'flag-three'];
      mockCli('file.html --flag-one file.png --flag-three=three');
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {
            flagOne:   undefined,
            flagThree: 'three',
            },
         flagOn: {
            flagOne:   true,
            flagTwo:   false,
            flagThree: true,
            },
         invalidFlag:    null,
         invalidFlagMsg: null,
         params:         ['file.html', 'file.png'],
         paramCount:     2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('with no flags or parameters results in the correct CLI data', () => {
      const validFlags = ['flag1', 'flag2', 'flag3'];
      process.argv = ['node', 'mock.js'];
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {},
         flagOn: {
            flag1: false,
            flag2: false,
            flag3: false,
            },
         invalidFlag:    null,
         invalidFlagMsg: null,
         params:         [],
         paramCount:     0,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('trims single quotes wrapping flags and parameters', () => {
      const validFlags = ['flag-one', 'flag-two', 'flag-three'];
      mockCli("file.html '--flag-one' 'filename with spaces.png' '--flag-three=t h r e e'");
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {
            flagOne:   undefined,
            flagThree: 't h r e e',
            },
         flagOn: {
            flagOne:   true,
            flagTwo:   false,
            flagThree: true,
            },
         invalidFlag:    null,
         invalidFlagMsg: null,
         params:         ['file.html', 'filename with spaces.png'],
         paramCount:     2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Correct error message is generated', () => {

   it('when a bogus flag is provided', () => {
      const validFlags = ['flag1', 'flag2', 'flag3'];
      mockCli('file.html --bogus file.png --flag3=three');
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {
            bogus: undefined,
            flag3: 'three',
            },
         flagOn: {
            flag1: false,
            flag2: false,
            flag3: true,
            },
         invalidFlag:    'bogus',
         invalidFlagMsg: 'Invalid flag: --bogus\nValid flags are --flag1 --flag2 --flag3',
         params:         ['file.html', 'file.png'],
         paramCount:     2,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Function cliArgvUtil.cleanPath()', () => {

   it('correctly normalizes a messy Windows path into a clean Unix path', () => {
      const actual =   ['a\\z', ' a\\z\\ ', 'a/b/c/./////..//../z/'].map(cliArgvUtil.cleanPath);
      const expected = ['a/z',  'a/z',      'a/z'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Function cliArgvUtil.calcAncestor()', () => {

   it('finds the ancestor folder of 2 files in the same folder', () => {
      const actual = cliArgvUtil.calcAncestor('web/style.less', 'web/style.css');
      delete actual.message;
      const expected = {
         common: 'web',
         source: 'style.less',
         target: 'style.css',
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('finds the ancestor folder when the target file is in a subfolder of the source file', () => {
      const actual = cliArgvUtil.calcAncestor('aaa/bbb/logo.png', 'aaa/bbb/ccc/logo.png');
      delete actual.message;
      const expected = {
         common: 'aaa/bbb',
         source: 'logo.png',
         target: 'ccc/logo.png',
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('finds no ancestor folder for 2 completely different files', () => {
      const actual = cliArgvUtil.calcAncestor('abc/index.html', 'xyz/license.txt');
      delete actual.message;
      const expected = {
         common: '',
         source: 'abc/index.html',
         target: 'xyz/license.txt',
         };
      assertDeepStrictEqual(actual, expected);
      });

   });
