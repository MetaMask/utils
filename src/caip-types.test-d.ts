import { expectAssignable, expectNotAssignable } from 'tsd';

import type {
  CaipAccountId,
  CaipChain,
  CaipChainId,
  CaipNamespace,
  CaipNamespaceId,
} from '.';

const embeddedString = 'test';

// Valid caip strings:

expectAssignable<CaipChainId>('namespace:reference');
expectAssignable<CaipChainId>('namespace:');
expectAssignable<CaipChainId>(':reference');
expectAssignable<CaipChainId>(`${embeddedString}:${embeddedString}`);

expectAssignable<CaipAccountId>('namespace:reference:accountAddress');
expectAssignable<CaipAccountId>('namespace:reference:');
expectAssignable<CaipAccountId>(':reference:accountAddress');
expectAssignable<CaipAccountId>(
  `${embeddedString}:${embeddedString}:${embeddedString}`,
);

expectAssignable<CaipNamespaceId>('string');
expectAssignable<CaipNamespaceId>(`${embeddedString}`);

// Not valid caip strings:

expectAssignable<CaipChainId>('namespace:😀');
expectAssignable<CaipChainId>('😀:reference');
expectNotAssignable<CaipChainId>(0);
expectNotAssignable<CaipChainId>('🙃');

expectAssignable<CaipAccountId>('namespace:reference:😀');
expectAssignable<CaipAccountId>('😀:reference:accountAddress');
expectNotAssignable<CaipAccountId>(0);
expectNotAssignable<CaipAccountId>('🙃');

expectNotAssignable<CaipNamespaceId>(0);

// Valid caip objects:

expectAssignable<CaipChain>({
  id: 'string',
  name: 'string',
});
expectAssignable<CaipChain>({
  id: `${embeddedString}`,
  name: `${embeddedString}`,
});

expectAssignable<CaipNamespace>({
  chains: [
    {
      id: 'string',
      name: 'string',
    },
    {
      id: `${embeddedString}`,
      name: `${embeddedString}`,
    },
  ],
});
expectAssignable<CaipNamespace>({
  chains: [
    {
      id: 'string',
      name: 'string',
    },
    {
      id: `${embeddedString}`,
      name: `${embeddedString}`,
    },
  ],
  methods: ['string', `${embeddedString}`],
  events: ['string', `${embeddedString}`],
});

// Not valid caip objects:
expectNotAssignable<CaipChain>('');
expectNotAssignable<CaipChain>(0);
expectNotAssignable<CaipChain>({});
expectNotAssignable<CaipChain>({
  id: 'string',
});
expectNotAssignable<CaipChain>({
  name: 'string',
});
expectNotAssignable<CaipChain>({
  id: 0,
  name: 'string',
});
expectNotAssignable<CaipChain>({
  id: 'string',
  name: 0,
});

expectNotAssignable<CaipNamespace>('');
expectNotAssignable<CaipNamespace>(0);
expectNotAssignable<CaipNamespace>({});
expectNotAssignable<CaipNamespace>({
  chains: [
    '',
    0,
    {},
    {
      id: 'string',
      name: 0,
    },
    {
      id: 'string',
    },
    {
      name: 'string',
    },
  ],
});
expectNotAssignable<CaipNamespace>({
  chains: [
    {
      id: 'string',
      name: 'string',
    },
  ],
  methods: [0],
});
expectNotAssignable<CaipNamespace>({
  chains: [
    {
      id: 'string',
      name: 'string',
    },
  ],
  events: [0],
});
