import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateSchoolYearDto {
  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
  })
  @IsDateString()
  endDate: Date;
}
