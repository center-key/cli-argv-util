// cli-argv-util
// Package Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'node:fs';

// Setup and Utilities
import { cliArgvUtil } from '../dist/cli-argv-util.js';

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
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const version =  cliArgvUtil.version;
      const semVer =   /\d+[.]\d+[.]\d+/;
      const actual =   { version: version, valid: semVer.test(version) };
      const expected = { version: version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Library module', () => {

   const module = cliArgvUtil;

   it('is exported as an object', () => {
      const actual =   { type: typeof module };
      const expected = { type: 'object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has the correct properties', () => {
      const actual = Object.keys(module).sort().map(key => [key, typeof module[key]]);
      const expected = [
         ['assertOk',        'function'],
         ['calcAncestor',    'function'],
         ['cleanPath',       'function'],
         ['colorizePath',    'function'],
         ['escapers',        'object'],
         ['parse',           'function'],
         ['readFolder',      'function'],
         ['readPackageJson', 'function'],
         ['run',             'function'],
         ['unescape',        'function'],
         ['unquoteArgs',     'function'],
         ['version',         'string'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
