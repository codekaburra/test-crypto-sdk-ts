import BigNumber from 'bignumber.js';

export const toBaseUnit = (amount: string | number | BigNumber, decimals:  number) => {
  return new BigNumber(amount).shiftedBy(decimals);
};
export const toReadableUnit = (amount: string | number | BigNumber, decimals:  number) => {
  return new BigNumber(amount).shiftedBy(-decimals);
};
