import { RoleEnum } from '../roles/dto/roles.dto';

export interface JwtPayload {
  id: string;
  username: string;
  name: string;
  role: RoleEnum;
}
