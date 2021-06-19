import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExamPeriod } from "src/exams/entities/exam-period.entity";
import { SchoolYear } from "src/school-years/entities/school-year.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExamPeriodsSeederService {
  constructor(
    @InjectRepository(ExamPeriod)
    private readonly examPeriodsRepository: Repository<ExamPeriod>,
    @InjectRepository(SchoolYear)
    private readonly schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  async seed() {
    try {
      const examPeriodsToInsert: ExamPeriod[] = [];

      const schoolYears = await this.schoolYearsRepository.find();
      schoolYears.forEach((schoolYear) => {
        examPeriodsToInsert.push(...this.generateExamPeriods(schoolYear));
      });

      await this.examPeriodsRepository.save(examPeriodsToInsert);
    } catch (err) {
      console.log(err);
    }
  }

  generateExamPeriods(schoolYear: SchoolYear): ExamPeriod[] {
    const firstYear = +schoolYear.id.substr(0, 4);
    const secondYear = firstYear + 1;

    return [
      {
        id: null,
        name: "December",
        schoolYear,
        registrationStartTime: new Date(`${firstYear}-12-14`),
        registrationEndTime: new Date(`${firstYear}-12-18`),
        startTime: new Date(`${firstYear}-12-21`),
        endTime: new Date(`${firstYear}-12-26`),
      },
      {
        id: null,
        name: "January-february",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-01-18`),
        registrationEndTime: new Date(`${secondYear}-01-22`),
        startTime: new Date(`${secondYear}-01-25`),
        endTime: new Date(`${secondYear}-02-13`),
      },
      {
        id: null,
        name: "April",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-03-29`),
        registrationEndTime: new Date(`${secondYear}-04-02`),
        startTime: new Date(`${secondYear}-04-05`),
        endTime: new Date(`${secondYear}-04-10`),
      },
      {
        id: null,
        name: "June 1",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-05-24`),
        registrationEndTime: new Date(`${secondYear}-05-28`),
        startTime: new Date(`${secondYear}-06-02`),
        endTime: new Date(`${secondYear}-06-19`),
      },
      {
        id: null,
        name: "June 2",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-06-16`),
        registrationEndTime: new Date(`${secondYear}-06-21`),
        startTime: new Date(`${secondYear}-06-23`),
        endTime: new Date(`${secondYear}-07-10`),
      },
      {
        id: null,
        name: "September",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-08-16`),
        registrationEndTime: new Date(`${secondYear}-08-20`),
        startTime: new Date(`${secondYear}-08-23`),
        endTime: new Date(`${secondYear}-09-04`),
      },
      {
        id: null,
        name: "October",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-09-01`),
        registrationEndTime: new Date(`${secondYear}-09-04`),
        startTime: new Date(`${secondYear}-09-07`),
        endTime: new Date(`${secondYear}-09-18`),
      },
      {
        id: null,
        name: "October 2",
        schoolYear,
        registrationStartTime: new Date(`${secondYear}-09-14`),
        registrationEndTime: new Date(`${secondYear}-09-18`),
        startTime: new Date(`${secondYear}-09-21`),
        endTime: new Date(`${secondYear}-10-02`),
      },
    ];
  }
}
