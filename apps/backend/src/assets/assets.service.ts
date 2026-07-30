import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Asset, AssetStatus, AssetType } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async findAll(page = 1, limit = 20, type?: AssetType) {
    const where: FindOptionsWhere<Asset> = {
      status: AssetStatus.PUBLISHED,
    };

    if (type) {
      where.type = type;
    }

    const [items, total] = await this.assetsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findByTitle(title: string): Promise<Asset | null> {
    return this.assetsRepository.findOne({ where: { title } });
  }

  async findById(id: string): Promise<Asset | null> {
    return this.assetsRepository.findOne({ where: { id } });
  }

  async create(
    createAssetDto: CreateAssetDto,
    creatorId: string,
  ): Promise<Asset> {
    const asset = this.assetsRepository.create({
      ...createAssetDto,
      creatorId,
    });
    return this.assetsRepository.save(asset);
  }

  async publish(id: string, creatorId: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.creatorId !== creatorId) {
      throw new ForbiddenException('You can only publish your own assets');
    }

    asset.status = AssetStatus.PUBLISHED;
    asset.publishedAt = new Date();

    return this.assetsRepository.save(asset);
  }

  async delete(id: string): Promise<void> {
    await this.assetsRepository.delete(id);
  }

  async findByCreator(creatorId: string, page = 1, limit = 20) {
    const [items, total] = await this.assetsRepository.findAndCount({
      where: { creatorId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }
}
