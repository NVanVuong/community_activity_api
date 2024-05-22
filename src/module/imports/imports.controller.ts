import {
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImportsService } from './imports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';
import { AuthGuard } from '@nestjs/passport';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('imports')
export class ImportsController {
  constructor(private readonly importService: ImportsService) {}

  @Post('classes/:file')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ResponseMessage('Import clazzes completed')
  async importClassesCSV(@Param('file') file: string) {
    if (!file) throw new Error('File not found');
    return await this.importService.importClazzes(`./uploads/${file}.csv`);
  }

  @Post('users/:file')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ResponseMessage('Import users completed')
  async importUsersCSV(@Param('file') file: string) {
    if (!file) throw new Error('File not found');
    return await this.importService.importUsers(`./uploads/${file}.csv`);
  }
}
