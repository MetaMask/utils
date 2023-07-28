import type { Infer } from 'superstruct';
import {
  array,
  is,
  object,
  optional,
  pattern,
  size,
  string,
} from 'superstruct';

export const CAIP_CHAIN_ID_REGEX =
  /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-a-zA-Z0-9]{1,32})$/u;

export const CAIP_NAMESPACE_ID_REGEX = /^[-a-z0-9]{3,8}$/u;

export const CAIP_ACCOUNT_ID_REGEX =
  /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;

export const CAIP_ACCOUNT_ADDRESS_REGEX =
  /^(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;

/**
 * Parse a chain ID string to an object containing the namespace and reference.
 * This validates the chain ID before parsing it.
 *
 * @param caipChainId - The chain ID to validate and parse.
 * @returns The parsed chain ID.
 */
export function parseCaipChainId(caipChainId: CaipChainId): {
  namespace: CaipNamespaceId;
  reference: string;
} {
  const match = CAIP_CHAIN_ID_REGEX.exec(caipChainId);
  if (!match?.groups) {
    throw new Error('Invalid chain ID.');
  }

  return {
    namespace: match.groups.namespace as CaipNamespaceId,
    reference: match.groups.reference as string,
  };
}

/**
 * Parse an account ID to an object containing the chain, chain ID and address.
 * This validates the account ID before parsing it.
 *
 * @param accountId - The account ID to validate and parse.
 * @returns The parsed account ID.
 */
export function parseCaipAccountId(accountId: CaipAccountId): {
  chain: { namespace: CaipNamespaceId; reference: string };
  chainId: CaipChainId;
  address: string;
} {
  const match = CAIP_ACCOUNT_ID_REGEX.exec(accountId);
  if (!match?.groups) {
    throw new Error('Invalid account ID.');
  }

  return {
    address: match.groups.accountAddress as string,
    chainId: match.groups.chainId as CaipChainId,
    chain: {
      namespace: match.groups.namespace as CaipNamespaceId,
      reference: match.groups.reference as string,
    },
  };
}

/**
 * A helper struct for a string with a minimum length of 1 and a maximum length
 * of 40.
 */
export const LimitedString = size(string(), 1, 40);

/**
 * A CAIP-2 chain ID, i.e., a human-readable namespace and reference.
 */
export const CaipChainIdStruct = pattern(string(), CAIP_CHAIN_ID_REGEX);
export type CaipChainId = `${string}:${string}`;

export const CaipAccountIdStruct = pattern(string(), CAIP_ACCOUNT_ID_REGEX);
export type CaipAccountId = `${string}:${string}:${string}`;

export const CaipAccountIdArrayStruct = array(CaipAccountIdStruct);

/**
 * A chain descriptor.
 */
export const CaipChainStruct = object({
  id: CaipChainIdStruct,
  name: LimitedString,
});
export type CaipChain = {
  id: CaipChainId;
  name: string;
};

export const CaipNamespaceStruct = object({
  /**
   * A list of supported chains in the namespace.
   */
  chains: array(CaipChainStruct),

  /**
   * A list of supported RPC methods on the namespace, that a DApp can call.
   */
  methods: optional(array(LimitedString)),

  /**
   * A list of supported RPC events on the namespace, that a DApp can listen to.
   */
  events: optional(array(LimitedString)),
});
export type CaipNamespace = {
  chains: CaipChain[];
  methods?: string[];
  events?: string[];
};

/**
 * A CAIP-2 namespace, i.e., the first part of a chain ID.
 */
export const CaipNamespaceIdStruct = pattern(string(), CAIP_NAMESPACE_ID_REGEX);
export type CaipNamespaceId = Infer<typeof CaipNamespaceIdStruct>;

/**
 * A CAIP-10 account address, i.e., the last part of the account ID.
 */
export const CaipAccountAddressStruct = pattern(
  string(),
  CAIP_ACCOUNT_ADDRESS_REGEX,
);
export type CaipAccountAddress = Infer<typeof CaipAccountAddressStruct>;

/**
 * Check if the given value is a CAIP-2 chain ID.
 *
 * @param value - The value to check.
 * @returns Whether the value is a CAIP-2 chain ID.
 */
export function isCaipChainId(value: unknown): value is CaipChainId {
  return is(value, CaipChainIdStruct);
}

/**
 * Check if the given value is a CAIP-2 namespace ID.
 *
 * @param value - The value to check.
 * @returns Whether the value is a CAIP-2 namespace ID.
 */
export function isCaipNamespaceId(value: unknown): value is CaipNamespaceId {
  return is(value, CaipNamespaceIdStruct);
}

/**
 * Check if a value is a {@link CaipNamespace}.
 *
 * @param value - The value to validate.
 * @returns True if the value is a valid {@link CaipNamespace}.
 */
export function isCaipNamespace(value: unknown): value is CaipNamespace {
  return is(value, CaipNamespaceStruct);
}

/**
 * Check if the given value is a CAIP-10 account ID.
 *
 * @param value - The value to check.
 * @returns Whether the value is a CAIP-10 account ID.
 */
export function isCaipAccountId(value: unknown): value is CaipAccountId {
  return is(value, CaipAccountIdStruct);
}

/**
 * Check if the given value is an array of CAIP-10 account IDs.
 *
 * @param value - The value to check.
 * @returns Whether the value is an array of CAIP-10 account IDs.
 */
export function isCaipAccountIdArray(value: unknown): value is CaipAccountId[] {
  return is(value, CaipAccountIdArrayStruct);
}

/**
 * Check if a value is a {@link CaipAccountAddress}.
 *
 * @param value - The value to validate.
 * @returns True if the value is a valid {@link CaipAccountAddress}.
 */
export function isCaipAccountAddress(
  value: unknown,
): value is CaipAccountAddress {
  return is(value, CaipAccountAddressStruct);
}
