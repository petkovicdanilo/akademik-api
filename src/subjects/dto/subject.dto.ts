import { ApiProperty } from "@nestjs/swagger";

export class SubjectDto {
  id: number;
  name: string;
  @ApiProperty({
    enum: [1, 2],
  })
  semester: 1 | 2;
  compulsory: boolean;
  ectsPoints: number;
  professorId: number;
  // assistantId: number;
  departmentId: number;
}
