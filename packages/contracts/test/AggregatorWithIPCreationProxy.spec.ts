import chai = require('chai')
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity,
} from 'ethereum-waffle'
import * as AggregatorWithIPCreationProxy from '../build/AggregatorWithIPCreationProxy.json'
import * as PlasmaRegistry from '../build/PlasmaRegistry.json'

chai.use(solidity)
const { expect } = chai

describe('Create AggregatorWithIPCreationProxy with new PlasmaRegistry', () => {
  const provider = createMockProvider()
  const [wallet] = getWallets(provider)
  let aggregatorWithIPCreationProxy
  let plasmaRegistry

  beforeEach(async () => {
    plasmaRegistry = await deployContract(wallet, PlasmaRegistry, [])
    aggregatorWithIPCreationProxy = await deployContract(
      wallet,
      AggregatorWithIPCreationProxy,
      [
        plasmaRegistry,
        '0x0000000000000000000000000000000000001234',
        await wallet.getAddress(),
      ],
      { gasLimit: 1000258612000000000 }
    )
  })

  it('Creates aggregator and assigns to Plasma Registry', async () => {
    expect(plasmaRegistry.getAggregatorCount()).to.eq(1)
    expect(plasmaRegistry.aggregators[0].metadata.ip).to.eq(
      await wallet.getAddress()
    )
  })

  it('Deletes AggregatorWithIPCreationProxy contract', async () => {
    expect(aggregatorWithIPCreationProxy).to.eq(0)
  })
})

describe('Create AggregatorWithIPCreationProxy with existing PlasmaRegistry', () => {
  const provider = createMockProvider()
  const [wallet] = getWallets(provider)
  let aggregatorWithIPCreationProxy
  let plasmaRegistry

  beforeEach(async () => {
    plasmaRegistry = await deployContract(wallet, PlasmaRegistry, [])
    plasmaRegistry.newAggregator('0x0000000000000000000000000000000123456789')
    aggregatorWithIPCreationProxy = await deployContract(
      wallet,
      AggregatorWithIPCreationProxy,
      [
        plasmaRegistry,
        '0x0000000000000000000000000000000000001234',
        await wallet.getAddress(),
      ]
    )
  })

  it('Creates aggregator and assigns to Plasma Registry', async () => {
    expect(await plasmaRegistry.getAggregatorCount()).to.eq(1)
    expect(await plasmaRegistry.aggregators[0].authenticationAddress).to.eq(
      '0x0000000000000000000000000000000123456789'
    )
    expect(await plasmaRegistry.getAggregatorCount()).to.eq(2)
    expect(await plasmaRegistry.aggregators[1].authenticationAddress).to.eq(
      '0x0000000000000000000000000000000000001234'
    )
  })

  it('Deletes AggregatorWithIPCreationProxy contract', async () => {
    expect(aggregatorWithIPCreationProxy).to.eq(0)
  })
})
