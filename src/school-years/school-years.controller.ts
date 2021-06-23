import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SchoolYearsService } from "./school-years.service";
import { CreateSchoolYearDto } from "./dto/create-school-year.dto";
import { UpdateSchoolYearDto } from "./dto/update-school-year.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("school-years")
@ApiTags("school-years")
export class SchoolYearsController {
  constructor(private readonly schoolYearsService: SchoolYearsService) {}

  @Post()
  async create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
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

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const schoolYear = await this.schoolYearsService.findOne(id);

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  // @Post("current")
  // setCurrent(@Body() schoolYear: string) {
  //   return this.schoolYearsService.setCurrent(schoolYear);
  // }

  // @Get("current")
  // findCurrent() {
  //   return this.schoolYearsService.findCurrent();
  // }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ) {
    const schoolYear = await this.schoolYearsService.update(
      id,
      updateSchoolYearDto,
    );

    return this.schoolYearsService.mapToDto(schoolYear);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const schoolYear = await this.schoolYearsService.remove(id);

    return this.schoolYearsService.mapToDto(schoolYear);
  }
}
