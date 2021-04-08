import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { Game as GameEntity } from './entities/game.entity';
import { Publisher as PublisherEntity } from '../publishers/entities/publisher.entity';
@ApiTags('GAMES')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'List games' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GameEntity],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getGames(): Promise<GameEntity[]> {
    return this.gamesService.getGames();
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Find game by gameId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GameEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getGame(@Param('gameId') gameId: string): Promise<GameEntity> {
    return this.gamesService.getGameById(gameId);
  }

  @Get(':gameId/publisher')
  @ApiOperation({ summary: 'Get game publisher info by gameId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PublisherEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getPublisher(@Param('gameId') gameId: string): Promise<PublisherEntity> {
    return this.gamesService.getGamePublisherByGameId(gameId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create game' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GameEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  createGame(@Body() body: CreateGameDto): Promise<GameEntity> {
    return this.gamesService.createGame(body);
  }

  @Put(':gameId/update')
  @ApiOperation({ summary: 'Update game by gameId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GameEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  updateGame(
    @Param('gameId') gameId: string,
    @Body() body: UpdateGameDto,
  ): Promise<GameEntity> {
    return this.gamesService.updateGameById(gameId, body);
  }

  @Delete(':gameId/delete')
  @ApiOperation({ summary: 'Delete game by gameId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GameEntity,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  deleteGame(@Param('gameId') gameId: string): Promise<GameEntity> {
    return this.gamesService.deleteGameById(gameId);
  }

  @Post('trigger-apply-discount-and-delete-older-games-process')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  triggerApplyDiscountAndDeleteOlderGamesProcess() {
    return this.gamesService.triggerApplyDiscountAndDeleteOlderGamesProcess();
  }
}
