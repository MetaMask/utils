import * as allExports from './node';

describe('node', () => {
  it('includes Node-specific exports in addition to the cross-platform ones', () => {
    expect(Object.keys(allExports).sort()).toMatchInlineSnapshot(`
      [
        "AssertionError",
        "CAIP_ACCOUNT_ADDRESS_REGEX",
        "CAIP_ACCOUNT_ID_REGEX",
        "CAIP_ASSET_ID_REGEX",
        "CAIP_ASSET_NAMESPACE_REGEX",
        "CAIP_ASSET_REFERENCE_REGEX",
        "CAIP_ASSET_TYPE_REGEX",
        "CAIP_CHAIN_ID_REGEX",
        "CAIP_NAMESPACE_REGEX",
        "CAIP_REFERENCE_REGEX",
        "CAIP_TOKEN_ID_REGEX",
        "CaipAccountAddressStruct",
        "CaipAccountIdStruct",
        "CaipAssetIdStruct",
        "CaipAssetNamespaceStruct",
        "CaipAssetReferenceStruct",
        "CaipAssetTypeStruct",
        "CaipChainIdStruct",
        "CaipNamespaceStruct",
        "CaipReferenceStruct",
        "CaipTokenIdStruct",
        "ChecksumStruct",
        "Duration",
        "ESCAPE_CHARACTERS_REGEXP",
        "FrozenMap",
        "FrozenSet",
        "HexAddressStruct",
        "HexChecksumAddressStruct",
        "HexStruct",
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
        "createSandbox",
        "definePattern",
        "directoryExists",
        "ensureDirectoryStructureExists",
        "exactOptional",
        "fileExists",
        "forceRemove",
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
        "isCaipAssetNamespace",
        "isCaipAssetReference",
        "isCaipAssetType",
        "isCaipChainId",
        "isCaipNamespace",
        "isCaipReference",
        "isCaipTokenId",
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
        "parseCaipAssetId",
        "parseCaipAssetType",
        "parseCaipChainId",
        "readFile",
        "readJsonFile",
        "remove0x",
        "satisfiesVersionRange",
        "signedBigIntToBytes",
        "stringToBytes",
        "timeSince",
        "toCaipAccountId",
        "toCaipAssetId",
        "toCaipAssetType",
        "toCaipChainId",
        "valueToBytes",
        "wrapError",
        "writeFile",
        "writeJsonFile",
      ]
    `);
  });
});
