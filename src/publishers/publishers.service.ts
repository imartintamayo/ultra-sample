import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from './schemas/publisher.schema';
import { Publisher as PublisherEntity } from './entities/publisher.entity';
import { CreatePublisherDto } from './dto/publisher.dto';
import { PublisherConflictException } from './errors/PublisherConflictException.error';
import { PublisherNotFoundException } from './errors/PublisherNotFoundException.error';

@Injectable()
export class PublishersService {
  constructor(
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  private _savePublisher(publisher: Publisher): Promise<PublisherDocument> {
    const createdPublisher = new this.publisherModel(publisher);
    return createdPublisher.save();
  }

  private _findPublishers(): Promise<PublisherDocument[]> {
    return this.publisherModel.find().exec();
  }

  findPublisherBySiret(siret: number): Promise<PublisherDocument> {
    return this.publisherModel
      .findOne({
        siret,
      })
      .exec();
  }

  async getPublishers(): Promise<PublisherEntity[]> {
    const publishers = await this._findPublishers();
    return publishers.map((publisher) => new PublisherEntity(publisher));
  }

  async createPublisher(
    publisherDto: CreatePublisherDto,
  ): Promise<PublisherEntity> {
    const siret = publisherDto.siret;
    let publisher = await this.findPublisherBySiret(siret);

    if (publisher) {
      throw new PublisherConflictException(siret);
    }

    const createdPublisher = await this._savePublisher(publisherDto);
    return new PublisherEntity(createdPublisher);
  }
}
