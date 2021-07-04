import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { UpdateUserDto } from "src/users/dto/update-user.dto";

export class UpdateStudentDto extends UpdateUserDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  departmentId?: number;
}
