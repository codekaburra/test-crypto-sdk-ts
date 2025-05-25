
import { ethers } from 'ethers';
import networks from '../networks/evm.json';
import { toReadableUnit } from '../utils';
const selectedNetwork = networks.ethereum_mainnet;

export const getClient = async () => {
  return new ethers.JsonRpcProvider(selectedNetwork.rpc);
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
      await getTransaction('0x19f4befdbbc58c901bfda5ed5036b5aaa1e9d66c972ba5fad268bdce04998eaf');
  }
};

export const getNetworkInfo = async () => {
  console.log(selectedNetwork.rpc);
  const client = await getClient();
  const network = await client.getNetwork();
  console.log(network);
  const feeData = await client.getFeeData();
  console.log('---------------------------');
  console.log(feeData);
  printGasPrice('gasPrice', feeData.gasPrice);
  printGasPrice('maxFeePerGas', feeData.maxFeePerGas);
  printGasPrice('maxPriorityFeePerGas', feeData.maxPriorityFeePerGas);
};

export const printGasPrice = (feeName: string, feeFromRpc: null | bigint) => {
  if (!feeFromRpc) return;
  const fee = new BigNumber(feeFromRpc.toString());
  console.log(
    ' | ', fee.toString(10),
    ' | ', toReadableUnit(fee, 9).toString(10),
    ' | ', toReadableUnit(fee, 18).toString(10)
  );
};

export const getAddressInfo = async (address: string) => {
  const client = await getClient();
  const balance = await client.getBalance(address);
  const nonce = await client.getTransactionCount(address);
  console.log(`${address} | nonce ${nonce} | ${balance} = ${toReadableUnit(balance.toString(10), 18)}`);
};

export const getTransaction = async (transactionHash: string) => {
  const client = await getClient();
  const result = await client.getTransaction(transactionHash);
  console.log(result);
  return result;
};

export const broadcastTransaction = async (transaction: string) => {
  console.log('broadcastTransaction ', transaction);
  const client = await getClient();
  const result = await client.broadcastTransaction(transaction);
  console.log('broadcastTransaction result ', JSON.stringify(result));
  console.log(`${selectedNetwork.explorer.transaction}${result}`);
};

export const buildTransaction = async () => {
  const client = await getClient();
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_EVM || '', client);
  console.log('signer ', signer.address);
  const transaction = await signer.populateTransaction({
    to: '',
    value: '',
    data: '0x',
  });
  console.log('transaction ', transaction);
  const rawTx = await signer.signTransaction(transaction);
  console.log('rawTx', rawTx);
};
