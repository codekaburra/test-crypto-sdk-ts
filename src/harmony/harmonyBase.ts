import axios from 'axios';

// ===========================================================================
// Configuration
// ===========================================================================

const RPC_URL = process.env.HARMONY_RPC_URL || 'https://api.harmony.one';

export const testHarmony = async (args: string[]) => {
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
      console.log(`Unknown Harmony command: ${command}`);
      break;
  }
};

export const run = testHarmony;

export const getAccount = async (address: string) => {
  try {
    // Harmony uses Ethereum-like RPC
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'hmyv2_getAccount',
      params: [address],
    });
    console.log(JSON.stringify(response.data.result, null, 2));
    return response.data.result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Harmony account:', message);
    throw error;
  }
};

export const getBlock = async (blockNumber: string) => {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'hmyv2_getBlockByNumber',
      params: [blockNumber, true],
    });
    console.log(JSON.stringify(response.data.result, null, 2));
    return response.data.result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Harmony block:', message);
    throw error;
  }
};

export const getTransaction = async (transactionHash: string) => {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'hmyv2_getTransactionByHash',
      params: [transactionHash],
    });
    console.log(JSON.stringify(response.data.result, null, 2));
    return response.data.result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Harmony transaction:', message);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const response = await axios.post(RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method: 'hmyv2_getBalance',
      params: [address, 'latest'],
    });
    const balance = parseInt(response.data.result, 16);
    console.log(`Balance for ${address}: ${balance / 1e18} ONE`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Harmony balance:', message);
    throw error;
  }
};
