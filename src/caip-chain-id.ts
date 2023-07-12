import { is, pattern, string, Struct } from 'superstruct';

import { assert } from './assert';

export type CaipChainId = `${string}:${string}`;

export const CaipChainIdStruct = pattern(
  string(),
  /^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$/u,
) as Struct<CaipChainId, null>;

/**
 * Check if a string is a valid caip chain id string.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid caip chain id string.
 */
export function isCaipChainIdString(value: unknown): value is CaipChainId {
  return is(value, CaipChainIdStruct);
}

/**
 * Assert that a value is a valid caip chain id string.
 *
 * @param value - The value to check.
 * @throws If the value is not a valid caip chain id string.
 */
export function assertIsCaipChainIdString(
  value: unknown,
): asserts value is CaipChainId {
  assert(isCaipChainIdString(value), 'Value must be a caip chain id string.');
}

/**
 * Returns caip chain id string from namespace and reference.
 *
 * @param namespace - The caip chain id namespace string.
 * @param reference - The caip chaid id reference string.
 * @returns The unvalidated caip chaid id string.
 */
export function getCaipChainIdString(
  namespace: string,
  reference: string,
): string {
  return `${namespace}:${reference}`;
}
