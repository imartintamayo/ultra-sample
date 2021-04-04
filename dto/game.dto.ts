class PublisherDto {
    name: string;
    phone: string;
    siret: number;
}

export class CreateGameDto {
    title: string;
    price: number;
    releaseDate: Date;
    tags: string[] = [];
    publisher: PublisherDto;
}