import {
  isCaipAccountAddress,
  isCaipAccountId,
  isCaipAccountIdArray,
  isCaipChainId,
  isCaipNamespace,
  isCaipNamespaceId,
  parseCaipAccountId,
  parseCaipChainId,
} from './caip-types';

describe('parseCaipChainId', () => {
  it('parses valid chain ids', () => {
    expect(parseCaipChainId('eip155:1')).toMatchInlineSnapshot(`
      {
        "namespace": "eip155",
        "reference": "1",
      }
    `);

    expect(
      parseCaipChainId('bip122:000000000019d6689c085ae165831e93'),
    ).toMatchInlineSnapshot(
      `
      {
        "namespace": "bip122",
        "reference": "000000000019d6689c085ae165831e93",
      }
    `,
    );

    expect(parseCaipChainId('cosmos:cosmoshub-3')).toMatchInlineSnapshot(
      `
      {
        "namespace": "cosmos",
        "reference": "cosmoshub-3",
      }
    `,
    );

    expect(
      parseCaipChainId('polkadot:b0a8d493285c2df73290dfb7e61f870f'),
    ).toMatchInlineSnapshot(
      `
      {
        "namespace": "polkadot",
        "reference": "b0a8d493285c2df73290dfb7e61f870f",
      }
    `,
    );
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    'foobarbazquz:1',
    'foo:',
    'foo:foobarbazquzfoobarbazquzfoobarbazquzfoobarbazquzfoobarbazquzfoobarbazquz',
  ])('throws for invalid input', (input) => {
    expect(() => parseCaipChainId(input as any)).toThrow('Invalid chain ID.');
  });
});

describe('parseCaipAccountId', () => {
  it('parses valid account ids', () => {
    expect(
      parseCaipAccountId('eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'),
    ).toMatchInlineSnapshot(
      `
      {
        "address": "0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
        "chain": {
          "namespace": "eip155",
          "reference": "1",
        },
        "chainId": "eip155:1",
      }
    `,
    );

    expect(
      parseCaipAccountId(
        'bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
      ),
    ).toMatchInlineSnapshot(
      `
      {
        "address": "128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6",
        "chain": {
          "namespace": "bip122",
          "reference": "000000000019d6689c085ae165831e93",
        },
        "chainId": "bip122:000000000019d6689c085ae165831e93",
      }
    `,
    );

    expect(
      parseCaipAccountId(
        'cosmos:cosmoshub-3:cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0',
      ),
    ).toMatchInlineSnapshot(
      `
      {
        "address": "cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0",
        "chain": {
          "namespace": "cosmos",
          "reference": "cosmoshub-3",
        },
        "chainId": "cosmos:cosmoshub-3",
      }
    `,
    );

    expect(
      parseCaipAccountId(
        'polkadot:b0a8d493285c2df73290dfb7e61f870f:5hmuyxw9xdgbpptgypokw4thfyoe3ryenebr381z9iaegmfy',
      ),
    ).toMatchInlineSnapshot(
      `
      {
        "address": "5hmuyxw9xdgbpptgypokw4thfyoe3ryenebr381z9iaegmfy",
        "chain": {
          "namespace": "polkadot",
          "reference": "b0a8d493285c2df73290dfb7e61f870f",
        },
        "chainId": "polkadot:b0a8d493285c2df73290dfb7e61f870f",
      }
    `,
    );
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    'foobarbazquz:1',
    'foo:',
    'foo:foobarbazquzfoobarbazquzfoobarbazquzfoobarbazquzfoobarbazquzfoobarbazquz',
    'eip155:1',
    'eip155:1:',
  ])('throws for invalid input', (input) => {
    expect(() => parseCaipAccountId(input as any)).toThrow(
      'Invalid account ID.',
    );
  });
});

describe('isCaipNamespaceId', () => {
  it.each(['eip155', 'bip122'])(
    'returns true for a valid namespace id',
    (id) => {
      expect(isCaipNamespaceId(id)).toBe(true);
    },
  );

  it.each([true, false, null, undefined, 1, {}, [], 'a', 'foobarbaz'])(
    'returns false for an invalid namespace id',
    (id) => {
      expect(isCaipNamespaceId(id)).toBe(false);
    },
  );
});

