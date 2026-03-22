// Types and Interfaces for EOS ecosystem

export interface EosAccount {
  accountName: string;
  address: string;
  privateKey: string;
}

export interface NetworkConfig {
  explorer: string;
  rpc: string;
  monitoringAccount: string[];
  accounts: Record<string, EosAccount>;
}

export interface Networks {
  EOS_MAINNET: NetworkConfig;
  WAX_MAINNET: NetworkConfig;
  JUNGLE_TESTNET4: NetworkConfig;
}

export interface TransactionAction {
  account: string;
  name: string;
  authorization: Array<{
    actor: string;
    permission: string;
  }>;
  data: any;
}

export interface TransactionResult {
  transaction_id: string;
  processed: {
    id: string;
    block_num: number;
    block_time: string;
    receipt: any;
  };
}

export interface AccountInfo {
  account_name: string;
  head_block_num: number;
  head_block_time: string;
  privileged: boolean;
  last_code_update: string;
  created: string;
  core_liquid_balance?: string;
  ram_quota: number;
  net_weight: number;
  cpu_weight: number;
  net_limit: {
    used: number;
    available: number;
    max: number;
  };
  cpu_limit: {
    used: number;
    available: number;
    max: number;
  };
  ram_usage: number;
  permissions: any[];
}

export interface BlockInfo {
  timestamp: string;
  block_num: number;
  ref_block_prefix: number;
}

export interface Balance {
  balance: string;
  symbol: string;
  contract: string;
}

export interface ResourceUsage {
  account: string;
  ram: {
    used: number;
    available: number;
    total: number;
  };
}
