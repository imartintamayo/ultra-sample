import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../../schemas/game.schema';
import { Publisher, PublisherDocument } from '../../schemas/publisher.schema';
import { CreateGameDto } from '../../dto/game.dto';
const ONE_HUNDRED = 100;
@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  getGames(): Promise<Game[]> {
    return this.gameModel.find().populate('publisher').exec();
  }

  getGame(gameId: string) {
    return this.gameModel.findById(gameId).populate('publisher').exec();
  }

  async getPublisher(gameId: string) {
    const game = await this.gameModel
      .findById(gameId, { publisher: 1, _id: 0 })
      .populate('publisher')
      .exec();
    return game.publisher;
  }

  async createGame(game: CreateGameDto): Promise<Game> {
    const siret = game.publisher;
    let publisher = await this.publisherModel.findOne({
      siret,
    });

    if (!publisher) {
      throw new Error('Publisher not found');
    }

    const createdGame = new this.gameModel({
      ...game,
      publisher: publisher._id,
    });
    return createdGame.save();
  }

  updateGame(gameId: string, game) {
    return this.gameModel.findOneAndUpdate(
      {
        _id: gameId,
      },
      game,
    );
  }

  applyDiscountToGamesHavingAReleaseDateBetween(
    discountPercent: number,
    startDate: string,
    endDate: string,
  ) {
    const discount = (ONE_HUNDRED - discountPercent) / ONE_HUNDRED;
    return this.gameModel
      .updateMany(
        {
          releaseDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
        {
          $mul: {
            price: discount,
          },
        },
      )
      .exec();
  }

  async deleteGame(gameId: string) {
    return await this.gameModel.deleteOne({
      _id: gameId,
    });
  }

  deleteGamesWithReleaseDateOlderThan(releaseDate: string) {
    return this.gameModel
      .deleteMany({
        releaseDate: new Date(releaseDate),
      })
      .exec();
  }
}
