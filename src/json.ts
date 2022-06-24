import deepEqual from 'fast-deep-equal';
import { hasProperty } from './misc';

/**
 * Any JSON-compatible value.
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

/**
 * Type guard for {@link Json}.
 *
 * @param value - The value to check.
 * @returns Whether the value is valid JSON.
 */
export function isValidJson(value: unknown): value is Json {
  try {
    return deepEqual(value, JSON.parse(JSON.stringify(value)));
  } catch (_) {
    return false;
  }
}

/**
 * The string '2.0'.
 */
export const jsonrpc2 = '2.0' as const;

/**
 * A String specifying the version of the JSON-RPC protocol.
 * MUST be exactly "2.0".
 */
export type JsonRpcVersion2 = typeof jsonrpc2;

/**
 * An identifier established by the Client that MUST contain a String, Number,
 * or NULL value if included. If it is not included it is assumed to be a
 * notification. The value SHOULD normally not be Null and Numbers SHOULD
 * NOT contain fractional parts.
 */
export type JsonRpcId = number | string | null;

/**
 * A JSON-RPC error object.
 */
export type JsonRpcError = {
  code: number;
  message: string;
  data?: unknown;
  stack?: string;
};

/**
 * A JSON-RPC request object.
 *
 * @template Params - The type of the params.
 */
export type JsonRpcRequest<Params> = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion2;
  method: string;
  params?: Params;
};

/**
 * A JSON-RPC notification object.
 *
 * @template Params - The type of the params.
 */
export type JsonRpcNotification<Params> = {
  jsonrpc: JsonRpcVersion2;
  method: string;
  params?: Params;
};

/**
 * Type guard to narrow a JSON-RPC request or notification object to a
 * notification.
 *
 * @param requestOrNotification - The JSON-RPC request or notification to check.
 * @returns Whether the specified JSON-RPC message is a notification.
 */
export function isJsonRpcNotification<T>(
  requestOrNotification: JsonRpcNotification<T> | JsonRpcRequest<T>,
): requestOrNotification is JsonRpcNotification<T> {
  return !hasProperty(requestOrNotification, 'id');
}

/**
 * Assertion type guard to narrow a JSON-RPC request or notification object to a
 * notification.
 *
 * @param requestOrNotification - The JSON-RPC request or notification to check.
 */
export function assertIsJsonRpcNotification<T>(
  requestOrNotification: JsonRpcNotification<T> | JsonRpcRequest<T>,
): asserts requestOrNotification is JsonRpcNotification<T> {
  if (!isJsonRpcNotification(requestOrNotification)) {
    throw new Error('Not a JSON-RPC notification.');
  }
}

/**
 * Type guard to narrow a JSON-RPC request or notification object to a request.
 *
 * @param requestOrNotification - The JSON-RPC request or notification to check.
 * @returns Whether the specified JSON-RPC message is a request.
 */
export function isJsonRpcRequest<T>(
  requestOrNotification: JsonRpcNotification<T> | JsonRpcRequest<T>,
): requestOrNotification is JsonRpcRequest<T> {
  return hasProperty(requestOrNotification, 'id');
}

/**
 * Assertion type guard to narrow a JSON-RPC request or notification object to a
 * request.
 *
 * @param requestOrNotification - The JSON-RPC request or notification to check.
 */
export function assertIsJsonRpcRequest<T>(
  requestOrNotification: JsonRpcNotification<T> | JsonRpcRequest<T>,
): asserts requestOrNotification is JsonRpcRequest<T> {
  if (!isJsonRpcRequest(requestOrNotification)) {
    throw new Error('Not a JSON-RPC request.');
  }
}

/**
 * A successful JSON-RPC response object.
 *
 * @template Result - The type of the result.
 */
export type JsonRpcSuccess<Result = unknown> = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion2;
  result: Result;
};

/**
 * A failed JSON-RPC response object.
 */
export type JsonRpcFailure = {
  id: JsonRpcId;
  jsonrpc: JsonRpcVersion2;
  error: JsonRpcError;
};

/**
 * A JSON-RPC response object. Must be checked to determine whether it's a
 * success or failure.
 *
 * @template Result - The type of the result.
 */
export type JsonRpcResponse<Result = unknown> =
  | JsonRpcSuccess<Result>
  | JsonRpcFailure;

/**
 * Type guard to narrow a JsonRpcResponse object to a success (or failure).
 *
 * @param response - The response object to check.
 * @returns Whether the response object is a success, i.e. has a `result`
 * property.
 */
export function isJsonRpcSuccess<Result>(
  response: JsonRpcResponse<Result>,
): response is JsonRpcSuccess<Result> {
  return hasProperty(response, 'result');
}

