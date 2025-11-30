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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileType } from '../interfaces/file-type.enum';
import { UserType } from '../interfaces/user.enum';
import { JwtUser } from '../interfaces/jwt.user';
import { FILE } from '../../../shared/constants/file.constants';
import { FileStorageService } from './user-file.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../auth/guards/roles.guard';
import { RequireUserType } from '../../auth/decorators/roles.decorator';
import { UuidValidationPipe } from '../../../shared/pipes';
import { CanAccessUser } from '../../auth/guards/can-access.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('cv')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
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
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
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
    // Get file metadata
    const userFile = await this.fileStorageService.getFileMetadataById(fileId);

    if (!userFile) {
      throw new NotFoundException('File not found.');
    }

    // Authorization Check - Employees can access all files, candidates only their own
    if (req.user.user_type === UserType.CANDIDATE && 
        userFile.candidate.id !== req.user.entity_id) {
      throw new ForbiddenException('You do not have access to this file');
    }

    res.setHeader('Content-Type', userFile.mime_type);
    res.setHeader('Content-Length', userFile.size.toString());

    // Set Content-Disposition header based on file type
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
    }

    // Send file
    const fileStream = await this.fileStorageService.getFileStreamByPath(
      userFile.file_path,
    );

    fileStream.pipe(res);
  }

  @Get('/user/:candidateId')
  @UseGuards(CanAccessUser) //Employees and self-user only can access this data
  @UsePipes(new UuidValidationPipe())
  async getAllFiles(
    @Param('candidateId', UuidValidationPipe) candidateId: string,
  ) {
    return await this.fileStorageService.getAllUserFilesMetadata(candidateId);
  }
}
