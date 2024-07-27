import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUrlDto } from '../dto/request/create-url.dto';
import { CreateUrlResponseDto } from '../dto/response/create-url.response.dto';
import { UrlProcessService } from './url-process.service';
import { UrlResponseDto } from '../dto/response/url.response.dto';
import { UuidGeneratorService } from './uuid-generator.service';

@Injectable()
export class UrlShortenerService {
  private readonly logger = new Logger(UrlShortenerService.name);
  constructor(
    private readonly urlProcessService: UrlProcessService,
    private readonly uuidGeneratorService: UuidGeneratorService,
  ) {}

  public async shortenUrl(
    createUrlDto: CreateUrlDto,
  ): Promise<CreateUrlResponseDto> {
    const traceId = this.uuidGeneratorService.generateUUID();
    this.logger.log(`[traceId=${traceId}] shortening url list`);
    if (!createUrlDto.urlList || createUrlDto.urlList.length === 0) {
      this.logger.error(`[traceId=${traceId}] urlList is required`);
      throw new BadRequestException('urlList is required');
    }

    return this.urlProcessService.shortener(createUrlDto.urlList, traceId);
  }

  public async getOriginalUrl(key: string, res: any): Promise<void> {
    const traceId = this.uuidGeneratorService.generateUUID();
    this.logger.log(`[traceId=${traceId}] restoring url`);
    const longUrl = await this.urlProcessService.restoreUrl(key, traceId);

    if (!longUrl) {
      this.logger.error(`[traceId=${traceId}] key not found`);
      throw new NotFoundException('key not found');
    }
    res.redirect(longUrl);
  }

  public async deleteUrl(key: string): Promise<void> {
    const traceId = this.uuidGeneratorService.generateUUID();
    this.logger.log(`[traceId=${traceId}] deleting url`);
    await this.urlProcessService.deleteUrl(key, traceId);
  }

  public async masiveUpload(file: Express.Multer.File) {
    const traceId = this.uuidGeneratorService.generateUUID();
    this.logger.log(`[traceId=${traceId}] masive upload`);

    const lines = file.buffer.toString().split('\n');
    const urlList = [];

    lines.map((line) => {
      const urls = line.split(';');
      urls.map((item) => {
        const url = this.trimUrl(item);
        if (url) urlList.push(url);
      });
    });

    return this.urlProcessService.shortener(urlList, traceId);
  }

  public async getAllUrls(): Promise<UrlResponseDto> {
    const traceId = this.uuidGeneratorService.generateUUID();
    this.logger.log(`[traceId=${traceId}] get all url`);
    return this.urlProcessService.getAllUrl(traceId);
  }

  private trimUrl(url: string): string {
    const trimmedItem = url.replace(/\r/g, '').trim();
    if (!!trimmedItem) {
      return trimmedItem;
    }
  }
}
