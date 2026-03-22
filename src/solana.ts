import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// ===========================================================================
// Configuration
// ===========================================================================

const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
const connection = new Connection(RPC_URL);

export const testSolana = async (args: string[]) => {
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
      await getBalance(commandArgs[0]);
      break;
    default:
      console.log(`Unknown Solana command: ${command}`);
      break;
  }
};

export const run = testSolana;

export const getAccount = async (address: string) => {
  try {
    const publicKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(publicKey);
    console.log(JSON.stringify(accountInfo, null, 2));
    return accountInfo;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Solana account:', message);
    throw error;
  }
};

export const getBlock = async (slot: string) => {
  try {
    const block = await connection.getBlock(parseInt(slot));
    console.log(JSON.stringify(block, null, 2));
    return block;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Solana block:', message);
    throw error;
  }
};

export const getTransaction = async (signature: string) => {
  try {
    const transaction = await connection.getTransaction(signature);
    console.log(JSON.stringify(transaction, null, 2));
    return transaction;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Solana transaction:', message);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    console.log(`Balance for ${address}: ${balance / 1e9} SOL`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Solana balance:', message);
    throw error;
  }
};
