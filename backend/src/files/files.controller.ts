import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { TaiLieuDinhKem } from './file.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @Roles('user', 'admin', 'party')
  findAll(): Promise<TaiLieuDinhKem[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin', 'party')
  findOne(@Param('id') id: string): Promise<TaiLieuDinhKem> {
    return this.filesService.findOne(+id);
  }

  @Post('upload/:recordId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  @Roles('user')
  async uploadFile(@UploadedFile() file: any, @Param('recordId') recordId: string) {
    const fileEntity = await this.filesService.create({
      ho_so_id: recordId,
      ten_file: file.originalname,
      duong_dan_file: file.path,
      kich_thuoc: file.size,
    });
    return fileEntity;
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.filesService.remove(+id);
  }
}