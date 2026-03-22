import BigNumber from 'bignumber.js';
import fs from 'fs';

export function u512ToByteArray(value: bigint): Uint8Array {
  const byteArray = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    byteArray[63 - i] = Number(value & BigInt(0xff));
    value = value >> BigInt(8);
  }
  return byteArray;
}

export function uint8ArrayToHex(array: Uint8Array): string {
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function hexStringToUint8Array(hex: string): Uint8Array {
  const length = hex.length / 2;
  const byteArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    byteArray[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return byteArray;
}

export function numberToBytes(number: number): Uint8Array {
  const bytes = [];
  for (let i = 7; i >= 0; i--) {
    bytes[i] = number & 0xff;
    number >>= 8;
  }
  return new Uint8Array(bytes);
}

export function bytesToHexString(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => ('0' + byte.toString(16)).slice(-2))
    .join('');
}

export function numberToHexString(number: number): string {
  return number.toString(16).padStart(14, '0');
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const saveToTextFile = (data: string, filename: string): void => {
  fs.writeFileSync(filename, data);
};

export const logPercentage = (value: string | number | BigNumber, total: string | number | BigNumber): string => {
  return `${new BigNumber(value).div(total).multipliedBy(100).toFixed(2)}% \t (${value.toString()}/${total.toString()})`;
};

export const toBaseUnit = (amount: string | number | BigNumber, decimals: number) => {
  return new BigNumber(amount).shiftedBy(decimals);
};

export const toReadableUnit = (amount: string | number | BigNumber, decimals: number) => {
  return new BigNumber(amount).shiftedBy(-decimals);
};
