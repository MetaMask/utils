import type SafeEventEmitter from '@metamask/safe-event-emitter';

import type { JsonRpcParams, JsonRpcRequest, Json } from './json';
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
 * The interface for a legacy Ethereum provider.
 *
 * This provider follows conventions that pre-date
 * [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193). It is not compliant with
 * any Ethereum provider standard.
 */
export type LegacyEthereumProvider = {
  /**
   * Send a provider request asynchronously.
   *
   * @param req - The request to send.
   * @param callback - A function that is called upon the success or failure of the request.
   */
  sendAsync<Result extends Json = Json>(
    req: Partial<JsonRpcRequest>,
    callback: SendAsyncCallback<Result>,
  ): void;
};

type SendAsyncCallback<Result extends Json> = (
  ...args:
    | [error: EverythingButNull, result: undefined]
    | [error: null, result: Result]
) => void;

// What it says on the tin. We omit `null`, as that value is used for a
// successful response to indicate a lack of an error.
type EverythingButNull =
  | string
  | number
  | boolean
  | object
  | symbol
  | undefined;
