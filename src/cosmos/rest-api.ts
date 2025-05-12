import axios from 'axios';
import cosmosNetworks from '../networks/cosmos.json';

const { restApi, addresses } = cosmosNetworks.cosmosMainnet;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const run = async (_args: string[]) => {
  // await getAccountInfo(addresses[0]);
  // await getAccountBalance(addresses[0]);
  // await getTransaction('23F11303A504083A874F6744A74EB2FEE25C47C5543A143F4B1550B3A5E162F5');
  await getAddressInfo(addresses[0]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getApi = async (url: string, data: any) => {
  console.log(url);
  return axios.get(url, data).then((result) => {
    return result.data;
  });
};

export const getTransaction = async (transactionHash: string) => {
  const result = await getApi(
    `${restApi}/cosmos/tx/v1beta1/txs/${transactionHash}`,
    {}
  );
  console.log(result);
  return result;
};
export const getAccountBalance = async (address: string) => {
  const result = await getApi(
    `${restApi}/cosmos/bank/v1beta1/balances/${address}`,
    {}
  );
  console.log(result);
  return result;
};
export const getAccountInfo = async (address: string) => {
  const result = await getApi(
    `${restApi}/cosmos/auth/v1beta1/account_info/${address}`,
    {}
  );
  return result.info;
};
export const broadcastTransaction = async (txBytes: string) => {
  /*
  curl -X POST \
    -H "Content-Type: application/json" \
    -d'{"tx_bytes":"{{txBytes}}","mode":"BROADCAST_MODE_SYNC"}' \
    localhost:1317/cosmos/tx/v1beta1/txs
*/
  console.log('broadcastTransaction ', txBytes);
  return axios.post(`${restApi}/cosmos/tx/v1beta1/txs`,
    {
      tx_bytes: txBytes,
      mode: 'BROADCAST_MODE_SYNC'
    }
  ).then((result) => {
    return result.data;
  });
};

export const getAddressInfo = async (address: string) => {
  const accountInfo = await getAccountInfo(address);
  const balance = await getAccountBalance(address);
  if (accountInfo) {
    console.log(`${address} | ${accountInfo.account_number} | sequence ${accountInfo.sequence} `, balance);
  }
};
/**
/cosmos/auth/v1beta1/accounts
/cosmos/auth/v1beta1/accounts/{address}
/cosmos/auth/v1beta1/params
/cosmos/authz/v1beta1/grants
/cosmos/authz/v1beta1/grants/grantee/{grantee}
/cosmos/authz/v1beta1/grants/granter/{granter}
/cosmos/bank/v1beta1/balances/{address}
/cosmos/bank/v1beta1/balances/{address}/by_denom
/cosmos/bank/v1beta1/denoms_metadata
/cosmos/bank/v1beta1/denoms_metadata/{denom}
/cosmos/bank/v1beta1/params
/cosmos/bank/v1beta1/spendable_balances/{address}
/cosmos/bank/v1beta1/supply
/cosmos/bank/v1beta1/supply/by_denom
/cosmos/base/tendermint/v1beta1/blocks/{height}
/cosmos/base/tendermint/v1beta1/blocks/latest
/cosmos/base/tendermint/v1beta1/node_info
/cosmos/base/tendermint/v1beta1/syncing
/cosmos/base/tendermint/v1beta1/validatorsets/{height}
/cosmos/base/tendermint/v1beta1/validatorsets/latest
/cosmos/distribution/v1beta1/community_pool
/cosmos/distribution/v1beta1/delegators/{delegator_address}/rewards
/cosmos/distribution/v1beta1/params
/cosmos/distribution/v1beta1/validators/{validator_address}/slashes
/cosmos/evidence/v1beta1/evidence
/cosmos/evidence/v1beta1/evidence/{hash}
/cosmos/feegrant/v1beta1/allowance/{granter}/{grantee}
/cosmos/feegrant/v1beta1/allowances/{grantee}
/cosmos/feegrant/v1beta1/issued/{granter}
/cosmos/gov/v1/proposals/{proposal_id}/votes/{voter}
/cosmos/gov/v1beta1/params/{params_type}
/cosmos/gov/v1beta1/proposals
/cosmos/gov/v1beta1/proposals/{proposal_id}
/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits
/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits/{depositor}
/cosmos/gov/v1beta1/proposals/{proposal_id}/tally
/cosmos/gov/v1beta1/proposals/{proposal_id}/votes
/cosmos/slashing/v1beta1/params
/cosmos/slashing/v1beta1/signing_infos
/cosmos/staking/v1beta1/delegations/{delegator_addr}
/cosmos/staking/v1beta1/delegators/{delegator_addr}/redelegations
/cosmos/staking/v1beta1/delegators/{delegator_addr}/validators
/cosmos/staking/v1beta1/params
/cosmos/staking/v1beta1/pool
/cosmos/staking/v1beta1/validators
/cosmos/staking/v1beta1/validators/{validator_addr}
/cosmos/staking/v1beta1/validators/{validator_addr}/delegations
/cosmos/tx/v1beta1/txs/block/{height}
/cosmos/tx/v1beta1/txs/{hash}
/cosmos/tx/v1beta1/simulate
/cosmos/tx/v1beta1/txs
/cosmos/upgrade/v1beta1/applied_plan/{name}
/cosmos/upgrade/v1beta1/current_plan
/cosmos/upgrade/v1beta1/module_versions
 */