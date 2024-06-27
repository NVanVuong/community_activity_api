import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProofsService } from './proofs.service';
import { ConfirmProofDto, CreateProofDto } from './dto/create-proof.dto';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { User } from 'src/entity/user.entity';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('proofs')
export class ProofsController {
  constructor(private proofsService: ProofsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  async getProofs(
    @CurrentUser() user: User,
    @Query('keyword') keyword: string = '',
  ) {
    return this.proofsService.getProofs(user, keyword);
  }

  @Get('me/')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proofs retrieved successfully')
  getProofsOfUser(
    @CurrentUser() user: User,
    @Query('keyword') keyword: string,
  ) {
    return this.proofsService.getMyProofs(user.id, keyword);
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

  @Post(':userActivityId/submit')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof submitted successfully')
  @UseInterceptors(FileInterceptor('image'))
  submitProof(
    @Param('userActivityId') userActivityId: string,
    @Body() createProofDto: CreateProofDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.proofsService.submitProof(userActivityId, createProofDto, file);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof submitted for external activity successfully')
  @UseInterceptors(FileInterceptor('image'))
  submitProofForExternalActivity(
    @Body() createProofDto: CreateProofDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.proofsService.submitProofForExternalActivity(
      createProofDto,
      user,
      file,
    );
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof approved successfully')
  approveProof(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() confirmProofDto: ConfirmProofDto,
  ) {
    return this.proofsService.approveProof(user, id, confirmProofDto.comment);
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('Proof rejected successfully')
  rejectProof(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() confirmProofDto: ConfirmProofDto,
  ) {
    return this.proofsService.rejectProof(user, id, confirmProofDto.comment);
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
