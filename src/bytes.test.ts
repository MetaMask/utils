import {
  bytesToBigInt,
  bytesToHex,
  bytesToNumber,
  bytesToString,
} from './bytes';
import {
  BYTES_FIXTURES,
  LARGE_BYTES_FIXTURES,
  UTF_8_BYTES_FIXTURES,
} from './__fixtures__/bytes';

describe('bytesToHex', () => {
  it.each(BYTES_FIXTURES)(
    'returns a hex string from a byte array',
    ({ bytes, hex }) => {
      expect(bytesToHex(bytes)).toBe(hex);
    },
  );

  it.each(LARGE_BYTES_FIXTURES)(
    'returns a hex string from a large byte array',
    ({ bytes, hex }) => {
      expect(bytesToHex(bytes)).toBe(hex);
    },
  );
});

describe('bytesToBigInt', () => {
  it.each(BYTES_FIXTURES)(
    'returns a bigint from a byte array',
    ({ bytes, bigint }) => {
      expect(bytesToBigInt(bytes)).toBe(bigint);
    },
  );

  it.each(LARGE_BYTES_FIXTURES)(
    'returns a hex string from a large byte array',
    ({ bytes, bigint }) => {
      expect(bytesToBigInt(bytes)).toBe(bigint);
    },
  );
});

describe('bytesToNumber', () => {
  it.each(BYTES_FIXTURES)(
    'returns a number from a byte array',
    ({ bytes, number }) => {
      expect(bytesToNumber(bytes)).toBe(number);
    },
  );

  it.each(LARGE_BYTES_FIXTURES)(
    'throws an error when the resulting number is not a safe integer',
    ({ bytes }) => {
      expect(() => bytesToNumber(bytes)).toThrow(
        'Number is not a safe integer. Use `bytesToBigInt` instead.',
      );
    },
  );
});

describe('bytesToString', () => {
  it.each(UTF_8_BYTES_FIXTURES)(
    'returns a string from a byte array',
    ({ bytes, string }) => {
      expect(bytesToString(bytes)).toBe(string);
    },
  );
});
