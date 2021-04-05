import { IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, Min } from 'class-validator';
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
    @IsString()
    @IsNotEmpty()
    title?: string;
    
    @IsNumber()
    @Min(0)
    price?: number;

    @IsDateString()
    releaseDate?: Date;

    @IsString({
        each: true,
    })
    tags?: string[] = [];

    @IsNumber()
    publisher?: number;
}