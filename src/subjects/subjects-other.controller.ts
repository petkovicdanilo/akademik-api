import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SubjectDto } from "./dto/subject.dto";
import { SubjectsService } from "./subjects.service";

@Controller()
@ApiTags("subjects")
export class SubjectsOtherController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get("students/:id/:schoolYearId/subjects")
  async findByStudentSchoolYearId(
    @Param("id") id: number,
    @Param("schoolYearId") schoolYearId: string,
  ) {
    return this.subjectsService.findByStudentSchoolYearId(id, schoolYearId);
  }

  @Post("students/:id/:schoolYearId/subjects")
  @ApiBody({
    isArray: true,
    type: Number,
  })
  async addSubjects(
    @Param("id") id: number,
    @Param("schoolYearId") schoolYearId: string,
    @Body() subjectIds: number[],
  ) {
    const enrolledSubjects = await this.subjectsService.addSubjectsToStudent(
      subjectIds,
      id,
      schoolYearId,
    );

    return enrolledSubjects.map((enrolledSubject) =>
      this.subjectsService.mapEnrolledToDto(enrolledSubject),
    );
  }

  @Get("departments/:id/subjects")
  @ApiResponse({
    status: 200,
    type: [SubjectDto],
  })
  async findByDepartment(@Param("id") id: number) {
    const subjects = await this.subjectsService.findByDepartment(id);

    return subjects.map((subject) => this.subjectsService.mapToDto(subject));
  }
  @Get("professor/:id/subjects")
  async findByProfessor(@Param("id") id: number) {
    const subjects = await this.subjectsService.findByProfessor(id);

    return subjects.map((subject) => this.subjectsService.mapToDto(subject));
  }
}
