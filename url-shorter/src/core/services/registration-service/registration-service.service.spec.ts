import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { RegisterUrl } from 'src/application/dto/domain/register-url.dto';
import { RegistrationService } from './registration-service.service';

jest.mock('axios');

describe('RegistrationService', () => {
  let service: RegistrationService;
  let logger: Logger;
  const traceIdMock = 'traceId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationService],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    logger = new Logger(RegistrationService.name);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a URL successfully', async () => {
    const data: RegisterUrl = {
      shortUrl: 'short',
      originalUrl: 'http://example.com',
      action: 'create',
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: 'OK' });

    await expect(
      service.registerUrl(data, traceIdMock),
    ).resolves.toBeUndefined();
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.PROCESS_QUEUE_URL}/url`,
      data,
    );
  });

  it('should register a URL with optional parameters', async () => {
    const data: RegisterUrl = {
      shortUrl: 'short',
      originalUrl: 'http://example.com',
      action: 'create',
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: 'OK' });

    await expect(
      service.registerUrl(data, traceIdMock),
    ).resolves.toBeUndefined();
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.PROCESS_QUEUE_URL}/url`,
      data,
    );
  });

  it('should register a URL with missing action field', async () => {
    const data: RegisterUrl = {
      shortUrl: 'short',
      originalUrl: 'http://example.com',
      action: 'create',
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: 'OK' });

    await expect(
      service.registerUrl(data, traceIdMock),
    ).resolves.toBeUndefined();
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.PROCESS_QUEUE_URL}/url`,
      data,
    );
  });

  it('should fetch and return URL list successfully', async () => {
    const mockResponse = {
      data: {
        data: [
          {
            id: '1',
            shortUrl: 'short1',
            originalUrl: 'http://example1.com',
            action: 'create',
          },
          {
            id: '2',
            shortUrl: 'short2',
            originalUrl: 'http://example2.com',
            action: 'create',
          },
        ],
      },
    };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await service.getUrlList(traceIdMock);

    expect(result).toEqual(mockResponse.data.data);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.PROCESS_QUEUE_URL}/url`,
    );
  });
});
