// cli-argv-util
// Unit Tests Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';

////////////////////////////////////////////////////////////////////////////////
describe('Function cliArgvUtil.calcAncestor()', () => {

   it('finds the ancestor folder of 2 files in the same folder', () => {
      const actual = cliArgvUtil.calcAncestor('web/style.less', 'web/style.css');
      delete actual.message;
      const expected = {
         common:   'web',
         source:   'style.less',
         target:   'style.css',
         renamed:  true,
         filename: null,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('finds the ancestor folder when the target file is in a subfolder of the source file', () => {
      const actual = cliArgvUtil.calcAncestor('aaa/bbb/logo.png', 'aaa/bbb/ccc/logo.png');
      delete actual.message;
      const expected = {
         common:   'aaa/bbb',
         source:   'logo.png',
         target:   'ccc/logo.png',
         renamed:  false,
         filename: 'logo.png',
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('finds the ancestor folder when the source file is in a subfolder of the target file', () => {
      const actual = cliArgvUtil.calcAncestor('aaa/bbb/ccc/logo.png', 'aaa/bbb/logo.png');
      delete actual.message;
      const expected = {
         common:   'aaa/bbb',
         source:   'ccc/logo.png',
         target:   'logo.png',
         renamed:  false,
         filename: 'logo.png',
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('finds no ancestor folder for 2 completely different files', () => {
      const actual = cliArgvUtil.calcAncestor('abc/index.html', 'xyz/license.txt');
      delete actual.message;
      const expected = {
         common:   '',
         source:   'abc/index.html',
         target:   'xyz/license.txt',
         renamed:  true,
         filename: null,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });
