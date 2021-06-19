import { PartialType } from "@nestjs/swagger";
import { CreateExamPeriodDto } from "./create-exam-period.dto";

export class UpdateExamPeriodDto extends PartialType(CreateExamPeriodDto) {}
