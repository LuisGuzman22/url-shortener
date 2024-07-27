import { Injectable, Logger } from '@nestjs/common';
import { UuidGeneratorService } from './uuid-generator.service';
import { CacheService } from './cache.service';
import {
  ACTION_CREATE,
  INVALID_URL,
  ACTION_ACCESS,
  ACTION_DELETE,
  NOT_PROCESSED,
} from '../../constants/index';
import { RegistrationService } from '../../core/services/registration-service/registration-service.service';
import {
  CreateUrlResponseDto,
  ShortUrl,
} from '../dto/response/create-url.response.dto';
import { UrlResponseDto } from '../dto/response/url.response.dto';

@Injectable()
export class UrlProcessService {
  private readonly logger = new Logger(UrlProcessService.name);

  constructor(
    private readonly uuidGeneratorService: UuidGeneratorService,
    private readonly cacheService: CacheService,
    private readonly registrationService: RegistrationService,
  ) {}

  public async shortener(
    urlList: string[],
    traceId: string,
  ): Promise<CreateUrlResponseDto> {
    this.logger.log(`[traceId=${traceId}] shortening url list`);
    const shortList = await Promise.all(
      urlList.map((url) => this.processUrl(url, traceId)),
    );
    return { shortList };
  }

  private async processUrl(url: string, traceId: string): Promise<ShortUrl> {
    if (this.validateUrl(url)) {
      const id = await this.mapUrlToId(url, traceId);
      await this.registerUrl(
        {
          shortUrl: id,
          originalUrl: url,
          action: ACTION_CREATE,
        },
        traceId,
      );
      return this.createUrlResponse(id, url);
    }
    return this.createInvalidUrlResponse(url);
  }

  private createUrlResponse(shortUrl: string, longUrl: string): ShortUrl {
    return {
      shortUrl,
      longUrl,
    };
  }

  private createInvalidUrlResponse(longUrl: string): ShortUrl {
    return {
      shortUrl: INVALID_URL,
      longUrl,
    };
  }

  public async restoreUrl(key: string, traceId: string): Promise<string> {
    this.logger.log(`[traceId=${traceId}] restoring url`);
    const originalUrl = await this.cacheService.getValue(key, traceId);
    await this.registerUrl(
      {
        shortUrl: this.generateUrl(key),
        originalUrl: originalUrl,
        action: ACTION_ACCESS,
      },
      traceId,
    );
    return originalUrl;
  }

  public async deleteUrl(key: string, traceId: string): Promise<void> {
    this.logger.log(`[traceId=${traceId}] deleting url`);
    await this.registerUrl(
      {
        shortUrl: this.generateUrl(key),
        originalUrl: key,
        action: ACTION_DELETE,
      },
      traceId,
    );
    await this.cacheService.deleteValue(key, traceId);
  }

  public async getAllUrl(traceId: string): Promise<UrlResponseDto> {
    this.logger.log(`[traceId=${traceId}] get all url`);
    return await this.registrationService.getUrlList(traceId);
  }

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async registerUrl(
    registerData: {
      shortUrl: string;
      originalUrl?: string;
      action: string;
    },
    traceId: string,
  ): Promise<void> {
    await this.registrationService.registerUrl(registerData, traceId);
  }

  private generateUUID(): string {
    return this.uuidGeneratorService.generateUUID();
  }

  private async saveCache(
    key: string,
    value: string,
    traceId: string,
  ): Promise<boolean> {
    return await this.cacheService.setValue(key, value, traceId);
  }

  private async mapUrlToId(url: string, traceId: string): Promise<string> {
    const id = this.generateUUID();
    const registered = await this.saveCache(id, url, traceId);
    if (registered) {
      return this.generateUrl(id);
    } else {
      this.logger.error('url not processed');
      return NOT_PROCESSED;
    }
  }

  private generateUrl(key: string): string {
    return `${process.env.BASE_URL}/url/${key}`;
  }
}
