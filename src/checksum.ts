import { size, string } from 'superstruct';

import { base64 } from './base64.js';

export const ChecksumStruct = size(
  base64(string(), { paddingRequired: true }),
  44,
  44,
);
