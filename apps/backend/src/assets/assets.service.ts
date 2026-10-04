import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Asset, AssetStatus, AssetType } from './asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    private configService: ConfigService,
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
    const fileUrl = createAssetDto.fileKey
      ? `${this.configService.get('R2_PUBLIC_URL')}/${createAssetDto.fileKey}`
      : null;
    const asset = this.assetsRepository.create({
      ...createAssetDto,
      creatorId,
      fileUrl,
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

  async unpublish(id: string, creatorId: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.creatorId !== creatorId) {
      throw new ForbiddenException('You can only unpublish your own assets');
    }

    asset.status = AssetStatus.DRAFT;
    asset.publishedAt = null;

    return this.assetsRepository.save(asset);
  }

  async update(
    id: string,
    updateAssetDto: UpdateAssetDto,
    creatorId: string,
  ): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.creatorId !== creatorId) {
      throw new ForbiddenException('You can only edit your own assets');
    }

    Object.assign(asset, updateAssetDto);
    return this.assetsRepository.save(asset);
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

  async deleteById(id: string, creatorId: string): Promise<void> {
    const asset = await this.assetsRepository.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.creatorId !== creatorId) {
      throw new ForbiddenException('You can only delete your own assets');
    }

    await this.assetsRepository.delete(id);
  }
}
