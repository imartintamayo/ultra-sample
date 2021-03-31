import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesService {
  getGames() {
    return ['game'];
  }

  getGame(gameId: string) {
    return `game${gameId}`;
  }

  getPublisher(gameId: string) {
    return `publishergame${gameId}`;
  }

  createGame(game) {
    return `newGame + ${JSON.stringify(game, undefined, 2)}`;
  }

  updateGame(gameId: string, game) {
    return `Updated game ${gameId} + ${JSON.stringify(game, undefined, 2)}`;
  }

  applyDiscountToGamesHavingAReleaseDateBetween(
    discount: string,
    releaseDate1: string,
    releaseDate2: string,
  ) {
    return `apply-discount/${discount}/to-games-having-a-release-date-between/${releaseDate1}/and/${releaseDate2}`;
  }

  deleteGame(gameId: string) {
    return `Deleted game${gameId}`;
  }

  deleteGamesWithReleaseDateOlderThan(releaseDate: string) {
    return `remove-games-with-release-date-older-than/${releaseDate}`;
  }
}
