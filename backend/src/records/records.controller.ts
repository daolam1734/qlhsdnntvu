import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { HoSoDiNuocNgoai } from './record.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  @Roles('user', 'admin', 'party')
  findAll(): Promise<HoSoDiNuocNgoai[]> {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin', 'party')
  findOne(@Param('id') id: string): Promise<HoSoDiNuocNgoai> {
    return this.recordsService.findOne(+id);
  }

  @Post()
  @Roles('user')
  create(@Body() record: Partial<HoSoDiNuocNgoai>): Promise<HoSoDiNuocNgoai> {
    return this.recordsService.create(record);
  }

  @Put(':id')
  @Roles('admin', 'party')
  update(@Param('id') id: string, @Body() record: Partial<HoSoDiNuocNgoai>): Promise<HoSoDiNuocNgoai> {
    return this.recordsService.update(+id, record);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.recordsService.remove(+id);
  }
}