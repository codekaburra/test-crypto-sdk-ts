import { Networks } from './types';

export const networks: Networks = {
  TRON_MAINNET: {
    explorer: 'https://tronscan.org/#/',
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
    monitoringAccounts: [],
    accounts: {},
  },
  NILE_TESTNET: {
    explorer: 'https://nile.tronscan.org/#/',
    fullNode: 'https://api.nileex.io',
    solidityNode: 'https://api.nileex.io',
    eventServer: 'https://api.nileex.io',
    monitoringAccounts: [],
    accounts: {},
  },
};
