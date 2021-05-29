import { ApiProperty } from "@nestjs/swagger";
import { AdminDto } from "src/users/admins/dto/admin.dto";
import { PaginatedDto } from "./pagination";

export class AdminDtoList {
  @ApiProperty()
  items: AdminDto[];
}

export class AdminsPaginatedDto extends PaginatedDto(AdminDtoList) {}
