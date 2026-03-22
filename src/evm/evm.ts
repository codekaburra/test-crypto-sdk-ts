import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import networks from '../networks/evm.json';
import { toReadableUnit } from '../utils';
import axios from 'axios';

// ===========================================================================
// Configuration
// ===========================================================================

const selectedNetwork = networks.ethereum_mainnet;
const rpc = selectedNetwork.rpc;

export const getClient = async () => {
  return new ethers.JsonRpcProvider(rpc);
};

export const broadcastTransaction = async (signedTx: string) => {
  const client = await getClient();
  const tx = await client.broadcastTransaction(signedTx);
  console.log('Transaction broadcasted:', tx.hash);
  return tx;
};

export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'network':
      await networkInfo();
      break;
    case 'balance':
      await getAddressInfo(commandArgs[0] || selectedNetwork.addresses[0]);
      break;
    case 'erc20':
      await getERC20Balance(commandArgs[0], commandArgs[1]);
      break;
    case 'erc20balance': {
      // npm run dev evm erc20balance <walletAddress> <tokenAlias>
      const walletAddr = commandArgs[0];
      const tokenIdentifier = commandArgs[1];

      // Try to look up token from network config
      const networkTokens = (selectedNetwork as any).erc20;
      if (networkTokens && networkTokens[tokenIdentifier]) {
        const tokenConfig = networkTokens[tokenIdentifier];
        console.log(`Using token alias '${tokenIdentifier}' from network config`);
        await getERC20Balance(tokenConfig.contractAddress || tokenConfig.address, walletAddr, tokenConfig.decimals);
      } else {
        // Fallback to treating second arg as contract address
        await getERC20Balance(tokenIdentifier, walletAddr, commandArgs[2] ? parseInt(commandArgs[2]) : 18);
      }
      break;
    }
    case 'erc20custom': // npm run dev evm erc20custom <tokenAddress> <walletAddress> [decimals]
      await getERC20Balance(commandArgs[0], commandArgs[1], commandArgs[2] ? parseInt(commandArgs[2]) : 18);
      break;
    case 'balance-go': {
      // npm run dev evm balance-go
      let index = 0;
      for (const address of [
        '0x07e47ed3c5aff59fb5d1df4051c34da67fc55547', // 0
        '0xdfd051347f3e9908567ae565043928cc4e4e8', // 1
        '0x6e4f394e2b0e250e552cc9f6196ea552e4d1dc', // 2
        '0xdac852846a4a5489beef48ebbc5187bb87ddf7e', // 3
        '0x5ac39b6725e2ec7487b8b09d4d256579a820897a', // 4
        '0x8ffd89924874aeebebc f8d680c153e9437172af', // 5
        '0x31a884db4d60db9e546c7833d49988949ca6afa5', // 6
        '0x5373a0ee49106f49174ce8d1bc0943f78b22ee', // 7
        '0x4364c941466fb25e7b2fb8024de88949ca6afa5', // 8
        '0x377f5aabf858dd35627073ce74bb2707682e558', // 9
        '0xad06a98cac85448cb33495ca6e88b837e3b65ab6', // 10
        '0x8631a8e0360c1c6910ed8cc378cbbdebc82c126', // 11
        '0x58279ac54618a3ede8d4c89dfc5f9394fd732fb7', // 12
        '0x85937ab9374770ad5589cf9a81d72551cf4a1', // 13
        '0x40cba5e72bd0822166352f111e5ad52556f72a7b', // 14
        '0x155d4887c614cd3060f90a629adbe1d3adc7d2c8', // 15
        '0xa8436e845c8942f694c1a295d1f972dba81a3e78', // 16
        '0x4129cf2374fd309a426effdc8d005c9222d79c8c', // 17
        '0x64e914075fbe3ec9f8c4e801868cb70d5ab9bef', // 18
        '0xb62bf0caed873bbbab04d17f2aa33201f2ac2882', // 19
        '0x8695a6bcbf746a226a9e5149f3b7e977317db0de', // 20
        '0x35b2438d33c7dc449ae9ffbda14f56dc39a4c68b', // 21
        '0x1235e3873452bcae6e3dfe39a6e5db64906d76e8', // 22
        '0x97def4a354b5baefa42c8dcca5cd94906d76e8', // 23
        '0xa8d9c46cea86800814e149e163580b5ba16f7084', // 24
        '0x8565855b48182b81ec8de38b7707562ab906d76e8', // 25
        '0x14f1b7d9d47db46ba754061d9c2787d5ee545a2a', // 26
        '0xbf95a99b90edf48c4e4160224fa2312aa4a88c08', // 27
        '0xb9da1c9fc96fd5678f672bb6c58a7da938788e', // 28
        '0xf04460f6afc491c27465dc5bd6ec3a53e7fd', // 29
      ]) {
        await getBalance(address, index);
        index++;
      }
      break;
    }
    case 'transaction':
      await getTransaction(commandArgs[0]);
      break;
    case 'block':
      await getBlock(commandArgs[0]);
      break;
    case 'wallet':
      genAddress();
      break;
    case 'broadcast':
      // await broadcastTransaction(commandArgs[0]);
      break;
    default:
      console.log(`Unknown EVM command: ${command}`);
  }
};

