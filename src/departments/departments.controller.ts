import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Pagination } from "nestjs-typeorm-paginate";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { DepartmentsPaginatedDto } from "src/pagination/department.dto";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentDto } from "./dto/department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller("departments")
@ApiTags("departments")
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
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
    type: DepartmentsPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<DepartmentDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const departmentsPaginated = await this.departmentsService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: departmentsPaginated.items.map((department) =>
        this.departmentsService.mapDepartmentToDepartmentDto(department),
      ),
      meta: departmentsPaginated.meta,
      links: departmentsPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async findOne(@Param("id") id: number) {
    const department = await this.departmentsService.findOne(+id);

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentsService.create(
      createDepartmentDto,
    );

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const department = await this.departmentsService.update(
      +id,
      updateDepartmentDto,
    );

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async remove(@Param("id") id: number) {
    const department = await this.departmentsService.remove(+id);

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }
}
