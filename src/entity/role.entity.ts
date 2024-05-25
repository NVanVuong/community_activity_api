import { RoleEnum } from 'src/common/enum/role.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  name: RoleEnum;

  @Column()
  description: string;
}
