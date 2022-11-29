import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
dotenv.config()

const accounts = [
  ...(process.env.PRIVATE_KEY_01 ? [`${process.env.PRIVATE_KEY_01}`] : []),
  ...(process.env.PRIVATE_KEY_02 ? [`${process.env.PRIVATE_KEY_02}`] : []),
]

const config: HardhatUserConfig = {
  solidity: '0.8.10',
  networks: {
    hardhat: {
      // chainId: 1337,
      // allowUnlimitedContractSize: false,

      // Polygon Mainnet Fork
      chainId: 137,
      forking: {
        url: process.env.RPC_137 || 'https://rpc.ankr.com/polygon',
        blockNumber: 35934500, // 2022-11-22 evening CET
      },
    },
    mumbai: {
      chainId: 80001,
      url: process.env.RPC_80001 || 'https://rpc.ankr.com/polygon_mumbai',
      accounts,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  verify: {
    etherscan: {
      apiKey: `${process.env.ETHERSCAN_API_KEY}`,
    },
  },
}

export default config
