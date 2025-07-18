import type { Hex } from './hex';
import {
  add0x,
  assertIsHexString,
  assertIsStrictHexString,
  isValidChecksumAddressUnmemoized as isValidChecksumAddress,
  isHexString,
  isHexAddress,
  isHexChecksumAddress,
  isStrictHexString,
  isValidHexAddressUnmemoized as isValidHexAddress,
  remove0x,
  getChecksumAddressUnmemoized as getChecksumAddress,
  getChecksumAddress as getChecksumAddressMemoized,
} from './hex';

describe('isHexString', () => {
  it.each([
    '0x12345',
    '0x1234567890abcdef',
    '0x1234567890ABCDEF',
    '0x1234567890abcdefABCDEF',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEF',
    '12345',
    '1234567890abcdef',
    '1234567890ABCDEF',
    '1234567890abcdefABCDEF',
    '1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('returns true for a valid hex string', (hexString) => {
    expect(isHexString(hexString)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    '0x12345g',
    '0x1234567890abcdefg',
    '0x1234567890abcdefG',
    '0x1234567890abcdefABCDEFg',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEFg',
  ])('returns false for an invalid hex string', (hexString) => {
    expect(isHexString(hexString)).toBe(false);
  });
});

describe('isStrictHexString', () => {
  it.each([
    '0x12345',
    '0x1234567890abcdef',
    '0x1234567890ABCDEF',
    '0x1234567890abcdefABCDEF',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('returns true for a valid hex string', (hexString) => {
    expect(isStrictHexString(hexString)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    '0x12345g',
    '0x1234567890abcdefg',
    '0x1234567890abcdefG',
    '0x1234567890abcdefABCDEFg',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEFg',
    '12345',
    '1234567890abcdef',
    '1234567890ABCDEF',
    '1234567890abcdefABCDEF',
    '1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('returns false for an invalid hex string', (hexString) => {
    expect(isStrictHexString(hexString)).toBe(false);
  });
});

describe('assertIsHexString', () => {
  it.each([
    '0x12345',
    '0x1234567890abcdef',
    '0x1234567890ABCDEF',
    '0x1234567890abcdefABCDEF',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEF',
    '12345',
    '1234567890abcdef',
    '1234567890ABCDEF',
    '1234567890abcdefABCDEF',
    '1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('does not throw for a valid hex string', (hexString) => {
    expect(() => assertIsHexString(hexString)).not.toThrow();
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    '0x12345g',
    '0x1234567890abcdefg',
    '0x1234567890abcdefG',
    '0x1234567890abcdefABCDEFg',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEFg',
  ])('throws for an invalid hex string', (hexString) => {
    expect(() => assertIsHexString(hexString)).toThrow(
      'Value must be a hexadecimal string.',
    );
  });
});

describe('assertIsStrictHexString', () => {
  it.each([
    '0x12345',
    '0x1234567890abcdef',
    '0x1234567890ABCDEF',
    '0x1234567890abcdefABCDEF',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('does not throw for a valid hex string', (hexString) => {
    expect(() => assertIsStrictHexString(hexString)).not.toThrow();
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    '0x12345g',
    '0x1234567890abcdefg',
    '0x1234567890abcdefG',
    '0x1234567890abcdefABCDEFg',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEFg',
    '12345',
    '1234567890abcdef',
    '1234567890ABCDEF',
    '1234567890abcdefABCDEF',
    '1234567890abcdefABCDEF1234567890abcdefABCDEF',
  ])('throws for an invalid hex string', (hexString) => {
    expect(() => assertIsStrictHexString(hexString)).toThrow(
      'Value must be a hexadecimal string, starting with "0x".',
    );
  });
});

describe('isHexAddress', () => {
  it.each([
    '0x0000000000000000000000000000000000000000',
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xffffffffffffffffffffffffffffffffffffffff',
    '0x0123456789abcdef0123456789abcdef01234567',
  ])('returns true for a valid hex address', (hexString) => {
    expect(isHexAddress(hexString)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    // Missing 0x prefix
    '0000000000000000000000000000000000000000',
    '1234567890abcdef1234567890abcdef12345678',
    // Wrong case prefix
    '0X1234567890abcdef1234567890abcdef12345678',
    // Too short
    '0x123456789abcdef1234567890abcdef1234567',
    '0x',
    '0x0',
    '0x123',
    // Too long
    '0x1234567890abcdef1234567890abcdef123456789',
    '0x1234567890abcdef1234567890abcdef12345678a',
    // Contains uppercase letters (should be lowercase only)
    '0x1234567890ABCDEF1234567890abcdef12345678',
    '0x1234567890abcdef1234567890ABCDEF12345678',
    '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    // Invalid characters
    '0x1234567890abcdefg123456789abcdef12345678',
    '0x1234567890abcdef1234567890abcdef1234567g',
    '0x1234567890abcdef123456789abcdef12345678!',
  ])('returns false for an invalid hex address', (hexString) => {
    expect(isHexAddress(hexString)).toBe(false);
  });
});

describe('isHexChecksumAddress', () => {
  it.each([
    '0x0000000000000000000000000000000000000000',
    '0x1234567890abcdef1234567890abcdef12345678',
    '0x1234567890ABCDEF1234567890abcdef12345678',
    '0x1234567890abcdef1234567890ABCDEF12345678',
    '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    '0xffffffffffffffffffffffffffffffffffffffff',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
  ])('returns true for a valid hex checksum address', (hexString) => {
    expect(isHexChecksumAddress(hexString)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    0,
    1,
    {},
    [],
    // Missing 0x prefix
    '0000000000000000000000000000000000000000',
    '1234567890abcdef1234567890abcdef12345678',
    'd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    // Wrong case prefix
    '0X1234567890abcdef1234567890abcdef12345678',
    '0Xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    // Too short
    '0x123456789abcdef1234567890abcdef1234567',
    '0x',
    '0x0',
    '0x123',
    // Too long
    '0x1234567890abcdef1234567890abcdef123456789',
    '0x1234567890abcdef1234567890abcdef12345678a',
    // Invalid characters
    '0x1234567890abcdefg123456789abcdef12345678',
    '0x1234567890abcdef1234567890abcdef1234567g',
    '0x1234567890abcdef123456789abcdef12345678!',
    '0x1234567890abcdef123456789abcdef12345678@',
  ])('returns false for an invalid hex checksum address', (hexString) => {
    expect(isHexChecksumAddress(hexString)).toBe(false);
  });
});

describe('isValidHexAddress', () => {
  it.each([
    '0x0000000000000000000000000000000000000000' as Hex,
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Hex,
  ])('returns true for a valid prefixed hex address', (hexString) => {
    expect(isValidHexAddress(hexString)).toBe(true);
  });

  it.each([
    '0000000000000000000000000000000000000000',
    'd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  ])('returns false for a valid non-prefixed hex address', (hexString) => {
    // @ts-expect-error - testing invalid input
    expect(isValidHexAddress(hexString)).toBe(false);
  });

  it.each([
    '12345g',
    '1234567890abcdefg',
    '1234567890abcdefG',
    '1234567890abcdefABCDEFg',
    '1234567890abcdefABCDEF1234567890abcdefABCDEFg',
    '0x',
    '0x0',
    '0x12345g',
    '0x1234567890abcdefg',
    '0x1234567890abcdefG',
    '0x1234567890abcdefABCDEFg',
    '0x1234567890abcdefABCDEF1234567890abcdefABCDEFg',
    '0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045',
    '0xCF5609B003B2776699EEA1233F7C82D5695CC9AA',
    '0Xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  ])('returns false for an invalid hex address', (hexString) => {
    // @ts-expect-error - testing invalid input
    expect(isValidHexAddress(hexString)).toBe(false);
  });
});

describe('getChecksumAddress', () => {
  it('returns the checksum address for a valid hex address', () => {
    expect(
      getChecksumAddress('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed'),
    ).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');

    expect(
      getChecksumAddress('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'),
    ).toBe('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');

    expect(
      getChecksumAddress('0x52908400098527886e0f7030069857d2e4169ee7'),
    ).toBe('0x52908400098527886E0F7030069857D2E4169EE7');

    expect(
      getChecksumAddress('0xde709f2102306220921060314715629080e2fb77'),
    ).toBe('0xde709f2102306220921060314715629080e2fb77');

    expect(
      getChecksumAddress('0x8617e340b3d01fa5f11f306f4090fd50e238070d'),
    ).toBe('0x8617E340B3D01FA5F11F306F4090FD50E238070D');

    expect(
      getChecksumAddress('0x27b1fdb04752bbc536007a920d24acb045561c26'),
    ).toBe('0x27b1fdb04752bbc536007a920d24acb045561c26');

    expect(
      getChecksumAddress('0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb'),
    ).toBe('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB');

    expect(
      getChecksumAddress('0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb'),
    ).toBe('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb');

    expect(
      getChecksumAddress('0x0000000000000000000000000000000000000000'),
    ).toBe('0x0000000000000000000000000000000000000000');
  });

  it('throws for an invalid hex address', () => {
    expect(() => getChecksumAddress('0x')).toThrow('Invalid hex address.');
  });
});

describe('getChecksumAddress (memoized)', () => {
  it('memoizes results for repeated calls with the same input', () => {
    const address = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed' as Hex;
    const expected = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';

    // First call should compute the result
    const result1 = getChecksumAddressMemoized(address);
    expect(result1).toBe(expected);

    // Second call with the same input should return the cached result
    const result2 = getChecksumAddressMemoized(address);
    expect(result2).toBe(expected);

    // Results should be the same object reference (memoized)
    expect(result1).toBe(result2);
  });

  it('handles different inputs correctly', () => {
    const address1 = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed' as Hex;
    const address2 = '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359' as Hex;

    const result1 = getChecksumAddressMemoized(address1);
    const result2 = getChecksumAddressMemoized(address2);

    expect(result1).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
    expect(result2).toBe('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');
    expect(result1).not.toBe(result2);
  });
});

describe('isValidChecksumAddress', () => {
  it.each([
    '0x0000000000000000000000000000000000000000' as Hex,
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Hex,
    '0xCf5609B003B2776699eEA1233F7C82D5695cC9AA' as Hex,
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Hex,
    '0x8617E340B3D01FA5F11F306F4090FD50E238070D' as Hex,
    '0x52908400098527886E0F7030069857D2E4169EE7' as Hex,
    '0xde709f2102306220921060314715629080e2fb77' as Hex,
    '0x27b1fdb04752bbc536007a920d24acb045561c26' as Hex,
    '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed' as Hex,
    '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359' as Hex,
    '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB' as Hex,
    '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb' as Hex,
  ])('returns true for a valid checksum address', (hexString) => {
    expect(isValidChecksumAddress(hexString)).toBe(true);
  });

  it.each([
    '0xz' as Hex,
    '0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045' as Hex,
    '0xCF5609B003B2776699EEA1233F7C82D5695CC9AA' as Hex,
  ])('returns false for an invalid checksum address', (hexString) => {
    expect(isValidChecksumAddress(hexString)).toBe(false);
  });
});

describe('add0x', () => {
  it('adds a 0x-prefix to a string', () => {
    expect(add0x('12345')).toBe('0x12345');
  });

  it('does not add a 0x-prefix if it is already present', () => {
    expect(add0x('0x12345')).toBe('0x12345');
    expect(add0x('0X12345')).toBe('0x12345');
  });
});

describe('remove0x', () => {
  it('removes a 0x-prefix from a string', () => {
    expect(remove0x('0x12345')).toBe('12345');
    expect(remove0x('0X12345')).toBe('12345');
  });

  it('does not remove a 0x-prefix if it is not present', () => {
    expect(remove0x('12345')).toBe('12345');
  });
});
