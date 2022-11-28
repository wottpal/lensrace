import { LensProfile } from './LensProfile.model'

export class Race {
  public id: string
  public name: string
  public followerGoal: number
  public contractAddress: string
  public participants: LensProfile[]

  constructor(args: {
    name: string
    id: string
    followerGoal: number
    contractAddress: string
    participants: LensProfile[]
  }) {
    this.name = args.name
    this.id = args.id
    this.followerGoal = args.followerGoal
    this.contractAddress = args.contractAddress
    this.participants = args.participants
  }
}

export const raceData: Race[] = [
  new Race({
    name: 'Road to Glory',
    id: '2',
    followerGoal: 10000,
    contractAddress: '0x123456789',
    participants: [
      new LensProfile({
        name: 'Stani',
        avatar:
          'https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafkreidxilha4jw7w3r2ksgzdy4vlshiefi6e3zaymd7z65223iscibfwu',
      }),
      new LensProfile({
        name: 'Nader Dabit',
        avatar:
          'https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmVBfhfgfhGsRVxTNURVUgceqyzjdVe11ic5rCghmePuKX',
      }),
      new LensProfile({
        name: 'Nicolo',
        avatar:
          'https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmZbUEcUg4zLPXJzzFxzPZ5vmS2TJRarZoZSL81fQrvKSW',
      }),
    ],
  }),
  new Race({
    name: 'Race #1',
    id: '1',
    followerGoal: 150,
    contractAddress: '0x123456789',
    participants: [
      new LensProfile({
        name: 'Dennis ◆ zoma.eth',
        avatar:
          'https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafkreiaarkx7narcvadoeywxprau4anhcqf3za4ytaeyv2n6svcvh6w234',
      }),
      new LensProfile({
        name: 'cryptoneur.eth',
        avatar:
          'https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmYCmXvYxhTpQSYeUDW2nDKGLdzqH5AX5qKVDUysfDSAUe',
      }),
    ],
  }),
]
