import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './service.entity';
import { AddServiceDto } from './dto/add-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { PaginationDto, SortingDto } from './dto/pagination.dto';

@Controller('services')
@UseGuards(AuthGuard())
export class ServicesController {
  private logger = new Logger('ServicesController', { timestamp: true });
  constructor(private servicesService: ServicesService) {}

  @Get()
  async getServices(
    @Query() filterDto: FilterServiceDto,
    @GetUser() user: User,
    @Query() pagination: PaginationDto,
    @Query() sorting: SortingDto,
  ): Promise<Service[]> {
    this.logger.verbose(`User ${user.username} retreiving all services`);
    return await this.servicesService.getServices({
      filterDto,
      user,
      pagination,
      sorting,
    });
  }

  @Get('/:id')
  async getServiceById(@Param('id') id: string): Promise<Service> {
    return await this.servicesService.getServiceById(id);
  }

  @Post()
  async addNewService(@Body() addServiceDto: AddServiceDto): Promise<Service> {
    return await this.servicesService.addNewService(addServiceDto);
  }

  @Delete('/:id')
  async deleteService(@Param('id') id: string): Promise<void> {
    return await this.servicesService.deleteService(id);
  }

  @Patch('/:id')
  async updateService(
    @Param('id') id: string,
    @Body() addServiceDto: AddServiceDto,
  ): Promise<Service> {
    return await this.servicesService.updateService(id, addServiceDto);
  }
}
