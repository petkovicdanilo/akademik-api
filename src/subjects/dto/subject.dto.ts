import { ApiProperty } from "@nestjs/swagger";
import { Semester, SubjectYear } from "../types";

export class SubjectDto {
  id: number;
  name: string;
  @ApiProperty({
    enum: [1, 2],
  })
  semester: Semester;
  @ApiProperty({
    enum: [1, 2, 3, 4],
  })
  year: SubjectYear;
  compulsory: boolean;
  ectsPoints: number;
  professorId: number;
  // assistantId: number;
  departmentId: number;
}
