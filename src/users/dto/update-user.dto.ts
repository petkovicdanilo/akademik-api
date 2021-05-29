import { ApiProperty } from "@nestjs/swagger";

export abstract class UpdateUserDto {
  @ApiProperty({ required: false })
  firstName: string;

  @ApiProperty({ required: false })
  lastName: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({
    required: false,
    type: () => String,
    format: "date",
  })
  dateOfBirth: Date;
}
