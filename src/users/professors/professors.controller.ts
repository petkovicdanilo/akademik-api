import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfessorsPaginatedDto } from "src/pagination/professor.dto";
import { ProfessorDto } from "./dto/professor.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { Request } from "express";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { ProfessorSpecificDto } from "./dto/professor-specific.dto";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { ProfilesService } from "../profiles/profiles.service";
import { AccessForbiddenException } from "src/common/exceptions/access-forbidden.exception";

@Controller("users/professors")
@ApiTags("professors")
export class ProfessorsController {
  constructor(
    private readonly professorsService: ProfessorsService,
    private readonly utilService: UtilService,
    private readonly profilesService: ProfilesService,
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
    type: ProfessorsPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<ProfessorDto>> {
    const pagingParams = this.utilService.getPagingParams(
      paginationParams,
      request,
    );
    const professorsPaginated = await this.professorsService.findAll(
      pagingParams,
    );

    return {
      items: professorsPaginated.items.map((professor) =>
        this.professorsService.mapProfessorToProfessorDto(professor),
      ),
      meta: professorsPaginated.meta,
      links: professorsPaginated.links,
    };
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async findOne(@Param("id") id: number): Promise<ProfessorDto> {
    const professor = await this.professorsService.findOne(+id);
    return this.professorsService.mapProfessorToProfessorDto(professor);
  }

  @Post(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async addProfessorSpecificInfo(
    @Param("id") id: number,
    @Body() professorSpecificDto: ProfessorSpecificDto,
    @Req() request: any,
  ): Promise<ProfessorDto> {
    const profile = await this.profilesService.findOne(id);
    const ability = this.caslAbilityFactory.createForProfessor(request.user);

    if (ability.cannot(Action.Create, profile)) {
      throw new AccessForbiddenException("Can't add professor specific info");
    }

    const professor = await this.professorsService.addProfessorSpecificInfo(
      id,
      professorSpecificDto,
    );

    return this.professorsService.mapProfessorToProfessorDto(professor);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateProfessorDto: UpdateProfessorDto,
    @Req() request: any,
  ): Promise<ProfessorDto> {
    const professor = await this.professorsService.findOne(id);
    const ability = this.caslAbilityFactory.createForProfessor(request.user);

    if (ability.cannot(Action.Update, professor.profile)) {
      throw new AccessForbiddenException("Can't update professor");
    }

    const updatedProfessor = await this.professorsService.update(
      +id,
      updateProfessorDto,
    );
    return this.professorsService.mapProfessorToProfessorDto(updatedProfessor);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async remove(
    @Param("id") id: number,
    @Req() request: any,
  ): Promise<ProfessorDto> {
    const professor = await this.professorsService.findOne(id);
    const ability = this.caslAbilityFactory.createForProfessor(request.user);

    if (ability.cannot(Action.Delete, professor.profile)) {
      throw new AccessForbiddenException("Can't delete professor");
    }

    const deletedProfessor = await this.professorsService.remove(+id);
    return this.professorsService.mapProfessorToProfessorDto(deletedProfessor);
  }
}
