import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkExperienceDto } from '../dto/work-experience/create-work-experience.dto';
import { UpdateWorkExperienceDto } from '../dto/work-experience/update-work-experience.dto';
import { WorkExperienceService } from './work-experience.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('candidates/:candidateId/work-experiences')
@UseGuards(JwtAuthGuard)
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Post()
  create(
    @Param('candidateId') candidateId: string,
    @Body() createDto: CreateWorkExperienceDto,
  ) {
    return this.workExperienceService.create(candidateId, createDto);
  }

  @Get()
  findAll(@Param('candidateId') candidateId: string) {
    return this.workExperienceService.findAllByCandidate(candidateId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workExperienceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateWorkExperienceDto) {
    return this.workExperienceService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workExperienceService.remove(id);
  }
}
