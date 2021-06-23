import { ApiProperty } from "@nestjs/swagger";
import { Grade } from "src/subjects/types";

export class GradesDto {
  studentId: number;

  @ApiProperty({
    enum: [6, 7, 8, 9, 10],
    type: Number,
  })
  grade: Grade;
}
