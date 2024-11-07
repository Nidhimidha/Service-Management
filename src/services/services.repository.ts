import { Repository, DataSource } from 'typeorm';
import { Service } from './service.entity';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AddServiceDto } from './dto/add-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { User } from 'src/auth/user.entity';
import { PaginationDto, SortingDto } from './dto/pagination.dto';

@Injectable()
export class ServicesRepository extends Repository<Service> {
  private logger = new Logger('ServicesRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

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
    const { searchText } = filterDto;
    const query = this.createQueryBuilder('service');
    if (searchText) {
      query.andWhere(
        'service.name ILIKE :searchText OR service.description ILIKE :searchText',
        { searchText: `%${searchText}%` },
      );
    }
    const { page = 1, limit = 10 } = pagination;
    const { sortBy = 'lastModifiedAt', sortOrder = 'DESC' } = sorting;

    query
      .orderBy(`service.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    try {
      const services = await query.getMany();
      return services;
    } catch (error) {
      this.logger.error(
        `Failed to get services for user ${user.username}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async addNewService(addServiceDto: AddServiceDto) {
    const { name, description } = addServiceDto;
    const service = this.create({ name, description });
    await this.save(service);
    return service;
  }
}
