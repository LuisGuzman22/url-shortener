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

  public create(url: Url): Promise<Url> {
    this.logger.log('Create URL service called');
    return this.urlRepository.save(url);
  }

  public async findAll(): Promise<Url[]> {
    this.logger.log('Find all URLs service called');
    const response = await this.urlRepository.findAll();
    return response.map((url) => ({
      id: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      action: url.action,
    }));
  }

  public findById(id: string): Promise<Url | null> {
    this.logger.log('Find URL by ID service called');
    return this.urlRepository.findById(id);
  }

  public update(id: string, url: Url): Promise<Url> {
    this.logger.log('Update URL service called');
    return this.urlRepository.update(id, url);
  }

  public delete(id: string): Promise<void> {
    this.logger.log('Delete URL service called');
    return this.urlRepository.delete(id);
  }
}
