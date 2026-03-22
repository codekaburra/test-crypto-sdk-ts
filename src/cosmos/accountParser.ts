import { accountFromAny } from '@cosmjs/stargate';
import type { Account } from '@cosmjs/stargate';

const INJECTIVE_ETH_ACCOUNT = '/injective.types.v1beta1.EthAccount';

type AnyAccountInput = {
  typeUrl?: string;
  value?: Uint8Array;
  address?: string;
  pubkey?: unknown;
  account_number?: string | number;
  sequence?: string | number;
};

/**
 * Parse account from REST `Any` JSON (e.g. Injective `EthAccount`).
 */
export function parseCosmosAccountAny(input: AnyAccountInput): Account {
  const typeUrl = input.typeUrl ?? '';

  if (typeUrl === INJECTIVE_ETH_ACCOUNT) {
    return {
      address: input.address ?? '',
      pubkey: (input.pubkey as Account['pubkey']) ?? null,
      accountNumber: parseInt(String(input.account_number ?? '0'), 10),
      sequence: parseInt(String(input.sequence ?? '0'), 10),
    };
  }

  try {
    return accountFromAny({
      typeUrl,
      value: input.value ?? new Uint8Array(),
    });
  } catch {
    return {
      address: input.address ?? '',
      pubkey: null,
      accountNumber: 0,
      sequence: 0,
    };
  }
}
