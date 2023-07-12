import {
  isCaipChainIdString,
  assertIsCaipChainIdString,
  getCaipChainIdString,
  parseCaipChainIdString,
} from './caip-chain-id';

const validCaipChainIdStrings = [
  '123:a',
  '12345678:a',
  'abc:1',
  'abc:1234567890abcdefghijklmnopqrst32',
  '12345678:1234567890abcdefghijklmnopqrst32',
  'az-45678:abcxyz_1234567890-ABCXYZ',
  'eip155:1',
  'bip122:000000000019d6689c085ae165831e93',
  'bip122:12a765e31ffd4059bada1e25190f6e98',
  'bip122:fdbe99b90c90bae7505796461471d89a',
  'cosmos:cosmoshub-2',
  'cosmos:cosmoshub-3',
  'cosmos:Binance-Chain-Tigris',
  'cosmos:iov-mainnet',
  'starknet:SN_GOERLI',
  'lip9:9ee11e9df416b18b',
  'chainstd:8c3444cf8970a9e41a706fab93e7a6c4',
] as const;

const invalidCaipChainIdStrings = [
  true,
  false,
  null,
  undefined,
  0,
  1,
  {},
  [],
  '12:a',
  '123456789:a',
  'abc:',
  'abc:1234567890abcdefghijklmnopqrstu33',
  'abc',
  '123::a',
  '123:a:a',
  ':123:a',
  'Abc:1',
  'abc!@#$:1',
  'abc:!@#$%^&*()123',
] as const;

describe('isCaipChainIdString', () => {
  it.each(validCaipChainIdStrings)(
    'returns true for a valid caip chain id string',
    (caipChainIdString) => {
      expect(isCaipChainIdString(caipChainIdString)).toBe(true);
    },
  );

  it.each(invalidCaipChainIdStrings)(
    'returns false for an invalid caip chain id string',
    (caipChainIdString) => {
      expect(isCaipChainIdString(caipChainIdString)).toBe(false);
    },
  );
});

describe('assertIsCaipChainIdString', () => {
  it.each(validCaipChainIdStrings)(
    'does not throw for a valid caip chain id string',
    (caipChainIdString) => {
      expect(() => assertIsCaipChainIdString(caipChainIdString)).not.toThrow();
    },
  );

  it.each(invalidCaipChainIdStrings)(
    'throws for an invalid caip chain id string',
    (caipChainIdString) => {
      expect(() => assertIsCaipChainIdString(caipChainIdString)).toThrow(
        'Value must be a caip chain id string.',
      );
    },
  );
});

describe('getCaipChainIdString', () => {
  it('returns the unvalidated caip chain id string', () => {
    expect(getCaipChainIdString('eip155', '1')).toBe('eip155:1');
    expect(getCaipChainIdString('namespace', 'reference')).toBe(
      'namespace:reference',
    );
    expect(getCaipChainIdString('', '')).toBe(':');
    expect(getCaipChainIdString('UNVALIDATED', '!@#$%^&*()')).toBe(
      'UNVALIDATED:!@#$%^&*()',
    );
  });
});

describe('parseCaipChainIdString', () => {
  it('returns the unvalidated caip chain id namespace and reference', () => {
    expect(parseCaipChainIdString('eip155:1')).toStrictEqual({
      namespace: 'eip155',
      reference: '1',
    });
    expect(parseCaipChainIdString('namespace:reference')).toStrictEqual({
      namespace: 'namespace',
      reference: 'reference',
    });
    expect(parseCaipChainIdString('abc:123:xyz')).toStrictEqual({
      namespace: 'abc',
      reference: '123',
    });
  });

  it('returns empty string for missing caip chain id namespace or reference', () => {
    expect(parseCaipChainIdString(':')).toStrictEqual({
      namespace: '',
      reference: '',
    });
    expect(parseCaipChainIdString('')).toStrictEqual({
      namespace: '',
      reference: '',
    });
    expect(parseCaipChainIdString(':abc:123:xyz')).toStrictEqual({
      namespace: '',
      reference: 'abc',
    });
  });
});
