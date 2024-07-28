import { Inject, Injectable, Logger } from '@nestjs/common';
import { URL_REPOSITORY_TOKEN, UrlRepository } from '../ports/url-repository';
import { Url } from '../domain/url';

@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private readonly urlRepository: UrlRepository,
  ) {}

  public create(url: Url, traceId: string): Promise<Url> {
    this.logger.log(`[traceId=${traceId}] Create URL service called`);
    return this.urlRepository.save(url, traceId);
  }

  public async findAll(traceId: string): Promise<Url[]> {
    this.logger.log(`[traceId=${traceId}] Find all URLs service called`);
    const response = await this.urlRepository.findAll(traceId);
    return response.map((url) => ({
      id: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      action: url.action,
    }));
  }
}
