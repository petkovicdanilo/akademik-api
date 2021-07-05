import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";
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

  async create(createExamPeriodDto: CreateExamPeriodDto): Promise<ExamPeriod> {
    const schoolYear = await this.schoolYearsService.findOne(
      createExamPeriodDto.schoolYearId,
    );

    const examPeriod = new ExamPeriod();

    examPeriod.name = createExamPeriodDto.name;
    examPeriod.startDate = createExamPeriodDto.startDate;
    examPeriod.endDate = createExamPeriodDto.endDate;
    examPeriod.registrationStartDate =
      createExamPeriodDto.registrationStartDate;
    examPeriod.registrationEndDate = createExamPeriodDto.registrationEndDate;
    examPeriod.schoolYear = schoolYear;

    try {
      return await this.examPeriodsRepository.save(examPeriod);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  async findOne(id: number): Promise<ExamPeriod> {
    const examPeriod = await this.examPeriodsRepository.findOne(id);

    if (!examPeriod) {
      throw new EntityNotFoundException(ExamPeriod, "Exam period");
    }

    return examPeriod;
  }

  async update(
    id: number,
    updateExamPeriodDto: UpdateExamPeriodDto,
  ): Promise<ExamPeriod> {
    const examPeriod = await this.findOne(id);

    examPeriod.name = updateExamPeriodDto.name ?? examPeriod.name;
    examPeriod.startDate =
      updateExamPeriodDto.startDate ?? examPeriod.startDate;
    examPeriod.endDate = updateExamPeriodDto.endDate ?? examPeriod.endDate;
    examPeriod.registrationStartDate =
      updateExamPeriodDto.registrationStartDate ??
      examPeriod.registrationStartDate;
    examPeriod.registrationEndDate =
      updateExamPeriodDto.registrationEndDate ?? examPeriod.registrationEndDate;

    if (updateExamPeriodDto.schoolYearId) {
      const schoolYear = await this.schoolYearsService.findOne(
        updateExamPeriodDto.schoolYearId,
      );

      examPeriod.schoolYear = schoolYear;
    }

    try {
      return await this.examPeriodsRepository.save(examPeriod);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  async remove(id: number): Promise<ExamPeriod> {
    const examPeriod = await this.findOne(id);

    this.examPeriodsRepository.remove(examPeriod);
    examPeriod.id = id;

    return examPeriod;
  }

  async findBySchoolYearId(schoolYearId: string): Promise<ExamPeriod[]> {
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
      startDate: examPeriod.startDate,
      endDate: examPeriod.endDate,
      registrationStartDate: examPeriod.registrationStartDate,
      registrationEndDate: examPeriod.registrationEndDate,
      schoolYearId: examPeriod.schoolYear.id,
    };
  }
}
