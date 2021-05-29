import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Pagination } from "nestjs-typeorm-paginate";
import { AdminsPaginatedDto } from "src/pagination/admin.dto";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admin")
@ApiTags("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
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
    type: AdminsPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<AdminDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const adminsPaginated = await this.adminService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: adminsPaginated.items.map((student) =>
        this.adminService.mapAdminToAdminDto(student),
      ),
      meta: adminsPaginated.meta,
      links: adminsPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: AdminDto,
  })
  async findOne(@Param("id") id: string): Promise<AdminDto> {
    const admin = await this.adminService.findOne(+id);
    return this.adminService.mapAdminToAdminDto(admin);
  }

  @Post()
  async create(@Body() createAdminDto: CreateUserDto) {
    const admin = await this.adminService.create(createAdminDto);
    return this.adminService.mapAdminToAdminDto(admin);
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: AdminDto,
  })
  async update(
    @Param("id") id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminDto> {
    const admin = await this.adminService.update(+id, updateAdminDto);
    return this.adminService.mapAdminToAdminDto(admin);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: AdminDto,
  })
  async remove(@Param("id") id: string): Promise<AdminDto> {
    const admin = await this.adminService.remove(+id);
    return this.adminService.mapAdminToAdminDto(admin);
  }
}