export const getNetworkInfo = async () => {
  const client = await getClient();
  const [network, feeData, blockNumber] = await Promise.all([
    client.getNetwork(),
    client.getFeeData(),
    client.getBlockNumber(),
  ]);

  const result = {
    rpc: rpc,
    chainId: network.chainId.toString(),
    name: network.name,
    blockNumber,
    feeData: {
      gasPrice: feeData.gasPrice?.toString() ?? null,
      maxFeePerGas: feeData.maxFeePerGas?.toString() ?? null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() ?? null,
    },
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
};

export const getAddressInfo = async (address: string) => {
  const client = await getClient();
  const [balance, nonce, code] = await Promise.all([
    client.getBalance(address),
    client.getTransactionCount(address),
    client.getCode(address),
  ]);

  const result = {
    address,
    nonce,
    balanceWei: balance.toString(),
    balanceEth: toReadableUnit(balance.toString(), 18).toString(10),
    isContract: code !== '0x',
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
};

export const getBlock = async (blockNumberOrHash: string | number) => {
  const client = await getClient();
  const block = await client.getBlock(blockNumberOrHash);
  console.log(JSON.stringify(block, null, 2));
  return block;
};

export const getTransaction = async (transactionHash: string) => {
  const client = await getClient();
  const [tx, receipt] = await Promise.all([
    client.getTransaction(transactionHash),
    client.getTransactionReceipt(transactionHash),
  ]);

  const result = {
    transaction: tx,
    receipt: receipt,
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
};

export async function decodeInputData(data: string, contractAddress: string | null = null) {
  try {
    // Extract function selector (first 4 bytes)
    const selector = data.slice(0, 10);

    // Common function selectors and their signatures
    const commonSelectors: { [key: string]: string } = {
      '0xa9059cbb': 'transfer(address,uint256)',
      '0x23b872dd': 'transferFrom(address,address,uint256)',
      '0x095ea7b3': 'approve(address,uint256)',
      '0x40c10f19': 'mint(address,uint256)',
      '0x9dc29fac': 'burn(address,uint256)',
      '0x18160ddd': 'totalSupply()',
      '0x70a08231': 'balanceOf(address)',
      '0xdd62ed3e': 'allowance(address,address)',
    };

    const decoded: any = {
      selector,
      functionName: 'Unknown',
      functionSignature: commonSelectors[selector] || 'Unknown',
      parameters: null as any,
      rawData: data,
    };

    // Try to decode with known function signatures
    if (commonSelectors[selector]) {
      try {
        const iface = new ethers.Interface([`function ${commonSelectors[selector]}`]);
        const decodedParams = iface.decodeFunctionData(commonSelectors[selector].split('(')[0], data);
        decoded.functionName = commonSelectors[selector].split('(')[0];
        decoded.parameters = Array.from(decodedParams);
      } catch (e) {
        console.warn(`Failed to decode known function ${commonSelectors[selector]}:`, e);
      }
    }

    // Try to decode using available ABI files if contract address is known
    if (contractAddress && !decoded.parameters) {
      const abiFiles = [
        '/Users/evelynmok/Documents/projects/ts-playground/src/abi/FiatTokenV2_1.json',
        '/Users/evelynmok/Documents/projects/ts-playground/src/abi/MessageTransmitter.json',
        '/Users/evelynmok/Documents/projects/ts-playground/src/abi/OptimismPortal2.json',
        '/Users/evelynmok/Documents/projects/ts-playground/src/abi/TokenMessenger.json',
      ];

      for (const abiPath of abiFiles) {
        try {
          const abi = (await import(abiPath)).default;
          const iface = new ethers.Interface(abi);
          const fragment = iface.getFunction(selector);
          if (fragment) {
            const decodedParams = iface.decodeFunctionData(fragment, data);
            decoded.functionName = fragment.name;
            decoded.functionSignature = fragment.format();
            decoded.parameters = Array.from(decodedParams);
            break;
          }
        } catch (e) {
          // Continue trying other ABIs
        }
      }
    }

    return decoded;
  } catch (error) {
    console.warn('Error decoding input data:', error);
    return {
      selector: data.slice(0, 10),
      functionName: 'Unknown',
      functionSignature: 'Unknown',
      parameters: null,
      rawData: data,
      error: (error as Error).message,
    };
  }
}

async function decodeLogs(logs: any[]) {
  const decodedLogs: any[] = [];

  // Common event signatures
  const commonEvents: { [key: string]: string } = {
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': 'Transfer(address,address,uint256)',
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': 'Approval(address,address,uint256)',
    '0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885': 'Mint(address,uint256)',
    '0xcc16f5db4873288815c1e089dbd86736ffcc184412cf7a71a0fdb75d397ca5': 'Burn(address,uint256)',
  };

  for (const log of logs) {
    try {
      const topic0 = Array.isArray(log.topics) ? log.topics[0] : log.topic0;
      const decodedLog: any = {
        address: log.address,
        topics: Array.isArray(log.topics)
          ? log.topics
          : [log.topic0, log.topic1, log.topic2, log.topic3].filter((t: any) => t),
        data: log.data,
        eventName: 'Unknown',
        eventSignature: commonEvents[topic0] || 'Unknown',
        parameters: null as any,
        logIndex: log.logIndex,
        blockNumber: log.blockNumber,
      };

      // Try to decode with common event signatures
      if (commonEvents[topic0]) {
        try {
          const iface = new ethers.Interface([`event ${commonEvents[topic0]}`]);
          const parsed = iface.parseLog({
            topics: decodedLog.topics,
            data: log.data,
          });
          if (parsed) {
            decodedLog.eventName = parsed.name;
            decodedLog.parameters = parsed.args;
          }
        } catch (e) {
          console.warn(`Failed to decode known event ${commonEvents[topic0]}:`, e);
        }
      }

      // Try to decode using available ABI files
      if (!decodedLog.parameters) {
        const abiFiles = [
          '/Users/evelynmok/Documents/projects/ts-playground/src/abi/FiatTokenV2_1.json',
          '/Users/evelynmok/Documents/projects/ts-playground/src/abi/MessageTransmitter.json',
          '/Users/evelynmok/Documents/projects/ts-playground/src/abi/OptimismPortal2.json',
          '/Users/evelynmok/Documents/projects/ts-playground/src/abi/TokenMessenger.json',
        ];

        for (const abiPath of abiFiles) {
          try {
            const abi = (await import(abiPath)).default;
            const iface = new ethers.Interface(abi);
            const parsed = iface.parseLog({
              topics: decodedLog.topics,
              data: log.data,
            });
            if (parsed) {
              decodedLog.eventName = parsed.name;
              decodedLog.eventSignature = parsed.signature;
              decodedLog.parameters = parsed.args;
              break;
            }
          } catch (e) {
            // Continue trying other ABIs
          }
        }
      }

      decodedLogs.push(decodedLog);
    } catch (error) {
      console.warn('Error decoding log:', error);
      decodedLogs.push({
        ...log,
        eventName: 'Unknown',
      });
    }
  }

  return decodedLogs;
}

export const getNonce = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  const nonce = await provider.getTransactionCount(address);
  console.log(`address: ${address} nonce: ${nonce}`);
  return nonce;
};

export const getCode = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  const result = await provider.getCode(address);
  console.log(`address: ${address} code: ${result}`);
  return result;
};

export async function networkInfo() {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  console.log('rpc:', selectedNetwork.rpc);
  console.log('getNetwork:', JSON.stringify(await provider.getNetwork()));
  console.log('getBlockNumber:', await provider.getBlockNumber());
  const feeData = await provider.getFeeData();
  console.log('------------------------------------------------');
  console.log('getFeeData:', feeData);
  printGasPrice('gasPrice', feeData.gasPrice);
  printGasPrice('maxFeePerGas', feeData.maxFeePerGas);
  printGasPrice('maxPriorityFeePerGas', feeData.maxPriorityFeePerGas);
  console.log('------------------------------------------------');

  try {
    const [chainId, clientVersion, protocolVersion, networkId, blockNumber, gasPrice] = await Promise.all([
      makeRPCCall('eth_chainId'),
      makeRPCCall('web3_clientVersion').catch(() => 'Unknown'),
      makeRPCCall('eth_protocolVersion').catch(() => 'Unknown'),
      makeRPCCall('net_version'),
      makeRPCCall('eth_blockNumber'),
      makeRPCCall('eth_gasPrice'),
    ]);

    console.log({
      chainId,
      clientVersion,
      protocolVersion,
      networkId,
      blockNumber,
      gasPrice,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get network info: ${message}`);
  }
}

export async function printGasPrice(gasPriceName: string, gasPriceFromRpc: null | bigint) {
  if (!gasPriceFromRpc) return;
  const gasPrice = new BigNumber(gasPriceFromRpc.toString());
  console.log(
    '|',
    gasPrice.toString(10),
    '|',
    gasPrice.dividedBy('1e9').toString(10),
    '|',
    gasPrice.dividedBy('1e18').toString(10) + ' | ' + gasPriceName,
  );
}

export async function buildTransaction(): Promise<string> {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  const signer = new ethers.Wallet(process.env.EVM_M_PRIVATE_KEY_1 || '', provider);
  console.log('signer', signer.address);
  const tx = await signer.populateTransaction({
    to: process.env.EVM_M_ADDRESS_1 || '',
    maxFeePerGas: '1000000000',
    maxPriorityFeePerGas: '1000000000',
    gasLimit: '40000',
    value: new BigNumber('0.001').multipliedBy('1e18').toString(10),
    data: '0x',
  });
  console.log('tx', tx);
  const rawTx = await signer.signTransaction(tx);
  console.log('rawTx', rawTx);
  return rawTx;
}

export async function broadcast(tx: string) {
  console.log(`
    curl --location ${selectedNetwork.rpc} \\
    --header 'Content-Type: application/json' \\
    --data '{
      "jsonrpc":"2.0",
      "method":"eth_sendRawTransaction",
      "params":["${tx}"],
      "id":1
    }'
  `);
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  const result = await provider.broadcastTransaction(tx);
  console.log(`broadcastTransaction result \n ${JSON.stringify(result)}`);
  console.log(`${selectedNetwork.explorer}tx/${result.hash}`);
}

export async function makeRPCCall(method: string, params: any[] = []): Promise<any> {
  const response = await axios.post(
    selectedNetwork.rpc,
    {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    },
  );

  if (response.data.error) {
    throw new Error(`RPC Error: ${response.data.error.message}`);
  }
  return response.data.result;
}

export async function getERC20Balance(tokenAddress: string, walletAddress: string, decimals = 18) {
  try {
    const client = await getClient();
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
    ];
    const contract = new ethers.Contract(tokenAddress, abi, client);

    const [balance, name, symbol, tokenDecimals, nativeBalance] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.name().catch(() => 'Unknown'),
      contract.symbol().catch(() => 'Unknown'),
      contract.decimals().catch(() => decimals),
      client.getBalance(walletAddress),
    ]);

    const formattedERC20Balance = ethers.formatUnits(balance, tokenDecimals);

    console.log('---------------- Token Info ----------------');
    console.log(`Token Address: ${tokenAddress}`);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Token Decimals: ${tokenDecimals}`);
    console.log('--------------------------------------------');
    console.log('|');
    console.log(`walletAddress: ${walletAddress}`);
    console.log('|');
    console.log('native');
    console.log('balance');
    console.log('nativeBalance');
    console.log(ethers.formatEther(nativeBalance).toString());
    console.log('|');
    console.log('|');
    console.log(walletAddress);
    console.log('|');
    console.log(symbol);
    console.log('balance');
    console.log(balance.toString());
    console.log('|');
    console.log(symbol);
    console.log('|');
    console.log(formattedERC20Balance);
    console.log('|');
    console.log(symbol);
    console.log('|');

    return {
      tokenAddress,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals,
      walletAddress,
    };
  } catch (error) {
    console.error('Error querying ERC20 balance:', error);
    throw error;
  }
}

export async function createERC20() {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);
  const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY || '', provider);
  console.log('signer', signer.address);
}

