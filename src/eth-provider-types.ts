import type SafeEventEmitter from '@metamask/safe-event-emitter';

import type { Hex } from './hex';
import type { JsonRpcParams, Json } from './json';
import type { PartialOrAbsent } from './misc';

/**
 * An interface for the EIP-1193 specification for an Ethereum JavaScript Provider.
 *
 * For details, see:
 * - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
 * - [BaseProvider]{@link https://github.com/MetaMask/providers/blob/main/src/BaseProvider.ts} in package [@metamask/providers](https://www.npmjs.com/package/@metamask/providers)
 */
export type EIP1193Provider = SafeEventEmitter & {
  /**
   * Submits an RPC request for the given method, with the given params.
   * Resolves with the result of the method call, or rejects on error.
   *
   * @param args - The RPC request arguments.
   * @param args.method - The RPC method name.
   * @param args.params - The parameters for the RPC method.
   * @returns A Promise that resolves with the result of the RPC method,
   * or rejects if an error is encountered.
   */
  request<Params extends JsonRpcParams, Result extends Json>(
    args: Params,
  ): Promise<PartialOrAbsent<Result>>;
};

/**
 * An extension of the EIP-1193 specification for an Ethereum JavaScript Provider.
 *
 * For details, see:
 * - [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
 * - [BaseProvider]{@link https://github.com/MetaMask/providers/blob/main/src/BaseProvider.ts} in package [@metamask/providers](https://www.npmjs.com/package/@metamask/providers)
 * - https://docs.metamask.io/wallet/reference/provider-api/
 */
export type EthJsonRpcProvider = EIP1193Provider & {
  /**
   * The chain ID of the currently connected Ethereum chain, represented as 0x-prefixed hexstring.
   * See [chainId.network]{@link https://chainid.network} for more information.
   */
  chainId: Hex | null;

  /**
   * The user's currently selected Ethereum address as a 0x-prefixed hexstring.
   * If read-access is denied, null is returned.
   */
  selectedAddress: Hex | null;

  /**
   * Returns true if the provider has a connection to the network and is able to process requests for the active chain.
   *
   * @returns Whether the provider can process RPC requests.
   */
  isConnected(): boolean;
};
