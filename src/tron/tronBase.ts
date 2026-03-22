import axios from 'axios';
import { networks } from './networks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TronWeb } from 'tronweb';

// ===========================================================================
// Configuration
// ===========================================================================

const selectedNetwork = networks.TRON_MAINNET;
const tronWeb = new (TronWeb as any)({
  fullHost: selectedNetwork.fullNode,
  headers: { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY || '' },
});

export const testTron = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'account':
      await getAccount(commandArgs[0]);
      break;
    case 'block':
      await getBlock(commandArgs[0]);
      break;
    case 'transaction':
      await getTransaction(commandArgs[0]);
      break;
    case 'balance':
      for (const accountName of selectedNetwork.monitoringAccounts) {
        await getBalance(accountName);
      }
      break;
    default:
      console.log(`Unknown Tron command: ${command}`);
      break;
  }
};

export const run = testTron;

export const getAccount = async (address: string) => {
  try {
    const account = await tronWeb.trx.getAccount(address);
    console.log(JSON.stringify(account, null, 2));
    return account;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching account:', message);
    throw error;
  }
};

export const getBlock = async (blockNumber: string) => {
  try {
    const block = await tronWeb.trx.getBlock(blockNumber);
    console.log(JSON.stringify(block, null, 2));
    return block;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching block:', message);
    throw error;
  }
};

export const getTransaction = async (transactionHash: string) => {
  try {
    const transaction = await tronWeb.trx.getTransaction(transactionHash);
    console.log(JSON.stringify(transaction, null, 2));
    return transaction;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching transaction:', message);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const balance = await tronWeb.trx.getBalance(address);
    console.log(`Balance for ${address}: ${tronWeb.fromSun(balance)} TRX`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching balance:', message);
    throw error;
  }
};

export const getHistoricalTransactions = async (address: string) => {
  try {
    const endpoint = `${selectedNetwork.fullNode}/v1/accounts/${address}/transactions`;
    const response = await axios.get(endpoint, {
      headers: { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY || '' },
      params: {
        limit: 200,
        only_confirmed: true,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching historical transactions:', message);
    throw error;
  }
};
