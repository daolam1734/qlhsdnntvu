import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TaiLieuDinhKem } from './file.entity';
import { RecordsModule } from '../records/records.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaiLieuDinhKem]), RecordsModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}