import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../schemas/game.schema';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { CreateGameDto, UpdateGameDto } from '../dto/game.dto';
import { Game as GameEntity } from '../entities/game.entity';
import { Publisher as PublisherEntity } from '../entities/publisher.entity';
import { ApplyDiscountAndDeleteOlderGames } from '../entities/apply-discount-and-delete-older-games.entity';
import { applyDiscountAndDeleteOlderGamesProcess } from '../utils/apply-discount-and-delete-older-games-process-execute';
import { GameNotFoundException } from '../errors/GameNotFoundException.error';
import { PublisherNotFoundException } from '../errors/PublisherNotFoundException.error';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  async getGames(): Promise<GameEntity[]> {
    const games = await this.gameModel.find().populate('publisher').exec();
    return games.map((game) => new GameEntity(game));
  }

  async getGame(gameId: string): Promise<GameEntity> {
    const game = await this.gameModel
      .findById(gameId)
      .populate('publisher')
      .exec();

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    return new GameEntity(game);
  }

  async getPublisher(gameId: string): Promise<PublisherEntity> {
    const game = await this.gameModel
      .findById(gameId, { publisher: 1, _id: 0 })
      .populate('publisher')
      .exec();

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    return new PublisherEntity(game?.publisher);
  }

  async createGame(createGameDto: CreateGameDto): Promise<GameEntity> {
    const siret = createGameDto.publisher;
    const publisher = await this.publisherModel.findOne({
      siret,
    });

    if (!publisher) {
      throw new PublisherNotFoundException(siret);
    }

    const createdGame = new this.gameModel({
      ...createGameDto,
      publisher: publisher._id,
    });
    const game = await createdGame.save();
    return new GameEntity(game, publisher);
  }

  async updateGame(
    gameId: string,
    updateGameDto: UpdateGameDto,
  ): Promise<GameEntity> {
    let game = await this.gameModel.findOne({
      _id: gameId,
    });

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    const { publisher: siret, ...dataToSet } = updateGameDto;
    const publisher = await this.publisherModel.findOne({
      siret,
    });

    if (siret && !publisher) {
      throw new PublisherNotFoundException(siret);
    }

    if (publisher) {
      Object.assign(dataToSet, { publisher: publisher._id });
    }

    await this.gameModel.updateOne(
      {
        _id: gameId,
      },
      {
        $set: dataToSet,
      },
    );

    game = await this.gameModel
      .findOne({
        _id: gameId,
      })
      .populate('publisher');

    return new GameEntity(game);
  }

  async deleteGame(gameId: string): Promise<GameEntity> {
    const game = await this.gameModel
      .findOne({
        _id: gameId,
      })
      .populate('publisher');

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    await this.gameModel
      .deleteOne({
        _id: gameId,
      })
      .exec();

    return new GameEntity(game);
  }

  triggerApplyDiscountAndDeleteOlderGamesProcess() {
    const config: ApplyDiscountAndDeleteOlderGames = {
      gameModel: this.gameModel,
      releaseDate: new Date(),
      discountPercent: 20,
      applyToGamesWithReleaseDateMinusMonthsStart: 12,
      applyToGamesWithReleaseDateMinusMonthsEnd: 18,
    };
    return applyDiscountAndDeleteOlderGamesProcess(config);
  }
}
