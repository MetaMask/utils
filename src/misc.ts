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
 * Useful for representing some value that _migh_ be present and / or complete.
 *
 * @template Value - The value that might be present or complete.
 */
export type Maybe<Value> = Partial<Value> | null | undefined;

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

type CreateArrayDeepEqualParam<Element> = {
  sort?: (valueA: Element, valueB: Element) => number;
  isEqual?: (valueA: Element, valueB: Element) => boolean;
};

// Kudos to: https://stackoverflow.com/a/19746771
/**
 * Creates an array deep equality comparator. Returns `true` if the arrays have
 * the same length and if every element exists in both arrays, and `false`
 * otherwise. The specified arrays are not mutated, but are instead copied and
 * sorted. Sorting and member value equality behavior can be customized.
 *
 * @template Element - The type of the elements of the arrays to compare.
 * @param options - An options bag.
 * @param options.sort - The function used to sort the arrays. Defaults to the
 * default behavior of {@link Array.prototype.sort}.
 * @param options.isEqual - The function used to check equality between array
 * member values. Defaults to a referential equality check (`a === b`).
 * @returns Whether the two arrays are deeply equal.
 */
export function createArrayDeepEqual<Element>({
  sort,
  isEqual,
}: CreateArrayDeepEqualParam<Element> = {}): (
  arrayA: Element[],
  arrayB: Element[],
) => boolean {
  const arrayDeepEqual = (arrayA: Element[], arrayB: Element[]) => {
    if (arrayA.length !== arrayB.length) {
      return false;
    }

    const arrayASorted = [...arrayA].sort(sort);
    const arrayBSorted = [...arrayB].sort(sort);

    return arrayASorted.every((value, index) =>
      isEqual
        ? isEqual(value, arrayBSorted[index])
        : value === arrayBSorted[index],
    );
  };

  return arrayDeepEqual;
}
