import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  siret: number;
}
