import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from "class-validator";
import { Semester, SubjectYear } from "../types";

export class CreateSubjectDto {
  @IsAlphanumeric()
  name: string;

  @ApiProperty({
    enum: [1, 2],
  })
  @IsNumber()
  @Min(1)
  @Max(2)
  semester: Semester;

  @ApiProperty({
    enum: [1, 2, 3, 4],
  })
  @IsNumber()
  @Min(1)
  @Max(4)
  year: SubjectYear;

  @IsNotEmpty()
  compulsory: boolean;

  @IsNumber()
  ectsPoints: number;

  @IsNumber()
  professorId: number;

  // @IsNumber()
  // assistantId: number;

  @IsNumber()
  departmentId: number;
}
