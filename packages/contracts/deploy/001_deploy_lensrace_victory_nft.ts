import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getConstantsFor } from '../shared/deploymentConstants'

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  console.log(`deployer: ${deployer}…`)

  const { VictoryNftBaseUri } = getConstantsFor(network.name)
  if (!VictoryNftBaseUri) {
    throw new Error(`No VictoryNftBaseUri constant for network ${hre.network.name}`)
  }

  await deploy('LensraceVictoryNFT', {
    from: deployer,
    args: [VictoryNftBaseUri],
    log: true,
  })
}
func.tags = ['LensraceVictoryNFT']
export default func
