import { run as runCosmos } from './cosmos/rest-api';
import 'dotenv/config';

export const main = async () => {
  const args = process.argv.slice(2);
  console.log(args);
  if (args.length === 0) {
    console.log('missing command & argument');
    return;
  }
  const [command, ...commandArgs] = args;
  switch (command) {
  case 'cosmos':
    await runCosmos(commandArgs);
    break;
  default:
    console.log('invalid command');
  }
};

main();