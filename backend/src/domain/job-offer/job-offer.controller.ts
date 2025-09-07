import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import {
  CreateJobOfferDto,
  JobOfferResponseDto,
  UpdateJobOfferDto,
} from './dto';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/shared/dto/pagination/pagination.dto';
import { NotEmptyDtoPipe, UuidValidationPipe } from 'src/shared/pipes';
import { FilterJobOfferDto } from './dto/filter-job-offer-dto';

@Controller('job-offers')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post()
  async create(@Body() createJobOfferDto: CreateJobOfferDto) {
    return await this.jobOfferService.create(createJobOfferDto);
  }

  @Get()
  async findAll(
    @Query() filterDto: FilterJobOfferDto,
  ): Promise<PaginatedResponse<JobOfferResponseDto>> {
    return await this.jobOfferService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', UuidValidationPipe) id: string) {
    return await this.jobOfferService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateJobOfferDto: UpdateJobOfferDto,
  ) {
    return await this.jobOfferService.update(id, updateJobOfferDto);
  }

  @Delete(':id')
  async remove(@Param('id', UuidValidationPipe) id: string) {
    return await this.jobOfferService.softDelete(id);
  }
}
