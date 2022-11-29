import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, constants, Contract, ContractFactory } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { Lensrace__factory } from '../typechain-types'

/**
 * Constants & Global Variables
 */
const LENSHUB_ADDRESS = getAddress('0xdb46d1dc155634fbc732f92e853b10b288ad5a1d')

let LensraceFactory: ContractFactory
let contract: Contract
let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress
let addrs: SignerWithAddress[]

/**
 * Test Initialization (Deployment)
 */

beforeEach(async () => {
  ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  LensraceFactory = await ethers.getContractFactory('LensraceFactory')
  contract = await LensraceFactory.deploy(LENSHUB_ADDRESS)
})

describe('Lensrace', function() {
  const deployRace = async (profileIds: number[], raceName: string, followerGoal: number) => {
    const deployRaceTx = await contract.deployRace(profileIds, raceName, followerGoal)
    let raceAddress = constants.AddressZero
    await expect(deployRaceTx)
      .to.emit(contract, 'RaceDeployed')
      .withArgs((_raceAddress: string) => {
        raceAddress = _raceAddress
        return true
      })
    expect(raceAddress).to.not.equal(constants.AddressZero)
    const race = Lensrace__factory.connect(raceAddress, owner)
    return { race, raceAddress }
  }

  it('it should have the correct lenshub address', async () => {
    expect(await contract.lensHub()).to.equals(LENSHUB_ADDRESS)
  })

  it('it should correctly deploy & store a race', async () => {
    expect(await contract.racesLength()).to.equal(0)
    const { raceAddress } = await deployRace([], '', 0)
    expect(await contract.racesLength()).to.equal(1)
    const latestRace = await contract.races(0)
    expect(raceAddress).to.equal(latestRace)
  })

  it('it should correctly set race attributes', async () => {
    const profileIds = [1208, 994]
    const raceName = 'Epic Race'
    const followerGoal = 69
    const { race } = await deployRace(profileIds, raceName, followerGoal)
    expect(await race.raceName()).to.equal(raceName)
    expect(await race.followerGoal()).to.equal(followerGoal)
    expect(await race.getProfileIds()).to.deep.equal(profileIds.map(id => BigNumber.from(id)))
  })
})
