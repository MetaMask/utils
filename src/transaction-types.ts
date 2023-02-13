/* eslint-disable no-restricted-globals */

export type Address = `0x${string}` | Buffer;

export type Transaction = {
  /**
   * The transaction's nonce.
   */
  nonce?: bigint | string | number | Buffer;

  /**
   * The transaction's gas price.
   */
  gasPrice?: bigint | string | number | Buffer | null;

  /**
   * The transaction's gas limit.
   */
  gasLimit?: bigint | string | number | Buffer;

  /**
   * The maximum price of the consumed gas
   * to be included as a tip to the validator
   */
  maxPriorityFeePerGas?: bigint | string | number | Buffer;

  /**
   * the maximum fee per unit of gas willing to be paid for the
   * transaction (inclusive of _baseFeePerGas_ and _maxPriorityFeePerGas_)
   */
  maxFeePerGas?: bigint | string | number | Buffer;

  /**
   * The transaction's the address is from.
   */
  from?: Address;

  /**
   * The transaction's the address is sent to.
   */
  to?: Address;

  /**
   * The amount of Ether sent.
   */
  value?: bigint | string | number | Buffer;

  /**
   * This will contain the data of the message or the init of a contract.
   */
  data?: Buffer;

  /**
   * EC recovery ID.
   */
  v?: bigint | string | number | Buffer;

  /**
   * EC signature parameter.
   */
  r?: bigint | string | number | Buffer;

  /**
   * EC signature parameter.
   */
  s?: bigint | string | number | Buffer;

  /**
   * The transaction type
   */
  type?: bigint | string | number | Buffer;
};
