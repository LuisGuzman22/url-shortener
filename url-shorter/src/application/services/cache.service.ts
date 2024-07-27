import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async setValue(
    key: string,
    value: string,
    traceId: string,
  ): Promise<boolean> {
    this.logger.log(`[traceId=${traceId}] setting cache`);
    const data = await this.redisClient.set(key, value);
    if (data !== 'OK') {
      return false;
    }
    return true;
  }

  async getValue(key: string, traceId: string): Promise<string> {
    this.logger.log(`[traceId=${traceId}] getting cache`);
    return await this.redisClient.get(key);
  }

  async deleteValue(key: string, traceId: string): Promise<void> {
    this.logger.log(`[traceId=${traceId}] deleting cache`);
    await this.redisClient.del(key);
  }
}
