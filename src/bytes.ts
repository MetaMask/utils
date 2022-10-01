import { assert } from './assert';
import { add0x, assertIsHexString, remove0x } from './hex';

export type Bytes = bigint | number | string | Uint8Array;

/**
 * Memoized function that returns an array to be used as a lookup table for
 * converting bytes to hexadecimal values.
 *
 * The array is created lazily and then cached for future use. The benefit of
 * this approach is that the performance of converting bytes to hex is much
 * better than if we were to call `toString(16)` on each byte.
 *
 * The downside is that the array is created once and then never garbage
 * collected. This is not a problem in practice because the array is only 256
 * elements long.
 *
 * @returns A function that returns the lookup table.
 */
function getPrecomputedHexValuesBuilder(): () => string[] {
  // To avoid issues with tree shaking, we need to use a function to return the
  // array. This is because the array is only used in the `bytesToHex` function
  // and if we were to use a global variable, the array might be removed by the
  // tree shaker.
  const lookupTable: string[] = [];

  return () => {
    if (lookupTable.length === 0) {
      for (let i = 0; i < 256; i++) {
        lookupTable.push(i.toString(16).padStart(2, '0'));
      }
    }

    return lookupTable;
  };
}

/**
 * Function implementation of the {@link getPrecomputedHexValuesBuilder}
 * function.
 */
const getPrecomputedHexValues = getPrecomputedHexValuesBuilder();

/**
 * Check if a value is a `Uint8Array`.
 *
 * @param value - The value to check.
 * @returns Whether the value is a `Uint8Array`.
 */
export function isBytes(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array;
}

/**
 * Assert that a value is a `Uint8Array`.
 *
 * @param value - The value to check.
 * @throws If the value is not a `Uint8Array`.
 */
export function assertIsBytes(value: unknown): asserts value is Uint8Array {
  assert(isBytes(value), 'Value must be a Uint8Array.');
}

/**
 * Convert a `Uint8Array` to a hexadecimal string.
 *
 * @param bytes - The bytes to convert to a hexadecimal string.
 * @returns The hexadecimal string.
 */
export function bytesToHex(bytes: Uint8Array): string {
  assertIsBytes(bytes);

  const lookupTable = getPrecomputedHexValues();
  const hex = Array.prototype.map.call(bytes, (n) => lookupTable[n]).join('');

  return add0x(hex);
}

/**
 * Convert a `Uint8Array` to a `bigint`.
 *
 * To convert a `Uint8Array` to a `number` instead, use {@link bytesToNumber}.
 *
 * @param bytes - The bytes to convert to a bigint.
 * @returns The bigint.
 */
export function bytesToBigInt(bytes: Uint8Array): bigint {
  assertIsBytes(bytes);

  const hex = bytesToHex(bytes);

  // This can catch possible regressions in the future, if we ever change the
  // implementation of `bytesToHex` to return a string without the `0x` prefix.
  assert(hex.startsWith('0x'), 'Hex string must start with "0x".');

  return BigInt(hex);
}

/**
 * Convert a `Uint8Array` to a `number`.
 *
 * To convert a `Uint8Array` to a `bigint` instead, use {@link bytesToBigInt}.
 *
 * @param bytes - The bytes to convert to a number.
 * @returns The number.
 * @throws If the resulting number is not a safe integer.
 */
export function bytesToNumber(bytes: Uint8Array): number {
  assertIsBytes(bytes);

  const number = Number(bytesToBigInt(bytes));

  assert(
    Number.isSafeInteger(number),
    'Number is not a safe integer. Use `bytesToBigInt` instead.',
  );

  return number;
}

/**
 * Convert a UTF-8 encoded `Uint8Array` to a `string`.
 *
 * @param bytes - The bytes to convert to a string.
 * @returns The string.
 */
export function bytesToString(bytes: Uint8Array): string {
  assertIsBytes(bytes);

  return new TextDecoder(undefined).decode(bytes);
}

