import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SchoolYearsService } from "src/school-years/school-years.service";
import { Repository } from "typeorm";
import { CreateExamPeriodDto } from "./dto/create-exam-period.dto";
import { ExamPeriodDto } from "./dto/exam-period.dto";
import { UpdateExamPeriodDto } from "./dto/update-exam-period.dto";
import { ExamPeriod } from "./entities/exam-period.entity";

@Injectable()
export class ExamPeriodsService {
  constructor(
    @InjectRepository(ExamPeriod)
    private readonly examPeriodsRepository: Repository<ExamPeriod>,
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  async create(createExamPeriodDto: CreateExamPeriodDto) {
    const schoolYear = await this.schoolYearsService.findOne(
      createExamPeriodDto.schoolYear,
    );

    const examPeriod = new ExamPeriod();

    examPeriod.name = createExamPeriodDto.name;
    examPeriod.startTime = createExamPeriodDto.startTime;
    examPeriod.endTime = createExamPeriodDto.endTime;
    examPeriod.registrationStartTime =
      createExamPeriodDto.registrationStartTime;
    examPeriod.registrationEndTime = createExamPeriodDto.registrationEndTime;
    examPeriod.schoolYear = schoolYear;

    return this.examPeriodsRepository.save(examPeriod);
  }

  async findOne(id: number) {
    const examPeriod = await this.examPeriodsRepository.findOne(id);

    if (!examPeriod) {
      throw new NotFoundException("Exam period not found");
    }

    return examPeriod;
  }

  async update(id: number, updateExamPeriodDto: UpdateExamPeriodDto) {
    const examPeriod = await this.findOne(id);

    examPeriod.name = updateExamPeriodDto.name ?? examPeriod.name;
    examPeriod.startTime =
      updateExamPeriodDto.startTime ?? examPeriod.startTime;
    examPeriod.endTime = updateExamPeriodDto.endTime ?? examPeriod.endTime;
    examPeriod.registrationStartTime =
      updateExamPeriodDto.registrationStartTime ??
      examPeriod.registrationStartTime;
    examPeriod.registrationEndTime =
      updateExamPeriodDto.registrationEndTime ?? examPeriod.registrationEndTime;

    if (updateExamPeriodDto.schoolYear) {
      const schoolYear = await this.schoolYearsService.findOne(
        updateExamPeriodDto.schoolYear,
      );

      examPeriod.schoolYear = schoolYear;
    }

    return this.examPeriodsRepository.save(examPeriod);
  }

  async remove(id: number) {
    const examPeriod = await this.findOne(id);

    this.examPeriodsRepository.remove(examPeriod);
    examPeriod.id = id;

    return examPeriod;
  }

  async findBySchoolYearId(schoolYearId: string) {
    const schoolYear = await this.schoolYearsService.findOne(schoolYearId);

    return this.examPeriodsRepository.find({
      where: {
        schoolYear,
      },
    });
  }

  mapToDto(examPeriod: ExamPeriod): ExamPeriodDto {
    return {
      id: examPeriod.id,
      name: examPeriod.name,
      startTime: examPeriod.startTime,
      endTime: examPeriod.endTime,
      registrationStartTime: examPeriod.registrationStartTime,
      registrationEndTime: examPeriod.registrationEndTime,
      schoolYear: examPeriod.schoolYear.id,
    };
  }
}
