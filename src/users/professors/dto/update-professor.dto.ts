import { ApiProperty } from "@nestjs/swagger";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { ProfessorTitle } from "../types";

export class UpdateProfessorDto extends UpdateUserDto {
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
