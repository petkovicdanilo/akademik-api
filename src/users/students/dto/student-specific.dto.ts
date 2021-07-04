import { IsNotEmpty } from "class-validator";

export class StudentSpecificDto {
  @IsNotEmpty()
  departmentId: number;
}
