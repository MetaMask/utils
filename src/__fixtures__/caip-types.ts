export const CAIP_CHAIN_ID_FIXTURES = [
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

export const CAIP_NAMESPACE_FIXTURES = Array.from(
  new Set(CAIP_CHAIN_ID_FIXTURES.map((value) => value.split(':')[0])),
);

export const CAIP_REFERENCE_FIXTURES = Array.from(
  new Set(CAIP_CHAIN_ID_FIXTURES.map((value) => value.split(':')[1])),
);

export const CAIP_ACCOUNT_ID_FIXTURES = [
  'eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb',
  'bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
  'cosmos:cosmoshub-3:cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0',
  'polkadot:b0a8d493285c2df73290dfb7e61f870f:5hmuyxw9xdgbpptgypokw4thfyoe3ryenebr381z9iaegmfy',
  'starknet:SN_GOERLI:0x02dd1b492765c064eac4039e3841aa5f382773b598097a40073bd8b48170ab57',
  'chainstd:8c3444cf8970a9e41a706fab93e7a6c4:6d9b0b4b9994e8a6afbd3dc3ed983cd51c755afb27cd1dc7825ef59c134a39f7',
  'hedera:mainnet:0.0.1234567890-zbhlt',
] as const;

export const CAIP_ACCOUNT_ADDRESS_FIXTURES = Array.from(
  new Set(CAIP_ACCOUNT_ID_FIXTURES.map((value) => value.split(':')[2])),
);

export const CAIP_ASSET_TYPE_FIXTURES = [
  'eip155:1/slip44:60',
  'eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f',
  'bip122:000000000019d6689c085ae165831e93/slip44:0',
  'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
  'cosmos:cosmoshub-3/slip44:118',
  'cosmos:Binance-Chain-Tigris/slip44:714',
  'lip9:9ee11e9df416b18b/slip44:134',
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/nft:Fz6LxeUg5qjesYX3BdmtTwyyzBtMxk644XiTqU5W3w9w',
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
] as const;

export const CAIP_ASSET_ID_FIXTURES = [
  'eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769',
  'hedera:mainnet/nft:0.0.55492/12',
] as const;

export const CAIP_ASSET_NAMESPACE_FIXTURES = Array.from(
  new Set(
    CAIP_ASSET_TYPE_FIXTURES.map((value) => value.split('/')[1]?.split(':')[0]),
  ),
);

export const CAIP_ASSET_REFERENCE_FIXTURES = Array.from(
  new Set(
    CAIP_ASSET_TYPE_FIXTURES.map((value) => value.split('/')[1]?.split(':')[1]),
  ),
);
