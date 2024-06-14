import { RoleEnum } from 'src/common/enum/role.enum';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Subcategory } from './subcategory.entity';

@Entity()
export class Role {
  @PrimaryColumn('char', { length: 50 })
  id: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  name: RoleEnum;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Subcategory, (subcategory) => subcategory.roles)
  @JoinTable()
  subcategories: Subcategory[];
}
