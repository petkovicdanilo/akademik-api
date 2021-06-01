import { ApiProperty } from "@nestjs/swagger";
import { AbstractUserDto } from "src/users/dto/abstract-user.dto";
import { ProfessorTitle } from "../types";

export class ProfessorDto extends AbstractUserDto {
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
