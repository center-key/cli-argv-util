// cli-argv-util
// Unit Tests Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';

// Utilities
const mockCli = (line) => process.argv = ['node', 'mock.js', ...line.split(' ')];

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
         flagMapRaw: {
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
         flagMapRaw: {
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
         flagMapRaw: {},
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
         flagMapRaw: {
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
describe('Calling cliArgvUtil.parse() with escaped characters and macros', () => {

   it('results in the correct CLI flag value replacements', () => {
      const validFlags = ['flag1', 'flag2', 'flag3'];
      mockCli('file.html --flag1={{hash}}{{space}}Allow{{space}}bots{{bang}} file.png --flag3={{macro:lucky-number}}');
      const actual = cliArgvUtil.parse(validFlags);
      const expected = {
         flagMap: {
            flag1: '# Allow bots!',
            flag3: '777',
            },
         flagMapRaw: {
            flag1: '{{hash}}{{space}}Allow{{space}}bots{{bang}}',
            flag3: '{{macro:lucky-number}}',
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

   });
