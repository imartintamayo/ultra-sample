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
import { CreateGameDto, UpdateGameDto } from '../dto/game.dto';
import { Game as GameEntity } from '../entities/game.entity';
import { Publisher as PublisherEntity } from '../entities/publisher.entity';
@ApiTags('GAMES')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'List games' })
  @ApiResponse({
    status: 200,
    description: 'The list of games',
    type: [GameEntity],
  })
  getGames(): Promise<GameEntity[]> {
    return this.gamesService.getGames();
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Find game by gameId' })
  @ApiResponse({ status: 200, description: 'The found game', type: GameEntity })
  getGame(@Param('gameId') gameId: string): Promise<GameEntity> {
    return this.gamesService.getGame(gameId);
  }

  @Get(':gameId/publisher')
  @ApiOperation({ summary: 'Get game publisher info by gameId' })
  @ApiResponse({
    status: 200,
    description: 'The found game publisher info',
    type: PublisherEntity,
  })
  getPublisher(@Param('gameId') gameId: string): Promise<PublisherEntity> {
    return this.gamesService.getPublisher(gameId);
  }

  @Post()
  @ApiOperation({ summary: 'Create game' })
  @ApiResponse({
    status: 201,
    description: 'The created game',
    type: GameEntity,
  })
  createGame(@Body() body: CreateGameDto): Promise<GameEntity> {
    return this.gamesService.createGame(body);
  }

  @Put(':gameId')
  @ApiOperation({ summary: 'Update game by gameId' })
  @ApiResponse({
    status: 200,
    description: 'The updated game',
    type: GameEntity,
  })
  updateGame(
    @Param('gameId') gameId: string,
    @Body() body: UpdateGameDto,
  ): Promise<GameEntity> {
    return this.gamesService.updateGame(gameId, body);
  }

  @Delete(':gameId')
  @ApiOperation({ summary: 'Delete game by gameId' })
  @ApiResponse({
    status: 200,
    description: 'The deleted game',
    type: GameEntity,
  })
  deleteGame(@Param('gameId') gameId: string): Promise<GameEntity> {
    return this.gamesService.deleteGame(gameId);
  }

  @Post('trigger-apply-discount-and-delete-older-games-process')
  triggerApplyDiscountAndDeleteOlderGamesProcess() {
    return this.gamesService.triggerApplyDiscountAndDeleteOlderGamesProcess();
  }
}
