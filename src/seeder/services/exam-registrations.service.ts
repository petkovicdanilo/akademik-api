import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExamPeriod } from "src/exams/entities/exam-period.entity";
import { EnrolledSubject } from "src/subjects/entities/enrolled-subject.entity";
import { DeepPartial, Repository } from "typeorm";
import * as faker from "faker";
import { ExamRegistration } from "src/exams/entities/exam-registration.entity";
import { Grade } from "src/subjects/types";

@Injectable()
export class ExamRegistrationsSeederService {
  constructor(
    @InjectRepository(EnrolledSubject)
    private readonly enrolledSubjectsRepository: Repository<EnrolledSubject>,
    @InjectRepository(ExamPeriod)
    private readonly examPeriodsRepository: Repository<ExamPeriod>,
    @InjectRepository(ExamRegistration)
    private readonly examRegistrationsRepository: Repository<ExamRegistration>,
  ) {}

  async seed() {
    try {
      const enrolledSubjects = await this.enrolledSubjectsRepository.find();
      const examPeriods = await this.examPeriodsRepository.find();
      const schoolYearToExamPeriod = new Map<string, ExamPeriod[]>();

      examPeriods.forEach((examPeriod) => {
        if (!schoolYearToExamPeriod.has(examPeriod.schoolYear.id)) {
          schoolYearToExamPeriod.set(examPeriod.schoolYear.id, []);
        }

        schoolYearToExamPeriod.get(examPeriod.schoolYear.id).push(examPeriod);
      });

      const examRegistrationsToAdd: DeepPartial<ExamRegistration>[] = [];
      const enrolledSubjectsToUpdate: EnrolledSubject[] = [];

      enrolledSubjects.forEach((enrolledSubject) => {
        // no exam registrations for this subject
        if (faker.datatype.number({ min: 1, max: 10 }) < 2) {
          return;
        }

        const examPeriods = schoolYearToExamPeriod.get(
          enrolledSubject.schoolYearId,
        );

        let i = 0;
        let graded = false;

        while (i < examPeriods.length && !graded) {
          // no exam registration in this exam period
          if (faker.datatype.number({ min: 1, max: 2 }) == 1) {
            i++;
            continue;
          }

          const examPeriod = examPeriods[i];

          const grade = faker.datatype.number({ min: 1, max: 10 });

          const examRegistration: DeepPartial<ExamRegistration> = {
            createdAt: faker.date.between(
              examPeriod.startDate,
              examPeriod.endDate,
            ),
            studentId: enrolledSubject.studentId,
            subjectId: enrolledSubject.subjectId,
            examPeriodId: examPeriod.id,
          };

          if (grade >= 6) {
            examRegistration.grade = grade as Grade;

            enrolledSubject.grade = grade as Grade;
            enrolledSubjectsToUpdate.push(enrolledSubject);

            graded = true;
          }

          examRegistrationsToAdd.push(examRegistration);

          i++;
        }
      });

      await this.enrolledSubjectsRepository.save(enrolledSubjectsToUpdate);
      await this.examRegistrationsRepository.save(examRegistrationsToAdd);
    } catch (err) {
      console.log(err);
    }
  }
}
