import networks from '../networks/polkadot.json';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Hash } from '@polkadot/types/interfaces';
import { 
  mnemonicGenerate, 
  mnemonicToMiniSecret,
  mnemonicValidate,
  ed25519PairFromSeed } from '@polkadot/util-crypto';

const selectedNetwork = networks.paseo;
// https://polkadot.js.org/docs/
// https://docs.polkadot.com/develop/networks/#__tabbed_1_2
export const getClient = async () => {
  // Create a WebSocket provider
  const wsProvider = new WsProvider(selectedNetwork.wss);
  return await ApiPromise.create({ provider: wsProvider });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  console.log('rpc :', selectedNetwork.wss);
  await getNetworkInfo();
  switch (command) {
    case 'balance':
      // await getAddressInfo(commandArgs[0]);
      await getAddressInfo(process.env.POLKADOT_ADDRESS || '');
      break;
    case 'broadcast':
      await broadcastTransaction(commandArgs[0]);
      break;
    default:
      await newWallet();
      // await getTransaction('');
      // await getAddressInfo(selectedNetwork.addresses[0]);
  }
};

export const newWallet = async () => {
  const mnemonicAlice = process.env.POLKADOT_MNEMONIC || mnemonicGenerate();
  if (!mnemonicValidate(mnemonicAlice)) {
    throw new Error('Invalid POLKADOT_MNEMONIC (or generated mnemonic failed validation)');
  }
  const seedAlice = mnemonicToMiniSecret(mnemonicAlice);
  const { publicKey, secretKey } = ed25519PairFromSeed(seedAlice);
  const address = encodeAddress(publicKey);
  return {
    address,
    publicKey: Buffer.from(publicKey).toString('hex'),
    secretKey: Buffer.from(secretKey).toString('hex'),
    ...(process.env.POLKADOT_MNEMONIC ? {} : { mnemonic: mnemonicAlice }),
  };
};

export const getNetworkInfo = async () => {
  const api = await getClient();
  const [chain, lastHeader] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.chain.getHeader(),
  ]);
  const existentialDeposit = api.consts.balances.existentialDeposit.toString();
  return {
    wss: selectedNetwork.wss,
    genesisHash: api.genesisHash.toHex(),
    chain: chain.toString(),
    existentialDeposit,
    latestBlockNumber: lastHeader.number.toString(),
    latestBlockHash: lastHeader.hash.toHex(),
  };
};

const isValidAddressPolkadotAddress = (address: string) => {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
    );

    return true;
  } catch (error) {
    return false;
  }
};

export const getAddressInfo = async (address: string) => {
  if (!isValidAddressPolkadotAddress(address)) {
    throw new Error(`Invalid Polkadot address: ${address}`);
  }
  const api = await getClient();
  const [timestamp, accountData] = await Promise.all([
    api.query.timestamp.now(),
    api.query.system.account(address),
  ]);
  const json = accountData.toJSON() as {
    nonce?: string | number;
    consumers?: number;
    providers?: number;
    data?: { free?: string; reserved?: string; frozen?: string };
  };
  return {
    address,
    timestamp: timestamp.toString(),
    nonce: json.nonce,
    consumers: json.consumers,
    providers: json.providers,
    balance: json.data,
  };
};

/**
 * Resolve extrinsic metadata. Substrate needs the **block hash** (not the extrinsic hash alone).
 * Pass `blockHash` as the parent block hash that includes the extrinsic (hex `0x…`).
 */
export const getTransaction = async (extrinsicHash: string, blockHash: string) => {
  const api = await getClient();
  const at = api.registry.createType('Hash', blockHash) as Hash;
  const extrinsicInfo = await api.derive.tx.extrinsicInfo(at, extrinsicHash);
  if (!extrinsicInfo) {
    return { extrinsicHash, blockHash, found: false };
  }
  return {
    extrinsicHash,
    blockHash,
    found: true,
    events: extrinsicInfo.events.map((event) => event.toJSON()),
  };
};

export const broadcastTransaction = async (transaction: string) => {
  const api = await getClient();
  const hash = await api.rpc.author.submitExtrinsic(transaction);
  return { hash: hash.toHex() };
};

export const buildTransaction = async () => {
  const api = await getClient();
  const recipient = process.env.POLKADOT_RECIPIENT || 'INSERT_RECIPIENT_ADDRESS';
  const amount = process.env.POLKADOT_AMOUNT || '0';
  const balances = api.tx.balances;
  const unsigned =
    'transferAllowDeath' in balances && typeof balances.transferAllowDeath === 'function'
      ? balances.transferAllowDeath(recipient, amount)
      : balances.transfer(recipient, amount);
  return {
    recipient,
    amount,
    method: unsigned.method.toHuman(),
    section: unsigned.method.section,
  };
};
