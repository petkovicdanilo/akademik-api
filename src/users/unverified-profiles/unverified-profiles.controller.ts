import {
  Controller,
  Get,
  Post,
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
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UnverifiedProfilesPaginatedDto } from "src/pagination/unverified-profile.dto";
import { UtilService } from "src/util/util.service";
import { ProfileDto } from "../profiles/dto/profile.dto";
import { ProfilesService } from "../profiles/profiles.service";
import { UnverifiedProfileDto } from "./dto/unverified-profile.dto";
import { UnverifiedProfilesService } from "./unverified-profiles.service";

@Controller("unverified")
@ApiTags("unverified users")
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class UnverifiedProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
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
    type: UnverifiedProfilesPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<UnverifiedProfileDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const profilesPaginated = await this.unverifiedProfilesService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: profilesPaginated.items.map((profile) =>
        this.unverifiedProfilesService.mapToDto(profile),
      ),
      meta: profilesPaginated.meta,
      links: profilesPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: UnverifiedProfileDto,
  })
  async findOne(@Param("id") id: number) {
    const profile = await this.unverifiedProfilesService.findOne(+id);

    return this.unverifiedProfilesService.mapToDto(profile);
  }

  @Post(":id/verify")
  @ApiResponse({
    status: 200,
    type: ProfileDto,
  })
  async verify(@Param("id") id: number) {
    const profile = await this.unverifiedProfilesService.verify(id);

    return this.profilesService.mapProfileToProfileDto(profile);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: UnverifiedProfileDto,
  })
  async remove(@Param("id") id: number) {
    const profile = await this.unverifiedProfilesService.remove(+id);

    return this.unverifiedProfilesService.mapToDto(profile);
  }
}
