import axios from 'axios';

/**
 * Nano (XNO) blockchain module
 * Based on RPC methods for account management and block analysis.
 */

export const getReceivable = async (address: string) => {
  const params = {
    action: 'receivable',
    account: address,
    // count: '10',
  };
  console.log('------------ getReceivable -----------', address);
  const result = await postCall(params);
  console.log(`num of pending receive: ${result.blocks.length}`);
  return result.blocks;
};

export const accountHistory = async (address: string) => {
  const params = {
    action: 'account_history',
    account: address,
    count: '10',
  };
  const result = await postCall(params);
  if (result.history != null && result.history !== '') {
    await getBlocks(result.history.map((_: { hash: string }) => _.hash));
    console.log(result.history.map((_: { account: string }) => _.account));
  }
  return result;
};

export const getBlocks = async (blockHashes: string[]) => {
  const params = {
    action: 'blocks',
    json_block: 'true',
    hashes: blockHashes,
  };
  console.log('------------ getBlocks -----------', blockHashes);
  const result = await postCall(params);
  return result;
};

export const getBlockInfo = async (blockHash: string) => {
  const params = {
    action: 'block_info',
    json_block: 'true',
    hash: blockHash,
  };
  console.log('------------ getBlockInfo -----------', blockHash);
  const result = await postCall(params);
  return result;
};

export const generateWork = async (hash: string) => {
  const params = {
    action: 'work_generate',
    hash,
  };
  const result = await postCall(params);
  return result;
};

export const postCall = async (data: unknown, shouldLog: boolean = true) => {
  const rpc = 'https://rpc.nano.to';
  const result = await axios.post(rpc, data);
  if (shouldLog) console.log(result.data);
  return result.data;
};

export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'history':
      await accountHistory(commandArgs[0] || 'nano_??????????????');
      break;
    case 'receivable':
      await getReceivable(commandArgs[0] || 'nano_??????????????');
      break;
    default:
      console.log('Unknown Nano command');
  }
};
