import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './url.controller';
import { UrlService } from 'src/core/services/url.service';
import { UrlSchema } from '../schemas/url.schema';
import { UrlRepositoryImpl } from '../repositories/url.repository';
import { URL_REPOSITORY_TOKEN } from '../../core/ports/url-repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }])],
  controllers: [UrlController],
  providers: [
    UrlService,
    { provide: URL_REPOSITORY_TOKEN, useClass: UrlRepositoryImpl },
  ],
})
export class UrlModule {}
