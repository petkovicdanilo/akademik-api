import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { ProfessorTitle } from "../types";

export class UpdateProfessorDto extends UpdateUserDto {
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
