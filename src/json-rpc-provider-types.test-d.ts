import { Web3Provider } from '@ethersproject/providers';
import EthQuery from '@metamask/eth-query';
import { expectAssignable, expectNotAssignable } from 'tsd';

import type { JsonRpcRequest, LegacyEthereumProvider } from '.';

// Known legacy providers
expectAssignable<LegacyEthereumProvider>(new EthQuery({} as any));
expectAssignable<LegacyEthereumProvider>(new Web3Provider({} as any));
expectAssignable<LegacyEthereumProvider>({
  send: async (method: string, params: string[]) =>
    Promise.resolve([method, params]),
});
expectAssignable<LegacyEthereumProvider>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  send: (_req: JsonRpcRequest, _cb: () => void) => {},
});
expectAssignable<LegacyEthereumProvider>({
  send: async (req: JsonRpcRequest, _cb: (_x: null, _result: null) => void) =>
    Promise.resolve(req),
});

expectNotAssignable<LegacyEthereumProvider>({ foo: '123' });
expectNotAssignable<LegacyEthereumProvider>({ send: '123' });

expectNotAssignable<LegacyEthereumProvider>({
  send: (method: string, params: string[]) => [method, params],
});
expectNotAssignable<LegacyEthereumProvider>({
  send: async (
    req: JsonRpcRequest,
    _cb: (_x: null, _result: undefined) => void,
  ) => Promise.resolve(req),
});
