import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { SubjectsService } from "src/subjects/subjects.service";
import { StudentsService } from "src/users/students/students.service";
import { CreateExamRegistrationsDto } from "./dto/create-exam-registrations.dto";
import { GradesDto } from "./dto/grades.dto";
import { ExamRegistrationsService } from "./exam-registrations.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags("exam-registrations")
@ApiBearerAuth()
export class ExamRegistrationsController {
  constructor(
    private readonly examRegistrationsService: ExamRegistrationsService,
    private readonly subjectsService: SubjectsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly studentsService: StudentsService,
  ) {}

  @Get("exam-periods/:id/:subjectId/exam-registrations")
  async findByExamPeriodSubject(
    @Param("id") examPeriodId: number,
    @Param("subjectId") subjectId: number,
    @Req() request: any,
  ) {
    const subject = await this.subjectsService.findOne(subjectId);
    const ability = this.caslAbilityFactory.createForGrade(request.user);

    if (ability.cannot(Action.Create, subject)) {
      throw new AccessForbiddenException("Can't list exam registrations");
    }

    const examRegistrations = await this.examRegistrationsService.findByExamPeriodSubject(
      examPeriodId,
      subjectId,
    );

    return examRegistrations.map((examRegistration) =>
      this.examRegistrationsService.mapToDto(examRegistration),
    );
  }

  @Post("exam-periods/:id/exam-registrations")
  async registrateExams(
    @Param("id") examPeriodId: number,
    @Body() createExamRegistrations: CreateExamRegistrationsDto,
    @Req() request: any,
  ) {
    const student = await this.studentsService.findOne(
      createExamRegistrations.studentId,
    );
    const ability = this.caslAbilityFactory.createForExamRegistration(
      request.user,
    );

    if (ability.cannot(Action.Create, student)) {
      throw new AccessForbiddenException("Can't registrate for exams");
    }

    const examRegistrations = await this.examRegistrationsService.registrateExams(
      createExamRegistrations.studentId,
      examPeriodId,
      createExamRegistrations.subjectIds,
    );

    return examRegistrations.map((examRegistration) =>
      this.examRegistrationsService.mapToDto(examRegistration),
    );
  }

  @Get("students/:id/:schoolYearId/exam-registrations")
  async findByStudentSchoolYear(
    @Param("id") studentId: number,
    @Param("schoolYearId") schoolYearId: string,
    @Req() request: any,
  ) {
    const student = await this.studentsService.findOne(studentId);
    const ability = this.caslAbilityFactory.createForExamRegistration(
      request.user,
    );

    if (ability.cannot(Action.Create, student)) {
      throw new AccessForbiddenException("Can't list exam registrations");
    }

    const examRegistrations = await this.examRegistrationsService.findByStudentSchoolYear(
      studentId,
      schoolYearId,
    );

    return examRegistrations.map((examRegistration) =>
      this.examRegistrationsService.mapToDto(examRegistration),
    );
  }

  @Post("exam-periods/:id/:subjectId/grade")
  @ApiBody({
    type: GradesDto,
    isArray: true,
  })
  async grade(
    @Param("id") examPeriodId: number,
    @Param("subjectId") subjectId: number,
    @Body() gradesDto: GradesDto[],
    @Req() request: any,
  ) {
    const subject = await this.subjectsService.findOne(subjectId);
    const ability = this.caslAbilityFactory.createForGrade(request.user);

    if (ability.cannot(Action.Create, subject)) {
      throw new AccessForbiddenException("Can't grade");
    }

    const examRegistrations = await this.examRegistrationsService.grade(
      examPeriodId,
      subjectId,
      gradesDto,
    );

    return examRegistrations.map((examRegistration) =>
      this.examRegistrationsService.mapToDto(examRegistration),
    );
  }
}
