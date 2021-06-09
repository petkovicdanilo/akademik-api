import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentDto } from "./dto/department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Controller("departments")
@ApiTags("departments")
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
    isArray: true,
  })
  async findAll(): Promise<DepartmentDto[]> {
    const departments = await this.departmentsService.findAll();

    return departments.map((depatment) =>
      this.departmentsService.mapDepartmentToDepartmentDto(depatment),
    );
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
