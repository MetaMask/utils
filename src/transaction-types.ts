/* eslint-disable no-restricted-globals */
import { Hex } from './hex';

export type Address = Hex | Buffer;

// https://ethereum.org/en/developers/docs/transactions/
export type Transaction = {
  nonce: bigint | string | number | Buffer;
  from: Address;
  to: Address;
  data: Buffer;
  gasPrice?: bigint | string | number | Buffer | null;
  gasLimit?: bigint | string | number | Buffer;
  value?: bigint | string | number | Buffer;
  v?: bigint | string | number | Buffer;
  r?: bigint | string | number | Buffer;
  s?: bigint | string | number | Buffer;
  type?: bigint | string | number | Buffer;
};

// https://eips.ethereum.org/EIPS/eip-2930
export type EIP2930Tx = {
  chainId: bigint | string | number | Buffer;
  accessList: { address: Hex; storageKeys: Hex[] }[];
} & Transaction;

// https://eips.ethereum.org/EIPS/eip-1559
export type EIP1559Tx = {
  gasPrice: never | null;
  gas: bigint | string | number | Buffer;
  maxPriorityFeePerGas?: bigint | string | number | Buffer;
  maxFeePerGas?: bigint | string | number | Buffer;
} & EIP2930Tx;

// https://eips.ethereum.org/EIPS/eip-4844
export type EIP4844Tx = {
  maxFeePerDataGas: bigint | string | number | Buffer;
  blobVersionedHashes: Hex[] | string[] | Buffer[];
  blobs?: Buffer[] | Uint8Array[] | number[][] | number[] | bigint[] | Hex[];
  kzgCommitments?:
    | Buffer[]
    | Uint8Array[]
    | number[][]
    | number[]
    | bigint[]
    | Hex[];
  kzgProof?: Buffer | Uint8Array | number[] | number | bigint | Hex;
} & EIP1559Tx;
