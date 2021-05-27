import { ApiProperty } from "@nestjs/swagger";
import { StudentDto } from "src/users/students/dto/student.dto";
import { PaginatedDto } from "./pagination";

export class StudentDtoList {
  @ApiProperty()
  items: StudentDto[];
}

export class StudentsPaginatedDto extends PaginatedDto(StudentDtoList) {}
