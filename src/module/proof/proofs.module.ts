import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofsController } from './proofs.controller';
import { ProofsService } from './proofs.service';
import { Module } from '@nestjs/common';
import { Proof } from 'src/entity/proof.entity';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { ActivitiesModule } from '../activities/activities.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proof]),
    AuthModule,
    UserActivitiesModule,
    ActivitiesModule,
  ],
  controllers: [ProofsController],
  providers: [ProofsService],
})
export class ProofsModule {}
