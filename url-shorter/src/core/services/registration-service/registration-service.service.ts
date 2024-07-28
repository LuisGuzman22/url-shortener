import { Injectable, Logger } from '@nestjs/common';
import { RegisterUrl } from 'src/application/dto/domain/register-url.dto';
import axios from 'axios';
import { UrlResponseDto } from 'src/application/dto/response/url.response.dto';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
  constructor() {}

  public async registerUrl(data: RegisterUrl, traceId: string): Promise<void> {
    try {
      this.logger.log(`[traceId=${traceId}] register url`);
      const url = `${process.env.PROCESS_QUEUE_URL}/url`;
      await axios.post(url, data, { headers: { traceid: traceId } });
    } catch (error) {
      this.logger.error(
        `[traceId=${traceId}] [error=${error}] error on register url `,
      );
    }
  }

  public async getUrlList(traceId: string): Promise<UrlResponseDto> {
    try {
      this.logger.log(`[traceId=${traceId}] get url list`);
      const url = `${process.env.PROCESS_QUEUE_URL}/url`;
      const response = await axios.get(url, { headers: { traceid: traceId } });
      const data = response.data.data;
      return data;
    } catch (error) {
      this.logger.error(
        `[traceId=${traceId}] [error=${error}] error on get url list `,
      );
    }
  }
}
