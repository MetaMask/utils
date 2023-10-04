import { expectAssignable, expectNotAssignable } from 'tsd';
import EthQuery from '@metamask/eth-query';
import { Web3Provider } from '@ethersproject/providers';

import type {
  LegacyEthereumProvider
} from '.';

// Known legacy providers

expectAssignable<LegacyEthereumProvider>(new EthQuery({} as any));
expectAssignable<LegacyEthereumProvider>(new Web3Provider({} as any));
