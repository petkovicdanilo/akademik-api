import { Grade } from "../types";
import { SubjectDto } from "./subject.dto";

export class StudentsSubjectDto extends SubjectDto {
  grade?: Grade;
}
