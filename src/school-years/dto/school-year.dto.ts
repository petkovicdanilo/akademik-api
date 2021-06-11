import { ApiProperty } from "@nestjs/swagger";

export class SchoolYearDto {
  id: string;

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
