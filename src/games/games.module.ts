import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game, GameSchema } from './schemas/game.schema';
import {
  Publisher,
  PublisherSchema,
} from '../publishers/schemas/publisher.schema';
import { PublishersService } from '../publishers/publishers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Publisher.name, schema: PublisherSchema },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesService, PublishersService],
})
export class GamesModule {}
