import {
  DECIMAL_NUMBERS,
  HEX_STRINGS,
  NEGATIVE_INTEGERS,
  POSITIVE_INTEGERS,
} from './__fixtures__';
import { createBigInt, createBytes, createHex, createNumber } from './coercers';
import { add0x } from './hex';
import { bytesToBigInt, bytesToHex, hexToBytes } from './bytes';

describe('createNumber', () => {
  it.each(POSITIVE_INTEGERS)(
    'creates a number from a positive number-like value',
    (value) => {
      expect(createNumber(value)).toBe(value);
      expect(createNumber(BigInt(value))).toBe(value);
      expect(createNumber(add0x(value.toString(16)))).toBe(value);
      expect(createNumber(value.toString(10))).toBe(value);
    },
  );

  it.each(NEGATIVE_INTEGERS)(
    'creates a number from a negative number-like value',
    (value) => {
      expect(createNumber(value)).toBe(value);
      expect(createNumber(BigInt(value))).toBe(value);
      expect(createNumber(value.toString(10))).toBe(value);
    },
  );

  it.each(DECIMAL_NUMBERS)(
    'creates a number from a positive number-like value with decimals',
    (value) => {
      expect(createNumber(value)).toBe(value);
      expect(createNumber(value.toString(10))).toBe(value);
    },
  );

  it('throws if the result is not finite', () => {
    expect(() => createNumber(Infinity)).toThrow(
      'Expected a number-like value, got "Infinity".',
    );

    expect(() => createNumber(-Infinity)).toThrow(
      'Expected a number-like value, got "-Infinity".',
    );
  });

  it.each([true, false, null, undefined, NaN, {}, []])(
    'throws if the value is not a number-like value',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => createNumber(value)).toThrow(
        /Expected a number-like value, got "(.*)"\./u,
      );
    },
  );
});

describe('createBigInt', () => {
  it.each(POSITIVE_INTEGERS)(
    'creates a bigint from a positive number-like value',
    (value) => {
      expect(createBigInt(value)).toBe(BigInt(value));
      expect(createBigInt(add0x(value.toString(16)))).toBe(BigInt(value));
      expect(createBigInt(value.toString(10))).toBe(BigInt(value));
    },
  );

  it.each(NEGATIVE_INTEGERS)(
    'creates a bigint from a negative number-like value',
    (value) => {
      expect(createBigInt(value)).toBe(BigInt(value));
      expect(createBigInt(value.toString(10))).toBe(BigInt(value));
    },
  );

  it.each([true, false, null, undefined, NaN, {}, []])(
    'throws if the value is not a number-like value',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => createBigInt(value)).toThrow(
        /Expected a number-like value, got "(.*)"\./u,
      );
    },
  );
});

describe('createHex', () => {
  it.each(HEX_STRINGS)(
    'creates a hex string from a byte-like value',
    (value) => {
      const bytes = hexToBytes(value);

      expect(createHex(value)).toBe(value);
      expect(createHex(bytesToBigInt(bytes))).toBe(value);
      expect(createHex(bytesToHex(bytes))).toBe(value);
    },
  );

  it.each([true, false, null, undefined, NaN, {}, []])(
    'throws if the value is not a bytes-like value',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => createHex(value)).toThrow(
        /Expected a bytes-like value, got "(.*)"\./u,
      );
    },
  );
});

describe('createBytes', () => {
  it.each(HEX_STRINGS)(
    'creates a byte array from a byte-like value',
    (value) => {
      const bytes = hexToBytes(value);

      expect(createBytes(value)).toStrictEqual(bytes);
      expect(createBytes(bytesToBigInt(bytes))).toStrictEqual(bytes);
      expect(createBytes(bytesToHex(bytes))).toStrictEqual(bytes);
    },
  );

  it.each([true, false, null, undefined, NaN, {}, []])(
    'throws if the value is not a bytes-like value',
    (value) => {
      // @ts-expect-error Invalid type.
      expect(() => createBytes(value)).toThrow(
        /Expected a bytes-like value, got "(.*)"\./u,
      );
    },
  );
});
