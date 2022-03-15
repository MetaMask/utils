//
// Types
//

/**
 * Makes every specified property of the specified object type mutable.
 *
 * @template T - The object whose readonly properties to make mutable.
 * @template TargetKey - The property key(s) to make mutable.
 */
export type Mutable<
  T extends Record<string, unknown>,
  TargetKey extends string
> = {
  -readonly [Key in keyof Pick<T, TargetKey>]: T[Key];
} &
  {
    [Key in keyof Omit<T, TargetKey>]: T[Key];
  };

/**
 * Useful for representing some value that _migh_ be present and / or complete.
 *
 * @template T - The value that might be present or complete.
 */
export type Maybe<T> = Partial<T> | null | undefined;

/**
 * Like {@link Array}, but always non-empty.
 *
 * @template T - The non-empty array member type.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * A JavaScript object that is not `null`, a function, or an array. The object
 * can still be an instance of a class.
 */
export type PlainObject = Record<number | string | symbol, unknown>;

//
// Type Guards
//

/**
 * A {@link NonEmptyArray} type guard.
 *
 * @template T - The non-empty array member type.
 * @param value - The value to check.
 * @returns Whether the value is a non-empty array.
 */
export function isNonEmptyArray<T>(value: T[]): value is NonEmptyArray<T> {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard for "nullishness".
 *
 * @param value - A value (literally anything).
 * @returns `true` if the value is null or undefined, `false` otherwise.
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * A type guard for {@link PlainObject}.
 *
 * @param value - The value to check.
 * @returns Whether the specified value is a "plain object", i.e. its runtime
 * type is `object` and its neither `null` nor an `Array`.
 */
export function isObject(value: unknown): value is PlainObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

//
// Other utility functions
//

/**
 * An alias for {@link Reflect.hasOwnProperty}.
 *
 * @param object - The object to check.
 * @param name - The property name to check for.
 * @returns Whether the specified object has an own property with the specified
 * name.
 */
export const hasProperty = (
  object: PlainObject,
  name: string | number | symbol,
): boolean => Reflect.hasOwnProperty.call(object, name);
