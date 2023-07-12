import { expectAssignable, expectNotAssignable } from 'tsd';

import { CaipChainId } from '.';

// Valid caip chain id strings:

expectAssignable<CaipChainId>('namespace:reference');

expectAssignable<CaipChainId>('namespace:');

expectAssignable<CaipChainId>(':reference');

const embeddedString = 'test';
expectAssignable<CaipChainId>(`${embeddedString}:${embeddedString}`);

// Not valid caip chain id strings:

expectAssignable<CaipChainId>('namespace:😀');
expectAssignable<CaipChainId>('😀:reference');

expectNotAssignable<CaipChainId>(0);

expectNotAssignable<CaipChainId>('🙃');
