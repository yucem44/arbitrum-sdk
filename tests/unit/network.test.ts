import { getL1Network, addCustomNetwork, getL2Network } from '../../src'

import { expect } from 'chai'
import { getNetwork } from '../../src/lib/dataEntities/networks'

const mainnetId = 1
const arbOneId = 42161
const mockOrbitChainId = 99999999

describe('Network', () => {
  const fetchErrorMessage =
    'Network fetched successfully but the chain ID is invalid.'

  it('Adds a custom Orbit chain', async function () {
    const arbOneNetwork = await getL2Network(arbOneId)

    addCustomNetwork({
      customL2Network: {
        // we partially copy Arbitrum One network because we only want to mimic a custom chain
        ...arbOneNetwork,
        chainID: mockOrbitChainId,
        partnerChainID: arbOneId,
        isArbitrum: true,
        isCustom: true,
        isOrbit: true,
      },
    })
  })

  it('Successfully fetches an L1 network with `getL1Network`', async function () {
    const network = await getL1Network(mainnetId)
    expect(network.chainID, fetchErrorMessage).to.be.eq(mainnetId)
  })

  it('Fails to fetch an L2 network with `getL1Network`', async function () {
    let network
    try {
      network = await getL1Network(arbOneId)
    } catch (err) {
      // should fail
      expect(err).to.be.an('error')
      expect((err as Error).message).to.be.eq(
        `Unrecognized network ${arbOneId}.`
      )
    } finally {
      expect(network, '`getL1Network` returned a result for an L2 network.').to
        .be.undefined
    }
  })

  it('Successfully fetches an L2 network with `getL2Network`', async function () {
    const network = await getL2Network(arbOneId)
    expect(network.chainID, fetchErrorMessage).to.be.eq(arbOneId)
  })

  it('Fails to fetch an L1 network with `getL2Network`', async function () {
    let network
    try {
      network = await getL2Network(mainnetId)
    } catch (err) {
      // should fail
      expect(err).to.be.an('error')
      expect((err as Error).message).to.be.eq(
        `Unrecognized network ${mainnetId}.`
      )
    } finally {
      expect(network, '`getL2Network` returned a result for an L1 network.').to
        .be.undefined
    }
  })

  it('Successfully fetches a parent chain with `getNetwork`', async function () {
    const parentChain = await getNetwork(arbOneId)
    expect(parentChain.chainID, fetchErrorMessage).to.be.eq(arbOneId)
  })

  it('Fails to fetch an Orbit chain with `getNetwork`', async function () {
    let parentChain
    try {
      parentChain = await getNetwork(mockOrbitChainId, 1)
    } catch (err) {
      // should fail
      expect(err).to.be.an('error')
      expect((err as Error).message).to.be.eq(
        `Unrecognized network ${mockOrbitChainId}.`
      )
    } finally {
      expect(parentChain, '`getNetwork` returned a result for an Orbit chain.')
        .to.be.undefined
    }
  })

  it('Successfully fetches an Orbit chain with `getNetwork`', async function () {
    const chain = await getNetwork(mockOrbitChainId)
    expect(chain.chainID, fetchErrorMessage).to.be.eq(mockOrbitChainId)
  })

  it('Fails to fetch a parent chain with `getNetwork`', async function () {
    let chain
    try {
      chain = await getNetwork(mainnetId, 2)
    } catch (err) {
      // should fail
      expect(err).to.be.an('error')
      expect((err as Error).message).to.be.eq(
        `Unrecognized network ${mainnetId}.`
      )
    } finally {
      expect(chain, '`getNetwork` returned a result for a parent chain.').to.be
        .undefined
    }
  })
})
