import { Test } from '@nestjs/testing';
import { VersionsService } from '../../versions/versions.service';
import { VersionsRepository } from '../../versions/versions.repository';

describe('VersionsService', () => {
  let versionsService: VersionsService;
  let versionsRepository: VersionsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VersionsService,
        {
          provide: VersionsRepository,
          useValue: {
            getVersion: jest.fn(),
            updateVersion: jest.fn(),
            createVersion: jest.fn(),
          },
        },
      ],
    }).compile();
    versionsService = moduleRef.get(VersionsService);
    versionsRepository = moduleRef.get(VersionsRepository);
  });

  describe('handleSetVersionEvent', () => {
    test('should add a new version to an existing service ID', async () => {
      const id = 'test-version-id';
      const serviceId = 'test-service-id';
      const version = '1.1.0';
      const existingVersions = { id, serviceId, versions: ['1.0.0'] };
      jest.spyOn(versionsRepository, 'getVersion').mockImplementation(async () => existingVersions);
      await versionsService.handleSetVersionEvent({ serviceId, version });
      expect(versionsRepository.updateVersion).toHaveBeenCalledWith({
        serviceId,
        versions: ['1.0.0', '1.1.0'],
      });
    });

    test('should create a new version entry if service ID does not exist', async () => {
      const serviceId = 'test-service-id';
      const version = '1.0.0';
      jest.spyOn(versionsRepository, 'getVersion').mockImplementation(async () => null);
      await versionsService.handleSetVersionEvent({ serviceId, version });
      expect(versionsRepository.createVersion).toHaveBeenCalledWith({
        serviceId,
        versions: [version],
      });
    });
  });
});
