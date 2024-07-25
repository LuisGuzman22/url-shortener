import { ApiProperty } from '@nestjs/swagger';
import { Url } from '../../core/domain/url';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The shortened URL',
    example: 'http://short.url/abc123',
  })
  readonly shortUrl: string;

  @ApiProperty({
    description: 'The original URL',
    example: 'http://original.url/abc123',
  })
  readonly originalUrl: string;

  @ApiProperty({
    description: 'Action to be taken with the URL',
    example: 'redirect',
  })
  readonly action: string;
}

export class UpdateUrlDto {
  @ApiProperty({
    description: 'The shortened URL',
    example: 'http://short.url/abc123',
  })
  readonly shortUrl: string;

  @ApiProperty({
    description: 'The original URL',
    example: 'http://original.url/abc123',
  })
  readonly originalUrl: string;

  @ApiProperty({
    description: 'Action to be taken with the URL',
    example: 'redirect',
  })
  readonly action: string;
}

export class UrlResponseDto {
  @ApiProperty({
    type: [Url],
    description: 'Array of URL objects',
    example: [
      {
        id: 'url.id',
        shortUrl: 'url.shortUrl',
        originalUrl: 'url.originalUrl',
        action: 'url.action',
      },
    ],
  })
  data: Url[];
}
