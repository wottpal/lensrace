export enum NetworkKeys {
  hardhat = 'hardhat',
  mumbai = 'mumbai',
  polygon = 'polygon',
}

export enum ConstantsKeys {
  VictoryNftBaseUri = 'VictoryNftBaseUri',
}

export type ConstantsType = { [_ in ConstantsKeys]?: string }
export type AllConstantsType = { [_ in ConstantsKeys]: { [_ in NetworkKeys]: string } }

export const allConstants: AllConstantsType = {
  [ConstantsKeys.VictoryNftBaseUri]: {
    [NetworkKeys.hardhat]: 'https://localhost:3000/api/nft/',
    [NetworkKeys.mumbai]: 'https://dev.lensrace.xyz/api/nft/',
    [NetworkKeys.polygon]: 'https://lensrace.xyz/api/nft/',
  },
}

export const getConstantsFor = (network: NetworkKeys | string): ConstantsType => {
  return Object.entries(allConstants).reduce(
    (acc: any, [key, value]) => ({
      ...acc,
      [key]: value[network as NetworkKeys],
    }),
    {},
  ) as ConstantsType
}
