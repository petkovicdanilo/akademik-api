import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateExamPeriodDto } from "./dto/create-exam-period.dto";
import { UpdateExamPeriodDto } from "./dto/update-exam-period.dto";
import { ExamPeriodsService } from "./exam-periods.service";

@Controller("exam-periods")
@ApiTags("exam-periods")
export class ExamPeriodsController {
  constructor(private readonly examPeriodsService: ExamPeriodsService) {}

  @Post()
  async create(@Body() createExamPeriodDto: CreateExamPeriodDto) {
    const examPeriod = await this.examPeriodsService.create(
      createExamPeriodDto,
    );

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    const examPeriod = await this.examPeriodsService.findOne(+id);

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateExamPeriodDto: UpdateExamPeriodDto,
  ) {
    const examPeriod = await this.examPeriodsService.update(
      +id,
      updateExamPeriodDto,
    );

    return this.examPeriodsService.mapToDto(examPeriod);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    const examPeriod = await this.examPeriodsService.remove(+id);

    return this.examPeriodsService.mapToDto(examPeriod);
  }
}
