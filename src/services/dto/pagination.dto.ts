import { IsOptional, IsIn } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

export class SortingDto {
  @IsOptional()
  @IsIn(['name', 'description', 'versionCount', 'lastModifiedAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
