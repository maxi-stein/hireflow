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

  // Called by controller for uploading PDF or image
  // Store user file in filesystem and metadata in database
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
            user.entity_id,
            fileType,
            transactionalEntityManager,
          );
        }

        // Save in filesystem
        fileMeta = await this.saveToFilesystem(
          user.entity_id,
          processedFile,
          fileType,
        );

        // Save metadata in BD
        const userFile = transactionalEntityManager.create(UserFile, {
          ...fileMeta,
          file_type: fileType,
          candidate: { id: user.entity_id },
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

  async getFileStream(fileId: string, candidateId: string) {
    const userFile = await this.userFileRepository.findOne({
      where: { id: fileId, candidate: { id: candidateId } },
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

  // Used by controller for getting file stream by path
  async getFileStreamByPath(filePath: string) {
    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException('File not found in the folder');
    }

    return createReadStream(filePath);
  }

  async getUserFileMetadata(fileId: string, candidateId: string) {
    return this.userFileRepository.findOne({
      where: { candidate: { id: candidateId }, id: fileId },
    });
  }

  // Used by controller for getting file metadata
  async getFileMetadataById(fileId: string) {
    return this.userFileRepository.findOne({
      where: { id: fileId },
      relations: ['candidate'],
    });
  }

  // Used by controller for getting all files metadata for a candidate
  async getAllUserFilesMetadata(candidateId: string) {
    return this.userFileRepository.find({
      where: { candidate: { id: candidateId } },
    });
  }

  // TODO: evaluar si este metodo es necesario
  async deleteFile(fileId: string, candidateId: string): Promise<void> {
    const userFile = await this.userFileRepository.findOne({
      where: { id: fileId, candidate: { id: candidateId } },
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
    candidateId: string,
    file: Express.Multer.File,
    fileType: FileType,
  ) {
    const extension = path.extname(file.originalname);
    const fileName = `${candidateId}${extension}`;

    const filePath = path.join(
      this.uploadBasePath,
      fileType.toLowerCase() + 's',
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
    candidateId: string,
    fileType: FileType,
    transactionalEntityManager: EntityManager,
  ) {
    try {
      const existingFile = await transactionalEntityManager.findOne(UserFile, {
        where: {
          candidate: { id: candidateId },
          file_type: fileType,
        },
      });

      if (!existingFile) return;

      await transactionalEntityManager.delete(UserFile, {
        candidate: { id: candidateId },
        file_type: fileType,
      });

      try {
        await fs.unlink(existingFile.file_path);
      } catch (error) {
        console.warn(
          `Could not delete physical file ${existingFile.file_path}:`,
          error,
        );
      }

      try {
        const dirPath = path.dirname(existingFile.file_path);
        const filesInDir = await fs.readdir(dirPath);
        if (filesInDir.length === 0) {
          await fs.rmdir(dirPath);
        }
      } catch (error) {
        console.warn(`Could not delete directory:`, error);
      }
    } catch (error) {
      console.warn(
        `Error deleting previous files for candidate ${candidateId}:`,
        error,
      );
    }
  }

  // Used if upload transaction fails
  private async cleanupFailedUpload(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {}
  }
}
