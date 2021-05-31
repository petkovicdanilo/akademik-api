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
} from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfessorsPaginatedDto } from "src/pagination/professor.dto";
import { ProfessorDto } from "./dto/professor.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { Request } from "express";
import { PaginationParams } from "src/pagination/pagination-params.dto";
import { UtilService } from "src/util/util.service";
import { ProfessorSpecificDto } from "./dto/professor-specific.dto";

@Controller("users/professors")
@ApiTags("professors")
export class ProfessorsController {
  constructor(
    private readonly professorsService: ProfessorsService,
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
    type: ProfessorsPaginatedDto,
  })
  async findAll(
    @Req() request: Request,
    @Query() paginationParams: PaginationParams,
  ): Promise<Pagination<ProfessorDto>> {
    const page = paginationParams.page || 1;
    const limit = paginationParams.limit || 10;

    const route = this.utilService.getAppRoute(request.path);

    const professorsPaginated = await this.professorsService.findAll({
      page,
      limit,
      route,
    });

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
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async addProfessorSpecificInfo(
    @Param("id") id: number,
    @Body() professorSpecificDto: ProfessorSpecificDto,
  ) {
    const professor = await this.professorsService.addProfessorSpecificInfo(
      id,
      professorSpecificDto,
    );

    return this.professorsService.mapProfessorToProfessorDto(professor);
  }

  @Patch(":id")
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async update(
    @Param("id") id: number,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ): Promise<ProfessorDto> {
    const professor = await this.professorsService.update(
      +id,
      updateProfessorDto,
    );
    return this.professorsService.mapProfessorToProfessorDto(professor);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    type: ProfessorDto,
  })
  async remove(@Param("id") id: number): Promise<ProfessorDto> {
    const professor = await this.professorsService.remove(+id);
    return this.professorsService.mapProfessorToProfessorDto(professor);
  }
}
