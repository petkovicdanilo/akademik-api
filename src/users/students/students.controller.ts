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
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StudentsPaginatedDto } from "src/pagination/student.dto";
import { StudentDto } from "./dto/student.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { StudentSpecificDto } from "./dto/student-specific.dto";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { ProfilesService } from "../profiles/profiles.service";

@Controller("users/students")
@ApiTags("students")
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly utilService: UtilService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly profilesService: ProfilesService,
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
    @Req() request: any,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<StudentDto>> {
    const pagingParams = this.utilService.getPagingParams(
      paginationParams,
      request,
    );
    const studentsPaginated = await this.studentsService.findAll(pagingParams);

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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async addStudentSpecificInfo(
    @Param("id") id: number,
    @Body() studentSpecificDto: StudentSpecificDto,
    @Req() request: any,
  ) {
    const profile = await this.profilesService.findOne(id);
    const ability = this.caslAbilityFactory.createForStudent(request.user);

    if (ability.cannot(Action.Create, profile)) {
      throw new ForbiddenException("Can't add student specific information");
    }

    const student = await this.studentsService.addStudentSpecificInfo(
      id,
      studentSpecificDto,
    );

    return this.studentsService.mapStudentToStudentDto(student);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() request: any,
  ): Promise<StudentDto> {
    const student = await this.studentsService.findOne(id);
    const ability = this.caslAbilityFactory.createForStudent(request.user);

    if (ability.cannot(Action.Update, student.profile)) {
      throw new ForbiddenException("Can't update student");
    }

    const updatedStudent = await this.studentsService.update(
      +id,
      updateStudentDto,
    );
    return this.studentsService.mapStudentToStudentDto(updatedStudent);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: StudentDto,
  })
  async remove(
    @Param("id") id: number,
    @Req() request: any,
  ): Promise<StudentDto> {
    const student = await this.studentsService.findOne(id);
    const ability = this.caslAbilityFactory.createForStudent(request.user);

    if (ability.cannot(Action.Delete, student.profile)) {
      throw new ForbiddenException("Can't delete student");
    }

    const deletedStudent = await this.studentsService.remove(+id);

    return this.studentsService.mapStudentToStudentDto(deletedStudent);
  }
}
