import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UnverifiedProfilesPaginatedDto } from "src/pagination/unverified-profile.dto";
import { UtilService } from "src/util/util.service";
import { ProfileDto } from "../profiles/dto/profile.dto";
import { ProfilesService } from "../profiles/profiles.service";
import { UnverifiedProfileDto } from "./dto/unverified-profile.dto";
import { UnverifiedProfilesService } from "./unverified-profiles.service";

@Controller("users/unverified")
@ApiTags("users")
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
export class UnverifiedProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly unverifiedProfilesService: UnverifiedProfilesService,
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
    type: UnverifiedProfilesPaginatedDto,
  })
  async findAll(
    @Req() request: any,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<UnverifiedProfileDto>> {
    const ability = this.caslAbilityFactory.createForUnverifiedUser(
      request.user,
    );
    if (ability.cannot(Action.Read, "all")) {
      throw new ForbiddenException("Can't list unverified users");
    }

    const pagingParams = this.utilService.getPagingParams(
      paginationParams,
      request,
    );
    const profilesPaginated = await this.unverifiedProfilesService.findAll(
      pagingParams,
    );

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
  async findOne(@Param("id") id: number, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForUnverifiedUser(
      request.user,
    );
    if (ability.cannot(Action.Read, "all")) {
      throw new ForbiddenException("Can't get unverified user");
    }

    const profile = await this.unverifiedProfilesService.findOne(+id);

    return this.unverifiedProfilesService.mapToDto(profile);
  }

  @Post(":id/verify")
  @ApiResponse({
    status: 200,
    type: ProfileDto,
  })
  async verify(@Param("id") id: number, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForUnverifiedUser(
      request.user,
    );
    if (ability.cannot(Action.Update, "all")) {
      throw new ForbiddenException("Can't verify user");
    }

    const profile = await this.unverifiedProfilesService.verify(id);

    return this.profilesService.mapProfileToProfileDto(profile);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: UnverifiedProfileDto,
  })
  async remove(@Param("id") id: number, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForUnverifiedUser(
      request.user,
    );
    if (ability.cannot(Action.Delete, "all")) {
      throw new ForbiddenException("Can't verify user");
    }

    const profile = await this.unverifiedProfilesService.remove(+id);

    return this.unverifiedProfilesService.mapToDto(profile);
  }
}
