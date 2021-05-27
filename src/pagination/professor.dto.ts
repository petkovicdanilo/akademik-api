import { ApiProperty } from "@nestjs/swagger";
import { ProfessorDto } from "src/users/professors/dto/professor.dto";
import { PaginatedDto } from "./pagination";

export class ProfessorDtoList {
  @ApiProperty()
  items: ProfessorDto[];
}

export class ProfessorsPaginatedDto extends PaginatedDto(ProfessorDtoList) {}
