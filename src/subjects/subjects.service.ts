import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";
import { DepartmentsService } from "src/departments/departments.service";
import { SchoolYearsService } from "src/school-years/school-years.service";
import { ProfessorsService } from "src/users/professors/professors.service";
import { StudentsService } from "src/users/students/students.service";
import { DeepPartial, Repository } from "typeorm";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { StudentsSubjectDto } from "./dto/students-subject.dto";
import { SubjectDto } from "./dto/subject.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { EnrolledSubject } from "./entities/enrolled-subject.entity";
import { Subject } from "./entities/subject.entity";
import { Grade } from "./types";

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(EnrolledSubject)
    private readonly enrolledSubjectsRepository: Repository<EnrolledSubject>,
    private readonly departmentsService: DepartmentsService,
    private readonly professorsService: ProfessorsService,
    private readonly studentsService: StudentsService,
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject();
    subject.name = createSubjectDto.name;
    subject.compulsory = createSubjectDto.compulsory;
    subject.ectsPoints = createSubjectDto.ectsPoints;
    subject.semester = createSubjectDto.semester;
    subject.year = createSubjectDto.year;

    const department = await this.departmentsService.findOne(
      createSubjectDto.departmentId,
    );
    subject.department = Promise.resolve(department);

    const professor = await this.professorsService.findOne(
      createSubjectDto.professorId,
    );
    subject.professor = Promise.resolve(professor);

    try {
      return await this.subjectsRepository.save(subject);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne(id);

    if (!subject) {
      throw new EntityNotFoundException(Subject);
    }

    return subject;
  }

  find(ids: number[]): Promise<Subject[]> {
    return this.subjectsRepository
      .createQueryBuilder("subject")
      .where("subject.id IN (:...ids)", { ids })
      .orderBy("subject.year")
      .addOrderBy("subject.id")
      .getMany();
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);

    subject.name = updateSubjectDto.name ?? subject.name;
    subject.compulsory = updateSubjectDto.compulsory ?? subject.compulsory;
    subject.ectsPoints = updateSubjectDto.ectsPoints ?? subject.ectsPoints;
    subject.semester = updateSubjectDto.semester ?? subject.semester;
    subject.year = updateSubjectDto.year ?? subject.year;

    if (updateSubjectDto.professorId) {
      const professor = await this.professorsService.findOne(
        updateSubjectDto.professorId,
      );

      subject.professor = Promise.resolve(professor);
    }

    try {
      return await this.subjectsRepository.save(subject);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  async remove(id: number): Promise<Subject> {
    const subject = await this.findOne(id);

    this.subjectsRepository.remove(subject);
    subject.id = id;

    return subject;
  }

  async findByStudentSchoolYearId(
    studentId: number,
    schoolYearId: string,
  ): Promise<StudentsSubjectDto[]> {
    const student = await this.studentsService.findOne(studentId);
    const schoolYear = await this.schoolYearsService.findOne(schoolYearId);

    const enrolledSubjects = await this.enrolledSubjectsRepository.find({
      where: {
        student,
        schoolYear,
      },
      relations: ["subject"],
    });

    return enrolledSubjects.map((enrolledSubject) =>
      this.mapToStudentsDto(enrolledSubject.subject, enrolledSubject.grade),
    );
  }

  async addSubjectsToStudent(
    subjectIds: number[],
    studentId: number,
    schoolYearId: string,
  ): Promise<EnrolledSubject[]> {
    const student = await this.studentsService.findOne(studentId);

    const schoolYear = await this.schoolYearsService.findOne(schoolYearId);

    const subjects = await this.subjectsRepository
      .createQueryBuilder("subject")
      .where("subject.id IN (:...subjectIds)", { subjectIds })
      .orderBy("subject.id")
      .getMany();

    const subjectsFromAnotherDepartment = subjects.filter(
      (subject) => subject.departmentId != student.department.id,
    );

    if (subjectsFromAnotherDepartment.length > 0) {
      throw new InvalidDataException(
        "Student can't enroll in subject from another department",
      );
    }

    const alreadyPassedSubjects = await this.enrolledSubjectsRepository
      .createQueryBuilder("enrolled")
      .where("enrolled.subjectId IN (:...subjectIds)", { subjectIds })
      .andWhere("enrolled.studentId = :studentId", { studentId })
      .andWhere("enrolled.grade IS NOT NULL")
      .getCount();

    if (alreadyPassedSubjects > 0) {
      throw new InvalidDataException(
        "Student can't enroll in already passed subjects",
      );
    }

    const totalEctsPoints = subjects.reduce(
      (accumulator, subject) => accumulator + subject.ectsPoints,
      0,
    );

    if (totalEctsPoints < 60) {
      throw new InvalidDataException("Minumum of 60 ects points not satisfied");
    }

    const enrolledSubjects = subjects.map<DeepPartial<EnrolledSubject>>(
      (subject) => {
        return {
          studentId: student.id,
          subjectId: subject.id,
          schoolYearId: schoolYear.id,
        };
      },
    );

    return this.enrolledSubjectsRepository.save(enrolledSubjects);
  }

  async setGrade(
    studentId: number,
    schoolYearId: string,
    subjectId: number,
    grade: Grade,
  ): Promise<void> {
    const enrolledSubject = await this.enrolledSubjectsRepository
      .createQueryBuilder("enrolledSubject")
      .select("enrolledSubject")
      .where("enrolledSubject.studentId = :studentId", {
        studentId: studentId,
      })
      .andWhere("enrolledSubject.subjectId = :subjectId", {
        subjectId: subjectId,
      })
      .andWhere("enrolledSubject.schoolYearId = :schoolYearId", {
        schoolYearId: schoolYearId,
      })
      .getOne();

    if (!enrolledSubject) {
      throw new InvalidDataException("Student is not enrolled in subject");
    }

    enrolledSubject.grade = grade;

    await this.enrolledSubjectsRepository.save(enrolledSubject);
  }

  findByDepartment(departmentId: number): Promise<Subject[]> {
    return this.subjectsRepository
      .createQueryBuilder("subject")
      .where("subject.departmentId = :departmentId", { departmentId })
      .orderBy("subject.year")
      .addOrderBy("subject.semester")
      .getMany();
  }

  findByProfessor(professorId: number): Promise<Subject[]> {
    return this.subjectsRepository
      .createQueryBuilder("subject")
      .where("subject.professorId = :professorId", { professorId })
      .orderBy("subject.year")
      .addOrderBy("subject.semester")
      .getMany();
  }

  mapToDto(subject: Subject): SubjectDto {
    return {
      id: subject.id,
      name: subject.name,
      compulsory: subject.compulsory,
      ectsPoints: subject.ectsPoints,
      departmentId: subject.departmentId,
      professorId: subject.professorId,
      semester: subject.semester,
      year: subject.year,
    };
  }

  mapToStudentsDto(subject: Subject, grade?: Grade): StudentsSubjectDto {
    return {
      ...this.mapToDto(subject),
      grade,
    };
  }

  mapEnrolledToDto(enrolledSubject: EnrolledSubject): StudentsSubjectDto {
    return {
      id: enrolledSubject.subject.id,
      name: enrolledSubject.subject.name,
      compulsory: enrolledSubject.subject.compulsory,
      ectsPoints: enrolledSubject.subject.ectsPoints,
      departmentId: enrolledSubject.subject.departmentId,
      professorId: enrolledSubject.subject.professorId,
      semester: enrolledSubject.subject.semester,
      year: enrolledSubject.subject.year,
      grade: enrolledSubject.grade,
    };
  }
}
