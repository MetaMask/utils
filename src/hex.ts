/**
 * Add the `0x`-prefix to a hexadecimal string. If the string already has the
 * prefix, it is returned as-is.
 *
 * @param hex - The hexadecimal string to add the prefix to.
 * @returns The prefixed hexadecimal string.
 */
export function add0x(hex: string): string {
  if (hex.startsWith('0x')) {
    return hex;
  }
  return `0x${hex}`;
}

/**
 * Remove the `0x`-prefix from a hexadecimal string. If the string doesn't have
 * the prefix, it is returned as-is.
 *
 * @param hex - The hexadecimal string to remove the prefix from.
 * @returns The un-prefixed hexadecimal string.
 */
export function remove0x(hex: string): string {
  if (hex.startsWith('0x')) {
    return hex.substring(2);
  }
  return hex;
}
