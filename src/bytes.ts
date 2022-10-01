import { assert } from './assert';
import { add0x } from './hex';

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
 * Convert a `Uint8Array` to a hexadecimal string.
 *
 * @param bytes - The bytes to convert to a hexadecimal string.
 * @returns The hexadecimal string.
 */
export function bytesToHex(bytes: Uint8Array): string {
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
  return new TextDecoder(undefined).decode(bytes);
}
