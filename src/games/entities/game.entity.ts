import { ApiProperty } from '@nestjs/swagger';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { GameDocument } from '../schemas/game.schema';
import { PublisherDocument } from '../../publishers/schemas/publisher.schema';
import { Publisher as PublisherEntity } from '../../publishers/entities/publisher.entity';

export class Game {
  constructor(game?: GameDocument, publisher?: PublisherDocument) {
    this.id = game?._id;
    this.title = game?.title;
    this.price = game?.price;
    this.releaseDate = game?.releaseDate;
    this.tags = game?.tags;
    this.publisher = new PublisherEntity(
      publisher ? publisher : game?.publisher,
    );
  }

  @ApiProperty({ example: 'someId', description: 'The id of the Game' })
  id: string;

  @ApiProperty({ example: 'some title', description: 'The title of the Game' })
  title: string;

  @ApiProperty({ example: 10, description: 'The price of the Game' })
  price: number;

  @ApiProperty({
    example: 'some release date',
    description: 'The release date of the Game',
  })
  releaseDate: Date;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'The tags of the Game',
  })
  tags?: string[] = [];

  @ApiProperty({
    example: { name: 'some name', siret: 1234, phone: 'some phone' },
    description: 'The publisher of the Game',
  })
  publisher: Publisher;
}
