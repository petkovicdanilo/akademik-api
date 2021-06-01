import { ApiProperty } from "@nestjs/swagger";
import { ProfessorTitle } from "../types";

export class ProfessorSpecificDto {
  departmentId: number;

  @ApiProperty({
    enum: [
      "TeachingAssociate",
      "Assistant",
      "AssociateProfessor",
      "FullProfessor",
    ],
    type: "string",
  })
  title: ProfessorTitle;
}
