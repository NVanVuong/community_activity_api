import { IsEnum, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/enum/role.enum';
export class RoleDto {
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @IsString()
  description: string;
}
