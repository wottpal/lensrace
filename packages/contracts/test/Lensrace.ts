/* eslint-disable @typescript-eslint/no-unused-vars */

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
const LENS_PROFILE_ID_99_FOLLOWERS = 994
const OWNER_LENS_PROFILE_ID_99_FOLLOWERS = getAddress('0xd761d5368B3445d2D553a34Fa680e7E5Ed8fD28B')
const RANDOM_LENS_PROFILE_OWNER = getAddress('0xc86cd9f65300189019f6ac1bf90422e45f524cfb')

let LensraceFactory: ContractFactory
let factory: Contract
let LensraceVictoryNFT: ContractFactory
let raceNft: Contract

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress
let addrs: SignerWithAddress[]

/**
 * Test Initialization: Deploys `LensraceFactory` & `LensraceVictoryNFT`
 */
beforeEach(async () => {
  ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
  LensraceFactory = await ethers.getContractFactory('LensraceFactory')
  factory = await LensraceFactory.deploy(LENSHUB_ADDRESS)
  LensraceVictoryNFT = await ethers.getContractFactory('LensraceVictoryNFT')
  raceNft = await LensraceVictoryNFT.deploy(factory.address, '')
  await factory.setRaceNft(raceNft.address)
})

describe('Lensrace', function() {
  /// Convenience function to deploye a complete race.
  const deployRace = async (profileIds: number[], raceName: string, followerGoal: number) => {
    const deployRaceTx = await factory.deployRace(profileIds, raceName, followerGoal)
    let raceAddress = constants.AddressZero
    await expect(deployRaceTx)
      .to.emit(factory, 'RaceDeployed')
      .withArgs((_raceAddress: string) => {
        raceAddress = _raceAddress
        return true
      })
    expect(raceAddress).to.not.equal(constants.AddressZero)
    const race = Lensrace__factory.connect(raceAddress, owner)
    return { race, raceAddress }
  }

  it('it should have the correct lenshub address', async () => {
    expect(await factory.lensHub()).to.equals(LENSHUB_ADDRESS)
  })

  it('it should not deploy a race with empty profileIds', async () => {
    await expect(factory.deployRace([], '', 10)).to.be.revertedWith(RevertReasons.ProfileIdsEmpty)
  })

  it('it should correctly deploy & store a race', async () => {
    expect(await factory.racesLength()).to.equal(0)
    const { raceAddress } = await deployRace([LENS_PROFILE_ID_99_FOLLOWERS], '', 100)
    expect(await factory.racesLength()).to.equal(1)
    const latestRace = await factory.races(0)
    expect(raceAddress).to.equal(latestRace)
    const races = await factory.getRaces()
    expect(races).to.deep.equal([raceAddress])
  })

  it('it should be possible to initialize a race only once', async () => {
    const { race } = await deployRace([LENS_PROFILE_ID_99_FOLLOWERS], '', 100)
    await expect(race.init(factory.address, [], '', 0)).to.be.revertedWith(
      RevertReasons.ContractAlreadyInitialized,
    )
  })

  it('it should not deploy a race with nonexistent profile-ids', async () => {
    await expect(
      factory.deployRace([LENS_PROFILE_ID_99_FOLLOWERS, 1239291391391239], '', 100),
    ).to.be.revertedWith(RevertReasons.NotAllProfileIdsExist)
  })

  it('it should not deploy a race with already fulfilled goal', async () => {
    await expect(factory.deployRace([LENS_PROFILE_ID_99_FOLLOWERS], '', 99)).to.be.revertedWith(
      RevertReasons.RaceCanBeSettledOnInit,
    )
  })

  it('it should correctly set race attributes', async () => {
    const profileIds = [1208, LENS_PROFILE_ID_99_FOLLOWERS]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)
    expect(await race.raceName()).to.equal(raceName)
    expect(await race.followerGoal()).to.equal(followerGoal)
    expect(await race.getProfileIds()).to.deep.equal(profileIds.map(id => BigNumber.from(id)))
  })

  it('it should not settle before reached goal', async () => {
    const profileIds = [1208, LENS_PROFILE_ID_99_FOLLOWERS]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)
    await expect(race.settle({ gasLimit: 200000 + 25000 * profileIds.length })).to.be.revertedWith(
      RevertReasons.RaceGoalNotReached,
    )
    expect(await race.hasSettled()).to.equal(false)
    expect(await race.winningProfileId()).to.equal(0)
  })

  it('it should settle and declare winner correctly', async () => {
    const profileIds = [1208, LENS_PROFILE_ID_99_FOLLOWERS]
    const raceName = 'Epic Race'
    const followerGoal = 100
    const { race } = await deployRace(profileIds, raceName, followerGoal)

    // Give profile an extra follow to reach 100
    await impersonateAccount(RANDOM_LENS_PROFILE_OWNER)
    const profileOwner = await ethers.getSigner(RANDOM_LENS_PROFILE_OWNER)
    const lensHub = ILensHub__factory.connect(LENSHUB_ADDRESS, profileOwner)
    await lensHub.follow([LENS_PROFILE_ID_99_FOLLOWERS], [[]])

    // Race settling should go through and declare profile
    await expect(race.settle({ gasLimit: 200000 + 25000 * profileIds.length }))
      .to.emit(race, 'RaceSettled')
      .withArgs(LENS_PROFILE_ID_99_FOLLOWERS, 100, OWNER_LENS_PROFILE_ID_99_FOLLOWERS, 0)

    expect(await race.hasSettled()).to.equal(true)
    expect(await race.winningProfileId()).to.equal(LENS_PROFILE_ID_99_FOLLOWERS)
  })
})
