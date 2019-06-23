/* External Imports */
import { ethers } from 'ethers'

/* Internal Imports */
import { add0x, remove0x } from 'src/app'

/* Abi */
export const abi = new ethers.utils.AbiCoder()

/* Crypto */
/**
 * Computes the keccak256 hash of a value.
 * @param value Value to hash
 * @returns the hash of the value.
 */
export const keccak256 = (value: Buffer): Buffer => {
  const preimage = add0x(value.toString('hex'))
  return Buffer.from(remove0x(ethers.utils.keccak256(preimage)), 'hex')
}

export * from './misc'
export * from './range'
export * from './buffer'