describe('isCaipChainId', () => {
  it.each([
    'eip155:1',
    'eip155:1337',
    'bip122:000000000019d6689c085ae165831e93',
  ])('returns true for a valid chain id', (id) => {
    expect(isCaipChainId(id)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    {},
    [],
    'a',
    'eip155',
    'eip155:',
    'eip155:1:2',
    'bip122',
    'bip122:',
    'bip122:000000000019d6689c085ae165831e93:2',
  ])('returns false for an invalid chain id', (id) => {
    expect(isCaipChainId(id)).toBe(false);
  });
});

describe('isCaipAccountId', () => {
  it.each([
    'eip155:1:0x0000000000000000000000000000000000000000',
    'eip155:1337:0x0000000000000000000000000000000000000000',
    'bip122:000000000019d6689c085ae165831e93:0x0000000000000000000000000000000000000000',
  ])('returns true for a valid account id', (id) => {
    expect(isCaipAccountId(id)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    {},
    [],
    'foo',
    'eip155',
    'eip155:',
    'eip155:1',
    'eip155:1:',
    'eip155:1:0x0000000000000000000000000000000000000000:2',
    'bip122',
    'bip122:',
    'bip122:000000000019d6689c085ae165831e93',
    'bip122:000000000019d6689c085ae165831e93:',
    'bip122:000000000019d6689c085ae165831e93:0x0000000000000000000000000000000000000000:2',
  ])('returns false for an invalid account id', (id) => {
    expect(isCaipAccountId(id)).toBe(false);
  });
});

describe('isCaipAccountIdArray', () => {
  it.each([
    // `it.each` does not support nested arrays, so we nest them in objects.
    {
      accounts: [],
    },
    {
      accounts: [
        'eip155:1:0x0000000000000000000000000000000000000000',
        'eip155:1337:0x0000000000000000000000000000000000000000',
        'bip122:000000000019d6689c085ae165831e93:0x0000000000000000000000000000000000000000',
      ],
    },
    {
      accounts: ['eip155:1:0x0000000000000000000000000000000000000000'],
    },
  ])('returns true for a valid account id array', ({ accounts }) => {
    expect(isCaipAccountIdArray(accounts)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    {},
    'foo',
    ['foo'],
    ['eip155:1:0x0000000000000000000000000000000000000000:2'],
    [
      'bip122:000000000019d6689c085ae165831e93:0x0000000000000000000000000000000000000000:2',
    ],
  ])('returns false for an invalid account id array', (accounts) => {
    expect(isCaipAccountIdArray(accounts)).toBe(false);
  });
});

describe('isCaipNamespace', () => {
  it.each([
    {
      chains: [
        {
          id: 'eip155:1',
          name: 'Ethereum Mainnet',
        },
      ],
      methods: ['eth_signTransaction', 'eth_accounts'],
      events: ['accountsChanged'],
    },
    {
      chains: [
        {
          id: 'eip155:1',
          name: 'Ethereum Mainnet',
        },
      ],
      methods: ['eth_signTransaction'],
    },
    {
      chains: [
        {
          id: 'eip155:1',
          name: 'Ethereum Mainnet',
        },
      ],
      events: ['accountsChanged'],
    },
    {
      chains: [
        {
          id: 'eip155:1',
          name: 'Ethereum Mainnet',
        },
      ],
    },
  ])('returns true for a valid namespace', (namespace) => {
    expect(isCaipNamespace(namespace)).toBe(true);
  });

  it.each([
    {},
    [],
    true,
    false,
    null,
    undefined,
    1,
    'foo',
    { methods: [], events: [] },
    { chains: ['foo'] },
  ])('returns false for an invalid namespace', (namespace) => {
    expect(isCaipNamespace(namespace)).toBe(false);
  });
});

describe('isCaipAccountAddress', () => {
  it.each([
    Array(128).fill('0').join(''),
    '0',
    '0x0',
    '0x0000000000000000000000000000000000000000',
    '0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb',
    '128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
    'cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0',
    '5hmuyxw9xdgbpptgypokw4thfyoe3ryenebr381z9iaegmfy',
    '0x02dd1b492765c064eac4039e3841aa5f382773b598097a40073bd8b48170ab57',
    '6d9b0b4b9994e8a6afbd3dc3ed983cd51c755afb27cd1dc7825ef59c134a39f7',
    '0.0.1234567890-zbhlt',
  ])('returns true for a valid account address', (id) => {
    expect(isCaipAccountAddress(id)).toBe(true);
  });

  it.each([
    true,
    false,
    null,
    undefined,
    1,
    {},
    [],
    '',
    Array(129).fill('a').join(''),
  ])('returns false for an invalid account address', (id) => {
    expect(isCaipAccountAddress(id)).toBe(false);
  });
});
