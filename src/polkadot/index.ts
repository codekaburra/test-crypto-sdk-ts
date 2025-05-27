import networks from '../networks/polkadot.json';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { ApiPromise, WsProvider } from '@polkadot/api';
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
      await getAddressInfo(process.env.POLKADOT_ADDRESS);
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
  // Create mnemonic string for Alice using BIP39
  // const mnemonicAlice = mnemonicGenerate();
  const mnemonicAlice = 'resource battle dove melt antenna method midnight more slam detect real trade';

  console.log(`Generated mnemonic: ${mnemonicAlice}`);

  // Validate the mnemonic string that was generated
  const isValidMnemonic = mnemonicValidate(mnemonicAlice);

  console.log(`isValidMnemonic: ${isValidMnemonic}`);

  // Create valid Substrate-compatible seed from mnemonic
  const seedAlice = mnemonicToMiniSecret(mnemonicAlice);

  // Generate new public/secret keypair for Alice from the supplied seed
  const { publicKey, secretKey } = ed25519PairFromSeed(seedAlice);
  const address = encodeAddress(publicKey);
  console.log({ address, publicKey, secretKey });
  return { address, publicKey, secretKey };
};

export const getNetworkInfo = async () => {
  const api = await getClient();
  console.log('Genesis Hash:', api.genesisHash.toHex());
  // Get the minimum balance required for a new account
  const existentialDeposit = api.consts.balances.existentialDeposit.toString();
  console.log('existentialDeposit:', existentialDeposit);

  // Retrieve the chain name
  const chain = await api.rpc.system.chain();

  // Retrieve the latest header
  const lastHeader = await api.rpc.chain.getHeader();

  // Log the information
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
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
  const api = await getClient();
  // Example address
  // const address = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';
  console.log('getAddressInfo:', address);

  // Get current timestamp
  const timestamp = await api.query.timestamp.now();

  // Get account information
  const result = await api.query.system.account(address);
  console.log('getAddressInfo:', result.toJSON());
  // console.log(`
  //   Timestamp: ${timestamp}
  //   Free Balance: ${balance.free}
  //   Nonce: ${nonce}
  // `);
  //   console.log(`${address} | nonce ${nonce} | ${balance} = ${toReadableUnit(balance.toString(10), 18)}`);
};

export const getTransaction = async (transactionHash: string) => {
  const api = await getClient();
  const block = await api.derive.chain.getBlockByNumber(26157497);
  // const {blockNumber, blockHash}  = block;
  const blockNumber = block.block.header.number;
  const blockHash = block.block.hash;   
  console.log('block', {blockNumber: blockNumber.toString(), blockHash: blockHash.toString()});
//   const blockHash = api.registry.createType(
//  'Hash',
//  '0xb772e4949d2f3eb5ba356aa43f885cc4f9097ee9812c5436543f3846a0491729'
// );
// const extrinsicsInfo = await api.derive.tx.accountExtrinsics(
//  blockHash,
//  '0x21895DdfD4640b4e0aDCa2865b907f2CE6e6B777'
// );
const extrinsicInfo = await api.derive.tx.extrinsicInfo(
  blockHash,
  '0xf30c652051733ef0fc15b833ef4918b457a76b2393bbb7b520dca85f18b00074'
);
  // console.log(extrinsicInfo.extrinsic);
  extrinsicInfo.events.map((event) => console.log(event.toJSON()));
};

export const broadcastTransaction = async (transaction: string) => {
  // console.log('broadcastTransaction ', transaction);
  // const api = await getClient();
  // const result = await api.broadcastTransaction(transaction);
  // console.log('broadcastTransaction result ', JSON.stringify(result));
  // console.log(`${selectedNetwork.explorer.transaction}${result}`);
};

export const buildTransaction = async () => {
  const api = await getClient();
  // Assuming you have an `alice` keypair from the Keyring
  const recipient = 'INSERT_RECIPIENT_ADDRESS';
  const amount = 'INSERT_VALUE'; // Amount in the smallest unit (e.g., Planck for DOT)

  // Sign and send a transfer
  const txHash = await api.tx.balances
    .transfer(recipient, amount);
  // .signAndSend(alice);

  console.log('Transaction Hash:', txHash);

  // estimate the fees as RuntimeDispatchInfo, using the signer (either
  // address or locked/unlocked keypair) (When overrides are applied, e.g
  //  nonce, the format would be `paymentInfo(sender, { nonce })`)
  const info = await api.tx.balances
    .transfer(recipient, 123);
    // .paymentInfo(sender);

  // log relevant info, partialFee is Balance, estimated for current
//   console.log(`
//   class=${info.class.toString()},
//   weight=${info.weight.toString()},
//   partialFee=${info.partialFee.toHuman()}
// `);
};