/**
 * Type assertion to narrow a JsonRpcResponse object to a success (or failure).
 *
 * @param response - The response object to check.
 */
export function assertIsJsonRpcSuccess<T>(
  response: JsonRpcResponse<T>,
): asserts response is JsonRpcSuccess<T> {
  if (!isJsonRpcSuccess(response)) {
    throw new Error('Not a successful JSON-RPC response.');
  }
}

/**
 * Type guard to narrow a JsonRpcResponse object to a failure (or success).
 *
 * @param response - The response object to check.
 * @returns Whether the response object is a failure, i.e. has an `error`
 * property.
 */
export function isJsonRpcFailure(
  response: JsonRpcResponse<unknown>,
): response is JsonRpcFailure {
  return hasProperty(response, 'error');
}

/**
 * Type assertion to narrow a JsonRpcResponse object to a failure (or success).
 *
 * @param response - The response object to check.
 */
export function assertIsJsonRpcFailure(
  response: JsonRpcResponse<unknown>,
): asserts response is JsonRpcFailure {
  if (!isJsonRpcFailure(response)) {
    throw new Error('Not a failed JSON-RPC response.');
  }
}

type JsonRpcValidatorOptions = {
  permitEmptyString?: boolean;
  permitFractions?: boolean;
  permitNull?: boolean;
};

/**
 * Gets a function for validating JSON-RPC request / response `id` values.
 *
 * By manipulating the options of this factory, you can control the behavior
 * of the resulting validator for some edge cases. This is useful because e.g.
 * `null` should sometimes but not always be permitted.
 *
 * Note that the empty string (`''`) is always permitted by the JSON-RPC
 * specification, but that kind of sucks and you may want to forbid it in some
 * instances anyway.
 *
 * For more details, see the
 * [JSON-RPC Specification](https://www.jsonrpc.org/specification).
 *
 * @param options - An options object.
 * @param options.permitEmptyString - Whether the empty string (i.e. `''`)
 * should be treated as a valid ID. Default: `true`
 * @param options.permitFractions - Whether fractional numbers (e.g. `1.2`)
 * should be treated as valid IDs. Default: `false`
 * @param options.permitNull - Whether `null` should be treated as a valid ID.
 * Default: `true`
 * @returns The JSON-RPC ID validator function.
 */
export function getJsonRpcIdValidator(options?: JsonRpcValidatorOptions) {
  const { permitEmptyString, permitFractions, permitNull } = {
    permitEmptyString: true,
    permitFractions: false,
    permitNull: true,
    ...options,
  };

  /**
   * Type guard for {@link JsonRpcId}.
   *
   * @param id - The JSON-RPC ID value to check.
   * @returns Whether the given ID is valid per the options given to the
   * factory.
   */
  const isValidJsonRpcId = (id: unknown): id is JsonRpcId => {
    return Boolean(
      (typeof id === 'number' && (permitFractions || Number.isInteger(id))) ||
        (typeof id === 'string' && (permitEmptyString || id.length > 0)) ||
        (permitNull && id === null),
    );
  };
  return isValidJsonRpcId;
}

const NULL_LENGTH = 4; // null
const COMMA_LENGTH = 1; // ,
const WRAPPER_LENGTH = 1; // either [ ] { }
const TRUE_LENGTH = 4; // true
const FALSE_LENGTH = 5; // false
const ZERO_LENGTH = 1; // 0
const QUOTE_LENGTH = 1; // "
const COLON_LENGTH = 1; // :

/**
 * Checks whether a value is JSON serializable and counts the total number
 * of bytes needed to store the serialized version of the value.
 *
 * This function assumes the encoding of the JSON is done in UTF-8.
 *
 * @param value - A potential JSON serializable value.
 * @returns A tuple containing a boolean that signals whether the value was serializable and
 * a number of bytes that it will use when serialized to JSON.
 */
export function getJsonSerializableInfo(value: unknown): [boolean, number] {
  if (value === undefined) {
    return [true, 0];
  } else if (value === null) {
    return [true, NULL_LENGTH];
  }

  // eslint-disable-next-line default-case
  switch (typeof value) {
    case 'string':
      // TODO: Check if character is ASCII (1B) or UTF-8 (2B)
      return [true, value.length * 2 + QUOTE_LENGTH * 2];
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
          const [valid, size] = getJsonSerializableInfo(nestedValue);
          if (!valid) {
            throw new Error();
          }
          // Objects will have be serialized with "key": value, therefore we include the key in the calculation here
          const keySize = Array.isArray(value)
            ? 0
            : key.length + COMMA_LENGTH + COLON_LENGTH * 2;
          const separator = idx < arr.length - 1 ? COMMA_LENGTH : 0;
          return sum + keySize + size + separator;
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
