import { SigningStargateClient, StdFee } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet, EncodeObject } from '@cosmjs/proto-signing';
import { networks as cosmosNetworks } from './network';
import { ICosmosNetwork } from './types';

const selectedNetwork: ICosmosNetwork = cosmosNetworks.cosmosMainnet;

export const getClient = async () => {
  return await SigningStargateClient.connect(selectedNetwork.rpc);
};

export const getAddressInfo = async (address: string) => {
  const client = await getClient();
  const [balances, accountInfo] = await Promise.all([
    client.getAllBalances(address),
    client.getAccount(address),
  ]);
  return {
    address,
    accountNumber: accountInfo?.accountNumber ?? null,
    sequence: accountInfo?.sequence ?? null,
    balances,
  };
};

export async function buildTransaction(fromAddress: string, toAddress: string, amount: string) {
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress,
      toAddress,
      amount: [{ denom: selectedNetwork.denom || 'uatom', amount }],
    },
  };
  return {
    messages: [msgSend],
    fee: { amount: [{ denom: selectedNetwork.denom || 'uatom', amount: '5000' }], gas: '200000' },
    memo: 'Test transaction from buildTransaction()',
  };
}

export async function signTransaction(mnemonic: string, transaction: { messages: EncodeObject[], fee: StdFee, memo: string }) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'cosmos' });
  const [account] = await wallet.getAccounts();
  const client = await SigningStargateClient.connectWithSigner(selectedNetwork.rpc, wallet);
  
  const signedTx = await client.sign(account.address, transaction.messages, transaction.fee, transaction.memo);
  return Buffer.from(Uint8Array.from(signedTx.authInfoBytes)).toString('base64');
}

export const getTransaction = async (transactionHash: string) => {
  const client = await getClient();
  const tx = await client.getTx(transactionHash);
  console.log(JSON.stringify(tx, null, 2));
  return tx;
};

export const broadcastTransaction = async (txBytes: string) => {
  const client = await getClient();
  const result = await client.broadcastTx(Buffer.from(txBytes, 'base64'));
  console.log(JSON.stringify(result, null, 2));
  return result;
};

export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'balance':
      console.log(await getAddressInfo(commandArgs[0] || selectedNetwork.testAddresses[0]));
      break;
    case 'build':
      console.log(await buildTransaction(commandArgs[0], commandArgs[1], commandArgs[2]));
      break;
    default:
      console.log('Unknown Cosmos command');
  }
};
