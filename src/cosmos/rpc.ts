/* eslint-disable @typescript-eslint/no-unused-vars */
import cosmosNetworks from '../networks/cosmos.json';
import { SigningStargateClient } from '@cosmjs/stargate';

const selectedNetwork = cosmosNetworks.cosmosMainnet;

export const getClient = async () => {
  return await SigningStargateClient.connect(selectedNetwork.rpc);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'balance':
      await getAddressInfo(selectedNetwork.addresses[0]);
      break;
    case 'broadcast':
      await broadcastTransaction(commandArgs[0]);
      break;
    default:
      // await getAccountInfo(addresses[0]);
      // await getAccountBalance(addresses[0]);
      await getTransaction('23F11303A504083A874F6744A74EB2FEE25C47C5543A143F4B1550B3A5E162F5');
      await getAddressInfo(selectedNetwork.addresses[0]);
  }
};

export const getAddressInfo = async (address: string) => {
  const client = await getClient();
  const balance = await client.getAllBalances(address);
  const accountInfo = await client.getAccount(address);
  if (accountInfo) {
    console.log(`${address} | ${accountInfo.accountNumber} | sequence ${accountInfo.sequence} `, balance);
  }
};

export const getTransaction = async (transactionHash: string) => {
  const client = await getClient();
  const result = await client.getTx(transactionHash);
  console.log(result);
  return result;
};

export const broadcastTransaction = async (txBytes: string) => {
  console.log('broadcastTransaction ', txBytes);
  const client = await getClient();
  const result = await client.broadcastTxSync(Buffer.from(txBytes, 'base64'));
  console.log('broadcastTransaction result ', result);
  console.log(`${selectedNetwork.explorer.transaction}${result}`);
};
