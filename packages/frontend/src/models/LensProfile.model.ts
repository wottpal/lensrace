export class LensProfile {
  public name: string
  public avatar: string

  constructor(args: { name: string; avatar: string }) {
    this.name = args.name
    this.avatar = args.avatar
  }
}
