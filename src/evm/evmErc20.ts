import { run as runEvm } from './evm';

export const run = async (args: string[]) => {
  const [command, ...commandArgs] = args;
  switch (command) {
    case 'balance': // npm run dev evm-erc20 balance <walletAddress> <tokenAlias>
      await runEvm(['erc20balance', ...commandArgs]);
      break;
    case 'custom': // npm run dev evm-erc20 custom <tokenAddress> <walletAddress> [decimals]
      await runEvm(['erc20custom', ...commandArgs]);
      break;
    default:
      console.log(`Unknown EVM ERC20 command: ${command}`);
  }
};
