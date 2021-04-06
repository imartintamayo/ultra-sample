import { Model } from 'mongoose';
import { GameDocument } from '../schemas/game.schema';

export class ApplyDiscountAndDeleteOlderGames {
    gameModel: Model<GameDocument>;
    releaseDate: Date;
    discountPercent: number;
    applyToGamesWithReleaseDateMinusMonthsStart: number;
    applyToGamesWithReleaseDateMinusMonthsEnd: number;
}