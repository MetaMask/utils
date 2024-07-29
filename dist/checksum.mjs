import { size, string } from "superstruct";
import { base64 } from "./base64.mjs";
export const ChecksumStruct = size(base64(string(), { paddingRequired: true }), 44, 44);
//# sourceMappingURL=checksum.mjs.map