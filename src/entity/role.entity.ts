import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RoleEnum } from 'src/module/roles/dto/roles.dto';

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
