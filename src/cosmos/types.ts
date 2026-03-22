export enum CosmosPublicKeyTypeUrl {
  Secp256k1 = '/cosmos.crypto.secp256k1.PubKey',
  Ed25519 = '/cosmos.crypto.ed25519.PubKey',
  COSMOS_EVM = '/cosmos.evm.crypto.v1.ethsecp256k1.PubKey',
  EthSecp256k1Ethermint = '/ethermint.crypto.v1.ethsecp256k1.PubKey',
  EthSecp256k1Injective = '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
}

export interface ICosmosNetworks {
  [key: string]: ICosmosNetwork;
}

export interface ICosmosNetwork {
  prefix: string;
  denom: string;
  chainId: string;
  restApi: string;
  rpc: string;
  grpc?: string;
  publicKeyType?: string;
  testAddresses: string[];
  explorer: {
    address: string;
    transaction: string;
  };
}

export interface MintscanTransaction {
  hash: string;
  height: number;
  timestamp: string;
  fee: unknown[];
  gas_used: string;
  gas_wanted: string;
  success: boolean;
  error_log?: string;
  messages: unknown[];
  events: unknown[];
}

export interface MintscanResponse {
  transactions: MintscanTransaction[];
  pagination: {
    searchAfter?: string;
    hasMore: boolean;
  };
}
