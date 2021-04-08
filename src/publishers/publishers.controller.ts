import { Controller, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePublisherDto } from '../dto/publisher.dto';
import { Publisher as PublisherEntity } from '../entities/publisher.entity';

@ApiTags('PUBLISHERS')
@Controller('publishers')
export class PublishersController {
  constructor(private publishersService: PublishersService) {}

  @Get()
  @ApiOperation({ summary: 'List publishers' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [PublisherEntity],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  getPublishers(): Promise<PublisherEntity[]> {
    return this.publishersService.getPublishers();
  }

  @Post()
  @ApiOperation({ summary: 'Create publisher' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PublisherEntity,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  createPublisher(@Body() body: CreatePublisherDto): Promise<PublisherEntity> {
    return this.publishersService.createPublisher(body);
  }
}
