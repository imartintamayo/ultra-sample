import { Model } from 'mongoose';
import { GameDocument } from '../games/schemas/game.schema';

export interface ApplyDiscountAndDeleteOlderGamesConfig {
  gameModel: Model<GameDocument>;
  releaseDate: Date;
  discountPercent: number;
  applyToGamesWithReleaseDateMinusMonthsStart: number;
  applyToGamesWithReleaseDateMinusMonthsEnd: number;
}

export interface ReleaseDateFilter {
  $lt?: Date;
  $lte?: Date;
  $gte?: Date;
}

export interface DeleteWriteOpResult {
  n?: number;
  ok?: number;
  deletedCount?: number;
}

export interface UpdateWriteOpResult {
  n: number;
  ok: number;
  nModified: number;
}

export interface ApplyDiscountToGamesResult {
  gamesBeforeUpdate: GameDocument[];
  gamesAfterUpdate: GameDocument[];
  result: UpdateWriteOpResult;
}

export interface DeleteOlderGamesResult {
  deletedGames: GameDocument[];
  result: DeleteWriteOpResult;
}

export interface ApplyDiscountAndDeleteOlderGamesResult {
  deletedGames: DeleteOlderGamesResult;
  updatedGames: ApplyDiscountToGamesResult;
}