/**
 * Convert a hexadecimal string to a `Uint8Array`. The string can optionally be
 * prefixed with `0x`. It accepts even and odd length strings.
 *
 * @param value - The hexadecimal string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function hexToBytes(value: string): Uint8Array {
  assertIsHexString(value);

  // Remove the `0x` prefix if it exists, and pad the string to have an even
  // number of characters.
  const strippedValue = remove0x(value).toLowerCase();
  const normalizedValue =
    strippedValue.length % 2 === 0 ? strippedValue : `0${strippedValue}`;
  const bytes = new Uint8Array(normalizedValue.length / 2);

  for (let i = 0; i < normalizedValue.length; i++) {
    // While this is not the prettiest way to convert a hexadecimal string to a
    // `Uint8Array`, it is a lot faster than using `parseInt` to convert each
    // character.
    const c1 = normalizedValue.charCodeAt(i * 2);
    const c2 = normalizedValue.charCodeAt(i * 2 + 1);
    const n1 = c1 - (c1 < 58 ? 48 : 87);
    const n2 = c2 - (c2 < 58 ? 48 : 87);

    bytes[i] = n1 * 16 + n2;
  }

  return bytes;
}

/**
 * Convert a `bigint` to a `Uint8Array`.
 *
 * @param value - The bigint to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function bigIntToBytes(value: bigint): Uint8Array {
  assert(typeof value === 'bigint', 'Value must be a bigint.');

  const hex = value.toString(16);
  return hexToBytes(hex);
}

/**
 * Convert a `number` to a `Uint8Array`.
 *
 * @param value - The number to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 * @throws If the number is not a safe integer.
 */
export function numberToBytes(value: number): Uint8Array {
  assert(typeof value === 'number', 'Value must be a number.');
  assert(
    Number.isSafeInteger(value),
    'Value is not a safe integer. Use `bigIntToBytes` instead.',
  );

  const hex = value.toString(16);
  return hexToBytes(hex);
}

/**
 * Convert a `string` to a UTF-8 encoded `Uint8Array`.
 *
 * @param value - The string to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function stringToBytes(value: string): Uint8Array {
  assert(typeof value === 'string', 'Value must be a string.');

  return new TextEncoder().encode(value);
}

/**
 * Convert a byte-like value to a `Uint8Array`. The value can be a `Uint8Array`,
 * a `bigint`, a `number`, or a `string`.
 *
 * If the value is a `string`, and it is prefixed with `0x`, it will be
 * interpreted as a hexadecimal string. Otherwise, it will be interpreted as a
 * UTF-8 string. To convert a hexadecimal string to bytes without interpreting
 * it as a UTF-8 string, use {@link hexToBytes} instead.
 *
 * If the value is a `Uint8Array`, it will be returned as-is.
 *
 * @param value - The value to convert to bytes.
 * @returns The bytes as `Uint8Array`.
 */
export function valueToBytes(value: Bytes): Uint8Array {
  if (typeof value === 'bigint') {
    return bigIntToBytes(value);
  }

  if (typeof value === 'number') {
    return numberToBytes(value);
  }

  if (typeof value === 'string') {
    if (value.startsWith('0x')) {
      return hexToBytes(value);
    }

    return stringToBytes(value);
  }

  if (isBytes(value)) {
    return value;
  }

  throw new Error(`Unsupported value type: "${typeof value}".`);
}

/**
 * Concatenate multiple byte-like values into a single `Uint8Array`. The values
 * can be `Uint8Array`, `bigint`, `number`, or `string`. This uses
 * {@link valueToBytes} under the hood to convert each value to bytes. Refer to
 * the documentation of that function for more information.
 *
 * @param values - The values to concatenate.
 * @returns The concatenated bytes as `Uint8Array`.
 */
export function concatBytes(values: Bytes[]): Uint8Array {
  return values.map(valueToBytes).reduce((previousValue, currentValue) => {
    // While we could simply spread the values into an array and use
    // `Uint8Array.from`, that is a lot slower than using `Uint8Array.set`.
    const bytes = new Uint8Array(previousValue.length + currentValue.length);
    bytes.set(previousValue);
    bytes.set(currentValue, previousValue.length);

    return bytes;
  }, new Uint8Array(0));
}
