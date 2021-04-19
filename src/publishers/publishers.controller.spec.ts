import { Test, TestingModule } from '@nestjs/testing';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/publisher.dto';

describe('PublishersController', () => {
  let controller: PublishersController;
  let publishersService: PublishersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
      providers: [
        {
          provide: PublishersService,
          useValue: MockPublishersService,
        },
      ],
    }).compile();

    publishersService = module.get<PublishersService>(PublishersService);
    controller = module.get<PublishersController>(PublishersController);
  });

  afterEach(() => {
    MockPublishersService.getPublishers.mockRestore();
    MockPublishersService.createPublisher.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get publishers list "/"', () => {
    it('200 OK', async () => {
      await controller.getPublishers();
      expect(publishersService.getPublishers).toBeCalledTimes(1);
    });
  });

  describe('post publisher "/create"', () => {
    it('201 OK', async () => {
      const publisherDto: CreatePublisherDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      await controller.createPublisher(publisherDto);
      expect(publishersService.createPublisher).toBeCalledTimes(1);
      expect(publishersService.createPublisher).toBeCalledWith(publisherDto);
    });
  });
});

function MockPublishersService() {}
MockPublishersService.getPublishers = jest.fn();
MockPublishersService.createPublisher = jest.fn();
