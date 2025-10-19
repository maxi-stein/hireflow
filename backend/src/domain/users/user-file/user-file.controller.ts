import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileType } from '../interfaces/file-type.enum';
import { JwtUser } from '../interfaces/jwt.user';
import { FILE } from '../../../shared/constants/file.constants';
import { FileStorageService } from './user-file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('cv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE.MAX_SIZE }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.fileStorageService.storeUserFile(
      req.user,
      file,
      FileType.RESUME,
    );
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FILE.MAX_SIZE }), // 5MB
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.fileStorageService.storeUserFile(
      req.user,
      file,
      FileType.PROFILE_PICTURE,
    );
  }

  @Get(':fileId')
  async getFile(
    @Param('fileId') fileId: string,
    @Req() req: Request & { user: JwtUser },
    @Res() res: Response,
  ) {
    const fileStream = await this.fileStorageService.getFileStream(
      fileId,
      req.user.id,
    );

    fileStream.pipe(res);
  }

  @Get('user/:fileType')
  async getUserFilesByType(
    @Param('fileType') fileType: FileType,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.fileStorageService.getUserFilesByType(req.user.id, fileType);
  }

  @Delete(':fileId')
  async deleteFile(
    @Param('fileId') fileId: string,
    @Req() req: Request & { user: JwtUser },
  ) {
    return this.fileStorageService.deleteFile(fileId, req.user.id);
  }
}
