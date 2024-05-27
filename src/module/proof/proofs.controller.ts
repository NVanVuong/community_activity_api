import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProofsService } from './proofs.service';
import { CreateProofDto } from './dto/create-proof.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('proofs')
export class ProofsController {
  constructor(private proofsService: ProofsService) {}

  @Get()
  getProofs() {
    return this.proofsService.getProofs();
  }

  @Get(':id')
  getProof() {
    return this.proofsService.getProofs();
  }

  @Get('user-activity/:userActivityId')
  getProofByUserActivityId(@Param('userActivityId') userActivityId: string) {
    return this.proofsService.getProofByUserActivityId(userActivityId);
  }

  @Get('user/:userId')
  getProofsOfUser(@Param('userId') userId: string) {
    return this.proofsService.getProofsOfUser(userId);
  }

  @Get('class/:clazzId')
  getProofsOfClass(@Param('clazzId') clazzId: string) {
    return this.proofsService.getProofsOfClass(clazzId);
  }

  @Get('faculty/:facultyId')
  getProofsOfFaculty(@Param('facultyId') facultyId: string) {
    return this.proofsService.getProofsOfFaculty(facultyId);
  }

  @Post(':userActivityId')
  @ResponseMessage('Proof submitted successfully')
  submitProof(
    @Param('userActivityId') userActivityId: string,
    @Body() createProofDto: CreateProofDto,
  ) {
    return this.proofsService.submitProof(userActivityId, createProofDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof submitted for external activity successfully')
  submitProofForExternalActivity(
    @Body() createProofDto: CreateProofDto,
    @CurrentUser() user: User,
  ) {
    return this.proofsService.submitProofForExternalActivity(
      createProofDto,
      user,
    );
  }
}
