import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  releaseDate: Date;

  @IsString({
    each: true,
  })
  tags?: string[] = [];

  @IsNumber()
  publisher: number;
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @IsOptional()
  @IsString({
    each: true,
  })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  publisher?: number;
}
