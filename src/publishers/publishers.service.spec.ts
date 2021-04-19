import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/publisher.dto';
import { Publisher, PublisherDocument } from './schemas/publisher.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublisherConflictException } from './errors/PublisherConflictException.error';

// this is to create a reference to this method out of the publisher model instance
const save = jest.fn();

describe('PublishersService', () => {
  let publishersService: PublishersService;
  let publisherModel: Model<PublisherDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: getModelToken(Publisher.name),
          useValue: MockPublishersModel,
        },
      ],
    }).compile();

    publishersService = module.get<PublishersService>(PublishersService);
    publisherModel = module.get<Model<PublisherDocument>>(
      getModelToken(Publisher.name),
    );
  });

  afterEach(() => {
    MockPublishersModel.findOne.mockRestore();
    MockPublishersModel.find.mockRestore();
    save.mockRestore();
  });

  it('should be defined', () => {
    expect(publishersService).toBeDefined();
  });

  describe('getPublishers', () => {
    it('should return publishers list', async () => {
      MockPublishersModel.find.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue([]),
      }));

      await publishersService.getPublishers();
      expect(publisherModel.find).toBeCalledTimes(1);
    });
  });

  describe('createPublisher', () => {
    it('should create a new publisher on db', async () => {
      MockPublishersModel.findOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const publisherDto: CreatePublisherDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      await publishersService.createPublisher(publisherDto);
      expect(publisherModel.findOne).toBeCalledTimes(1);
      expect(publisherModel.findOne).toBeCalledWith({
        siret: publisherDto.siret,
      });

      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith();
    });

    it('should NOT create a new publisher on db and throw a PublisherConflictException', async () => {
      const publisherDto: CreatePublisherDto = {
        name: 'some name',
        phone: 'some phone',
        siret: 1234,
      };

      MockPublishersModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(publisherDto),
      }));

      let error;
      try {
        await publishersService.createPublisher(publisherDto);
      } catch (e) {
        error = e;
      }

      expect(publisherModel.findOne).toBeCalledTimes(1);
      expect(publisherModel.findOne).toBeCalledWith({
        siret: publisherDto.siret,
      });

      expect(error).toBeInstanceOf(PublisherConflictException);

      expect(save).not.toBeCalledTimes(1);
      expect(save).not.toBeCalledWith();
    });
  });

  describe('findPublisherBySiret', () => {
    it('should find a publisher by its siret number', async () => {
      MockPublishersModel.findOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));
      const siret = 1234;

      await publishersService.findPublisherBySiret(siret);
      expect(publisherModel.findOne).toBeCalledTimes(1);
      expect(publisherModel.findOne).toBeCalledWith({
        siret,
      });
    });
  });
});

function MockPublishersModel() {
  this.save = save;
}

MockPublishersModel.find = jest.fn();
MockPublishersModel.findOne = jest.fn();
