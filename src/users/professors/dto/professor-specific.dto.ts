import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ProfessorTitle } from "../types";

export class ProfessorSpecificDto {
  @IsNotEmpty()
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
  @IsEnum(ProfessorTitle)
  title: ProfessorTitle;
}
