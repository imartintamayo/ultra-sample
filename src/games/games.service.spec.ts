import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { Game, GameDocument } from './schemas/game.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { PublishersService } from '../publishers/publishers.service';
import { GameNotFoundException } from './errors/GameNotFoundException.error';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { PublisherNotFoundException } from '../publishers/errors/PublisherNotFoundException.error';

// this is to create a reference to this method out of the publisher model instance
const save = jest.fn();

describe('GamesService', () => {
  let gameService: GamesService;
  let gameModel: Model<GameDocument>;
  let publishersService: PublishersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: PublishersService,
          useValue: MockPublishersService,
        },
        {
          provide: getModelToken(Game.name),
          useValue: MockGamesModel,
        },
      ],
    }).compile();

    gameService = module.get<GamesService>(GamesService);
    publishersService = module.get<PublishersService>(PublishersService);
    gameModel = module.get<Model<GameDocument>>(getModelToken(Game.name));
  });

  afterEach(() => {
    MockGamesModel.find.mockRestore();
    MockGamesModel.findById.mockRestore();
    MockGamesModel.updateOne.mockRestore();
    MockGamesModel.deleteOne.mockRestore();
    MockPublishersService.findPublisherBySiret.mockRestore();
    save.mockRestore();
  });

  it('should be defined', () => {
    expect(gameService).toBeDefined();
  });

  describe('getGames', () => {
    it('should return games list', async () => {
      MockGamesModel.find.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue([]),
        })),
      }));

      await gameService.getGames();
      expect(gameModel.find).toBeCalledTimes(1);
    });
  });

  describe('getGameById', () => {
    it('should return the found game', async () => {
      const sampleGame = {
        price: 10,
        publisher: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      const gameId = 'some game id';
      await gameService.getGameById(gameId);
      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);
    });

    it('should throw an error if game is NOT found', async () => {
      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const gameId = 'some game id';
      let error;

      try {
        await gameService.getGameById(gameId);
      } catch (e) {
        error = e;
      }

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(error).toBeInstanceOf(GameNotFoundException);
    });
  });

  describe('getGamePublisherByGameId', () => {
    it('should return the found game publisher info', async () => {
      const sampleGame = {
        price: 10,
        publisher: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      const gameId = 'some game id';
      const result = await gameService.getGamePublisherByGameId(gameId);
      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);
      expect(result).toEqual(sampleGame.publisher);
    });

    it('should throw an error if game is NOT found', async () => {
      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const gameId = 'some game id';
      let error;

      try {
        await gameService.getGamePublisherByGameId(gameId);
      } catch (e) {
        error = e;
      }

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(error).toBeInstanceOf(GameNotFoundException);
    });
  });

  describe('createGame', () => {
    it('should return the found game publisher info', async () => {
      const gameDto: CreateGameDto = {
        price: 10,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockPublishersService.findPublisherBySiret.mockResolvedValue({
        _id: 'some publisher id',
      });

      await gameService.createGame(gameDto);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith();
    });

    it('should throw an error if publisher by siret is NOT found', async () => {
      const gameDto: CreateGameDto = {
        price: 10,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockPublishersService.findPublisherBySiret.mockResolvedValue(null);

      let error;
      try {
        await gameService.createGame(gameDto);
      } catch (e) {
        error = e;
      }

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      expect(error).toBeInstanceOf(PublisherNotFoundException);

      expect(save).not.toBeCalled();
    });
  });

  describe('updateGameById', () => {
    const sampleGame = {
      price: 10,
      publisher: {
        name: 'some name',
        siret: 1234,
        phone: 'some phone',
      },
      releaseDate: new Date(),
      title: 'some title',
      tags: [],
    };

    it('should update game by id - all fields', async () => {
      const gameDto: UpdateGameDto = {
        price: 10,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: ['tag1', 'tag2'],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const publisherId = 'some publisher id';
      MockPublishersService.findPublisherBySiret.mockResolvedValue({
        _id: publisherId,
      });

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
        publisher: publisherId,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should update game by id - publisher', async () => {
      const gameDto: UpdateGameDto = {
        publisher: 1234,
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const publisherId = 'some publisher id';
      MockPublishersService.findPublisherBySiret.mockResolvedValue({
        _id: publisherId,
      });

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
        publisher: publisherId,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should update game by id - price', async () => {
      const gameDto: UpdateGameDto = {
        price: 10,
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should update game by id - releaseDate', async () => {
      const gameDto: UpdateGameDto = {
        releaseDate: new Date(),
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should update game by id - title', async () => {
      const gameDto: UpdateGameDto = {
        title: 'some title',
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should update game by id - tags', async () => {
      const gameDto: UpdateGameDto = {
        tags: ['tag1', 'tag2'],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.updateOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const gameId = 'some game id';
      await gameService.updateGameById(gameId, gameDto);

      expect(MockGamesModel.findById).toBeCalledTimes(2);
      expect(MockGamesModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      const dataToSet = {
        ...gameDto,
      };
      expect(MockGamesModel.updateOne).toBeCalledTimes(1);
      expect(MockGamesModel.updateOne).toBeCalledWith(
        { _id: gameId },
        { $set: dataToSet },
      );
    });

    it('should throw an error if game is NOT found', async () => {
      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const gameId = 'some game id';
      let error;
      const gameDto: UpdateGameDto = {
        tags: ['tag1', 'tag2'],
      };

      try {
        await gameService.updateGameById(gameId, gameDto);
      } catch (e) {
        error = e;
      }

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(error).toBeInstanceOf(GameNotFoundException);

      expect(MockPublishersService.findPublisherBySiret).not.toBeCalled();
      expect(MockGamesModel.updateOne).not.toBeCalled();
    });

    it('should throw an error if publisher by siret is NOT found', async () => {
      const gameDto: UpdateGameDto = {
        price: 10,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockPublishersService.findPublisherBySiret.mockResolvedValue(null);

      const gameId = 'some game id';
      let error;

      try {
        await gameService.updateGameById(gameId, gameDto);
      } catch (e) {
        error = e;
      }

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(MockPublishersService.findPublisherBySiret).toBeCalledTimes(1);
      expect(MockPublishersService.findPublisherBySiret).toBeCalledWith(
        gameDto.publisher,
      );

      expect(error).toBeInstanceOf(PublisherNotFoundException);

      expect(MockGamesModel.updateOne).not.toBeCalled();
    });
  });

  describe('deleteGameById', () => {
    it('should delete the found game', async () => {
      const sampleGame = {
        price: 10,
        publisher: {
          name: 'some name',
          siret: 1234,
          phone: 'some phone',
        },
        releaseDate: new Date(),
        title: 'some title',
        tags: [],
      };

      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(sampleGame),
        })),
      }));

      MockGamesModel.deleteOne.mockImplementation(() => ({
        exec: jest.fn(),
      }));

      const gameId = 'some game id';
      await gameService.deleteGameById(gameId);

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(gameModel.deleteOne).toBeCalledTimes(1);
      expect(gameModel.deleteOne).toBeCalledWith({ _id: gameId });
    });

    it('should throw an error if game is NOT found', async () => {
      MockGamesModel.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          exec: jest.fn().mockResolvedValue(null),
        })),
      }));

      const gameId = 'some game id';
      let error;

      try {
        await gameService.deleteGameById(gameId);
      } catch (e) {
        error = e;
      }

      expect(gameModel.findById).toBeCalledTimes(1);
      expect(gameModel.findById).toBeCalledWith(gameId);

      expect(error).toBeInstanceOf(GameNotFoundException);

      expect(gameModel.deleteOne).not.toBeCalled();
    });
  });
});

function MockPublishersService() {}
MockPublishersService.findPublisherBySiret = jest.fn();

function MockGamesModel() {
  this.save = save;
}

MockGamesModel.find = jest.fn();
MockGamesModel.findById = jest.fn();
MockGamesModel.updateOne = jest.fn();
MockGamesModel.deleteOne = jest.fn();
