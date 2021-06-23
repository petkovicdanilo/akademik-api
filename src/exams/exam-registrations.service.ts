import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SchoolYearsService } from "src/school-years/school-years.service";
import { SubjectsService } from "src/subjects/subjects.service";
import { StudentsService } from "src/users/students/students.service";
import { Repository } from "typeorm";
import { ExamRegistrationDto } from "./dto/exam-registration.dto";
import { GradesDto as GradeDto } from "./dto/grades.dto";
import { ExamRegistration } from "./entities/exam-registration.entity";
import { ExamPeriodsService } from "./exam-periods.service";

@Injectable()
export class ExamRegistrationsService {
  constructor(
    @InjectRepository(ExamRegistration)
    private readonly examRegistrationsRepository: Repository<ExamRegistration>,
    private readonly subjectsService: SubjectsService,
    private readonly examPeriodsService: ExamPeriodsService,
    private readonly studentsService: StudentsService,
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  findByExamPeriodSubject(examPeriodId: number, subjectId: number) {
    return this.examRegistrationsRepository.find({
      where: {
        examPeriodId,
        subjectId,
      },
    });
  }

  async registrateExams(
    studentId: number,
    examPeriodId: number,
    subjectIds: number[],
  ) {
    const student = await this.studentsService.findOne(studentId);
    const examPeriod = await this.examPeriodsService.findOne(examPeriodId);
    const subjects = await this.subjectsService.find(subjectIds);

    const currentExamRegistrations = await this.examRegistrationsRepository.find(
      {
        where: {
          studentId,
          examPeriodId,
        },
      },
    );
    const currentExamRegistrationsMap = new Map(
      currentExamRegistrations.map((examReg) => [examReg.subjectId, examReg]),
    );

    const enrolledSubjects = await this.subjectsService.findByStudentSchoolYearId(
      studentId,
      examPeriod.schoolYear.id,
    );
    const enrolledSubjectsMap = new Map(
      enrolledSubjects.map((enrolled) => [enrolled.id, enrolled]),
    );

    const examRegistrationsToInsert = [];
    subjects.forEach((subject) => {
      if (!enrolledSubjectsMap.has(subject.id)) {
        throw new BadRequestException("Student not enrolled in subject");
      }

      if (enrolledSubjectsMap.get(subject.id).grade) {
        throw new BadRequestException(
          "Can't registrate for already passed subject",
        );
      }

      if (currentExamRegistrationsMap.has(subject.id)) {
        throw new BadRequestException("Already registrated for exam");
      }

      examRegistrationsToInsert.push({
        student,
        subject,
        examPeriod,
      });
    });

    return this.examRegistrationsRepository.save(examRegistrationsToInsert);
  }

  async findByStudentSchoolYear(studentId: number, schoolYearId: string) {
    const student = await this.studentsService.findOne(studentId);
    const schoolYear = await this.schoolYearsService.findOne(schoolYearId);

    return this.examRegistrationsRepository
      .createQueryBuilder("examRegistration")
      .leftJoinAndSelect("examRegistration.examPeriod", "examPeriod")
      .leftJoinAndSelect("examPeriod.schoolYear", "schoolYear")
      .where("examRegistration.studentId = :studentId", {
        studentId: student.id,
      })
      .andWhere("schoolYear.id = :schoolYearId", {
        schoolYearId: schoolYear.id,
      })
      .orderBy("examPeriod.id")
      .addOrderBy("examRegistration.subjectId")
      .getMany();
  }

  async grade(
    examPeriodId: number,
    subjectId: number,
    gradeDtos: GradeDto[],
  ): Promise<ExamRegistration[]> {
    const examPeriod = await this.examPeriodsService.findOne(examPeriodId);
    const subject = await this.subjectsService.findOne(subjectId);

    const examRegistrations = await this.examRegistrationsRepository
      .createQueryBuilder("examRegistration")
      .leftJoinAndSelect("examRegistration.student", "student")
      .leftJoinAndSelect("student.enrolledSubjects", "enrolledSubject")
      .leftJoinAndSelect("enrolledSubject.subject", "subject")
      .leftJoinAndSelect("enrolledSubject.schoolYear", "schoolYear")
      .where("examRegistration.examPeriodId = :examPeriodId", {
        examPeriodId,
      })
      .andWhere("student.id IN (:...studentIds)", {
        studentIds: gradeDtos.map((gradeDto) => gradeDto.studentId),
      })
      .andWhere("subject.id = :subjectId", { subjectId })
      .getMany();

    const examRegistrationsMap = new Map(
      examRegistrations.map((examReg) => [examReg.studentId, examReg]),
    );
    const examRegistrationsToUpdate: ExamRegistration[] = [];

    await Promise.all(
      gradeDtos.map(async (gradeDto) => {
        const enrolledSubjects = await this.subjectsService.findByStudentSchoolYearId(
          gradeDto.studentId,
          examPeriod.schoolYear.id,
        );

        if (!enrolledSubjects.find((enrolled) => enrolled.id == subjectId)) {
          throw new BadRequestException("Student not enrolled in subject");
        }

        if (!examRegistrationsMap.has(gradeDto.studentId)) {
          throw new BadRequestException(
            "Student didn't submit exam registration",
          );
        }

        const examRegistration = examRegistrationsMap.get(gradeDto.studentId);

        if (examRegistration.grade) {
          throw new BadRequestException("Student already has a grade");
        }

        examRegistration.grade = gradeDto.grade;
        examRegistrationsToUpdate.push(examRegistration);

        await this.subjectsService.setGrade(
          gradeDto.studentId,
          examPeriod.schoolYear.id,
          subject.id,
          gradeDto.grade,
        );
      }),
    );

    return this.examRegistrationsRepository.save(examRegistrationsToUpdate);
  }

  mapToDto(examRegistration: ExamRegistration): ExamRegistrationDto {
    return {
      studentId: examRegistration.studentId,
      subjectId: examRegistration.subjectId,
      examPeriodId: examRegistration.examPeriodId,
      createdAt: examRegistration.createdAt,
      grade: examRegistration.grade,
    };
  }
}