import { IsNumber, IsString } from "class-validator";

export class CreateLessonDto {
  @IsString()
  name: string;

  @IsNumber()
  professorId: number;

  @IsNumber()
  subjectId: number;

  @IsString()
  schoolYearId: string;
}
