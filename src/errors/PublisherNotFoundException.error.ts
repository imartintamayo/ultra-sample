import { HttpException, HttpStatus } from '@nestjs/common';

export class PublisherNotFoundException extends HttpException {
  constructor(siret) {
    super(`Publisher with siret: "${siret}" not found`, HttpStatus.NOT_FOUND);
    this.name = 'PublisherNotFoundException';
  }
}
