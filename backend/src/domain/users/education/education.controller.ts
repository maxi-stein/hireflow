import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from '../dto/education/create-education.dto';
import { UpdateEducationDto } from '../dto/education/update-education.dto';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../auth/guards/roles.guard';
import { RequireUserType } from '../../auth/decorators/roles.decorator';
import { UserType } from '../interfaces/user.enum';
import { JwtUser } from '../interfaces/jwt.user';

@Controller('educations')
@UseGuards(JwtAuthGuard)
export class EducationsController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  async create(@Body() createEducationDto: CreateEducationDto, @Req() req: Request & { user: JwtUser }) {
    return this.educationService.create(createEducationDto, req.user);
  }

  @Get()
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.educationService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', UuidValidationPipe) id: string, @Req() req: Request & { user: JwtUser }) {
    const education = await this.educationService.findOne(id, req.user);
    return education;
  }

  @Put(':id')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  async update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateEducationDto: UpdateEducationDto,
    @Req() req: Request & { user: JwtUser }
  ) {
    const updated = await this.educationService.update(id, updateEducationDto, req.user);
    return updated;
  }

  @Delete(':id')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  async remove(@Param('id', UuidValidationPipe) id: string, @Req() req: Request & { user: JwtUser }) {
    await this.educationService.remove(id, req.user);
  }
}
