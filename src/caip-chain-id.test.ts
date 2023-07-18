import {
  isCaipChainId,
  assertIsCaipChainId,
  buildCaipChainId,
  parseCaipChainId,
} from './caip-chain-id';

const validCaipChainIds = [
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

const invalidCaipChainIds = [
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

describe('isCaipChainId', () => {
  it.each(validCaipChainIds)(
    'returns true for a valid caip chain id string',
    (caipChainId) => {
      expect(isCaipChainId(caipChainId)).toBe(true);
    },
  );

  it.each(invalidCaipChainIds)(
    'returns false for an invalid caip chain id string',
    (caipChainId) => {
      expect(isCaipChainId(caipChainId)).toBe(false);
    },
  );
});

describe('assertIsCaipChainId', () => {
  it.each(validCaipChainIds)(
    'does not throw for a valid caip chain id string',
    (caipChainId) => {
      expect(() => assertIsCaipChainId(caipChainId)).not.toThrow();
    },
  );

  it.each(invalidCaipChainIds)(
    'throws for an invalid caip chain id string',
    (caipChainId) => {
      expect(() => assertIsCaipChainId(caipChainId)).toThrow(
        'Value must be a caip chain id string.',
      );
    },
  );
});

describe('buildCaipChainId', () => {
  it('returns the unvalidated caip chain id string', () => {
    expect(buildCaipChainId('eip155', '1')).toBe('eip155:1');
    expect(buildCaipChainId('namespace', 'reference')).toBe(
      'namespace:reference',
    );
    expect(buildCaipChainId('', '')).toBe(':');
    expect(buildCaipChainId('UNVALIDATED', '!@#$%^&*()')).toBe(
      'UNVALIDATED:!@#$%^&*()',
    );
  });
});

describe('parseCaipChainId', () => {
  it('returns the namespace and reference for valid caip chain id', () => {
    expect(parseCaipChainId('eip155:1')).toStrictEqual({
      namespace: 'eip155',
      reference: '1',
    });
    expect(parseCaipChainId('name:reference')).toStrictEqual({
      namespace: 'name',
      reference: 'reference',
    });
    expect(parseCaipChainId('abc:123')).toStrictEqual({
      namespace: 'abc',
      reference: '123',
    });
  });

  it('returns empty strings for invalid caip chain id', () => {
    expect(parseCaipChainId('12:a')).toStrictEqual({
      namespace: '',
      reference: '',
    });
    expect(parseCaipChainId('abc:')).toStrictEqual({
      namespace: '',
      reference: '',
    });
    expect(parseCaipChainId(':')).toStrictEqual({
      namespace: '',
      reference: '',
    });
    expect(parseCaipChainId('abc:123:xyz')).toStrictEqual({
      namespace: '',
      reference: '',
    });
  });
});
