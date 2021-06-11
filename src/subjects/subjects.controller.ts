import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SubjectsService } from "./subjects.service";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("subjects")
@ApiTags("subjects")
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectsService.create(createSubjectDto);

    return this.subjectsService.mapToDto(subject);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const subject = await this.subjectsService.findOne(+id);

    return this.subjectsService.mapToDto(subject);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    const subject = await this.subjectsService.update(+id, updateSubjectDto);

    return this.subjectsService.mapToDto(subject);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const subject = await this.subjectsService.remove(+id);

    return this.subjectsService.mapToDto(subject);
  }

  // @Get("/:id/:schoolYear/students")
  // @ApiTags("students")
  // findStudents(
  //   @Param("id") id: number,
  //   @Param("schoolYear") schoolYear: string,
  // ) {
  //   return 1;
  // }
}
