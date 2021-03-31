import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';

@Module({
  imports: [],
  controllers: [AppController, GamesController],
  providers: [AppService, GamesService],
})
export class AppModule {}
