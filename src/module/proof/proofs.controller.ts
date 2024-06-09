import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  async getProofs(@Query('keyword') keyword: string = '') {
    return this.proofsService.getProofs(keyword);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof retrieved successfully')
  getProof(@Param('id') id: string) {
    return this.proofsService.getProof(id);
  }

  @Get('user-activity/:userActivityId')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof retrieved successfully')
  getProofByUserActivityId(@Param('userActivityId') userActivityId: string) {
    return this.proofsService.getProofByUserActivity(userActivityId);
  }

  @Get('myproofs')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  getProofsOfUser(@CurrentUser() user: User) {
    return this.proofsService.getProofsOfUser(user.id);
  }

  @Get('class/:clazzId')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  getProofsOfClass(@Param('clazzId') clazzId: string) {
    return this.proofsService.getProofsOfClass(clazzId);
  }

  @Get('faculty/:facultyId')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  getProofsOfFaculty(@Param('facultyId') facultyId: string) {
    return this.proofsService.getProofsOfFaculty(facultyId);
  }

  @Post(':userActivityId')
  @UseGuards(AuthGuard('jwt'))
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

  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof approved successfully')
  approveProof(@Param('id') id: string) {
    return this.proofsService.approveProof(id);
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof rejected successfully')
  rejectProof(@Param('id') id: string, @Body() comment: string) {
    return this.proofsService.rejectProof(id, comment);
  }

  @Post(':id/resubmit')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof resubmitted successfully')
  resubmitProof(
    @Param('id') id: string,
    @Body() createProofDto: CreateProofDto,
  ) {
    return this.proofsService.resubmitProof(id, createProofDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof deleted successfully')
  deleteProof(@Param('id') id: string) {
    return this.proofsService.deleteProof(id);
  }
}
