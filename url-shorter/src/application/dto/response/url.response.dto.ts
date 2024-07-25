export class UrlResponseDto {
  data: Url[];
}

export class Url {
  id: string;
  shortUrl: string;
  longUrl: string;
  action: string;
}