export async function decodeTransactionReceipt(transactionHash: string) {
  const provider = new ethers.JsonRpcProvider(selectedNetwork.rpc);

  try {
    // Fetch transaction and receipt
    const [transaction, receipt] = await Promise.all([
      provider.getTransaction(transactionHash),
      provider.getTransactionReceipt(transactionHash),
    ]);

    if (!transaction || !receipt) {
      throw new Error(`Transaction ${transactionHash} not found`);
    }

    const result: any = {
      transactionHash,
      transaction: {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value.toString(),
        valueInEth: transaction.value ? ethers.formatEther(transaction.value) : '0',
        gasLimit: transaction.gasLimit.toString(),
        gasPrice: transaction.gasPrice?.toString(),
        maxFeePerGas: transaction.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
        nonce: transaction.nonce,
        type: transaction.type,
        data: transaction.data,
        chainId: transaction.chainId?.toString(),
      },
      receipt: {
        status: receipt.status,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: (receipt as any).effectiveGasPrice?.toString() || null,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        contractAddress: receipt.contractAddress,
        logs: receipt.logs,
      },
      decodedInput: null as any,
      decodedLogs: [] as any[],
      summary: {
        success: receipt.status === 1,
        isContractInteraction: transaction.to !== null && transaction.data !== '0x',
        isContractCreation: transaction.to === null,
        isSimpleTransfer: transaction.data === '0x' || transaction.data === '',
        logCount: receipt.logs.length,
      },
    };

    // Decode input data if it exists and isn't just '0x'
    if (transaction.data && transaction.data !== '0x' && transaction.data.length > 2) {
      result.decodedInput = await decodeInputData(transaction.data, transaction.to);
    }

    // Decode event logs
    if (receipt.logs && receipt.logs.length > 0) {
      result.decodedLogs = await decodeLogs(Array.from(receipt.logs));
    }

    console.log('=== Decoded Transaction Receipt ===');
    console.log(`Hash: ${transactionHash}`);
    console.log(`Status: ${result.summary.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`From: ${result.transaction.from}`);
    console.log(`To: ${result.transaction.to || 'Contract Creation'}`);
    console.log(`Value: ${result.transaction.valueInEth} ETH`);
    console.log(`Gas Used: ${result.receipt.gasUsed}`);
    console.log(`Block: ${result.receipt.blockNumber}`);

    if (result.summary.isContractInteraction || result.summary.isContractCreation) {
      console.log('=== Contract Interaction ===');
      if (result.decodedInput) {
        console.log('Decoded Input:', JSON.stringify(result.decodedInput, null, 2));
      } else {
        console.log('Raw Input:', result.transaction.data);
      }
    }

    if (result.decodedLogs.length > 0) {
      console.log('=== Decoded Event Logs ===');
      result.decodedLogs.forEach((log: any, index: number) => {
        console.log(`Log ${index}:`, JSON.stringify(log, null, 2));
      });
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error decoding transaction receipt: ${message}`);
    throw error;
  }
}

export function genAddress() {
  const wallet = ethers.Wallet.createRandom();
  console.log('wallet', wallet);
}

export const getBalance = async (address: string, index = 0) => {
  const client = await getClient();
  const balance = await client.getBalance(address);
  console.log(`${index} | ${address} | ${ethers.formatEther(balance)} ETH`);
  return balance;
};
