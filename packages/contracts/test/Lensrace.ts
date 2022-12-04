import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, constants, Contract, ContractFactory } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { RevertReasons } from '../shared/revertReasons'
import { ILensHub__factory, Lensrace__factory } from '../typechain-types'

/**
 * Constants & Global Variables
 */
const LENSHUB_ADDRESS = getAddress('0xdb46d1dc155634fbc732f92e853b10b288ad5a1d')
const RANDOM_LENS_PROFILE_OWNER = getAddress('0xc86cd9f65300189019f6ac1bf90422e45f524cfb')

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

describe('Lensrace', function () {
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

  it('it should not deploy a race with nonexistent profile-ids', async () => {
    await expect(contract.deployRace([994, 1239291391391239], '', 100)).to.be.revertedWith(
      RevertReasons.NotAllProfileIdsExist,
    )
  })

  it('it should correctly set race attributes', async () => {
    const profileIds = [1208, 994]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)
    expect(await race.raceName()).to.equal(raceName)
    expect(await race.followerGoal()).to.equal(followerGoal)
    expect(await race.getProfileIds()).to.deep.equal(profileIds.map((id) => BigNumber.from(id)))
  })

  it('it should not settle before reached goal', async () => {
    const profileIds = [1208, 994]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)
    await expect(race.settle({ gasLimit: 150000 + 25000 * profileIds.length })).to.be.revertedWith(
      RevertReasons.RaceGoalNotReached,
    )
    expect(await race.hasSettled()).to.equal(false)
    expect(await race.winningProfileId()).to.equal(0)
  })

  it('it should settle and declare winner correctly', async () => {
    const profileIds = [1208, 994]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)

    // Give #994 an extra follow to reach 100
    await impersonateAccount(RANDOM_LENS_PROFILE_OWNER)
    const profileOwner = await ethers.getSigner(RANDOM_LENS_PROFILE_OWNER)
    const lensHub = ILensHub__factory.connect(LENSHUB_ADDRESS, profileOwner)
    await lensHub.follow([994], [[]])

    // Race settling should go though and declare #994
    await expect(race.settle({ gasLimit: 150000 + 25000 * profileIds.length }))
      .to.emit(race, 'RaceSettled')
      .withArgs(994, 100)

    expect(await race.hasSettled()).to.equal(true)
    expect(await race.winningProfileId()).to.equal(994)
  })
})
