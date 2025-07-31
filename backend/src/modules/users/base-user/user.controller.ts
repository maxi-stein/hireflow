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
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UuidValidationPipe, NotEmptyDtoPipe } from '../../../shared/pipes';
import { PaginationDto } from '../dto/pagination/pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body(NotEmptyDtoPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', UuidValidationPipe) id: string) {
    return this.usersService.remove(id);
  }
}
