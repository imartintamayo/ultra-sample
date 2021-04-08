import { ApplyDiscountAndDeleteOlderGames } from '../games/dto/apply-discount-and-delete-older-games.entity';

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

const deleteGamesWithReleaseDateOlderThan = async ({
  gameModel,
  releaseDate,
  applyToGamesWithReleaseDateMinusMonthsEnd,
}: ApplyDiscountAndDeleteOlderGames) => {
  let date: Date = substracMonths(
    releaseDate,
    applyToGamesWithReleaseDateMinusMonthsEnd,
  );
  date = dateToStartOfDay(date);

  const gamesToDelete = await gameModel
    .find({
      releaseDate: {
        $lt: date,
      },
    })
    .populate('publisher')
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

const applyDiscountToGamesWithReleaseDateBetween = async ({
  gameModel,
  releaseDate,
  discountPercent,
  applyToGamesWithReleaseDateMinusMonthsStart,
  applyToGamesWithReleaseDateMinusMonthsEnd,
}: ApplyDiscountAndDeleteOlderGames) => {
  let startDate: Date = substracMonths(
    releaseDate,
    applyToGamesWithReleaseDateMinusMonthsEnd,
  );
  startDate = dateToStartOfDay(startDate);

  let endDate: Date = substracMonths(
    releaseDate,
    applyToGamesWithReleaseDateMinusMonthsStart,
  );
  endDate = dateToEndOfDay(endDate);

  const discount = getDiscountToApply(discountPercent);

  const gamesBeforeUpdate = await gameModel
    .find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .populate('publisher')
    .exec();

  const result = await gameModel
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

  const gamesAfterUpdate = await gameModel
    .find({
      releaseDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
    .populate('publisher')
    .exec();

  return {
    gamesBeforeUpdate,
    gamesAfterUpdate,
    result,
  };
};

export const applyDiscountAndDeleteOlderGamesProcess = async (
  config: ApplyDiscountAndDeleteOlderGames,
) => {
  const deletedGames = await deleteGamesWithReleaseDateOlderThan(config);
  const updatedGames = await applyDiscountToGamesWithReleaseDateBetween(config);

  return {
    deletedGames,
    updatedGames,
  };
};
