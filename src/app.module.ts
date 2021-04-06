import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './config/environment';
import { GamesModule } from './games/games.module';
import { PublishersModule } from './publishers/publishers.module';

@Module({
  imports: [
    GamesModule,
    MongooseModule.forRoot(environment.mongoConnect),
    PublishersModule,
  ],
})
export class AppModule {}
