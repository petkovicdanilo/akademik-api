import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";
import { Grade } from "../types";
import { SubjectDto } from "./subject.dto";

export class StudentsSubjectDto extends SubjectDto {
  @ApiProperty({
    enum: [6, 7, 8, 9, 10],
  })
  @IsNumber()
  @Min(6)
  @Max(10)
  grade?: Grade;
}
