import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-candidate.dto';

export class UpdateCandidateDoto extends PartialType(CreateCandidateDto) {}
