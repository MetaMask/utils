import { pattern, Struct } from 'superstruct';

import { assert } from './assert';

export type Base64Opts = {
  /**
   * Is the `=` padding at the end required or not.
   *
   * @default false
   */
  // Padding is optional in RFC 4648, that's why the default value is false
  paddingRequired?: boolean;
  /**
   * Which character set should be used.
   * The sets are based on {@link https://datatracker.ietf.org/doc/html/rfc4648 RFC 4648}.
   *
   * @default 'base64'
   */
  characterSet?: 'base64' | 'base64url';
};

/**
 * Ensure that a provided string-based struct is valid base64.
 *
 * @param struct - The string based struct.
 * @param opts - Optional options to specialize base64 validation. See {@link Base64Opts} documentation.
 * @returns A superstruct validating base64.
 */
export const base64 = <T extends string, S>(
  struct: Struct<T, S>,
  opts: Base64Opts = {},
) => {
  const paddingRequired = opts.paddingRequired ?? false;
  const characterSet = opts.characterSet ?? 'base64';

  let letters: string;
  if (characterSet === 'base64') {
    letters = String.raw`[A-Za-z0-9+\/]`;
  } else {
    assert(characterSet === 'base64url');
    letters = String.raw`[-_A-Za-z0-9]`;
  }

  let re: RegExp;
  if (paddingRequired) {
    re = new RegExp(
      `^(?:${letters}{4})*(?:${letters}{3}=|${letters}{2}==)?$`,
      'u',
    );
  } else {
    re = new RegExp(
      `^(?:${letters}{4})*(?:${letters}{2,3}|${letters}{3}=|${letters}{2}==)?$`,
      'u',
    );
  }

  return pattern(struct, re);
};
