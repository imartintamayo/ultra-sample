import { ApiProperty } from '@nestjs/swagger';
import { PublisherDocument } from '../schemas/publisher.schema';

export class Publisher {
  constructor(publisher?: PublisherDocument) {
    this.name = publisher?.name;
    this.siret = publisher?.siret;
    this.phone = publisher?.phone;
  }

  @ApiProperty({
    example: 'some title',
    description: 'The name of the Publisher',
  })
  name: string;

  @ApiProperty({ example: 10, description: 'The siret of the Publisher' })
  siret: number;

  @ApiProperty({
    example: 'some release date',
    description: 'The phone of the Publisher',
  })
  phone: string;
}
