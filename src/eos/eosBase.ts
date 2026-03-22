import axios from 'axios';
import { Api, JsonRpc, Numeric } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { EosAccount } from './eosType';
import { logPercentage, saveToTextFile, sleep } from '../utils';
import { networks } from './networks';

// ===========================================================================
// Configuration
// ===========================================================================

const CONTACT_CORE_VAULTA = 'core.vaulta';
const DEFAULT_BLOCK_BEHIND = 3;
const DEFAULT_EXPIRE_SECONDS = 30;

const selectedNetwork = networks.EOS_MAINNET;
const rpc = selectedNetwork.rpc;

export const testEos = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'network':
      await getEosLatestBlockInfo();
      break;
    case 'account':
      await getEosAccount('mxcdeposit');
      break;
    case 'block':
      await getBlock('204100884');
      break;
    case 'transaction':
      await getTransaction(commandArgs[0]);
      break;
    case 'broadcast':
      // await broadcast();
      break;
    case 'process2':
      for (const to of ['accountA']) {
        await checkResources(to);
        await buildTransactionPowerup(
          'eosio',
          selectedNetwork.accounts.accountA,
          to,
          552000,
          2207074500,
          '1.0000 EOS',
        );
      }
      break;
    case 'process':
      // First powerup to get enough CPU for the transfer
      await buildTransactionPowerup(
        'eosio',
        selectedNetwork.accounts.accountA,
        'accountA',
        33120,
        29427660,
        '1.0000 EOS',
      );
      break;
    case 'balance':
      for (const accountName of selectedNetwork.monitoringAccount) {
        console.log(`---------------- ${accountName} ----------------`);
        await getAccount(accountName);
        await getBalance(accountName);
        console.log('------------------------------------------------');
      }
      break;
    case 'check':
      for (const accountName of ['']) {
        await checkResources(accountName);
      }
      break;
    case 'checkall':
      for (const accountName of []) {
        await checkResources(accountName);
        await sleep(5000);
      }
      break;
    case 'history': {
      const accountName = '';
      const historicalActions = (await getHistoricalActions(accountName)) || {};
      await processHistoricalActions(historicalActions);
      break;
    }
    default:
      break;
  }
};

export const run = testEos;

export const broadcast = async (txn: { signatures: string[]; compression: number; transaction: Uint8Array }) => {
  const rpcClient = new JsonRpc(selectedNetwork.rpc, { fetch });
  const transaction = await rpcClient.push_transaction({
    signatures: txn.signatures,
    compression: txn.compression,
    serializedTransaction: txn.transaction,
  });
  console.log(JSON.stringify(transaction, null, 2));
};

export const buildTransactionSwapVaultaToEos = async (from: EosAccount, quantity: string, memo: string) => {
  return await buildTransactionTransfer('core.vaulta', from, CONTACT_CORE_VAULTA, quantity, memo);
};

export const buildTransactionSwapEosToVaulta = async (from: EosAccount, quantity: string, memo: string) => {
  return await buildTransactionTransfer('eosio.token', from, CONTACT_CORE_VAULTA, quantity, memo);
};

export const buildTransactionSystemWrapper = async (
  contractName: string,
  functionName: string,
  from: EosAccount,
  data: unknown,
) => {
  await buildTransaction(contractName, functionName, from, data);
};

export const buildTransactionBuyRam = async (contractName: string, from: EosAccount, to: string, bytes: number) => {
  await buildTransactionSystemWrapper(contractName, 'buyrambytes', from, {
    payer: from.accountName,
    receiver: to,
    bytes: bytes,
  });
};

export const buildTransactionPowerup = async (
  contractName: string,
  from: EosAccount,
  to: string,
  net_frac: number,
  cpu_frac: number,
  max_payment: string,
) => {
  await buildTransactionSystemWrapper(contractName, 'powerup', from, {
    payer: from.accountName,
    receiver: to,
    days: 1,
    net_frac,
    cpu_frac,
    max_payment,
  });
};

