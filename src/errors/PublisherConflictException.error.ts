import { HttpException, HttpStatus } from '@nestjs/common';

export class PublisherConflictException extends HttpException {
  constructor(siret) {
    super(
      `A Publisher with siret: "${siret}" already exists`,
      HttpStatus.CONFLICT,
    );
    this.name = 'PublisherConflictException';
  }
}
