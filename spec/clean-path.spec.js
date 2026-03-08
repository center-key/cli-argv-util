// cli-argv-util
// Unit Tests Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';

////////////////////////////////////////////////////////////////////////////////
describe('Function cliArgvUtil.cleanPath()', () => {

   it('correctly normalizes a messy Windows path into a clean Unix path', () => {
      const actual =   ['a\\z', ' a\\z\\ ', 'a/b/c/./////..//../z/'].map(cliArgvUtil.cleanPath);
      const expected = ['a/z',  'a/z',      'a/z'];
      assertDeepStrictEqual(actual, expected);
      });

   });
