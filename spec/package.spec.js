// cli-argv-util
// Package Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';
import fs from 'fs';

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
         ['assert',          'function'],
         ['calcAncestor',    'function'],
         ['cleanPath',       'function'],
         ['parse',           'function'],
         ['readFolder',      'function'],
         ['readPackageJson', 'function'],
         ['run',             'function'],
         ['unescape',        'function'],
         ['unquoteArgs',     'function'],
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
