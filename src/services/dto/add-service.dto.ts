import { IsNotEmpty } from 'class-validator';
export class AddServiceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  version: string;
}
