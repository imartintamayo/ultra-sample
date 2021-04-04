import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GamesService } from './games.service';
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  getGames() {
    return this.gamesService.getGames();
  }

  @Get(':gameId')
  getGame(@Param('gameId') gameId: string) {
    return this.gamesService.getGame(gameId);
  }

  @Get(':gameId/publisher')
  getPublisher(@Param('gameId') gameId: string) {
    return this.gamesService.getPublisher(gameId);
  }

  @Post()
  createGame(@Body() body) {
    return this.gamesService.createGame(body);
  }

  @Put(':gameId')
  updateGame(@Param('gameId') gameId: string, @Body() body) {
    return this.gamesService.updateGame(gameId, body);
  }

  @Put(
    'apply-discount/:discountPercent/to-games-having-a-release-date-between/:startDate/and/:endDate',
  )
  applyDiscountToGamesHavingAReleaseDateBetween(
    @Param('discountPercent') discountPercent: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    return this.gamesService.applyDiscountToGamesHavingAReleaseDateBetween(
      Number.parseInt(discountPercent, 10),
      startDate,
      endDate,
    );
  }

  @Delete(':gameId')
  deleteGame(@Param('gameId') gameId: string) {
    return this.gamesService.deleteGame(gameId);
  }

  @Delete('remove-games-with-release-date-older-than/:releaseDate')
  deleteGamesWithReleaseDateOlderThan(
    @Param('releaseDate') releaseDate: string,
  ) {
    return this.gamesService.deleteGamesWithReleaseDateOlderThan(releaseDate);
  }
}
