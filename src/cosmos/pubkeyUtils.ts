import { toBech32 } from '@cosmjs/encoding';
import crypto from 'crypto';
import { ethers } from 'ethers';
import { CosmosPublicKeyTypeUrl } from './types';

/**
 * Derives a bech32 address from a compressed public key and its type URL.
 *
 * @param pubKeyHex - Compressed public key as a hex string (with or without 0x prefix)
 * @param typeUrl - Public key algorithm identified by its Cosmos type URL (use CosmosPublicKeyTypeUrl enum)
 * @param prefix - Bech32 human-readable prefix (e.g. "cosmos", "inj", "mantra")
 * @returns Bech32-encoded address
 */
export function deriveAddressFromPubKey(
  pubKeyHex: string,
  typeUrl: CosmosPublicKeyTypeUrl,
  prefix: string,
): string {
  const pubKeyBytes = Buffer.from(pubKeyHex.replace(/^0x/i, ''), 'hex');

  switch (typeUrl) {
    case CosmosPublicKeyTypeUrl.Secp256k1: {
      // RIPEMD160(SHA256(pubkey))
      const sha256Hash = crypto.createHash('sha256').update(pubKeyBytes).digest();
      const addressBytes = crypto.createHash('ripemd160').update(sha256Hash).digest();
      return toBech32(prefix, addressBytes);
    }

    case CosmosPublicKeyTypeUrl.Ed25519: {
      // First 20 bytes of SHA256(pubkey)
      const sha256Hash = crypto.createHash('sha256').update(pubKeyBytes).digest();
      return toBech32(prefix, sha256Hash.subarray(0, 20));
    }

    case CosmosPublicKeyTypeUrl.EthSecp256k1Ethermint:
    case CosmosPublicKeyTypeUrl.EthSecp256k1Injective: {
      // keccak256 of uncompressed pubkey (64 bytes, without 0x04 prefix), take last 20 bytes
      const uncompressedHex = ethers.SigningKey.computePublicKey(pubKeyBytes, false);
      const rawPubKeyBytes = Buffer.from(uncompressedHex.slice(4), 'hex');
      const keccakHash = ethers.keccak256(rawPubKeyBytes);
      // keccakHash = '0x' + 64 hex chars -> last 20 bytes = last 40 hex chars
      const addressBytes = Buffer.from(keccakHash.slice(-40), 'hex');
      return toBech32(prefix, addressBytes);
    }

    default:
      throw new Error(`Unsupported public key type: ${typeUrl}`);
  }
}

/**
 * Derives a checksummed EVM (0x) address from a compressed secp256k1 public key.
 * keccak256(uncompressed_pubkey_without_prefix)[12:]
 */
export function deriveEvmAddress(pubKeyHex: string): string {
  const pubKeyBytes = Buffer.from(pubKeyHex.replace(/^0x/i, ''), 'hex');
  const uncompressedHex = ethers.SigningKey.computePublicKey(pubKeyBytes, false);
  const rawPubKeyBytes = Buffer.from(uncompressedHex.slice(4), 'hex');
  const keccakHash = ethers.keccak256(rawPubKeyBytes);
  return ethers.getAddress('0x' + keccakHash.slice(-40));
}
