import { Injectable, Logger } from '@nestjs/common';
import { RegisterUrl } from 'src/application/dto/domain/register-url.dto';
import axios from 'axios';
import { UrlResponseDto } from 'src/application/dto/response/url.response.dto';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
  constructor() {}

  public async registerUrl(data: RegisterUrl): Promise<void> {
    try {
      this.logger.log('registering url');

      const url = `${process.env.PROCESS_QUEUE_URL}/url`;
      await axios.post(url, data);
    } catch (error) {
      this.logger.error('error on register url', error);
    }
  }

  public async getUrlList(): Promise<UrlResponseDto> {
    try {
      this.logger.log('get all url');
      const url = `${process.env.PROCESS_QUEUE_URL}/url`;
      const response = await axios.get(url);
      const data = response.data.data;
      return data;
    } catch (error) {
      this.logger.error('error on get urls', error);
    }
  }
}
