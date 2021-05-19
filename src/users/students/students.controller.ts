import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common";
import { StudentsService } from "./students.service";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("students")
@ApiTags("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studentsService.remove(+id);
  }
}
