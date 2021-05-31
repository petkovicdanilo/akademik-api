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
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Pagination } from "nestjs-typeorm-paginate";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { AdminsPaginatedDto } from "src/pagination/admin.dto";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { AdminsService } from "./admins.service";
import { AdminDto } from "./dto/admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admins")
@ApiTags("admins")
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService,
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

    const adminsPaginated = await this.adminsService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: adminsPaginated.items.map((student) =>
        this.adminsService.mapAdminToAdminDto(student),
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
  async findOne(@Param("id") id: number): Promise<AdminDto> {
    const admin = await this.adminsService.findOne(+id);
    return this.adminsService.mapAdminToAdminDto(admin);
  }

  @Post()
  async create(@Body() createAdminDto: CreateUserDto) {
    const admin = await this.adminsService.create(createAdminDto);
    return this.adminsService.mapAdminToAdminDto(admin);
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: AdminDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminDto> {
    const admin = await this.adminsService.update(+id, updateAdminDto);
    return this.adminsService.mapAdminToAdminDto(admin);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: AdminDto,
  })
  async remove(@Param("id") id: number): Promise<AdminDto> {
    const admin = await this.adminsService.remove(+id);
    return this.adminsService.mapAdminToAdminDto(admin);
  }
}
