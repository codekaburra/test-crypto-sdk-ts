import IconService from 'icon-sdk-js';
import BigNumber from 'bignumber.js';

const { HttpProvider } = IconService;

// ===========================================================================
// Configuration
// ===========================================================================

const RPC_URL = process.env.ICON_RPC_URL || 'https://ctz.solidwallet.io/api/v3';
const provider = new HttpProvider(RPC_URL);
const iconService = new IconService(provider);

export const testIcx = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'account':
      // Icon doesn't have a direct getAccount in the same way, usually check balance or specific methods
      await getBalance(commandArgs[0]);
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
      console.log(`Unknown ICON command: ${command}`);
      break;
  }
};

export const run = testIcx;

export const getBlock = async (blockHeightOrHash: string) => {
  try {
    let block;
    if (blockHeightOrHash.startsWith('0x')) {
      block = await iconService.getBlockByHash(blockHeightOrHash).execute();
    } else {
      block = await iconService.getBlockByHeight(new BigNumber(blockHeightOrHash)).execute();
    }
    console.log(JSON.stringify(block, null, 2));
    return block;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching ICON block:', message);
    throw error;
  }
};

export const getTransaction = async (transactionHash: string) => {
  try {
    const transaction = await iconService.getTransaction(transactionHash).execute();
    console.log(JSON.stringify(transaction, null, 2));
    return transaction;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching ICON transaction:', message);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const balance = await iconService.getBalance(address).execute();
    const balanceStr = (balance as unknown as string).toString();
    const formatted = (IconService.IconAmount as any)
      .fromLoop(balanceStr, (IconService.IconAmount as any).Unit.ICX)
      .toString();
    console.log(`Balance for ${address}: ${formatted} ICX`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching ICON balance:', message);
    throw error;
  }
};
