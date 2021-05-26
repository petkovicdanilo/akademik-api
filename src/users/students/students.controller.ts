import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { StudentsPaginatedDto } from "src/pagination/student.dto";
import { StudentDto } from "./dto/student.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";

@Controller("students")
@ApiTags("students")
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly utilService: UtilService,
  ) {}

  @Get()
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
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<StudentDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const studentsPaginated = await this.studentsService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: studentsPaginated.items.map((student) => student.toDto()),
      meta: studentsPaginated.meta,
      links: studentsPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async findOne(@Param("id") id: string): Promise<StudentDto> {
    const student = await this.studentsService.findOne(+id);
    return student.toDto();
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async update(
    @Param("id") id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    const student = await this.studentsService.update(+id, updateStudentDto);
    return student.toDto();
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async remove(@Param("id") id: string): Promise<StudentDto> {
    const student = await this.studentsService.remove(+id);
    return student.toDto();
  }
}
