import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Url } from '../domain/url';
import { UrlRepository, URL_REPOSITORY_TOKEN } from '../ports/url-repository';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;
  const traceIdMock = 'trace-id';
  const mockUrlRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: URL_REPOSITORY_TOKEN,
          useValue: mockUrlRepository,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<UrlRepository>(URL_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new URL', async () => {
      const url: Url = {
        id: '1',
        originalUrl: 'http://example.com',
        shortUrl: 'http://short.url/1',
        action: 'create',
      };
      mockUrlRepository.save.mockResolvedValue(url);

      expect(await service.create(url, traceIdMock)).toEqual(url);
      expect(mockUrlRepository.save).toHaveBeenCalledWith(url, traceIdMock);
    });
  });

  describe('findAll', () => {
    it('should return an array of URLs', async () => {
      const urls: Url[] = [
        {
          id: '1',
          originalUrl: 'http://example.com',
          shortUrl: 'http://short.url/1',
          action: 'create',
        },
        {
          id: '2',
          originalUrl: 'http://example2.com',
          shortUrl: 'http://short.url/2',
          action: 'create',
        },
      ];
      mockUrlRepository.findAll.mockResolvedValue(urls);

      expect(await service.findAll(traceIdMock)).toEqual(urls);
      expect(mockUrlRepository.findAll).toHaveBeenCalled();
    });
  });
});
