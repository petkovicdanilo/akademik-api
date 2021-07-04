import { IsNotEmpty } from "class-validator";
import { UpdateUserDto } from "src/users/dto/update-user.dto";

export class UpdateStudentDto extends UpdateUserDto {
  @IsNotEmpty()
  departmentId: number;
}
