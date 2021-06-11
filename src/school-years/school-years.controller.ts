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
  create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
    return this.schoolYearsService.create(createSchoolYearDto);
  }

  @Get()
  findAll() {
    return this.schoolYearsService.findAll();
  }

  @Get(":schoolYear")
  findOne(@Param("schoolYear") schoolYear: string) {
    return this.schoolYearsService.findOne(schoolYear);
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
  update(
    @Param("id") id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ) {
    return this.schoolYearsService.update(id, updateSchoolYearDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.schoolYearsService.remove(id);
  }
}