export const buildTransactionBlockSwapTo = async (from: EosAccount, shouldBlock: boolean) => {
  return await buildTransaction(CONTACT_CORE_VAULTA, 'blockswapto', from, {
    account: from.accountName,
    block: shouldBlock,
  });
};

export const buildTransactionTransfer = async (
  contractName: string,
  from: EosAccount,
  to: string,
  quantity: string,
  memo: string,
) => {
  console.log();
  return await buildTransaction(contractName, 'transfer', from, {
    from: from.accountName,
    to,
    quantity,
    memo,
  });
};

/**
 * Build and execute a generic transaction
 * @param contractName - Smart contract name
 * @param actionName - Action name
 * @param account - Account to sign transaction
 * @param data - Action data
 * @param blocksBehind - Blocks behind for transaction reference
 * @param expireSeconds - Transaction expiration time
 */
export const buildTransaction = async (
  contractName: string,
  actionName: string,
  account: EosAccount,
  data: unknown,
  blocksBehind: number = DEFAULT_BLOCK_BEHIND,
  expireSeconds: number = DEFAULT_EXPIRE_SECONDS,
) => {
  const transaction = {
    actions: [
      {
        account: contractName,
        name: actionName,
        authorization: [
          {
            actor: account.accountName,
            permission: 'active',
          },
        ],
        data: data,
      },
    ],
  };

  try {
    const signatureProvider = new JsSignatureProvider([account.privateKey]);
    const rpcClient = new JsonRpc(selectedNetwork.rpc, { fetch });
    const api = new Api({
      rpc: rpcClient,
      signatureProvider,
    });

    const result = await api.transact(transaction, {
      blocksBehind,
      expireSeconds,
    });
    console.log('Result:', result);
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error executing transaction:', message);
    throw error;
  }
};

export const checkResources = async (account_names: string) => {
  const account = await axios.post(`${rpc}/v1/chain/get_account`, { account_name: account_names }).then((response) => {
    return response.data;
  });

  console.log(
    `${account.account_name} | net ${logPercentage(account.net_limit.used, account.net_limit.max)} \t | cpu ${logPercentage(account.cpu_limit.used, account.cpu_limit.max)}`,
  );

  console.log({
    account_name: account.account_name,
    core_liquid_balance: account.core_liquid_balance,
    ram_quota: account.ram_quota,
    net_weight: account.net_weight,
    cpu_weight: account.cpu_weight,
    net_limit: account.net_limit,
    cpu_limit: account.cpu_limit,
    ram_usage: account.ram_usage,
    total_resources: account.total_resources,
  });
};

export const getAccount = async (account_name: string) => {
  await axios.post(`${rpc}/v1/chain/get_account`, { account_name: `${account_name}` }).then((response) => {
    console.log(JSON.stringify(response.data, null, 2));
  });
};

export const getBlock = async (blockNumber: string) => {
  await axios.post(`${rpc}/v1/chain/get_block`, { block_num_or_id: `${blockNumber}` }).then((response) => {
    console.log(JSON.stringify(response.data, null, 2));
  });
};

export const getTransaction = async (transactionHash: string) => {
  const rpcClient = new JsonRpc(selectedNetwork.rpc, { fetch });
  const transaction = await rpcClient.history_get_transaction(transactionHash);
  console.log(JSON.stringify(transaction, null, 2));
};

