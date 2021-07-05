import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { StudentsService } from "src/users/students/students.service";
import { SubjectDto } from "./dto/subject.dto";
import { SubjectsService } from "./subjects.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";
import { StudentsSubjectDto } from "./dto/students-subject.dto";

@Controller()
@ApiTags("subjects")
export class SubjectsOtherController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get("students/:id/:schoolYearId/subjects")
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async findByStudentSchoolYearId(
    @Param("id") id: number,
    @Param("schoolYearId") schoolYearId: string,
    @Req() request: any,
  ): Promise<StudentsSubjectDto[]> {
    const student = await this.studentsService.findOne(id);
    const ability = this.caslAbilityFactory.createForSubject(request.user);

    if (ability.cannot(Action.Read, student.profile)) {
      throw new AccessForbiddenException("Can't list student's subjects");
    }

    return this.subjectsService.findByStudentSchoolYearId(id, schoolYearId);
  }

  @Post("students/:id/:schoolYearId/subjects")
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiBody({
    isArray: true,
    type: Number,
  })
  async addSubjects(
    @Param("id") id: number,
    @Param("schoolYearId") schoolYearId: string,
    @Body() subjectIds: number[],
    @Req() request: any,
  ): Promise<StudentsSubjectDto[]> {
    const student = await this.studentsService.findOne(id);
    const ability = this.caslAbilityFactory.createForSubject(request.user);

    if (ability.cannot(Action.Create, student.profile)) {
      throw new AccessForbiddenException("Can't enroll student to subjects");
    }

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
  async findByDepartment(@Param("id") id: number): Promise<SubjectDto[]> {
    const subjects = await this.subjectsService.findByDepartment(id);

    return subjects.map((subject) => this.subjectsService.mapToDto(subject));
  }

  @Get("professor/:id/subjects")
  async findByProfessor(@Param("id") id: number): Promise<SubjectDto[]> {
    const subjects = await this.subjectsService.findByProfessor(id);

    return subjects.map((subject) => this.subjectsService.mapToDto(subject));
  }
}
