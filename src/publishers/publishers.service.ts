import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from '../../schemas/publisher.schema';
import { CreatePublisherDto } from '../../dto/publisher.dto';

@Injectable()
export class PublishersService {
  constructor(
    @InjectModel(Publisher.name)
    private publisherModel: Model<PublisherDocument>,
  ) {}

  getPublishers(): Promise<Publisher[]> {
    return this.publisherModel.find().exec();
  }

  getPublisher(publisherId: string): Promise<Publisher> {
    return this.publisherModel.findById(publisherId).exec();
  }

  async createPublisher(publisherDto: CreatePublisherDto): Promise<Publisher> {
    const siret = publisherDto.siret;
    let publisher = await this.publisherModel.findOne({
      siret,
    });

    if (publisher) {
      throw new Error(`A Publisher with siret: ${siret} already exists`);
    }

    const createdGame = new this.publisherModel({
      ...publisherDto,
    });
    return createdGame.save();
  }

  async updatePublisher(publisherId: string, publisherDto) {
    let publisher = await this.publisherModel.findOne({
      _id: publisherId,
    });

    if (!publisher) {
      throw new Error(`Publisher not found with publisherId: ${publisherId}`);
    }

    const siret = publisherDto.siret;

    if (siret) {
      publisher = await this.publisherModel.findOne({
        siret,
      });

      if (publisher) {
        throw new Error(`A Publisher with siret: ${siret} already exists`);
      }
    }

    return this.publisherModel.updateOne(
      {
        _id: publisherId,
      },
      {
        $set: publisherDto,
      },
    );
  }

  deletePublisher(publisherId: string) {
    return this.publisherModel.deleteOne({
      _id: publisherId,
    });
  }
}
