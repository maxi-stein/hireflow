import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { UserFile } from '../entities/user-files.entity';
import { FileType } from '../interfaces/file-type.enum';
import { JwtUser } from '../interfaces/jwt.user';
import { Candidate } from '../entities/candidate.entity';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class FileStorageService {
  private readonly uploadBasePath = 'uploads';

  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async storeUserFile(
    user: JwtUser,
    file: Express.Multer.File,
    fileType: FileType,
    entityManager?: EntityManager,
  ): Promise<UserFile> {
    const manager = entityManager || this.userFileRepository.manager;

    return manager.transaction(async (transactionalEntityManager) => {
      try {
        // 1. Validaciones específicas por tipo
        this.validateFileForType(file, fileType);

        // 2. Procesar archivo si es necesario (ej: imágenes)
        const processedFile = await this.processFileIfNeeded(file, fileType);

        // 3. Guardar en filesystem
        const fileMeta = await this.saveToFilesystem(
          user.id,
          processedFile,
          fileType,
        );

        // 4. Si es CV o Profile Picture, desactivar archivos anteriores del mismo tipo
        if (
          fileType === FileType.RESUME ||
          fileType === FileType.PROFILE_PICTURE
        ) {
          await this.deactivatePreviousFiles(
            user.id,
            fileType,
            transactionalEntityManager,
          );
        }

        // Save metadata in BD
        const userFile = transactionalEntityManager.create(UserFile, {
          ...fileMeta,
          file_type: fileType,
          user: { id: user.id },
        });

        const savedFile = await transactionalEntityManager.save(userFile);

        // Actualizar profile_updated_at en Candidate o Employee
        await this.updateProfileTimestamp(user, transactionalEntityManager);

        return savedFile;
      } catch (error) {
        // Limpiar archivo si la transacción falla
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
      throw new NotFoundException('Archivo no encontrado');
    }

    try {
      await fs.access(userFile.file_path);
    } catch {
      throw new NotFoundException('Archivo físico no encontrado');
    }

    const fs = require('fs');
    return fs.createReadStream(userFile.file_path);
  }

  async getUserFilesByType(userId: string, fileType: FileType) {
    return this.userFileRepository.find({
      where: { user: { id: userId }, file_type: fileType },
      order: { created_at: 'DESC' },
    });
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const userFile = await this.userFileRepository.findOne({
      where: { id: fileId, user: { id: userId } },
    });

    if (!userFile) {
      throw new NotFoundException('Archivo no encontrado');
    }

    await this.userFileRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Delete physical file
        try {
          await fs.unlink(userFile.file_path);
        } catch (error) {
          console.warn(
            `No se pudo eliminar el archivo físico: ${userFile.file_path}`,
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
          throw new BadRequestException('El CV debe ser un archivo PDF');
        }
        break;
      case FileType.PROFILE_PICTURE:
        if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException(
            'La foto de perfil debe ser una imagen',
          );
        }
        break;
    }
  }

  private async processFileIfNeeded(
    file: Express.Multer.File,
    fileType: FileType,
  ): Promise<Express.Multer.File> {
    if (fileType === FileType.PROFILE_PICTURE) {
      // Procesar imagen (redimensionar, comprimir, etc.)
      return await this.processImage(file);
    }
    return file;
  }

  private async processImage(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    const sharp = require('sharp');

    try {
      const processedBuffer = await sharp(file.buffer)
        .resize(500, 500) // Tamaño máximo
        .jpeg({ quality: 80 }) // Convertir a JPEG para consistencia
        .toBuffer();

      return {
        ...file,
        buffer: processedBuffer,
        size: processedBuffer.length,
        mimetype: 'image/jpeg',
        originalname: path.parse(file.originalname).name + '.jpg',
      };
    } catch (error) {
      throw new BadRequestException('No se pudo procesar la imagen');
    }
  }

  private async saveToFilesystem(
    userId: string,
    file: Express.Multer.File,
    fileType: FileType,
  ) {
    const extension = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}${extension}`;

    const filePath = path.join(
      this.uploadBasePath,
      userId,
      fileType.toLowerCase(),
      fileName,
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return {
      file_name: file.originalname,
      stored_name: fileName,
      file_path: filePath,
      mime_type: file.mimetype,
      size: file.size,
    };
  }

  private async deactivatePreviousFiles(
    userId: string,
    fileType: FileType,
    transactionalEntityManager: EntityManager,
  ) {
    // Para CV y Profile Picture, mantener solo el último activo
    // Podrías implementar lógica de "soft delete" o marcar como inactivo
    // Por ahora simplemente eliminamos los anteriores (depende de tu negocio)
    // await transactionalEntityManager.delete(UserFile, {
    //   user: { id: userId },
    //   file_type: fileType,
    // });
    // O mantener historial pero marcar cuál es el activo
  }

  private async updateProfileTimestamp(
    user: JwtUser,
    transactionalEntityManager: EntityManager,
  ) {
    const currentTimestamp = new Date();

    if (user.user_type === 'candidate') {
      await transactionalEntityManager.update(
        Candidate,
        { user: { id: user.id } },
        { profile_updated_at: currentTimestamp },
      );
    } else if (user.user_type === 'employee') {
      await transactionalEntityManager.update(
        Employee,
        { user: { id: user.id } },
        { profile_updated_at: currentTimestamp },
      );
    }
  }

  private async cleanupFailedUpload(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Silent fail - el archivo podría no existir
    }
  }

  // Método auxiliar para obtener el archivo activo de un tipo
  async getActiveUserFile(
    userId: string,
    fileType: FileType,
  ): Promise<UserFile | null> {
    return this.userFileRepository.findOne({
      where: { user: { id: userId }, file_type: fileType },
      order: { created_at: 'DESC' },
    });
  }
}
