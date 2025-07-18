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
import { EducationsService } from '../educations/education.service';
import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';
import { Education } from '../entities/education.entity';
import { EducationResponseDto } from '../dto/education/education-response.dto';
import {
  PaginatedResponse,
  PaginationDto,
} from '../dto/pagination/pagination.dto';

@Controller('educations')
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post()
  async create(
    @Body() createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.educationsService.create(createEducationDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<EducationResponseDto>> {
    return this.educationsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EducationResponseDto> {
    const education = await this.educationsService.findOne(id);
    return education;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    const updated = await this.educationsService.update(id, updateEducationDto);
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.educationsService.remove(id);
  }
}
