import { HttpException, HttpStatus } from '@nestjs/common';

export class GameNotFoundException extends HttpException {
  constructor(gameId) {
    super(`Game not found with gameId: "${gameId}"`, HttpStatus.NOT_FOUND);
    this.name = 'GameNotFoundException';
  }
}
