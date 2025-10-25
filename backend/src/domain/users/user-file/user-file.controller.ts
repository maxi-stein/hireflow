import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  UsePipes,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileType } from '../interfaces/file-type.enum';
import { JwtUser } from '../interfaces/jwt.user';
import { FILE } from '../../../shared/constants/file.constants';
import { FileStorageService } from './user-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UuidValidationPipe } from '../../../shared/pipes';
import { CanAccessUser } from '../../auth/guards/can-edit.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('cv')
  @UseInterceptors(FileInterceptor('resume'))
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
  @UseInterceptors(FileInterceptor('profile-picture'))
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
    // Set up headers
    const userFile = await this.fileStorageService.getUserFileMetadata(
      fileId,
      req.user.user_id,
    );

    if (!userFile) {
      throw new NotFoundException('File not found.');
    }

    res.setHeader('Content-Type', userFile.mime_type);
    res.setHeader('Content-Length', userFile.size.toString());

    if (userFile.mime_type.startsWith('image/')) {
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${userFile.file_name}"`,
      );
    } else if (userFile.mime_type === 'application/pdf') {
      // Show in explorer
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${userFile.file_name}"`,
      );

      // Force download
      // res.setHeader('Content-Disposition', `attachment; filename="${userFile.file_name}"`);
    }

    // Send file
    const fileStream = await this.fileStorageService.getFileStream(
      fileId,
      req.user.user_id,
    );

    fileStream.pipe(res);
  }

  @Get('/user/:userId')
  @UseGuards(CanAccessUser) //Employees and self-user only can access this data
  @UsePipes(new UuidValidationPipe())
  async getAllFiles(@Param('userId', UuidValidationPipe) userId: string) {
    return await this.fileStorageService.getAllUserFilesMetadata(userId);
  }
}
