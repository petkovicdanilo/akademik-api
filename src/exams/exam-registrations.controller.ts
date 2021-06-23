import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ProfileType } from "src/users/profiles/types";
import { CreateExamRegistrationsDto } from "./dto/create-exam-registrations.dto";
import { GradesDto } from "./dto/grades.dto";
import { ExamRegistrationsService } from "./exam-registrations.service";

@Controller()
@ApiTags("exam-registrations")
export class ExamRegistrationsController {
  constructor(
    private readonly examRegistrationsService: ExamRegistrationsService,
  ) {}

  @Get("exam-periods/:id/:subjectId/exam-registrations")
  async findByExamPeriodSubject(
    @Param("id") examPeriodId: number,
    @Param("subjectId") subjectId: number,
  ) {
    const examRegistrations = await this.examRegistrationsService.findByExamPeriodSubject(
      examPeriodId,
      subjectId,
    );

    return examRegistrations.map((examRegistration) =>
      this.examRegistrationsService.mapToDto(examRegistration),
    );
  }

  @Post("exam-periods/:id/exam-registrations")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async registrateExams(
    @Param("id") examPeriodId: number,
    @Body() createExamRegistrations: CreateExamRegistrationsDto,
    @Req() request: any,
  ) {
    if (
      createExamRegistrations.studentId != request.user.id &&
      request.user.type != ProfileType.Admin
    ) {
      throw new UnauthorizedException("Unauthorized");
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
  ) {
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
  ) {
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
