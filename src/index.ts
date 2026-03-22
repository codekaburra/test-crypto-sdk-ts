import 'dotenv/config';
import BigNumber from 'bignumber.js';

// Import chain modules
import { run as testCosmos } from './cosmos/cosmosBase';
import { run as testEvm } from './evm/evm';
import { run as testPolkadot } from './polkadot/polkadot';
import { run as testEos } from './eos/eosBase';
import { run as testNano } from './nano';
import { run as testTron } from './tron/tronBase';
import { run as testCasper } from './casper/index';
import { run as testAptos } from './aptos/index';
import { run as testSolana } from './solana';
import { run as testIcx } from './icon/icx';
import { run as testHarmony } from './harmony/harmonyBase';
import { run as testEvmErc20 } from './evm/evmErc20';

/**
 * Main entry point for the "playground" CLI and API server.
 * DISPATCHER / ROUTING — this is where CLI arguments are routed.
 */
const testing = async () => {
  console.log('--- [START] ---');
  const args = process.argv.slice(2); // Get command line arguments
  if (args.length === 0) {
    console.log('No arguments provided.');
    return;
  }

  console.log('args:', args);
  const [command, ...commandArgs] = args;

  switch (command) {
    case 'tobase': {
      const input = '1';
      const decimals = 12;
      console.log(`${input} -> ${(new BigNumber(input).shiftedBy(decimals)).toString(10)}`);
      break;
    }
    case 'tonormal': {
      const input = '125000000000';
      const decimals = 18;
      console.log(`${input} -> ${(new BigNumber(input).shiftedBy(-decimals)).toString(10)}`);
      break;
    }
    case 'evm':
      await testEvm(commandArgs);
      break;
    case 'evm-erc20':
      await testEvmErc20(commandArgs);
      break;
    case 'nano':
      await testNano(commandArgs);
      break;
    case 'cosmos':
      await testCosmos(commandArgs);
      break;
    case 'casper':
      await testCasper(commandArgs);
      break;
    case 'eos':
      await testEos(commandArgs);
      break;
    case 'aptos':
      await testAptos(commandArgs);
      break;
    case 'polkadot':
      await testPolkadot(commandArgs);
      break;
    case 'bridgeUSDCEvmToAptos':
      // await bridgeUSDCEvmToAptos();
      break;
    case 'solana':
      await testSolana(commandArgs);
      break;
    case 'icx':
      await testIcx(commandArgs);
      break;
    case 'tron':
      await testTron(commandArgs);
      break;
    case 'one':
      await testHarmony(commandArgs);
      break;
    case 'server': {
      // Lazy-load Express only when needed
      const { default: serverApp } = await import('./index_api');
      console.log('🚀 Starting API server...');
      const PORT = Number(process.env.PORT) || 3000;
      serverApp.listen(PORT, () => {
        console.log(`🚀 API Server running on port ${PORT}`);
      });
      break;
    }
    default:
      console.log(`Unknown command: ${command}`);
      break;
  }

  console.log('--- [END] ---');
};

export default testing;

if (require.main === module) {
  testing().catch((err) => {
    console.error('Fatal Error:', err);
    process.exit(1);
  });
}
