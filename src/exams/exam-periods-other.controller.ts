import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ExamPeriodDto } from "./dto/exam-period.dto";
import { ExamPeriodsService } from "./exam-periods.service";

@Controller()
@ApiTags("exam-periods")
export class ExamPeriodsOtherController {
  constructor(private readonly examPeriodsService: ExamPeriodsService) {}

  @Get("school-years/:id/exam-periods")
  async findBySchoolYearId(
    @Param("id") schoolYearId: string,
  ): Promise<ExamPeriodDto[]> {
    const examPeriods = await this.examPeriodsService.findBySchoolYearId(
      schoolYearId,
    );

    return examPeriods.map((examPeriod) =>
      this.examPeriodsService.mapToDto(examPeriod),
    );
  }
}
