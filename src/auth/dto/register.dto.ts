import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "src/users/types";

export class RegisterDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  salt: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: ["student", "professor"] })
  type: UserType;
}
