import chai = require('chai')
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity,
} from 'ethereum-waffle'
import * as Aggregator from '../build/Aggregator.json'
import * as BasicTokenMock from '../build/BasicTokenMock.json'

/* External Imports */
const Web3 = require('web3')
declare var require: any

// "Web3.givenProvider" will be set in a Ethereum supported browser.
const web3 = new Web3('http://localhost:8545')


chai.use(solidity)
const { expect } = chai

describe('Creates Aggregator and checks that fields are properly assigned', () => {
  const provider = createMockProvider()
  const [wallet] = getWallets(provider)
  let aggregator
  let token

  beforeEach(async () => {
    const authenticationAddress = await wallet.getAddress()
    const id = 121
    aggregator = await deployContract(
      wallet,
      Aggregator,
      [authenticationAddress, id],
      { gasLimit: 6700000 }
    )
  })

  it('Assigns AuthenticationAddress to Aggregator', async () => {
    expect(await aggregator.authenticationAddress()).to.eq(
      await wallet.getAddress()
    )
  })

  it('Creates commitment chain', async () => {
    expect(await aggregator.commitmentChain()).to.exist
  })

  it('Creates deposit contract', async () => {
    token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000])
    await aggregator.addDepositContract(token)
    // console.log("hey : " + aggregator.depositContracts[0])
    // expect(await aggregator.depositContracts[0]).to.eq(address(token))
  })

  it('Assigns ID to Aggregator', async () => {
    expect(await aggregator.id()).to.eq(121)
  })

  it('Assigns and deletes IP in Metadata', async () => {
    const addr = '0x00000000000000000000000987654321'
    await aggregator.setMetadata(addr, 'heyo')
    expect(await aggregator.metadata(addr)).to.eq('heyo')
    await aggregator.deleteMetadata(addr)
    expect(await aggregator.metadata(addr)).to.eq('')
  })
})
