import { IsNumber } from "class-validator";

export class CreateExamRegistrationsDto {
  @IsNumber()
  studentId: number;

  @IsNumber({}, { each: true })
  subjectIds: number[];
}
