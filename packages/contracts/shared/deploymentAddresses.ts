export enum NetworkKeys {
  hardhat = 'hardhat',
  mumbai = 'mumbai',
  polygon = 'polygon',
}

export enum AddressesKeys {
  LensHub = 'LensHub',
}

export type AddressesType = { [_ in AddressesKeys]?: string }
export type AllAddressesType = { [_ in AddressesKeys]: { [_ in NetworkKeys]: string } }

export const allAddresses: AllAddressesType = {
  [AddressesKeys.LensHub]: {
    [NetworkKeys.hardhat]: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
    [NetworkKeys.mumbai]: '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82',
    [NetworkKeys.polygon]: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
  },
}

export const getAddressesFor = (network: NetworkKeys | string): AddressesType => {
  return Object.entries(allAddresses).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value[network as NetworkKeys],
    }),
    {},
  ) as AddressesType
}
