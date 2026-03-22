import { ICosmosNetworks } from './types';

export const networks: ICosmosNetworks = {
  cosmosMainnet: {
    prefix: 'cosmos',
    denom: 'uatom',
    chainId: 'cosmoshub-4',
    restApi: 'https://cosmos-rest.publicnode.com',
    rpc: 'https://cosmos-rpc.publicnode.com:443',
    testAddresses: [
      'cosmos13npjv25498ahpus228ylyq884xg2rp80v5djrn', // 0
      'cosmos1m0zu0plzrtm3td5ds69kv3s85rwq6qu9v2ju6e', // 1
      'cosmos156qns490a78lc3vyyetk68mrrfau3f7yl2f8jh', // 2
      'cosmos1fvupup882gd5t7d6tv8pte2d4k8s9vsvurum7ar', // 3
      'cosmos1owy9zpqeh1t3e038xt7rrpx6yan85n1eu9v094', // 4
      'cosmos10rmmwydy5d680aa8mxqr7syaq9526r67v327avn', // 5
      'cosmos1lu236hye2ljysp8uu8ajzt5gqdjrxk7hu43d5s', // 6
      'cosmos10xjtevmvf7reqeljsvwtrsa84pd0djah17au0e', // 7
      'cosmos132rf8xj358xynh3fw2qy6e5w43xgands219uaa', // 8
      'cosmos1drnu34gavkqmwx79nzxx3kafr3ad6v8uqq90av', // 9
      'cosmos1nhzrxkfdu3rntepgdj6mg6pavlwzvw76zsfx8x', // 10
      'cosmos1rr5f5lqefpv8n1l9uv5et6x7kqv791qatap7yq', // 11
      'cosmos1c4t1fxvrsukyk13gtf8vh26dr7dy9kn4xnzraj', // 12
      'cosmos1xjahgarjuvrr434xg8s58f8725yhkzu2a5d4ln', // 13
      'cosmos1e0dnqzw2wsxv6rw46qqsw686nwqdh34ykwkmk3', // 14
      'cosmos1h74k5jhevpwh7jt9anj0ln87lv3dgyyhcfxw5fh7n', // 15
      'cosmos1mdc0ue2egst6etmxktyctka9sykqv2cv8k10cf', // 16
      'cosmos134w8jt5m8fs5w9ughz82dqvhf9htnqmqgr3cx3', // 17
      'cosmos1pt2yrzpak69szthqpadszdkfde55xd2dcyyy1j', // 18
      'cosmos1gce2n2tuun480ghw87x8nndjaz5jk37au71j6d', // 19
      'cosmos1mq3wj5ahxky7x6trcx59p6d0fjpgzfasas36cfj', // 20
      'cosmos1qzw9atdmzdzyafex4z6dhq9vag3436rn8zjg93', // 21
      'cosmos1m836jjdaeum35ura1rdmz9sy8795k9vd3w7pm7', // 22
      'cosmos1d4udtnlvyf5rlue7uwmd9f1ysz5zt4e7q5edn', // 23
      'cosmos19smr194v2k254vwh54husz0d45nc2dtjkcp9rk', // 24
      'cosmos1yah2q83r00tsqsyq6z69xl2zdupshqczd29mkz', // 25
      'cosmos1vm9k89hu8aimpkpxqxa8xaddmntff8fz545as', // 26
      'cosmos1ehr4avnj9dsju6lg99rm884nnxd75wqcga7jthu', // 27
      'cosmos1z80dc8tdmk6ks4j7cppxa2n8gvn7w4lcchk4hv', // 28
      'cosmos1qz46mh96pxf70x7rdvnr8f64lf0q8qf4jsgatpl', // 29
    ],
    explorer: {
      address: 'https://www.mintscan.io/cosmos/address/',
      transaction: 'https://www.mintscan.io/cosmos/tx/',
    },
  },
  akash: {
    prefix: 'akash',
    denom: 'uakt',
    chainId: 'akashnet-2',
    restApi: 'https://akash-rest.publicnode.com',
    rpc: 'https://akash-rpc.publicnode.com:443',
    testAddresses: [],
    explorer: {
      address: 'https://www.mintscan.io/akash/address/',
      transaction: 'https://www.mintscan.io/akash/tx/',
    },
  },
  babylonTestnet5: {
    prefix: 'bbn',
    denom: 'ubbn',
    chainId: 'bbn-test-5',
    restApi: 'https://rest.testcosmos.directory/babylontestnet',
    rpc: 'https://babylon-testnet-rpc.nodes.guru',
    testAddresses: [
    ],
    explorer: {
      address: 'https://testnet.babylon.explorers.guru/address/',
      transaction: 'https://testnet.babylon.explorers.guru/transaction/',
    },
  },
  babylonMainnet: {
    prefix: 'bbn',
    denom: 'ubbn',
    chainId: 'bbn-1',
    restApi: 'https://babylon-rest.publicnode.com',
    rpc: 'https://babylon-rpc.publicnode.com:443',
    testAddresses: [],
    explorer: {
      address: 'https://babylon.explorers.guru/address/',
      transaction: 'https://babylon.explorers.guru/transaction/',
    },
  },
};
