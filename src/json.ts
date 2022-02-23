const NULL_LENGTH = 4; // null
const COMMA_LENGTH = 1; // ,
const WRAPPER_LENGTH = 1; // either [ ] { }
const TRUE_LENGTH = 4; // true
const FALSE_LENGTH = 5; // false
const ZERO_LENGTH = 1; // 0
const QUOTE_LENGTH = 1; // "
const COLON_LENGTH = 1; // :

/**
 * Checks whether a value is JSON serializable and counts the total number of bytes needed to store the serialized version of the value.
 *
 * This function assumes the encoding of the JSON is done in UTF-8.
 *
 * @param value A potential JSON serializable value
 * @returns A tuple containing a boolean that signals whether the value was serializable and a number of bytes
 */
export function getJsonSizing(value: unknown): [boolean, number] {
  if (value === undefined) {
    return [true, 0];
  } else if (value === null) {
    return [true, NULL_LENGTH];
  }

  // eslint-disable-next-line default-case
  switch (typeof value) {
    case 'string':
      // @todo Check actual byte length of the string here
      return [true, value.length + QUOTE_LENGTH * 2];
    case 'boolean':
      return [true, value ? TRUE_LENGTH : FALSE_LENGTH];
    case 'number':
      return [
        true,
        // Check number of digits since all digits are 1 byte
        value === 0 ? ZERO_LENGTH : Math.floor(Math.log10(value) + 1),
      ];
  }

  if (!isPlainObject(value) && !Array.isArray(value)) {
    return [false, 0];
  }

  try {
    return [
      true,
      Object.entries(value).reduce(
        (sum, [key, nestedValue], idx, arr) => {
          const [valid, size] = getJsonSizing(nestedValue);
          if (!valid) {
            throw new Error();
          }
          // Objects will have be serialized with "key": value, therefore we include the key in the calculation here
          const keySize = Array.isArray(value)
            ? 0
            : key.length + COMMA_LENGTH + COLON_LENGTH * 2;
          const seperator = idx < arr.length - 1 ? COMMA_LENGTH : 0;
          return sum + keySize + size + seperator;
        },
        // Starts at 2 because the string will minimally contain {}/[]
        WRAPPER_LENGTH * 2,
      ),
    ];
  } catch (_) {
    return [false, 0];
  }
}

export type PlainObject = Record<number | string | symbol, unknown>;

export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null) return false;

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
