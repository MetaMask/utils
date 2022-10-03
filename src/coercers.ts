import {
  bigint,
  coerce,
  create,
  Infer,
  instance,
  number,
  string,
  StructError,
  union,
} from 'superstruct';
import { add0x, HexStruct, isHexString } from './hex';
import { assert } from './assert';
import { bytesToHex, valueToBytes } from './bytes';

const NumberLikeStruct = union([number(), bigint(), string()]);
const NumberCoercer = coerce(number(), NumberLikeStruct, Number);
const BigIntCoercer = coerce(bigint(), NumberLikeStruct, BigInt);

const BytesLikeStruct = union([
  string(),
  instance(Uint8Array),
  bigint(),
  number(),
]);

const BytesCoercer = coerce(
  instance(Uint8Array),
  BytesLikeStruct,
  valueToBytes,
);

const HexCoercer = coerce(HexStruct, BytesLikeStruct, (value) => {
  return bytesToHex(valueToBytes(value));
});

export type NumberLike = Infer<typeof NumberLikeStruct>;
export type BytesLike = Infer<typeof BytesLikeStruct>;

/**
 * Create a number from a number-like value.
 *
 * - If the value is a number, it is returned as-is.
 * - If the value is a `bigint`, it is converted to a number.
 * - If the value is a string, it is parsed as a number
 * - If the value is a hex string (starts with "0x"), it is parsed as a number.
 *
 * This validates that the value is a number-like value, and that the resulting
 * number is not `NaN` or `Infinity`.
 *
 * @example
 * ```typescript
 * const value = createNumber('0x010203');
 * console.log(value); // 66051
 *
 * const otherValue = createNumber(123n);
 * console.log(otherValue); // 123
 * ```
 * @param value - The value to create the number from.
 * @returns The created number.
 * @throws If the value is not a number-like value, or if the resulting number
 * is `NaN` or `Infinity`.
 */
export function createNumber(value: NumberLike): number {
  try {
    const result = create(value, NumberCoercer);

    assert(
      Number.isFinite(result),
      `Expected a number-like value, got "${value}".`,
    );

    return result;
  } catch (error) {
    if (error instanceof StructError) {
      throw new Error(`Expected a number-like value, got "${value}".`);
    }

    /* istanbul ignore next */
    throw error;
  }
}

/**
 * Create a `bigint` from a number-like value.
 *
 * - If the value is a number, it is converted to a `bigint`.
 * - If the value is a `bigint`, it is returned as-is.
 * - If the value is a string, it is parsed as a `bigint`
 * - If the value is a hex string (starts with "0x"), it is parsed as a
 * `bigint`.
 *
 * @example
 * ```typescript
 * const value = createBigInt('0x010203');
 * console.log(value); // 16909060n
 *
 * const otherValue = createBigInt(123);
 * console.log(otherValue); // 123n
 * ```
 * @param value - The value to create the bigint from.
 * @returns The created bigint.
 * @throws If the value is not a number-like value.
 */
export function createBigInt(value: NumberLike): bigint {
  try {
    // The `BigInt` constructor throws if the value is not a number-like value.
    // There is no need to validate the value manually.
    return create(value, BigIntCoercer);
  } catch (error) {
    if (error instanceof StructError) {
      throw new Error(`Expected a number-like value, got "${error.value}".`);
    }

    /* istanbul ignore next */
    throw error;
  }
}

/**
 * Create a byte array from a bytes-like value.
 *
 * - If the value is a byte array, it is returned as-is.
 * - If the value is a hex string (starts with "0x"), it is parsed as a byte
 * array.
 * - If the value is a string, it is interpreted as a UTF-8 string and converted
 * to a byte array.
 * - If the value is a number, it is converted to a byte array.
 * - If the value is a `bigint`, it is converted to a byte array.
 *
 * @example
 * ```typescript
 * const value = createBytes('0x010203');
 * console.log(value); // Uint8Array [ 1, 2, 3 ]
 *
 * const otherValue = createBytes('Hello, world!');
 * console.log(otherValue); // Uint8Array [ 72, 101, ... ]
 * ```
 * @param value - The value to create the byte array from.
 * @returns The created byte array.
 * @throws If the value is not a bytes-like value.
 */
export function createBytes(value: BytesLike): Uint8Array {
  try {
    return create(value, BytesCoercer);
  } catch (error) {
    if (error instanceof StructError) {
      throw new Error(`Expected a bytes-like value, got "${error.value}".`);
    }

    /* istanbul ignore next */
    throw error;
  }
}

/**
 * Create a hexadecimal string from a bytes-like value.
 *
 * - If the value is a hex string, it is returned as-is.
 * - If the value is a string, it is interpreted as a UTF-8 string and converted
 * to a hex string.
 * - If the value is a `Uint8Array`, it is converted to a hex string.
 * - If the value is a number, it is converted to a hex string.
 * - If the value is a `bigint`, it is converted to a hex string.
 *
 * @example
 * ```typescript
 * const value = createHex(new Uint8Array([1, 2, 3]));
 * console.log(value); // '0x010203'
 *
 * const otherValue = createHex('Hello, world!');
 * console.log(otherValue); // '0x48656c6c6f2c20776f726c6421'
 * ```
 * @param value - The value to create the hex string from.
 * @returns The created hex string.
 * @throws If the value is not a bytes-like value.
 */
export function createHex(value: BytesLike): string {
  if (isHexString(value)) {
    return add0x(value);
  }

  try {
    return create(value, HexCoercer);
  } catch (error) {
    if (error instanceof StructError) {
      throw new Error(`Expected a bytes-like value, got "${error.value}".`);
    }

    /* istanbul ignore next */
    throw error;
  }
}
