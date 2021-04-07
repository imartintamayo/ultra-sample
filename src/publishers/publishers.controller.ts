import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePublisherDto } from '../dto/publisher.dto';

@ApiTags('PUBLISHERS')
@Controller('publishers')
export class PublishersController {
  constructor(private publishersService: PublishersService) {}

  @Get()
  @ApiOperation({ summary: 'List publishers' })
  @ApiResponse({ status: 200, description: 'The list of publishers' })
  getPublishers() {
    return this.publishersService.getPublishers();
  }

  @Post()
  @ApiOperation({ summary: 'Create publisher' })
  @ApiResponse({ status: 201, description: 'The created publisher' })
  createPublisher(@Body() body: CreatePublisherDto) {
    return this.publishersService.createPublisher(body);
  }
}
