import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// ===========================================================================
// Configuration
// ===========================================================================

const config = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(config);

export const testAptos = async (args: string[]) => {
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
      console.log(`Unknown Aptos command: ${command}`);
      break;
  }
};

export const run = testAptos;

export const getAccount = async (address: string) => {
  try {
    const account = await aptos.getAccountInfo({ accountAddress: address });
    console.log(JSON.stringify(account, null, 2));
    return account;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Aptos account:', message);
    throw error;
  }
};

export const getBlock = async (ledgerVersion: string) => {
  try {
    const block = await aptos.getBlockByVersion({ ledgerVersion: parseInt(ledgerVersion) });
    console.log(JSON.stringify(block, null, 2));
    return block;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Aptos block:', message);
    throw error;
  }
};

export const getTransaction = async (transactionHash: string) => {
  try {
    const transaction = await aptos.getTransactionByHash({ transactionHash });
    console.log(JSON.stringify(transaction, null, 2));
    return transaction;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Aptos transaction:', message);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const balance = await aptos.getAccountCoinAmount({
      accountAddress: address,
      coinType: '0x1::aptos_coin::AptosCoin',
    });
    console.log(`Balance for ${address}: ${balance} Octas`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Aptos balance:', message);
    throw error;
  }
};
