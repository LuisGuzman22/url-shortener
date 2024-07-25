import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    type: [String],
    description: 'List of URLs to be shortened',
    example: ['http://example.com/1', 'http://example.com/2'],
  })
  urlList: string[];
}
