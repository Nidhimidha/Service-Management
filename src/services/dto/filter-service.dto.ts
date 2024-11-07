import { IsOptional, IsString } from 'class-validator';
export class FilterServiceDto {
  @IsString()
  @IsOptional()
  searchText?: string;
}
