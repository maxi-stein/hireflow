import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { CreateWorkExperienceDto } from '../dto/work-experience/create-work-experience.dto';
import { UpdateWorkExperienceDto } from '../dto/work-experience/update-work-experience.dto';
import { WorkExperienceService } from './work-experience.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../auth/guards/roles.guard';
import { RequireUserType } from '../../auth/decorators/roles.decorator';
import { UserType } from '../interfaces/user.enum';
import { JwtUser } from '../interfaces/jwt.user';

@Controller('work-experiences')
@UseGuards(JwtAuthGuard)
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Post()
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  create(@Body() createDto: CreateWorkExperienceDto, @Req() req: Request & { user: JwtUser }) {
    return this.workExperienceService.create(createDto.candidate_id, createDto, req.user);
  }

  @Get()
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.EMPLOYEE)
  findAll(@Query('candidate_id') candidateId: string) {
    return this.workExperienceService.findAllByCandidate(candidateId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & { user: JwtUser }) {
    return this.workExperienceService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  update(@Param('id') id: string, @Body() updateDto: UpdateWorkExperienceDto, @Req() req: Request & { user: JwtUser }) {
    return this.workExperienceService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @UseGuards(UserTypeGuard)
  @RequireUserType(UserType.CANDIDATE)
  remove(@Param('id') id: string, @Req() req: Request & { user: JwtUser }) {
    return this.workExperienceService.remove(id, req.user);
  }
}
