/* eslint-disable no-restricted-globals */
import { Address, Hex } from './hex';

export type Transaction = (LegacyTx | EIP2930Tx | EIP1559Tx) & Signature;

export type Signature = {
  /**
   * EC signature parameter
   * 32 bytes long sequence.
   */
  r?: bigint | string | number | Buffer;

  /**
   * EC signature parameter
   * Signature proof.
   * 32 bytes long sequence
   */
  s?: bigint | string | number | Buffer;

  /**
   * Recovery identifier. It can be either 0x1b or 0x1c
   * 1 byte long sequence
   */
  v?: bigint | string | number | Buffer;
};

/**
 * Ethereum Legacy Transaction (Type-0)
 * Reference: https://ethereum.org/en/developers/docs/transactions/
 */
export type LegacyTx = {
  /**
   * Sequentially incrementing counter which indicates the transaction
   * number from the account
   */
  nonce: bigint | string | number | Buffer;
  /**
   * The address of the sender, that will be signing the transaction
   */
  from: Address;

  /**
   * The receiving address.
   * If an externally-owned account, the transaction will transfer value.
   * If a contract account, the transaction will execute the contract code.
   */
  to: Address;

  /**
   * Arbitrary data.
   */
  data?: Buffer;

  /**
   * Transaction's gas price.
   */
  gasPrice?: bigint | string | number | Buffer | null;

  /**
   * Maximum amount of gas units that this transaction can consume.
   */
  gasLimit?: bigint | string | number | Buffer;

  /**
   * The amount of Ether sent.
   */
  value?: bigint | string | number | Buffer;

  /**
   * Transaction type.
   */
  type?: bigint | string | number | Buffer;
};

/**
 * EIP-2930 Transaction: Optional Access Lists
 * Reference: https://eips.ethereum.org/EIPS/eip-2930
 */
export type EIP2930Tx = {
  /**
   * Transaction chain ID
   */
  chainId?: bigint | string | number | Buffer;

  /**
   * List of addresses and storage keys that the transaction plans to access
   */
  accessList?:
    | { address: Hex; storageKeys: Hex[] }[]
    | { address: Buffer; storageKeys: Buffer[] }[];
} & LegacyTx;

/**
 * EIP-1559 Transaction: Fee market change for ETH 1.0 chain (Type-2)
 *
 * Reference: https://eips.ethereum.org/EIPS/eip-1559
 */
export type EIP1559Tx = {
  /**
   * Maximum fee to give to the miner
   */
  maxPriorityFeePerGas: bigint | string | number | Buffer;

  /**
   * Maximum total fee
   */
  maxFeePerGas: bigint | string | number | Buffer;

  /**
   * Gas price from {@link LegacyTransaction}.
   * Not necessary for EIP-1559 transactions.
   */
  gasPrice?: never | null | undefined;
} & EIP2930Tx;
