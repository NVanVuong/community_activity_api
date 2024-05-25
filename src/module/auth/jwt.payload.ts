import { RoleEnum } from 'src/common/enum/role.enum';

export interface JwtPayload {
  id: string;
  username: string;
  name: string;
  role: RoleEnum;
}
