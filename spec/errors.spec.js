// cli-argv-util
// Error Handling Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { cliArgvUtil } from '../dist/cli-argv-util.js';

// Utilities
const mockCli = (line) => process.argv = ['node', 'mock.js', ...line.split(' ')];

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
         flagMapRaw: {
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
