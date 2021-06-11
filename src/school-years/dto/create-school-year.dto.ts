import { ApiProperty } from "@nestjs/swagger";

export class CreateSchoolYearDto {
  @ApiProperty({
    type: () => String,
    format: "date",
  })
  startDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  endDate: Date;
}
