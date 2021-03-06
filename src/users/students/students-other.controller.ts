import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Pagination } from "nestjs-typeorm-paginate";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { StudentsPaginatedDto } from "src/pagination/student.dto";
import { UtilService } from "src/util/util.service";
import { StudentDto } from "./dto/student.dto";
import { StudentsService } from "./students.service";

@Controller()
@ApiTags("students")
export class StudentsOtherController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly utilService: UtilService,
  ) {}

  @Get("/subjects/:id/:schoolYearId/students")
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
    type: StudentsPaginatedDto,
  })
  async findStudents(
    @Param("id") id: number,
    @Param("schoolYearId") schoolYearId: string,
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<StudentDto>> {
    const pagingParams = this.utilService.getPagingParams(
      paginationParams,
      request,
    );
    const studentsPaginated = await this.studentsService.findBySubjectSchoolYearId(
      id,
      schoolYearId,
      pagingParams,
    );

    return {
      items: studentsPaginated.items.map((student) =>
        this.studentsService.mapStudentToStudentDto(student),
      ),
      meta: studentsPaginated.meta,
      links: studentsPaginated.links,
    };
  }
}
