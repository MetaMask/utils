import { is, pattern, string, Struct } from 'superstruct';

import { assert } from './assert';

export type CaipChainId = `${string}:${string}`;

const CAIP2_REGEX = /^([-a-z0-9]{3,8}):([-_a-zA-Z0-9]{1,32})$/u;

export const CaipChainIdStruct = pattern(string(), CAIP2_REGEX) as Struct<
  CaipChainId,
  null
>;

export type ParsedCaipChainId = {
  namespace: string;
  reference: string;
};

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

/**
 * Returns the namespace and reference strings from caip chain id string.
 *
 * @param caipChainId - The caip chain id string.
 * @returns The {@link ParsedCaipChainId} object.
 */
export function parseCaipChainIdString(caipChainId: string): ParsedCaipChainId {
  const [, namespace, reference] = caipChainId.match(CAIP2_REGEX) ?? [];
  return {
    namespace: namespace ?? '',
    reference: reference ?? '',
  };
}
