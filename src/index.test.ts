import * as allExports from '.';

describe('index', () => {
  it('includes only cross-platform exports', () => {
    expect(Object.keys(allExports).sort()).toMatchInlineSnapshot(`
      [
        "AssertionError",
        "CAIP_ACCOUNT_ADDRESS_REGEX",
        "CAIP_ACCOUNT_ID_REGEX",
        "CAIP_ASSET_ID_REGEX",
        "CAIP_ASSET_TYPE_REGEX",
        "CAIP_CHAIN_ID_REGEX",
        "CAIP_NAMESPACE_REGEX",
        "CAIP_REFERENCE_REGEX",
        "CaipAccountAddressStruct",
        "CaipAccountIdStruct",
        "CaipAssetIdStruct",
        "CaipAssetTypeStruct",
        "CaipChainIdStruct",
        "CaipNamespaceStruct",
        "CaipReferenceStruct",
        "ChecksumStruct",
        "Duration",
        "ESCAPE_CHARACTERS_REGEXP",
        "FrozenMap",
        "FrozenSet",
        "HexAddressStruct",
        "HexChecksumAddressStruct",
        "HexStruct",
        "InvalidIso8601Date",
        "JsonRpcErrorStruct",
        "JsonRpcFailureStruct",
        "JsonRpcIdStruct",
        "JsonRpcNotificationStruct",
        "JsonRpcParamsStruct",
        "JsonRpcRequestStruct",
        "JsonRpcResponseStruct",
        "JsonRpcSuccessStruct",
        "JsonRpcVersionStruct",
        "JsonSize",
        "JsonStruct",
        "KnownCaipNamespace",
        "PendingJsonRpcResponseStruct",
        "StrictHexStruct",
        "UnsafeJsonStruct",
        "VersionRangeStruct",
        "VersionStruct",
        "add0x",
        "assert",
        "assertExhaustive",
        "assertIsBytes",
        "assertIsHexString",
        "assertIsJsonRpcError",
        "assertIsJsonRpcFailure",
        "assertIsJsonRpcNotification",
        "assertIsJsonRpcRequest",
        "assertIsJsonRpcResponse",
        "assertIsJsonRpcSuccess",
        "assertIsPendingJsonRpcResponse",
        "assertIsSemVerRange",
        "assertIsSemVerVersion",
        "assertIsStrictHexString",
        "assertStruct",
        "base64",
        "base64ToBytes",
        "bigIntToBytes",
        "bigIntToHex",
        "bytesToBase64",
        "bytesToBigInt",
        "bytesToHex",
        "bytesToNumber",
        "bytesToSignedBigInt",
        "bytesToString",
        "calculateNumberSize",
        "calculateStringSize",
        "concatBytes",
        "createBigInt",
        "createBytes",
        "createDataView",
        "createDeferredPromise",
        "createHex",
        "createModuleLogger",
        "createNumber",
        "createProjectLogger",
        "exactOptional",
        "getChecksumAddress",
        "getErrorMessage",
        "getJsonRpcIdValidator",
        "getJsonSize",
        "getKnownPropertyNames",
        "getSafeJson",
        "gtRange",
        "gtVersion",
        "hasProperty",
        "hexToBigInt",
        "hexToBytes",
        "hexToNumber",
        "inMilliseconds",
        "isASCII",
        "isBytes",
        "isCaipAccountAddress",
        "isCaipAccountId",
        "isCaipAssetId",
        "isCaipAssetType",
        "isCaipChainId",
        "isCaipNamespace",
        "isCaipReference",
        "isErrorWithCode",
        "isErrorWithMessage",
        "isErrorWithStack",
        "isHexString",
        "isJsonRpcError",
        "isJsonRpcFailure",
        "isJsonRpcNotification",
        "isJsonRpcRequest",
        "isJsonRpcResponse",
        "isJsonRpcSuccess",
        "isNonEmptyArray",
        "isNullOrUndefined",
        "isObject",
        "isPendingJsonRpcResponse",
        "isPlainObject",
        "isStrictHexString",
        "isValidChecksumAddress",
        "isValidHexAddress",
        "isValidJson",
        "isValidSemVerRange",
        "isValidSemVerVersion",
        "jsonrpc2",
        "numberToBytes",
        "numberToHex",
        "object",
        "parseCaipAccountId",
        "parseCaipChainId",
        "parseIso8601DateTime",
        "remove0x",
        "satisfiesVersionRange",
        "signedBigIntToBytes",
        "stringToBytes",
        "timeSince",
        "toCaipChainId",
        "valueToBytes",
        "wrapError",
      ]
    `);
  });
});
