import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreateGameDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsNumber()
    @Min(0)
    price: number;

    @IsDateString()
    releaseDate: Date;

    @IsArray()
    tags?: string[] = [];

    @IsNumber()
    publisher: number;
}