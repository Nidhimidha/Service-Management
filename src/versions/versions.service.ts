import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionsRepository } from './versions.repository';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(VersionsRepository)
    private versionRepository: VersionsRepository,
  ) {}

  /**
   * Listening to event version.set
   * If service ID already exists, pushes the version to already existing versions array
   * If not, adds a new row of version for the given service ID
   */
  @OnEvent('version.set')
  async handleSetVersionEvent(payload: { serviceId: string; version: string }) {
    const { serviceId, version } = payload;
    const existingVersion = await this.versionRepository.getVersion(serviceId);

    if (existingVersion?.serviceId) {
      const { versions } = existingVersion;
      versions.push(version);
      this.versionRepository.updateVersion({ serviceId, versions });
      return;
    }
    this.versionRepository.createVersion({ serviceId, versions: [version] });
  }

  /**
   * Listening to event version.delete
   * Deletes the record from version table for given service ID
   */
  @OnEvent('version.delete')
  async handleDeleteVersionEvent(payload: { serviceId }) {
    const { serviceId } = payload;
    const result = await this.versionRepository.delete(serviceId);
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Version with Service ID ${serviceId} not found`,
      );
    }
  }

  /**
   * Fetches versions for given service ID
   */
  async getVersions(serviceId: string): Promise<string[]> {
    const versions = await this.versionRepository.getVersion(serviceId);
    if (versions?.versions) {
      return versions.versions;
    }
    throw new NotFoundException(
      `Version for Service ID ${serviceId} not found`,
    );
  }
}
