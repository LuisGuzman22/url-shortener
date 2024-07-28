import { Url } from '../domain/url';

export const URL_REPOSITORY_TOKEN = Symbol('URL_REPOSITORY_TOKEN');

export interface UrlRepository {
  save(url: Url, traceId: string): Promise<Url>;
  findAll(traceId: string): Promise<Url[]>;
  findById(id: string): Promise<Url | null>;
  update(id: string, url: Url): Promise<Url>;
  delete(id: string): Promise<void>;
}
