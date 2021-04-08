import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { Game as GameEntity } from './entities/game.entity';
import {
  ApplyDiscountAndDeleteOlderGamesConfig,
  ApplyDiscountAndDeleteOlderGamesResult,
  DeleteWriteOpResult,
  UpdateWriteOpResult,
} from '../types/types';
import { ApplyDiscountAndDeleteOlderGames } from './entities/apply-discount-and-delete-older-games.entity';
import { applyDiscountAndDeleteOlderGamesProcess } from '../utils/apply-discount-and-delete-older-games-process-execute';
import { GameNotFoundException } from './errors/GameNotFoundException.error';
import { PublishersService } from '../publishers/publishers.service';
import { Publisher as PublisherEntity } from '../publishers/entities/publisher.entity';
import { PublisherNotFoundException } from '../publishers/errors/PublisherNotFoundException.error';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    private publisherService: PublishersService,
  ) {}

  private _findGameById(gameId: string): Promise<GameDocument> {
    return this.gameModel.findById(gameId).populate('publisher').exec();
  }

  private _findGames(): Promise<GameDocument[]> {
    return this.gameModel.find().populate('publisher').exec();
  }

  private _saveGame(game: Game): Promise<GameDocument> {
    const createdGame = new this.gameModel(game);
    return createdGame.save();
  }

  private _updateGameById(
    gameId: string,
    dataToSet: any,
  ): Promise<UpdateWriteOpResult> {
    return this.gameModel
      .updateOne(
        {
          _id: gameId,
        },
        {
          $set: dataToSet,
        },
      )
      .exec();
  }

  private _deleteGameById(gameId: string): Promise<DeleteWriteOpResult> {
    return this.gameModel
      .deleteOne({
        _id: gameId,
      })
      .exec();
  }

  async getGames(): Promise<GameEntity[]> {
    const games = await this._findGames();
    return games.map((game) => new GameEntity(game));
  }

  async getGameById(gameId: string): Promise<GameEntity> {
    const game = await this._findGameById(gameId);

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    return new GameEntity(game);
  }

  async getGamePublisherByGameId(gameId: string): Promise<PublisherEntity> {
    const game = await this._findGameById(gameId);

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    return new PublisherEntity(game?.publisher);
  }

  async createGame(createGameDto: CreateGameDto): Promise<GameEntity> {
    const siret = createGameDto.publisher;
    const publisher = await this.publisherService.findPublisherBySiret(siret);

    if (!publisher) {
      throw new PublisherNotFoundException(siret);
    }

    const game = await this._saveGame({
      ...createGameDto,
      publisher: publisher._id,
    });
    return new GameEntity(game, publisher);
  }

  async updateGameById(
    gameId: string,
    updateGameDto: UpdateGameDto,
  ): Promise<GameEntity> {
    let game = await this._findGameById(gameId);

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    const { publisher: siret, ...dataToSet } = updateGameDto;
    const publisher = await this.publisherService.findPublisherBySiret(siret);

    if (siret && !publisher) {
      throw new PublisherNotFoundException(siret);
    }

    if (publisher) {
      Object.assign(dataToSet, { publisher: publisher._id });
    }

    await this._updateGameById(gameId, dataToSet);
    game = await this._findGameById(gameId);

    return new GameEntity(game);
  }

  async deleteGameById(gameId: string): Promise<GameEntity> {
    const game = await this._findGameById(gameId);

    if (!game) {
      throw new GameNotFoundException(gameId);
    }

    await this._deleteGameById(gameId);
    return new GameEntity(game);
  }

  async triggerApplyDiscountAndDeleteOlderGamesProcess() {
    const config: ApplyDiscountAndDeleteOlderGamesConfig = {
      gameModel: this.gameModel,
      releaseDate: new Date(),
      discountPercent: 20,
      applyToGamesWithReleaseDateMinusMonthsStart: 12,
      applyToGamesWithReleaseDateMinusMonthsEnd: 18,
    };
    const result: ApplyDiscountAndDeleteOlderGamesResult = await applyDiscountAndDeleteOlderGamesProcess(
      config,
    );
    return result;
  }
}
