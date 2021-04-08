import { GameDocument } from 'src/games/schemas/game.schema';
import {
  ApplyDiscountAndDeleteOlderGamesConfig,
  ReleaseDateFilter,
  UpdateWriteOpResult,
  DeleteWriteOpResult,
  ApplyDiscountToGamesResult,
  DeleteOlderGamesResult,
  ApplyDiscountAndDeleteOlderGamesResult,
} from '../types/types';

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

const findGamesByReleaseDate = (
  gameModel,
  releaseDateFilter: ReleaseDateFilter,
): Promise<GameDocument[]> => {
  return gameModel
    .find({
      releaseDate: releaseDateFilter,
    })
    .populate('publisher')
    .exec();
};

const deleteGamesByReleaseDate = (
  gameModel,
  releaseDateFilter: ReleaseDateFilter,
): Promise<DeleteWriteOpResult> => {
  return gameModel
    .deleteMany({
      releaseDate: releaseDateFilter,
    })
    .exec();
};

const updateGamesByReleaseDate = (
  gameModel,
  releaseDateFilter: ReleaseDateFilter,
  discount: number,
): Promise<UpdateWriteOpResult> => {
  return gameModel
    .updateMany(
      {
        releaseDate: releaseDateFilter,
      },
      {
        $mul: {
          price: discount,
        },
      },
    )
    .exec();
};

const deleteGamesWithReleaseDateOlderThan = async ({
  gameModel,
  releaseDate,
  applyToGamesWithReleaseDateMinusMonthsEnd,
}: ApplyDiscountAndDeleteOlderGamesConfig): Promise<DeleteOlderGamesResult> => {
  let date: Date = substracMonths(
    releaseDate,
    applyToGamesWithReleaseDateMinusMonthsEnd,
  );
  date = dateToStartOfDay(date);

  const releaseDateFilter: ReleaseDateFilter = { $lt: date };
  const gamesToDelete: GameDocument[] = await findGamesByReleaseDate(
    gameModel,
    releaseDateFilter,
  );
  const result: DeleteWriteOpResult = await deleteGamesByReleaseDate(
    gameModel,
    releaseDateFilter,
  );

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
}: ApplyDiscountAndDeleteOlderGamesConfig): Promise<ApplyDiscountToGamesResult> => {
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
  const releaseDateFilter: ReleaseDateFilter = {
    $gte: startDate,
    $lte: endDate,
  };

  const gamesBeforeUpdate: GameDocument[] = await findGamesByReleaseDate(
    gameModel,
    releaseDateFilter,
  );
  const result: UpdateWriteOpResult = await updateGamesByReleaseDate(
    gameModel,
    releaseDateFilter,
    discount,
  );
  const gamesAfterUpdate: GameDocument[] = await findGamesByReleaseDate(
    gameModel,
    releaseDateFilter,
  );

  return {
    gamesBeforeUpdate,
    gamesAfterUpdate,
    result,
  };
};

export const applyDiscountAndDeleteOlderGamesProcess = async (
  config: ApplyDiscountAndDeleteOlderGamesConfig,
): Promise<ApplyDiscountAndDeleteOlderGamesResult> => {
  const deletedGames = await deleteGamesWithReleaseDateOlderThan(config);
  const updatedGames = await applyDiscountToGamesWithReleaseDateBetween(config);

  return {
    deletedGames,
    updatedGames,
  };
};
