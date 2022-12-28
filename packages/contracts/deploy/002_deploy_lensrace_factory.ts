import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddressesFor } from '../shared/deploymentAddresses'

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, execute } = deployments

  const { deployer } = await getNamedAccounts()
  console.log(`deployer: ${deployer}…`)

  const { LensHub } = getAddressesFor(network.name)
  if (!LensHub) {
    throw new Error(`No LensHub address for network ${hre.network.name}`)
  }

  const victoryNft = await hre.deployments.get('LensraceVictoryNFT')
  if (!victoryNft?.address) {
    throw new Error(`LensraceVictoryNFT deployment failed`)
  }

  // Deploy LensraceFactory
  const factory = await deploy('LensraceFactory', {
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [LensHub],
        },
      },
    },
    log: true,
  })
  if (factory.receipt?.status !== 1 || !factory.address) {
    throw new Error(`LensraceFactory deployment failed`)
  }

  // Set address of deployed LensraceVictoryNFT
  console.log(`Setting LensraceVictoryNFT address (${victoryNft.address}) on LensraceFactory…`)
  let receipt = await execute(
    'LensraceFactory',
    { from: deployer, log: true },
    'setRaceNft',
    victoryNft.address,
  )
  if (receipt.status !== 1) {
    throw new Error(`Call to 'setRaceNft' failed`)
  }

  // Grant LensraceFactory access on deployed LensraceVictoryNFT
  console.log(`Granting LensraceFactory access on LensraceVictoryNFT`)
  receipt = await execute(
    'LensraceVictoryNFT',
    { from: deployer, log: true },
    'grantFactoryRole',
    factory.address,
  )
  if (receipt.status !== 1) {
    throw new Error(`Call to 'grantFactoryRole' failed`)
  }
}
func.dependencies = ['LensraceVictoryNFT']
func.tags = ['LensraceFactory']
export default func
