//
// Types
//

/**
 * Makes every specified property of the specified object type mutable.
 *
 * @template ObjectValue - The object whose readonly properties to make mutable.
 * @template TargetKey - The property key(s) to make mutable.
 */
export type Mutable<
  ObjectValue extends Record<string, unknown>,
  TargetKey extends keyof ObjectValue
> = {
  -readonly [Key in keyof Pick<ObjectValue, TargetKey>]: ObjectValue[Key];
} &
  {
    [Key in keyof Omit<ObjectValue, TargetKey>]: ObjectValue[Key];
  };

/**
 * Useful for representing some value that _might_ be present and / or complete.
 *
 * @template Value - The value that might be present or complete.
 */
export type PartialOrAbsent<Value> = Partial<Value> | null | undefined;

/**
 * Like {@link Array}, but always non-empty.
 *
 * @template Element - The non-empty array member type.
 */
export type NonEmptyArray<Element> = [Element, ...Element[]];

/**
 * A JavaScript object that is not `null`, a function, or an array. The object
 * can still be an instance of a class.
 */
export type RuntimeObject = Record<number | string | symbol, unknown>;

//
// Type Guards
//

/**
 * A {@link NonEmptyArray} type guard.
 *
 * @template Element - The non-empty array member type.
 * @param value - The value to check.
 * @returns Whether the value is a non-empty array.
 */
export function isNonEmptyArray<Element>(
  value: Element[],
): value is NonEmptyArray<Element> {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard for "nullishness".
 *
 * @param value - Any value.
 * @returns `true` if the value is null or undefined, `false` otherwise.
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * A type guard for {@link RuntimeObject}.
 *
 * @param value - The value to check.
 * @returns Whether the specified value has a runtime type of `object` and is
 * neither `null` nor an `Array`.
 */
export function isObject(value: unknown): value is RuntimeObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

//
// Other utility functions
//

/**
 * An alias for {@link Object.hasOwnProperty}.
 *
 * @param object - The object to check.
 * @param name - The property name to check for.
 * @returns Whether the specified object has an own property with the specified
 * name, regardless of whether it is enumerable or not.
 */
export const hasProperty = (
  object: RuntimeObject,
  name: string | number | symbol,
): boolean => Object.hasOwnProperty.call(object, name);

export type PlainObject = Record<number | string | symbol, unknown>;

/**
 * Predefined sizes (in Bytes) of specific parts of JSON structure.
 */
export enum JsonSize {
  NULL = 4,
  COMMA = 1,
  WRAPPER = 1,
  TRUE = 4,
  FALSE = 5,
  ZERO = 1,
  QUOTE = 1,
  COLON = 1,
  DOT = 1,
}

/**
 * Check if the value is plain object.
 *
 * @param value - Value to be checked.
 * @returns Boolean.
 */
export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  try {
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(value) === proto;
  } catch (_) {
    return false;
  }
}

/**
 * Check if character or string is ASCII.
 *
 * @param value - String or character.
 * @returns Boolean, true if value is ASCII, false if not.
 */
export function isASCII(value: string) {
  // eslint-disable-next-line no-control-regex,require-unicode-regexp
  return /^[\x00-\x7F]*$/.test(value);
}

/**
 * Calculate string size.
 *
 * @param value - String value to calculate size.
 * @returns Number of bytes used to store whole string value.
 */
export function calculateStringSize(value: string) {
  let size = 0;
  for (const character of value) {
    if (isASCII(character)) {
      size += 1;
    } else {
      size += 2;
    }
  }

  // Detect characters that need backslash escape
  const re = /\\|'/gu;
  size += ((value || '').match(re) || []).length;

  return size;
}

/**
 * Calculate size of a number ofter JSON serialization.
 *
 * @param value - Number value to calculate size.
 * @returns Number of bytes used to store whole number in JSON.
 */
export function calculateNumberSize(value: number): number {
  if (value?.toString().length) {
    return value.toString().length;
  }
  return 0;
}
