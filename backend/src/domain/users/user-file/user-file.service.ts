import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserFile } from '../entities/user-files.entity';
import { FileType } from '../interfaces/file-type.enum';
import { JwtUser } from '../interfaces/jwt.user';
import { createReadStream } from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class FileStorageService {
  private readonly uploadBasePath = 'uploads';

  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,
  ) {}

  async storeUserFile(
    user: JwtUser,
    file: Express.Multer.File,
    fileType: FileType,
    entityManager?: EntityManager,
  ): Promise<UserFile> {
    const manager = entityManager || this.userFileRepository.manager;

    let fileMeta: any;

    return manager.transaction(async (transactionalEntityManager) => {
      try {
        //Validate type
        this.validateFileForType(file, fileType);

        // Process file if needed
        const processedFile = await this.processFileIfNeeded(file, fileType);

        // If Resume or Profile Picture, delete old file
        if (
          fileType === FileType.RESUME ||
          fileType === FileType.PROFILE_PICTURE
        ) {
          await this.deletePreviousFile(
            user.user_id,
            fileType,
            transactionalEntityManager,
          );
        }

        // Save in filesystem
        fileMeta = await this.saveToFilesystem(
          user.user_id,
          processedFile,
          fileType,
        );

        // Save metadata in BD
        const userFile = transactionalEntityManager.create(UserFile, {
          ...fileMeta,
          file_type: fileType,
          user: { id: user.user_id },
        });

        const savedFile = await transactionalEntityManager.save(userFile);

        return savedFile;
      } catch (error) {
        // If transaction fails, clean up file data
        if (fileMeta?.file_path) {
          await this.cleanupFailedUpload(fileMeta.file_path);
        }
        throw error;
      }
    });
  }

  async getFileStream(fileId: string, userId: string) {
    const userFile = await this.userFileRepository.findOne({
      where: { id: fileId, user: { id: userId } },
    });

    if (!userFile) {
      throw new NotFoundException('File metadata not found in DB');
    }

    try {
      await fs.access(userFile.file_path);
    } catch {
      throw new NotFoundException('File not found in the folder');
    }

    return createReadStream(userFile.file_path);
  }

  async getUserFileMetadata(fileId: string, userId: string) {
    return this.userFileRepository.findOne({
      where: { user: { id: userId }, id: fileId },
    });
  }

  async getAllUserFilesMetadata(userId: string) {
    return this.userFileRepository.find({
      where: { user: { id: userId } },
    });
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const userFile = await this.userFileRepository.findOne({
      where: { id: fileId, user: { id: userId } },
    });

    if (!userFile) {
      throw new NotFoundException('File not found');
    }

    await this.userFileRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Delete physical file
        try {
          await fs.unlink(userFile.file_path);
        } catch (error) {
          console.warn(
            `Physical file could not be deleted: ${userFile.file_path}`,
          );
        }

        // Delete BD registry
        await transactionalEntityManager.remove(UserFile, userFile);
      },
    );
  }

  private validateFileForType(file: Express.Multer.File, fileType: FileType) {
    switch (fileType) {
      case FileType.RESUME:
        if (file.mimetype !== 'application/pdf') {
          throw new BadRequestException('Resume must be a PDF');
        }
        break;
      case FileType.PROFILE_PICTURE:
        if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException('Profile picture must be an image');
        }
        break;
    }
  }

  private async processFileIfNeeded(
    file: Express.Multer.File,
    fileType: FileType,
  ): Promise<Express.Multer.File> {
    if (fileType === FileType.PROFILE_PICTURE) {
      // Process image (redimension, compress, etc.)
      return await this.processImage(file);
    }
    return file;
  }

  private async processImage(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    try {
      const processedBuffer = await sharp(file.buffer)
        .resize(500, 500)
        .jpeg({ quality: 80 }) // Quality to 80%
        .toBuffer();

      return {
        ...file,
        buffer: processedBuffer,
        size: processedBuffer.length,
        mimetype: 'image/jpeg',
        originalname: path.parse(file.originalname).name + '.jpg',
      };
    } catch (error) {
      throw new BadRequestException('Image could not be processed');
    }
  }

  private async saveToFilesystem(
    userId: string,
    file: Express.Multer.File,
    fileType: FileType,
  ) {
    const extension = path.extname(file.originalname);
    const fileName = `${userId}${extension}`;

    const filePath = path.join(
      this.uploadBasePath,
      fileType.toLowerCase(),
      's',
      fileName,
    );

    // Create folders and sub folders recursively if they do not exist.
    // Otherwise do nothing
    await fs.mkdir(path.dirname(filePath), {
      recursive: true,
    });

    // Write the file
    await fs.writeFile(filePath, file.buffer);

    return {
      file_name: file.originalname,
      stored_name: fileName,
      file_path: filePath,
      mime_type: file.mimetype,
      size: file.size,
    };
  }

  private async deletePreviousFile(
    userId: string,
    fileType: FileType,
    transactionalEntityManager: EntityManager,
  ) {
    try {
      const { file_path } = await transactionalEntityManager.findOne(UserFile, {
        where: {
          user: { id: userId },
          file_type: fileType,
        },
      });

      await transactionalEntityManager.delete(UserFile, {
        user: { id: userId },
        file_type: fileType,
      });

      try {
        await fs.unlink(file_path);
      } catch (error) {
        console.warn(`Could not delete physical file ${file_path}:`, error);
      }

      try {
        const filesInDir = await fs.readdir(file_path);
        if (filesInDir.length === 0) {
          await fs.rmdir(file_path);
        }
      } catch (error) {
        console.warn(`Could not delete directory ${file_path}:`, error);
      }
    } catch (error) {
      console.warn(`Error deleting previous files for user ${userId}:`, error);
    }
  }

  private async cleanupFailedUpload(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {}
  }
}
