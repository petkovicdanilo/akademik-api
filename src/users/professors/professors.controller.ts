import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common";
import { ProfessorsService } from "./professors.service";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("professors")
@ApiTags("professors")
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get()
  findAll() {
    return this.professorsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.professorsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return this.professorsService.update(+id, updateProfessorDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.professorsService.remove(+id);
  }
}
