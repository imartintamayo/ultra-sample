import { Model } from 'mongoose';
import { GameDocument } from '../../schemas/game.schema';
const DEFAULT_DISCOUNT = 20;
const EIGHT_TEEN = 18;
const TWELVE = 12;

const substracMonths = (date: Date, months: number) => {
  const nDate = new Date(date);
  nDate.setMonth(nDate.getMonth() - months);
  return nDate;
};

const dateToStartOfDay = (date: Date) => {
  const nDate = new Date(date);
  nDate.setHours(0);
  nDate.setMinutes(0);
  nDate.setSeconds(0);
  nDate.setMilliseconds(0);
  return nDate;
};

const dateToEndOfDay = (date: Date) => {
  const nDate = new Date(date);
  nDate.setHours(23);
  nDate.setMinutes(59);
  nDate.setSeconds(59);
  nDate.setMilliseconds(999);
  return nDate;
};

const getDiscountToApply = (discountPercent: number) => {
  return (100 - discountPercent) / 100;
};

const deleteGamesWithReleaseDateOlderThan = async (
  gameModel: Model<GameDocument>,
  releaseDate: Date,
) => {
  let date: Date = substracMonths(releaseDate, EIGHT_TEEN);
  date = dateToStartOfDay(date);

  const gamesToDelete = await gameModel
    .find({
      releaseDate: {
        $lt: date,
      },
    })
    .exec();

  const result = await gameModel
    .deleteMany({
      releaseDate: {
        $lt: date,
      },
    })
    .exec();

  return {
    deletedGames: gamesToDelete,
    result,
  };
};

const applyDiscountToGamesWithReleaseDateBetween = async (
  gameModel: Model<GameDocument>,
  releaseDate: Date,
  discountPercent: number,
) => {
  let startDate: Date = substracMonths(releaseDate, EIGHT_TEEN);
  startDate = dateToStartOfDay(startDate);

  let endDate: Date = substracMonths(releaseDate, TWELVE);
  endDate = dateToEndOfDay(endDate);

  const discount = getDiscountToApply(discountPercent);

  const gamesBeforeUpdate = await gameModel;
  gameModel
    .find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .exec();

  const result = gameModel
    .updateMany(
      {
        releaseDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      {
        $mul: {
          price: discount,
        },
      },
    )
    .exec();

  const gamesAfterUpdate = await gameModel;
  gameModel
    .find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .exec();

  return {
    gamesBeforeUpdate,
    gamesAfterUpdate,
    result,
  };
};

export const applyDiscountAndDeleteOlderGamesProcess = async (
  gameModel: Model<GameDocument>,
) => {
  const releaseDate = new Date();
  const deletedGames = await deleteGamesWithReleaseDateOlderThan(
    gameModel,
    releaseDate,
  );
  const updatedGames = await applyDiscountToGamesWithReleaseDateBetween(
    gameModel,
    releaseDate,
    DEFAULT_DISCOUNT,
  );

  return {
    deletedGames,
    updatedGames,
  };
};
