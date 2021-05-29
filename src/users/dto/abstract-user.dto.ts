import { ApiProperty } from "@nestjs/swagger";

export abstract class AbstractUserDto {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  dateOfBirth: Date;
}
