import { ApiProperty } from "@nestjs/swagger";
import { DepartmentDto } from "src/departments/dto/department.dto";
import { PaginatedDto } from "./pagination";

export class DepartmentDtoList {
  @ApiProperty()
  items: DepartmentDto[];
}

export class DepartmentsPaginatedDto extends PaginatedDto(DepartmentDtoList) {}
