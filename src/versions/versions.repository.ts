import { Version } from './version.entity';
import { Repository, DataSource } from 'typeorm';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class VersionsRepository extends Repository<Version> {
  private logger = new Logger('VersionsRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Version, dataSource.createEntityManager());
  }

  async getVersion(serviceId) {
    return await this.findOneBy({ serviceId });
  }

  async createVersion({
    serviceId,
    versions,
  }: {
    serviceId: string;
    versions: string[];
  }) {
    const newVersion = this.create({ versions, serviceId });
    await this.save(newVersion);
    this.logger.verbose(`Version created for service ID ${serviceId}`);
  }

  async updateVersion({
    serviceId,
    versions,
  }: {
    serviceId: string;
    versions: string[];
  }) {
    const version = await this.getVersion(serviceId);
    version.versions = versions;
    await this.save(version);
    this.logger.verbose(`Version added for service ID ${serviceId}`);
  }
}
