import { expectTypeOf } from 'vitest';

import type {
  CaipAccountAddress,
  CaipAccountId,
  CaipAssetId,
  CaipAssetNamespace,
  CaipAssetReference,
  CaipAssetType,
  CaipChainId,
  CaipNamespace,
  CaipReference,
} from '.';

const embeddedString = 'test' as const;

// Valid caip strings:

expectTypeOf<'namespace:reference'>().toMatchTypeOf<CaipChainId>();
expectTypeOf<'namespace:'>().toMatchTypeOf<CaipChainId>();
expectTypeOf<':reference'>().toMatchTypeOf<CaipChainId>();
expectTypeOf<`${typeof embeddedString}:${typeof embeddedString}`>().toMatchTypeOf<CaipChainId>();

expectTypeOf<'string'>().toMatchTypeOf<CaipNamespace>();
expectTypeOf<`${typeof embeddedString}`>().toMatchTypeOf<CaipNamespace>();

expectTypeOf<'string'>().toMatchTypeOf<CaipReference>();
expectTypeOf<`${typeof embeddedString}`>().toMatchTypeOf<CaipReference>();

expectTypeOf<'namespace:reference:accountAddress'>().toMatchTypeOf<CaipAccountId>();
expectTypeOf<'namespace:reference:'>().toMatchTypeOf<CaipAccountId>();
expectTypeOf<':reference:accountAddress'>().toMatchTypeOf<CaipAccountId>();
expectTypeOf<`${typeof embeddedString}:${typeof embeddedString}:${typeof embeddedString}`>().toMatchTypeOf<CaipAccountId>();

expectTypeOf<'string'>().toMatchTypeOf<CaipAccountAddress>();
expectTypeOf<`${typeof embeddedString}`>().toMatchTypeOf<CaipAccountAddress>();

expectTypeOf<'string'>().toMatchTypeOf<CaipAssetNamespace>();
expectTypeOf<`${typeof embeddedString}`>().toMatchTypeOf<CaipAssetNamespace>();

expectTypeOf<'string'>().toMatchTypeOf<CaipAssetReference>();
expectTypeOf<`${typeof embeddedString}`>().toMatchTypeOf<CaipAssetReference>();

expectTypeOf<'namespace:reference/assetNamespace:assetReference'>().toMatchTypeOf<CaipAssetType>();
expectTypeOf<'namespace:reference/:'>().toMatchTypeOf<CaipAssetType>();
expectTypeOf<':reference/assetNamespace:'>().toMatchTypeOf<CaipAssetType>();
expectTypeOf<`${typeof embeddedString}:${typeof embeddedString}/${typeof embeddedString}:${typeof embeddedString}`>().toMatchTypeOf<CaipAssetType>();

expectTypeOf<'namespace:reference/assetNamespace:assetReference/tokenId'>().toMatchTypeOf<CaipAssetId>();
expectTypeOf<'namespace:reference/:assetReference/'>().toMatchTypeOf<CaipAssetId>();
expectTypeOf<':reference/assetNamespace:/'>().toMatchTypeOf<CaipAssetId>();
expectTypeOf<`${typeof embeddedString}:${typeof embeddedString}/${typeof embeddedString}:${typeof embeddedString}/${typeof embeddedString}`>().toMatchTypeOf<CaipAssetId>();

// Not valid caip strings:

expectTypeOf<'namespace:😀'>().toMatchTypeOf<CaipChainId>();
expectTypeOf<'😀:reference'>().toMatchTypeOf<CaipChainId>();
expectTypeOf<number>().not.toMatchTypeOf<CaipChainId>();
expectTypeOf<'🙃'>().not.toMatchTypeOf<CaipChainId>();

expectTypeOf<number>().not.toMatchTypeOf<CaipNamespace>();

expectTypeOf<number>().not.toMatchTypeOf<CaipReference>();

expectTypeOf<'namespace:reference:😀'>().toMatchTypeOf<CaipAccountId>();
expectTypeOf<'😀:reference:accountAddress'>().toMatchTypeOf<CaipAccountId>();
expectTypeOf<number>().not.toMatchTypeOf<CaipAccountId>();
expectTypeOf<'🙃'>().not.toMatchTypeOf<CaipAccountId>();

expectTypeOf<number>().not.toMatchTypeOf<CaipAccountAddress>();

expectTypeOf<number>().not.toMatchTypeOf<CaipAssetNamespace>();

expectTypeOf<number>().not.toMatchTypeOf<CaipAssetReference>();

expectTypeOf<number>().not.toMatchTypeOf<CaipAssetType>();
expectTypeOf<'🙃'>().not.toMatchTypeOf<CaipAssetType>();

expectTypeOf<number>().not.toMatchTypeOf<CaipAssetId>();
expectTypeOf<'🙃'>().not.toMatchTypeOf<CaipAssetId>();
