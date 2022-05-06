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
 * A String specifying the version of the JSON-RPC protocol.
 * MUST be exactly "2.0".
 */
export type JsonRpcVersion2 = '2.0';

/**
 * The string '2.0'.
 */
export const jsonrpc2 = '2.0' as const;

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
  jsonrpc: JsonRpcVersion2;
  method: string;
  id: JsonRpcId;
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
 * The internal, base type for JSON-RPC responses.
 */
type JsonRpcResponseBase = {
  jsonrpc: JsonRpcVersion2;
  id: JsonRpcId;
};

/**
 * A successful JSON-RPC response object.
 *
 * @template Result - The type of the result.
 */
export type JsonRpcSuccess<Result = unknown> = JsonRpcResponseBase & {
  result: Result;
};

/**
 * A failed JSON-RPC response object.
 */
export type JsonRpcFailure = JsonRpcResponseBase & {
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
 * ATTN:** Assumes that only one of the `result` and `error` properties is
 * present on the `response`, as guaranteed by e.g. `JsonRpcEngine.handle`.
 *
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
 * ATTN:** Assumes that only one of the `result` and `error` properties is
 * present on the `response`, as guaranteed by e.g. `JsonRpcEngine.handle`.
 *
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
