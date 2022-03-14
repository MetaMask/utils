export type PlainObject = Record<number | string | symbol, unknown>;

/**
 * A plain object type guard.
 *
 * @param value - The value to check.
 * @returns Whether the specified value is a "plain object", i.e. its runtime
 * type is `object` and its neither `null` nor an `Array`.
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

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

/**
 * Like {@link Array}, but always non-empty.
 *
 * @template T - The non-empty array member type.
 */
export type NonEmptyArray<T> = [T, ...T[]];

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
