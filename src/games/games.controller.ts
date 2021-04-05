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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from '../../dto/game.dto';
@ApiTags('GAMES')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'List games' })
  @ApiResponse({ status: 200, description: 'The list of games' })
  getGames() {
    return this.gamesService.getGames();
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Find game by gameId' })
  @ApiResponse({ status: 200, description: 'The found game' })
  getGame(@Param('gameId') gameId: string) {
    return this.gamesService.getGame(gameId);
  }

  @Get(':gameId/publisher')
  @ApiOperation({ summary: 'Get game publisher info by gameId' })
  @ApiResponse({ status: 200, description: 'The found game publisher info' })
  getPublisher(@Param('gameId') gameId: string) {
    return this.gamesService.getPublisher(gameId);
  }

  @Post()
  @ApiOperation({ summary: 'Create game' })
  @ApiResponse({ status: 201, description: 'The created game' })
  createGame(@Body() body: CreateGameDto) {
    return this.gamesService.createGame(body);
  }

  @Put(':gameId')
  @ApiOperation({ summary: 'Update game by gameId' })
  @ApiResponse({ status: 200, description: 'The updated game' })
  updateGame(@Param('gameId') gameId: string, @Body() body) {
    return this.gamesService.updateGame(gameId, body);
  }

  @Delete(':gameId')
  @ApiOperation({ summary: 'Delete game by gameId' })
  @ApiResponse({ status: 200, description: 'The deleted game' })
  deleteGame(@Param('gameId') gameId: string) {
    return this.gamesService.deleteGame(gameId);
  }

  @Delete('remove-games-with-release-date-older-than/:releaseDate')
  deleteGamesWithReleaseDateOlderThan(
    @Param('releaseDate') releaseDate: string,
  ) {
    return this.gamesService.deleteGamesWithReleaseDateOlderThan(releaseDate);
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
}
