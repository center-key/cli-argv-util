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

   it('has functions named parse(), readFolder(), and run()', () => {
      const module = cliArgvUtil;
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['parse',      'function'],
         ['readFolder', 'function'],
         ['run',        'function'],
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
