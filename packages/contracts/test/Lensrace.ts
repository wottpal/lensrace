/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { impersonateAccount } from '@nomicfoundation/hardhat-network-helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, constants, Contract, ContractFactory } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ethers, network, upgrades } from 'hardhat'
import { AddressesType, getAddressesFor } from '../shared/deploymentAddresses'
import { RevertReasons } from '../shared/revertReasons'
import { ILensHub__factory, Lensrace__factory } from '../typechain-types'

/**
 * Constants & Global Variables
 */
const LENS_PROFILE_ID_99_FOLLOWERS = 994
const OWNER_LENS_PROFILE_ID_99_FOLLOWERS = getAddress('0xd761d5368B3445d2D553a34Fa680e7E5Ed8fD28B')
const RANDOM_LENS_PROFILE_OWNER = getAddress('0xc86cd9f65300189019f6ac1bf90422e45f524cfb')

let addresses: AddressesType
let LensraceFactory: ContractFactory
let factory: Contract
let LensraceVictoryNFT: ContractFactory
let raceNft: Contract

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress
let addr3: SignerWithAddress
let addrs: SignerWithAddress[]

/**
 * Test Initialization: Deploys `LensraceFactory` & `LensraceVictoryNFT`
 */
beforeEach(async () => {
  ;[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
  addresses = getAddressesFor(parseInt(await getChainId()))

  LensraceFactory = await ethers.getContractFactory('LensraceFactory')
  factory = await upgrades.deployProxy(LensraceFactory, [addresses.LensHub])
  await factory.deployed()

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
    expect(await factory.lensHub()).to.equals(addresses.LensHub)
  })

  it('it should not deploy factory without a given lenshub address', async () => {
    await expect(upgrades.deployProxy(LensraceFactory, [constants.AddressZero])).to.be.revertedWith(
      RevertReasons.LensHubAddressEmpty,
    )
  })

  it('it should not deploy a race with empty profileIds', async () => {
    await expect(factory.deployRace([], '', 100)).to.be.revertedWith(RevertReasons.ProfileIdsEmpty)
  })

  it('it should not deploy a race without the raceNft contract set', async () => {
    const factory = await upgrades.deployProxy(LensraceFactory, [addresses.LensHub])
    await factory.deployed()
    await expect(factory.deployRace([LENS_PROFILE_ID_99_FOLLOWERS], '', 100)).to.be.revertedWith(
      RevertReasons.RaceNftAddressEmpty,
    )
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
    await expect(race.initialize(factory.address, [], '', 0)).to.be.revertedWith(
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
    await expect(race.settle({ gasLimit: 250000 + 25000 * profileIds.length })).to.be.revertedWith(
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
    const lensHub = ILensHub__factory.connect(addresses.LensHub!, profileOwner)
    await lensHub.follow([LENS_PROFILE_ID_99_FOLLOWERS], [[]])

    // Race settling should go through and declare profile
    await expect(raceNft.ownerOf(0)).to.be.reverted
    await expect(race.settle({ gasLimit: 250000 + 25000 * profileIds.length }))
      .to.emit(race, 'RaceSettled')
      .withArgs(LENS_PROFILE_ID_99_FOLLOWERS, 100, OWNER_LENS_PROFILE_ID_99_FOLLOWERS, 0)

    expect(await race.hasSettled()).to.equal(true)
    expect(await race.winningProfileId()).to.equal(LENS_PROFILE_ID_99_FOLLOWERS)

    // Check if victory nft was minted successfully
    expect(await raceNft.ownerOf(0)).to.equal(OWNER_LENS_PROFILE_ID_99_FOLLOWERS)
  })

  it('raceNft should successfully grant roles', async () => {
    await expect(raceNft.connect(addr1).grantRaceRole(addr2.address)).to.be.revertedWith(
      RevertReasons.AccountIsMissingRole,
    )
    await expect(raceNft.connect(addr1).grantFactoryRole(addr2.address)).to.be.revertedWith(
      RevertReasons.AccountIsMissingRole,
    )
    await expect(raceNft.connect(addr2).safeMint(addr3.address)).to.be.revertedWith(
      RevertReasons.AccountIsMissingRole,
    )
    await expect(raceNft.connect(owner).grantFactoryRole(addr1.address)).not.to.be.reverted
    await expect(raceNft.connect(addr1).grantRaceRole(addr2.address)).not.to.be.reverted
    await expect(raceNft.connect(addr2).grantRaceRole(addr2.address)).to.be.revertedWith(
      RevertReasons.AccountIsMissingRole,
    )
    await expect(raceNft.connect(addr2).safeMint(addr3.address)).not.to.be.reverted
    await expect(raceNft.connect(addr1).safeMint(addr3.address)).to.be.revertedWith(
      RevertReasons.AccountIsMissingRole,
    )
  })

  it('raceNft should correctly set baseUri', async () => {
    await raceNft.connect(owner).grantFactoryRole(owner.address)
    await raceNft.connect(owner).grantRaceRole(owner.address)
    await expect(raceNft.safeMint(addr1.address))
      .to.emit(raceNft, 'VictoryMinted')
      .withArgs(addr1.address, 0)

    expect(await raceNft.tokenURI(0)).to.be.empty
    const SAMPLE_BASE_URI = 'https://bla.com/'
    await raceNft.setBaseURI(SAMPLE_BASE_URI)
    expect(await raceNft.tokenURI(0)).to.equal(`${SAMPLE_BASE_URI}0`)
  })

  it('raceNft should support erc721 interface', async () => {
    expect(await raceNft.supportsInterface('0x80ac58cd')).to.equal(true)
    expect(await raceNft.supportsInterface('0xffffffff')).to.equal(false)
  })
})
