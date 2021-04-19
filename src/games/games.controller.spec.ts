import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let gamesService: GamesService;
  const gameId = 'someGameId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: MockGameService,
        },
      ],
    }).compile();

    gamesService = module.get<GamesService>(GamesService);
    controller = module.get<GamesController>(GamesController);
  });

  afterEach(() => {
    MockGameService.getGames.mockRestore();
    MockGameService.getGameById.mockRestore();
    MockGameService.getGamePublisherByGameId.mockRestore();
    MockGameService.createGame.mockRestore();
    MockGameService.updateGameById.mockRestore();
    MockGameService.deleteGameById.mockRestore();
    MockGameService.triggerApplyDiscountAndDeleteOlderGamesProcess.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get games list "/"', () => {
    it('200 OK', async () => {
      await controller.getGames();
      expect(gamesService.getGames).toBeCalledTimes(1);
    });
  });

  describe('get game "/:gameId"', () => {
    it('200 OK', async () => {
      await controller.getGame(gameId);
      expect(gamesService.getGameById).toBeCalledTimes(1);
      expect(gamesService.getGameById).toBeCalledWith(gameId);
    });
  });

  describe('get game publisher "/:gameId/publisher"', () => {
    it('200 OK', async () => {
      await controller.getPublisher(gameId);
      expect(gamesService.getGamePublisherByGameId).toBeCalledTimes(1);
      expect(gamesService.getGamePublisherByGameId).toBeCalledWith(gameId);
    });
  });

  describe('post game "/create"', () => {
    it('201 OK', async () => {
      const gameDto: CreateGameDto = {
        price: 10.2,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
      };

      await controller.createGame(gameDto);
      expect(gamesService.createGame).toBeCalledTimes(1);
      expect(gamesService.createGame).toBeCalledWith(gameDto);
    });

    it('201 OK with tags', async () => {
      const gameDto: CreateGameDto = {
        price: 10.2,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: ['tag1', 'tag2'],
      };

      await controller.createGame(gameDto);
      expect(gamesService.createGame).toBeCalledTimes(1);
      expect(gamesService.createGame).toBeCalledWith(gameDto);
    });
  });

  describe('put game "/:gameId/update"', () => {
    it('200 OK - set price', async () => {
      const gameDto: UpdateGameDto = {
        price: 10.2,
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });

    it('200 OK - set publisher', async () => {
      const gameDto: UpdateGameDto = {
        publisher: 1234,
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });

    it('200 OK - set releaseDate', async () => {
      const gameDto: UpdateGameDto = {
        releaseDate: new Date(),
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });

    it('200 OK - set title', async () => {
      const gameDto: UpdateGameDto = {
        title: 'some new title',
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });

    it('200 OK - set tags', async () => {
      const gameDto: UpdateGameDto = {
        tags: ['tag1', 'tag2'],
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });

    it('200 OK - set all fields', async () => {
      const gameDto: UpdateGameDto = {
        price: 10.2,
        publisher: 1234,
        releaseDate: new Date(),
        title: 'some title',
        tags: ['tag1', 'tag2'],
      };

      await controller.updateGame(gameId, gameDto);
      expect(gamesService.updateGameById).toBeCalledTimes(1);
      expect(gamesService.updateGameById).toBeCalledWith(gameId, gameDto);
    });
  });

  describe('delete game "/:gameId/delete"', () => {
    it('200 OK', async () => {
      await controller.deleteGame(gameId);
      expect(gamesService.deleteGameById).toBeCalledTimes(1);
      expect(gamesService.deleteGameById).toBeCalledWith(gameId);
    });
  });

  describe('post trigger apply discount and delete older games process "/trigger-apply-discount-and-delete-older-games-process"', () => {
    it('201 OK', async () => {
      await controller.triggerApplyDiscountAndDeleteOlderGamesProcess();
      expect(
        gamesService.triggerApplyDiscountAndDeleteOlderGamesProcess,
      ).toBeCalledTimes(1);
    });
  });
});

function MockGameService() {}
MockGameService.getGames = jest.fn();
MockGameService.getGameById = jest.fn();
MockGameService.getGamePublisherByGameId = jest.fn();
MockGameService.createGame = jest.fn();
MockGameService.updateGameById = jest.fn();
MockGameService.deleteGameById = jest.fn();
MockGameService.triggerApplyDiscountAndDeleteOlderGamesProcess = jest.fn();
