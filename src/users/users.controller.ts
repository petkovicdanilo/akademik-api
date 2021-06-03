import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Request as NestJsRequest,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Pagination } from "nestjs-typeorm-paginate";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { ProfilesPaginatedDto } from "src/pagination/profile.dto";
import { UtilService } from "src/util/util.service";
import { ProfileDto } from "./profiles/dto/profile.dto";
import { ProfilesService } from "./profiles/profiles.service";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly utilService: UtilService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
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
    type: ProfilesPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<ProfileDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const profilesPaginated = await this.profilesService.findAll({
      page,
      limit,
      route,
    });

    return {
      items: profilesPaginated.items.map((profile) =>
        this.profilesService.mapProfileToProfileDto(profile),
      ),
      meta: profilesPaginated.meta,
      links: profilesPaginated.links,
    };
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  @ApiResponse({
    status: 200,
    type: ProfileDto,
  })
  async remove(@Param("id") id: number) {
    const profile = await this.profilesService.remove(+id);

    return this.profilesService.mapProfileToProfileDto(profile);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@NestJsRequest() req: any) {
    const profile = await this.profilesService.findOne(req.user.id);

    return this.profilesService.mapProfileToProfileDto(profile);
  }
}
