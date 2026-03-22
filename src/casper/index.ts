import { RpcClient, HttpHandler, PublicKey } from 'casper-js-sdk';
import { AccountIdentifier } from 'casper-js-sdk/dist/rpc/request';

// ===========================================================================
// Configuration
// ===========================================================================

const RPC_URL = process.env.CASPER_RPC_URL || 'https://rpc.mainnet.casperlabs.io';
const handler = new HttpHandler(RPC_URL);
const service = new RpcClient(handler);

export const testCasper = async (args: string[]) => {
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
      console.log(`Unknown Casper command: ${command}`);
      break;
  }
};

export const run = testCasper;

export const getAccount = async (publicKeyHex: string) => {
  try {
    const publicKey = PublicKey.fromHex(publicKeyHex);
    const accountIdentifier = new AccountIdentifier();
    accountIdentifier.publicKey = publicKey;
    const account = await service.getAccountInfo(null, accountIdentifier);
    console.log(JSON.stringify(account, null, 2));
    return account;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Casper account:', message);
    throw error;
  }
};

export const getBlock = async (blockHash?: string) => {
  try {
    let block;
    if (blockHash) {
      block = await service.getBlockByHash(blockHash);
    } else {
      block = await service.getLatestBlock();
    }
    console.log(JSON.stringify(block, null, 2));
    return block;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Casper block:', message);
    throw error;
  }
};

export const getTransaction = async (deployHash: string) => {
  try {
    const deploy = await service.getDeploy(deployHash);
    console.log(JSON.stringify(deploy, null, 2));
    return deploy;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Casper deploy:', message);
    throw error;
  }
};

export const getBalance = async (accountHash: string) => {
  try {
    // get balance requires state root hash
    const stateRootHash = (await service.getStateRootHashLatest()).stateRootHash.toHex();
    const balance = await service.getBalanceByStateRootHash(accountHash, stateRootHash);
    console.log(`Balance for ${accountHash}: ${balance.balanceValue.toString()} CSPR`);
    return balance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching Casper balance:', message);
    throw error;
  }
};
