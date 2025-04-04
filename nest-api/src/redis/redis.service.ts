import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

type RedisValue = {
  [key: string]: any;
};

@Injectable()
export class RedisService {
  public constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
  ) {}

  async set(key: string, value: RedisValue) {
    await this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
