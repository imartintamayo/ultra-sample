import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';
import { Publisher as PublisherEntity } from '../entities/publisher.entity';
import { CreatePublisherDto } from '../dto/publisher.dto';
import { PublisherConflictException } from '../errors/PublisherConflictException.error';

@Injectable()
export class PublishersService {
  constructor(
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  async getPublishers(): Promise<PublisherEntity[]> {
    const publishers = await this.publisherModel.find().exec();
    return publishers.map((publisher) => new PublisherEntity(publisher));
  }

  async createPublisher(
    publisherDto: CreatePublisherDto,
  ): Promise<PublisherEntity> {
    const siret = publisherDto.siret;
    let publisher = await this.publisherModel.findOne({
      siret,
    });

    if (publisher) {
      throw new PublisherConflictException(siret);
    }

    const createdPublisher = new this.publisherModel({
      ...publisherDto,
    });
    await createdPublisher.save();

    return new PublisherEntity(createdPublisher);
  }
}
