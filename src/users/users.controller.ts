import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { ProfilesPaginatedDto } from "src/pagination/profile.dto";
import { UtilService } from "src/util/util.service";
import { ProfileDto } from "./profiles/dto/profile.dto";
import { ProfilesService } from "./profiles/profiles.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller("users")
@ApiTags("users")
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly utilService: UtilService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
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
    type: ProfilesPaginatedDto,
  })
  async findAll(
    @Req() request: any,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<ProfileDto>> {
    const ability = this.caslAbilityFactory.createForUser(request.user);
    if (ability.cannot(Action.Read, "all")) {
      throw new AccessForbiddenException("Can't list all users");
    }

    const pagingParams = this.utilService.getPagingParams(
      paginationParams,
      request,
    );
    const profilesPaginated = await this.profilesService.findAll(pagingParams);

    return {
      items: profilesPaginated.items.map((profile) =>
        this.profilesService.mapProfileToProfileDto(profile),
      ),
      meta: profilesPaginated.meta,
      links: profilesPaginated.links,
    };
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: ProfileDto,
  })
  async remove(
    @Param("id") id: number,
    @Req() request: any,
  ): Promise<ProfileDto> {
    const ability = this.caslAbilityFactory.createForUser(request.user);
    const profile = await this.profilesService.findOne(id);

    if (ability.cannot(Action.Delete, profile)) {
      throw new AccessForbiddenException("User can't delete profile");
    }

    const removedProfile = await this.profilesService.remove(+id);
    return this.profilesService.mapProfileToProfileDto(removedProfile);
  }

  @Get("me")
  async me(@Req() request: any): Promise<ProfileDto> {
    const profile = await this.profilesService.findOne(request.user.id);

    return this.profilesService.mapProfileToProfileDto(profile);
  }
}
