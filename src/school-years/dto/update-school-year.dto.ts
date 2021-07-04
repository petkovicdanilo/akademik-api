import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class UpdateSchoolYearDto {
  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    type: () => String,
    format: "date",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate: Date;
}
