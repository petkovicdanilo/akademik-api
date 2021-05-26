import { ApiProperty } from "@nestjs/swagger";
import { StudentDto } from "src/users/students/dto/student.dto";
import { PaginatedRequestDto } from "./pagination";

export class StudentDtoList {
  @ApiProperty()
  items: StudentDto[];
}

export class StudentsPaginatedDto extends PaginatedRequestDto(StudentDtoList) {}
