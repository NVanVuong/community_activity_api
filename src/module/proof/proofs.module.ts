import { ProofsController } from './proofs.controller';
import { ProofsService } from './proofs.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ProofsController],
  providers: [ProofsService],
})
export class ProofsModule {}
