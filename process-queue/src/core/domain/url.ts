export class Url {
  constructor(
    public readonly id: string,
    public readonly shortUrl: string,
    public readonly originalUrl: string,
    public readonly action: string,
  ) {}
}
