import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Request,
  Param,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Asset } from './asset.entity';
import { QueryAssetsDto } from './dto/query-assets.dto';

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createAssetDto: CreateAssetDto,
    @Request() req,
  ): Promise<Asset> {
    const creatorId = req.user.id;
    return this.assetsService.create(createAssetDto, creatorId);
  }
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Param('id') id: string, @Request() req): Promise<Asset> {
    return this.assetsService.publish(id, req.user.id);
  }

  @Get()
  async findAll(@Query() query: QueryAssetsDto) {
    return this.assetsService.findAll(query.page, query.limit, query.type);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async findMine(@Request() req, @Query() query: QueryAssetsDto) {
    return this.assetsService.findByCreator(
      req.user.id,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Asset | null> {
    return this.assetsService.findById(id);
  }
}
