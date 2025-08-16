import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';
import { EducationResponseDto } from '../dto/education/education-response.dto';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';

@Controller('educations')
export class EducationsController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async create(@Body() createEducationDto: CreateEducationDto) {
    return this.educationService.create(createEducationDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.educationService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', UuidValidationPipe) id: string) {
    const education = await this.educationService.findOne(id);
    return education;
  }

  @Put(':id')
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateEducationDto: UpdateEducationDto,
  ) {
    const updated = await this.educationService.update(id, updateEducationDto);
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', UuidValidationPipe) id: string) {
    await this.educationService.remove(id);
  }
}
