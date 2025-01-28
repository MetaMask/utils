import { is, pattern, string } from '@metamask/superstruct';

import { definePattern } from './superstruct';

describe('definePattern', () => {
  const hexPattern = /^0x[0-9a-f]+$/u;

  it('is similar to superstruct.pattern', () => {
    const HexStringPattern = pattern(string(), hexPattern);
    const HexString = definePattern('HexString', hexPattern);

    expect(is('0xdeadbeef', HexStringPattern)).toBe(true);
    expect(is('0xdeadbeef', HexString)).toBe(true);
    expect(is('foobar', HexStringPattern)).toBe(false);
    expect(is('foobar', HexString)).toBe(false);
  });
});
