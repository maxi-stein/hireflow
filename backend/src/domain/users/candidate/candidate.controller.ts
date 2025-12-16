import {
  Controller,
  Get,
  Param,
  Body,
  Delete,
  Query,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from '../dto/candidate/update-candidate.dto';
import { RegisterCandidateDto } from '../dto/user/create-user.dto';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  // Public endpoint for candidate registration
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerCandidateDto: RegisterCandidateDto) {
    return this.candidateService.create(registerCandidateDto);
  }

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
