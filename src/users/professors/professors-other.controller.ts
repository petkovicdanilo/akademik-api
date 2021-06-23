import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProfessorsService } from "./professors.service";

@Controller()
@ApiTags("professors")
export class ProfessorsOtherController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get("departments/:id/professors")
  async findByDepartment(@Param("id") departmentId: number) {
    const professors = await this.professorsService.findByDepartment(
      departmentId,
    );

    return professors.map((professor) =>
      this.professorsService.mapProfessorToProfessorDto(professor),
    );
  }
}
