import { UpdateUserDto } from "src/users/dto/update-user.dto";

export class UpdateStudentDto extends UpdateUserDto {
  departmentId: number;
}