export const getTransaction1 = async (transactionHash: string) => {
  try {
    const endpoint = `https://api.eosrio.io/v2/transactions/${transactionHash}`;
    const response = await axios.post(endpoint, {
      transactionHash,
    });

    console.log();
    console.log('getTransaction1 result:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (errors: unknown) {
    const message = errors instanceof Error ? errors.message : String(errors);
    console.error('Error in getTransaction1:', message);
    throw errors;
  }
};

export const getBalance = async (accountName: string) => {
  const rpcClient = new JsonRpc(selectedNetwork.rpc, { fetch });
  const eosBalance = await rpcClient.get_currency_balance('eosio.token', accountName, 'EOS');

  const vaultaBalance = await rpcClient.get_currency_balance('core.vaulta', accountName, 'XYZ');

  console.log(`Balance for ${accountName}:`, eosBalance, vaultaBalance);
};

export const getBalanceVaulta2 = async (accountName: string) => {
  const rpcClient = new JsonRpc(selectedNetwork.rpc, { fetch });
  const result = await rpcClient.get_table_rows({
    json: true,
    code: 'core.vaulta',
    scope: accountName,
    table: 'accounts',
    limit: 10,
    reverse: false,
    show_payer: false,
  });

  console.log('Balance: ', result);
};

export const getEosLatestBlockInfo = async () => {
  let last_irreversible_block_num;
  await axios.post(`${rpc}/v1/chain/get_info`).then((response) => {
    last_irreversible_block_num = response.data.last_irreversible_block_num;
  });

  await axios.post(`${rpc}/v1/chain/get_block`, { block_num_or_id: `${last_irreversible_block_num}` }).then((response) => {
    console.log(`long headBlockTime = ${Date.now()}L;`);
    console.log(`Timestamp: ${response.data.timestamp}`);
  });
};

export const getEosAccount = async (accountName: string) => {
  await axios.post(`${rpc}/v1/chain/get_account`, { account_name: accountName }).then((response) => {
    console.log('response = ', response.data);
  });
};

export const getHistoricalActions = async (accountName: string, shouldSaveFile = false) => {
  try {
    const endpoint = 'https://eosnation.io';
    const params = {
      account: accountName,
      limit: 1000,
    };

    const response = await axios.get(`${endpoint}/v2/history/get_actions`, {
      params,
      timeout: 10000,
    });

    if (response.data && response.data.actions) {
      console.log(
        `${accountName} : ${response.data.actions.length} actions - time : ${response.data.actions[0].timestamp} to ${response.data.actions[response.data.actions.length - 1].timestamp}`,
      );

      if (shouldSaveFile) {
        console.log(JSON.stringify(response.data, null, 2));
        saveToTextFile(JSON.stringify(response.data, null, 2), `./eos_historicalActionsApiResponse_${accountName}.json`);
      }

      return response.data;
    }
  } catch (error: unknown) {
    console.warn('Hyperion endpoint failed', error);
  }
};

export const processHistoricalActions = async (response: any) => {
  const result: { [transactionId: string]: any } = {};

  response.actions.forEach((action: any) => {
    if (!result[action.trx_id]) {
      result[action.trx_id] = {
        transaction_id: action.trx_id,
        block_num: action.block_num,
        block_time: action.timestamp,
      };
    }

    if (action.act?.data?.to === 'eosio.fees') {
      result[action.trx_id].fee = action.act.data.quantity;
    } else {
      result[action.trx_id] = {
        ...result[action.trx_id],
        action: action.act?.name || '',
        data: action.act?.data || {},
      };
    }
  });

  const histories = Object.values(result);
  if (histories.length === 0) return [];

  const resultHeader = Object.keys(histories[0]).join(',');
  const resultString = histories.map((v: any) => Object.values(v).join(',')).join('\n');

  saveToTextFile(resultHeader + '\n' + resultString, `./eos_historicalActions_${Date.now()}.csv`);

  const summary = '';
  saveToTextFile(summary, `./eos_historicalActions_summary_${Date.now()}.csv`);
  return histories;
};

export const convertEosAddressToPublicKey = async (eosKeys: string) => {
  if (!eosKeys.startsWith('EOS')) {
    throw new Error('Invalid EOS public key format. It must start with \'EOS\'.');
  }

  const publicKey = Numeric.stringToPublicKey(eosKeys);
  console.log({
    eosKeys,
    publicKey: publicKey.toString(),
  });
  return publicKey.toString();
};
