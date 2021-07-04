import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { ProfessorTitle } from "../types";

export class UpdateProfessorDto extends UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiProperty({
    enum: [
      "TeachingAssociate",
      "Assistant",
      "AssociateProfessor",
      "FullProfessor",
    ],
    type: "string",
    required: false,
  })
  @IsEnum(ProfessorTitle)
  @IsOptional()
  title?: ProfessorTitle;
}
