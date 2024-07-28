import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlRepository } from '../../core/ports/url-repository';
import { Url } from '../../core/domain/url';
import { UrlDocument } from '../schemas/url.schema';

@Injectable()
export class UrlRepositoryImpl implements UrlRepository {
  private readonly logger = new Logger(UrlRepositoryImpl.name);

  constructor(
    @InjectModel('Url') private readonly urlModel: Model<UrlDocument>,
  ) {}

  public async save(url: Url, traceId: string): Promise<Url> {
    this.logger.log(`[traceId=${traceId}] Creating new url`);
    const createdUrl = new this.urlModel(url);
    const result = await createdUrl.save();
    return new Url(
      result.id,
      result.shortUrl,
      result.originalUrl,
      result.action,
    );
  }

  public async findAll(traceId: string): Promise<Url[]> {
    this.logger.log(`[traceId=${traceId}] Getting all urls`);
    const urls = await this.urlModel.find().exec();
    return urls.map(
      (url) => new Url(url.id, url.shortUrl, url.originalUrl, url.action),
    );
  }

  public async findById(id: string): Promise<Url | null> {
    const url = await this.urlModel.findById(id).exec();
    if (!url) return null;
    return new Url(url.id, url.shortUrl, url.originalUrl, url.action);
  }

  public async update(id: string, url: Url): Promise<Url> {
    const updatedUrl = await this.urlModel
      .findByIdAndUpdate(id, url, { new: true })
      .exec();
    return new Url(
      updatedUrl.id,
      updatedUrl.shortUrl,
      updatedUrl.originalUrl,
      updatedUrl.action,
    );
  }

  public async delete(id: string): Promise<void> {
    await this.urlModel.findByIdAndDelete(id).exec();
  }
}
