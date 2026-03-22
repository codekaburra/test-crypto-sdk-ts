import { Networks } from './eosType';

export const networks: Networks = {
  EOS_MAINNET: {
    explorer: 'https://eosauthority.com/',
    rpc: 'https://eos.api.eosnation.io',
    monitoringAccount: [
    ],
    accounts: {
      qcuikgfbli4q: {
        accountName: 'qcuikgfbli4q',
        address: '',
        privateKey: process.env.EOS_PRIVATE_KEY_qcuikgfbli4q || '',
      },
    },
  },
  WAX_MAINNET: {
    explorer: 'https://wax.bloks.io/',
    rpc: 'http://api.wax.alohaeos.com',
    monitoringAccount: [],
    accounts: {},
  },
  JUNGLE_TESTNET4: {
    explorer: 'https://jungle4.bloks.io/',
    rpc: 'https://jungle4.api.eosnation.io',
    monitoringAccount: [
    ],
    accounts: {
      bravetiger35: {
        accountName: 'bravetiger35',
        address: process.env.EOS_ADDRESS_bravetiger35 || '',
        privateKey: process.env.EOS_PRIVATE_KEY_bravetiger35 || '',
      },
      playfuladven: {
        accountName: 'playfuladven',
        address: process.env.EOS_ADDRESS_playfuladven || '',
        privateKey: process.env.EOS_PRIVATE_KEY_playfuladven || '',
      },
      gracefulpion: {
        accountName: 'gracefulpion',
        address: process.env.EOS_ADDRESS_gracefulpion || '',
        privateKey: process.env.EOS_PRIVATE_KEY_gracefulpion || '',
      },
    },
  },
};
