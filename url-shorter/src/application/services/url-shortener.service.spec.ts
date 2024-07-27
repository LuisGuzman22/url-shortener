import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { UrlProcessService } from './url-process.service';
import { UuidGeneratorService } from './uuid-generator.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from '../dto/request/create-url.dto';
import { CreateUrlResponseDto } from '../dto/response/create-url.response.dto';
import { Logger } from '@nestjs/common';
import { UrlResponseDto } from '../dto/response/url.response.dto';

jest.mock('./url-process.service');
jest.mock('./uuid-generator.service');

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let urlProcessService: UrlProcessService;
  let uuidGeneratorService: UuidGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlShortenerService, UrlProcessService, UuidGeneratorService],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    urlProcessService = module.get<UrlProcessService>(UrlProcessService);
    uuidGeneratorService =
      module.get<UuidGeneratorService>(UuidGeneratorService);
  });

  describe('shortenUrl', () => {
    it('should throw BadRequestException if urlList is empty', async () => {
      const createUrlDto: CreateUrlDto = { urlList: [] };
      await expect(service.shortenUrl(createUrlDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call urlProcessService.shortener with urlList', async () => {
      const createUrlDto: CreateUrlDto = { urlList: ['https://example.com'] };
      const response: CreateUrlResponseDto = {
        shortList: [{ shortUrl: 'shortUrl', longUrl: 'https://example.com' }],
      };
      jest.spyOn(urlProcessService, 'shortener').mockResolvedValue(response);
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      const result = await service.shortenUrl(createUrlDto);

      expect(result).toBe(response);
      expect(urlProcessService.shortener).toHaveBeenCalledWith(
        createUrlDto.urlList,
        'traceId',
      );
    });
  });

  describe('getOriginalUrl', () => {
    it('should throw NotFoundException if key not found', async () => {
      const key = 'invalidKey';
      const res = { redirect: jest.fn() };
      jest.spyOn(urlProcessService, 'restoreUrl').mockResolvedValue(null);
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      await expect(service.getOriginalUrl(key, res)).rejects.toThrow(
        NotFoundException,
      );
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should call res.redirect with longUrl', async () => {
      const key = 'validKey';
      const longUrl = 'https://example.com';
      const res = { redirect: jest.fn() };
      jest.spyOn(urlProcessService, 'restoreUrl').mockResolvedValue(longUrl);
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      await service.getOriginalUrl(key, res);

      expect(res.redirect).toHaveBeenCalledWith(longUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should call urlProcessService.deleteUrl', async () => {
      const key = 'validKey';
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      await service.deleteUrl(key);

      expect(urlProcessService.deleteUrl).toHaveBeenCalledWith(key, 'traceId');
    });
  });

  describe('masiveUpload', () => {
    it('should call urlProcessService.shortener with urlList from file', async () => {
      const file = {
        buffer: Buffer.from('https://example.com\nhttps://another.com'),
      } as Express.Multer.File;

      const response: CreateUrlResponseDto = {
        shortList: [
          { shortUrl: 'shortUrl1', longUrl: 'https://example.com' },
          { shortUrl: 'shortUrl2', longUrl: 'https://another.com' },
        ],
      };
      jest.spyOn(urlProcessService, 'shortener').mockResolvedValue(response);
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      const result = await service.masiveUpload(file);

      expect(result).toBe(response);
      expect(urlProcessService.shortener).toHaveBeenCalledWith(
        ['https://example.com', 'https://another.com'],
        'traceId',
      );
    });
  });

  describe('getAllUrls', () => {
    it('should call urlProcessService.getAllUrl', async () => {
      const response: UrlResponseDto = { data: [] };
      jest.spyOn(urlProcessService, 'getAllUrl').mockResolvedValue(response);
      jest
        .spyOn(uuidGeneratorService, 'generateUUID')
        .mockReturnValue('traceId');

      const result = await service.getAllUrls();

      expect(result).toBe(response);
      expect(urlProcessService.getAllUrl).toHaveBeenCalledWith('traceId');
    });
  });

  describe('trimUrl', () => {
    it('should trim and return a valid URL', () => {
      const url = '  https://example.com  ';
      const result = service['trimUrl'](url);
      expect(result).toBe('https://example.com');
    });

    it('should return undefined for an invalid URL', () => {
      const url = '   ';
      const result = service['trimUrl'](url);
      expect(result).toBeUndefined();
    });
  });
});
