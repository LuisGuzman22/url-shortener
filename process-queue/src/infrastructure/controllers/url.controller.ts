import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
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
  create(@Body() createUrlDto: CreateUrlDto): Promise<Url> {
    const url = new Url(
      null,
      createUrlDto.shortUrl,
      createUrlDto.originalUrl,
      createUrlDto.action,
    );
    return this.urlService.create(url);
  }

  @Get()
  @ApiOperation({ summary: 'Get all URLs' })
  @ApiResponse({ status: 200, description: 'Return all URLs.' })
  async findAll(): Promise<UrlResponseDto> {
    const response = {
      data: await this.urlService.findAll(),
    };
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get URL by ID' })
  @ApiParam({ name: 'id', description: 'ID of the URL to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Return the URL with the given ID.',
    type: Url,
  })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  findOne(@Param('id') id: string): Promise<Url | null> {
    return this.urlService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a URL by ID' })
  @ApiParam({ name: 'id', description: 'ID of the URL to update' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({
    status: 200,
    description: 'The URL has been successfully updated.',
    type: Url,
  })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ): Promise<Url> {
    const url = new Url(
      id,
      updateUrlDto.originalUrl,
      updateUrlDto.shortUrl,
      updateUrlDto.action,
    );
    return this.urlService.update(id, url);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a URL by ID' })
  @ApiParam({ name: 'id', description: 'ID of the URL to delete' })
  @ApiResponse({
    status: 200,
    description: 'The URL has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  delete(@Param('id') id: string): Promise<void> {
    return this.urlService.delete(id);
  }
}
