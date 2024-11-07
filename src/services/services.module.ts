import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesRepository } from './services.repository';
import { Service } from './service.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Service]), AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
