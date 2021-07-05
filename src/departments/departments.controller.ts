import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { DepartmentsService } from "./departments.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentDto } from "./dto/department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Department } from "./entities/department.entity";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller("departments")
@ApiTags("departments")
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
  async findOne(@Param("id") id: number): Promise<DepartmentDto> {
    const department = await this.departmentsService.findOne(+id);

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Req() request: any,
  ): Promise<DepartmentDto> {
    const ability = this.caslAbilityFactory.createForDepartment(request.user);
    if (!ability.can(Action.Create, Department)) {
      throw new AccessForbiddenException("User can't create department");
    }

    const department = await this.departmentsService.create(
      createDepartmentDto,
    );

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Req() request: any,
  ): Promise<DepartmentDto> {
    const ability = this.caslAbilityFactory.createForDepartment(request.user);
    if (!ability.can(Action.Update, Department)) {
      throw new AccessForbiddenException("User can't update department");
    }

    const department = await this.departmentsService.update(
      +id,
      updateDepartmentDto,
    );

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: DepartmentDto,
  })
  async remove(
    @Param("id") id: number,
    @Req() request: any,
  ): Promise<DepartmentDto> {
    const ability = this.caslAbilityFactory.createForDepartment(request.user);
    if (!ability.can(Action.Delete, Department)) {
      throw new AccessForbiddenException("User can't delete department");
    }
    const department = await this.departmentsService.remove(+id);

    return this.departmentsService.mapDepartmentToDepartmentDto(department);
  }
}
