import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";
import { Grade } from "src/subjects/types";

export class GradesDto {
  @IsNumber()
  studentId: number;

  @ApiProperty({
    enum: [6, 7, 8, 9, 10],
    type: Number,
  })
  @IsNumber()
  @Min(6)
  @Max(10)
  grade: Grade;
}
