import { ApiProperty } from "@nestjs/swagger";

export abstract class UserDto {
  @ApiProperty({ required: false })
  firstName: string;

  @ApiProperty({ required: false })
  lastName: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  dateOfBirth: Date;
}
