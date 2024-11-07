import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VersionsService } from './versions.service';

@Controller('versions')
@UseGuards(AuthGuard())
export class VersionsController {
  constructor(private versionsService: VersionsService) {}

  @Get('/:id')
  async getVersionByServiceId(@Param('id') id: string): Promise<string[]> {
    return await this.versionsService.getVersions(id);
  }
}
