import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { Url } from '../domain/url';
import { UrlRepository, URL_REPOSITORY_TOKEN } from '../ports/url-repository';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;

  const mockUrlRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

      expect(await service.create(url)).toEqual(url);
      expect(mockUrlRepository.save).toHaveBeenCalledWith(url);
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

      expect(await service.findAll()).toEqual(urls);
      expect(mockUrlRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a URL by ID', async () => {
      const url: Url = {
        id: '1',
        originalUrl: 'http://example.com',
        shortUrl: 'http://short.url/1',
        action: 'create',
      };
      mockUrlRepository.findById.mockResolvedValue(url);

      expect(await service.findById('1')).toEqual(url);
      expect(mockUrlRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if URL not found', async () => {
      mockUrlRepository.findById.mockResolvedValue(null);

      expect(await service.findById('2')).toBeNull();
      expect(mockUrlRepository.findById).toHaveBeenCalledWith('2');
    });
  });

  describe('update', () => {
    it('should update a URL', async () => {
      const url: Url = {
        id: '1',
        originalUrl: 'http://example.com',
        shortUrl: 'http://short.url/1',
        action: 'update',
      };
      mockUrlRepository.update.mockResolvedValue(url);

      expect(await service.update('1', url)).toEqual(url);
      expect(mockUrlRepository.update).toHaveBeenCalledWith('1', url);
    });
  });

  describe('delete', () => {
    it('should delete a URL', async () => {
      mockUrlRepository.delete.mockResolvedValue(undefined);

      expect(await service.delete('1')).toBeUndefined();
      expect(mockUrlRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
