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
  ForbiddenException,
} from "@nestjs/common";
import { SchoolYearsService } from "./school-years.service";
import { CreateSchoolYearDto } from "./dto/create-school-year.dto";
import { UpdateSchoolYearDto } from "./dto/update-school-year.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "src/common/guards/access-token.guard";
import { Action, CaslAbilityFactory } from "src/casl/casl-ability.factory";

@Controller("school-years")
@ApiTags("school-years")
export class SchoolYearsController {
  constructor(
    private readonly schoolYearsService: SchoolYearsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async create(
    @Body() createSchoolYearDto: CreateSchoolYearDto,
    @Req() request: any,
  ) {
    const ability = this.caslAbilityFactory.createForSchoolYear(request.user);
    if (ability.cannot(Action.Create, "all")) {
      throw new ForbiddenException("Can't create school year");
    }

    const schoolYear = await this.schoolYearsService.create(
      createSchoolYearDto,
    );

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Get()
  async findAll() {
    const schoolYears = await this.schoolYearsService.findAll();

    return schoolYears.map((schoolYear) =>
      this.schoolYearsService.mapToDto(schoolYear),
    );
  }

  @Post(":id/current")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async setCurrent(@Param("id") id: string, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForSchoolYear(request.user);
    if (ability.cannot(Action.Update, "all")) {
      throw new ForbiddenException("Can't set current school year");
    }

    const schoolYear = await this.schoolYearsService.setCurrent(id);

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Get("current")
  async findCurrent() {
    const schoolYear = await this.schoolYearsService.findCurrent();

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const schoolYear = await this.schoolYearsService.findOne(id);

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
    @Req() request: any,
  ) {
    const ability = this.caslAbilityFactory.createForSchoolYear(request.user);
    if (ability.cannot(Action.Update, "all")) {
      throw new ForbiddenException("Can't update school year");
    }

    const schoolYear = await this.schoolYearsService.update(
      id,
      updateSchoolYearDto,
    );

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async remove(@Param("id") id: string, @Req() request: any) {
    const ability = this.caslAbilityFactory.createForSchoolYear(request.user);
    if (ability.cannot(Action.Delete, "all")) {
      throw new ForbiddenException("Can't delete school year");
    }

    const schoolYear = await this.schoolYearsService.remove(id);

    return this.schoolYearsService.mapToDto(schoolYear);
  }
}
