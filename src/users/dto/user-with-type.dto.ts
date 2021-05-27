import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "../types";
import { UserDto } from "./user.dto";

export class UserWithTypeDto extends UserDto {
  @ApiProperty({
    enum: ["student", "professor"],
    type: "string",
  })
  type: UserType;
}
