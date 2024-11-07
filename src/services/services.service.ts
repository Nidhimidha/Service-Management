import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Service } from './service.entity';
import { AddServiceDto } from './dto/add-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesRepository } from './services.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/auth/user.entity';
import { PaginationDto, SortingDto } from './dto/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesRepository)
    private servicesRepository: ServicesRepository,

    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Fetches all services, and applies pagination, sorting and filtering based on query
   */
  async getServices({
    filterDto,
    user,
    pagination,
    sorting,
  }: {
    filterDto: FilterServiceDto;
    user: User;
    pagination: PaginationDto;
    sorting: SortingDto;
  }): Promise<Service[]> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const validSortFields = [
      'name',
      'description',
      'versionCount',
      'lastModifiedAt',
    ];
    if (sorting.sortBy && !validSortFields.includes(sorting.sortBy)) {
      throw new BadRequestException(`Invalid sort field: ${sorting.sortBy}`);
    }
    return this.servicesRepository.getServices({
      filterDto,
      user,
      pagination,
      sorting,
    });
  }

  /**
   * Fetches service for a given service id
   */
  async getServiceById(id: string): Promise<Service> {
    const foundService = this.servicesRepository.findOneBy({ id });
    if (!foundService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return foundService;
  }

  /**
   * Adds a new service, and emits event to set new version
   */
  async addNewService(addServiceDto: AddServiceDto): Promise<Service> {
    const service = await this.servicesRepository.addNewService(addServiceDto);
    this.eventEmitter.emit('version.set', {
      serviceId: service.id,
      version: addServiceDto.version,
    });
    return service;
  }

  /**
   * Deletes the service for given service id, and emits event to delete version record
   */
  async deleteService(id: string): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    this.eventEmitter.emit('version.delete', {
      serviceId: id,
    });
  }

  /**
   * Updates the service for given service id, and emits event to set version record
   */
  async updateService(
    id: string,
    addServiceDto: AddServiceDto,
  ): Promise<Service> {
    const { name, description, version } = addServiceDto;
    const service = await this.getServiceById(id);
    const currentVersionCount = service.versionCount;
    service.name = name;
    service.description = description;
    service.versionCount = currentVersionCount + 1;
    await this.servicesRepository.save(service);
    this.eventEmitter.emit('version.set', {
      serviceId: service.id,
      version,
    });
    return service;
  }
}
