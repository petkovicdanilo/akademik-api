import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { SubjectsPaginatedDto } from "src/pagination/subject.dto";
import { UtilService } from "src/util/util.service";
import { SubjectsService } from "./subjects.service";

@Controller()
@ApiTags("subjects")
export class SubjectsOtherController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly utilService: UtilService,
  ) {}

  @Get("students/:id/:schoolYear/subjects")
  async findByStudentSchoolYear(
    @Param("id") id: number,
    @Param("schoolYear") schoolYear: string,
  ) {
    return this.subjectsService.findByStudentSchoolYear(id, schoolYear);
  }

  @Post("students/:id/:schoolYear/subjects")
  @ApiBody({
    isArray: true,
    type: Number,
  })
  async addSubjects(
    @Param("id") id: number,
    @Param("schoolYear") schoolYear: string,
    @Body() subjectIds: number[],
  ) {
    const enrolledSubjects = await this.subjectsService.addSubjectsToStudent(
      subjectIds,
      id,
      schoolYear,
    );

    return enrolledSubjects.map((enrolledSubject) =>
      this.subjectsService.mapEnrolledToDto(enrolledSubject),
    );
  }

  @Get("departments/:id/subjects")
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: SubjectsPaginatedDto,
  })
  async findByDepartment(
    @Param("id") id: number,
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ) {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const subjectsPaginated = await this.subjectsService.findByDepartment(id, {
      page,
      limit,
      route,
    });

    return {
      items: subjectsPaginated.items.map((subject) =>
        this.subjectsService.mapToDto(subject),
      ),
      meta: subjectsPaginated.meta,
      links: subjectsPaginated.links,
    };
  }
  @Get("professor/:id/subjects")
  async findByProfessor(@Param("id") id: number) {
    const subjects = await this.subjectsService.findByProfessor(id);

    return subjects.map((subject) => this.subjectsService.mapToDto(subject));
  }
}
