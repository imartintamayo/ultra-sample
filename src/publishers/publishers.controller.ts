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
import { CreatePublisherDto } from '../../dto/publisher.dto';

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

  @Get(':publisherId')
  @ApiOperation({ summary: 'Find publisher by publisherId' })
  @ApiResponse({ status: 200, description: 'The found publisher' })
  getPublisher(@Param('publisherId') publisherId: string) {
    return this.publishersService.getPublisher(publisherId);
  }

  @Post()
  @ApiOperation({ summary: 'Create publisher' })
  @ApiResponse({ status: 201, description: 'The created publisher' })
  createPublisher(@Body() body: CreatePublisherDto) {
    return this.publishersService.createPublisher(body);
  }

  @Put(':publisherId')
  @ApiOperation({ summary: 'Update publisher by publisherId' })
  @ApiResponse({ status: 200, description: 'The updated publisher' })
  updatePublisher(@Param('publisherId') publisherId: string, @Body() body) {
    return this.publishersService.updatePublisher(publisherId, body);
  }

  @Delete(':publisherId')
  @ApiOperation({ summary: 'Delete publisher by publisherId' })
  @ApiResponse({ status: 200, description: 'The deleted publisher' })
  deletePublisher(@Param('publisherId') publisherId: string) {
    return this.publishersService.deletePublisher(publisherId);
  }
}
