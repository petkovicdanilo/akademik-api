import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiHideProperty()
  salt?: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  dateOfBirth: Date;
}
