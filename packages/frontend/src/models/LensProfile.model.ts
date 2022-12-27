export class LensProfile {
  public name!: string
  public avatar!: string

  constructor(args: { name: string; avatar: string }) {
    Object.assign(this, args)
  }

  static fromObject(data: any): LensProfile | null {
    if (!data) return null

    return new LensProfile({
      name: data?.['name'] as string,
      avatar: data?.['avatar']?.['asdasd']?.['url'] as string,
    })
  }
}
