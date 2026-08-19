import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), StorageModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
