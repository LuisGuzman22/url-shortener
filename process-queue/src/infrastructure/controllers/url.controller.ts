import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Headers,
} from '@nestjs/common';
import {
  CreateUrlDto,
  UpdateUrlDto,
  UrlResponseDto,
} from 'src/application/dtos/url.dto';
import { Url } from '../../core/domain/url';
import { UrlService } from '../../core/services/url.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully created.',
    type: Url,
  })
  @ApiBody({ type: CreateUrlDto })
  @ApiHeader({ name: 'traceid' })
  create(
    @Body() createUrlDto: CreateUrlDto,
    @Headers('traceid') traceId: string = 'no-trace-id',
  ): Promise<Url> {
    const url = new Url(
      null,
      createUrlDto.shortUrl,
      createUrlDto.originalUrl,
      createUrlDto.action,
    );
    return this.urlService.create(url, traceId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all URLs' })
  @ApiResponse({ status: 200, description: 'Return all URLs.' })
  @ApiHeader({ name: 'traceid' })
  async findAll(
    @Headers('traceid') traceId: string = 'no-trace-id',
  ): Promise<UrlResponseDto> {
    const response = {
      data: await this.urlService.findAll(traceId),
    };
    return response;
  }
}
