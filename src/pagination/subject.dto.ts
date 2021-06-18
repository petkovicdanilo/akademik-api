import { ApiProperty } from "@nestjs/swagger";
import { SubjectDto } from "src/subjects/dto/subject.dto";
import { PaginatedDto } from "./pagination";

export class SubjectDtoList {
  @ApiProperty()
  items: SubjectDto[];
}

export class SubjectsPaginatedDto extends PaginatedDto(SubjectDtoList) {}
