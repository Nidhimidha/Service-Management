import { Module } from '@nestjs/common';
import { VersionsService } from './versions.service';
import { VersionsRepository } from './versions.repository';
import { VersionsController } from './versions.controller';
import { Version } from './version.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Version]), AuthModule],
  controllers: [VersionsController],
  providers: [VersionsService, VersionsRepository],
})
export class VersionsModule {}
