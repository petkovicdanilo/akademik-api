import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Post,
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
import { StudentSpecificDto } from "./dto/student-specific.dto";

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
      items: studentsPaginated.items.map((student) =>
        this.studentsService.mapStudentToStudentDto(student),
      ),
      meta: studentsPaginated.meta,
      links: studentsPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async findOne(@Param("id") id: number): Promise<StudentDto> {
    const student = await this.studentsService.findOne(+id);
    return this.studentsService.mapStudentToStudentDto(student);
  }

  @Post(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async addStudentSpecificInfo(
    @Param("id") id: number,
    @Body() studentSpecificDto: StudentSpecificDto,
  ) {
    const student = await this.studentsService.addStudentSpecificInfo(
      id,
      studentSpecificDto,
    );

    return this.studentsService.mapStudentToStudentDto(student);
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    const student = await this.studentsService.update(+id, updateStudentDto);
    return this.studentsService.mapStudentToStudentDto(student);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async remove(@Param("id") id: number): Promise<StudentDto> {
    const student = await this.studentsService.remove(+id);
    return this.studentsService.mapStudentToStudentDto(student);
  }
}
