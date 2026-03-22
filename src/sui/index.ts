import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

function rpcUrl(): string {
  if (process.env.SUI_RPC_URL) {
    return process.env.SUI_RPC_URL;
  }
  const net = process.env.SUI_NETWORK === 'testnet' ? 'testnet' : 'mainnet';
  return getFullnodeUrl(net);
}

export const getSuiClient = (): SuiClient => new SuiClient({ url: rpcUrl() });

export const getNetworkInfo = async () => {
  const client = getSuiClient();
  const [chainIdentifier, latestCheckpoint] = await Promise.all([
    client.getChainIdentifier(),
    client.getLatestCheckpointSequenceNumber(),
  ]);
  return {
    rpcUrl: rpcUrl(),
    chainIdentifier,
    latestCheckpointSequenceNumber: latestCheckpoint,
  };
};

export const getAddressInfo = async (address: string) => {
  const client = getSuiClient();
  const balance = await client.getBalance({ owner: address });
  return {
    address,
    totalBalance: balance.totalBalance,
    coinObjectCount: balance.coinObjectCount,
    coinType: balance.coinType,
  };
};
