export interface TronAccount {
  address: string;
  privateKey: string;
}

export interface NetworkConfig {
  explorer: string;
  fullNode: string;
  solidityNode: string;
  eventServer: string;
  monitoringAccounts: string[];
  accounts: Record<string, TronAccount>;
}

export interface Networks {
  TRON_MAINNET: NetworkConfig;
  NILE_TESTNET: NetworkConfig;
}

export interface TransactionResult {
  result: boolean;
  txid: string;
  transaction: any;
}

export interface AccountInfo {
  address: string;
  balance?: number;
  create_time?: number;
  account_name?: string;
  // ... other fields as needed
}
