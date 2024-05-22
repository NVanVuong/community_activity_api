import { Exclude, Expose } from 'class-transformer';
import { Clazz } from 'src/entity/clazz.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { User } from 'src/entity/user.entity';

@Expose()
export class UserDto extends User {}

export class UserStudentDto extends UserDto {
  @Exclude()
  faculty: Faculty;
  @Exclude()
  clazz: Clazz;
}

@Expose()
export class UserFacultyDto extends UserDto {
  @Exclude()
  score: number;
  @Exclude()
  studentId: string;
  @Exclude()
  clazz: Clazz;
}

@Expose()
export class UserClazzDto extends UserDto {
  @Exclude()
  score: number;
  @Exclude()
  studentId: string;
  @Exclude()
  faculty: Faculty;
}
