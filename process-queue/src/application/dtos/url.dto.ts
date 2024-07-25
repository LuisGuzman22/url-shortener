import { Url } from '../../core/domain/url';

export class CreateUrlDto {
  readonly shortUrl: string;
  readonly originalUrl: string;
  readonly action: string;
}

export class UpdateUrlDto {
  readonly shortUrl: string;
  readonly originalUrl: string;
  readonly action: string;
}

export class UrlResponseDto {
  data: Url[];
}
