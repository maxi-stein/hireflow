import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from '../dto/candidate/update-candidate.dto';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.candidateService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.candidateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidateService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.candidateService.remove(id);
  }
}
