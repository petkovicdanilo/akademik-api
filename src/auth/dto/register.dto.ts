import { ApiProperty } from "@nestjs/swagger";

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
  type: "student" | "professor";
}
