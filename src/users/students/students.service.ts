import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { ProfilesService } from "../profiles/profiles.service";
import { ProfileType } from "../profiles/types";
import { StudentDto } from "./dto/student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Student } from "./entities/student.entity";
import { StudentSpecificDto } from "./dto/student-specific.dto";
import { Profile } from "../profiles/entities/profile.entity";
import { SchoolYearsService } from "src/school-years/school-years.service";
import { DepartmentsService } from "src/departments/departments.service";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly profilesService: ProfilesService,
    private readonly departmentsService: DepartmentsService,
    private readonly schoolYearsService: SchoolYearsService,
  ) {}

  findAll(options: IPaginationOptions): Promise<Pagination<Student>> {
    return paginate<Student>(this.studentsRepository, options);
  }

  async findOne(id: number): Promise<Student> {
    const profile = await this.profilesRepository.findOne(id);
    if (!profile || profile.type != ProfileType.Student) {
      throw new EntityNotFoundException(Student);
    }

    if (!profile.hasAdditionalInfo) {
      throw new InvalidDataException(
        "Student has not filled in additional information",
      );
    }

    return this.studentsRepository.findOne(id);
  }

  async addStudentSpecificInfo(
    id: number,
    studentSpecificDto: StudentSpecificDto,
    startingSchoolYearId: string = null,
  ) {
    const profile = await this.profilesService.findOne(id);

    if (profile.hasAdditionalInfo) {
      throw new InvalidDataException(
        "Student specific information already added. Please use patch method for further updates",
      );
    }

    profile.hasAdditionalInfo = true;

    const department = await this.departmentsService.findOne(
      studentSpecificDto.departmentId,
    );

    let startingSchoolYear;
    if (startingSchoolYearId == null) {
      startingSchoolYear = await this.schoolYearsService.findCurrent();
    } else {
      startingSchoolYear = await this.schoolYearsService.findOne(
        startingSchoolYearId,
      );
    }

    await this.studentsRepository.save({
      profile,
      department,
      startingSchoolYear,
    });

    return this.findOne(id);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(id);

    if (updateStudentDto.departmentId) {
      const department = await this.departmentsService.findOne(
        updateStudentDto.departmentId,
      );

      student.department = department;
    }

    student.profile.firstName =
      updateStudentDto.firstName ?? student.profile.firstName;
    student.profile.lastName =
      updateStudentDto.lastName ?? student.profile.lastName;
    student.profile.email = updateStudentDto.email ?? student.profile.email;
    student.profile.dateOfBirth =
      updateStudentDto.dateOfBirth ?? student.profile.dateOfBirth;
    student.profile.password = updateStudentDto.password
      ? await this.profilesService.hashPassword(
          updateStudentDto.password,
          student.profile.salt,
        )
      : student.profile.password;

    try {
      return await this.studentsRepository.save(student);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  async remove(id: number): Promise<Student> {
    const student = await this.findOne(id);

    await this.profilesService.remove(id);

    return student;
  }

  findBySubjectSchoolYearId(
    subjectId: number,
    schoolYearId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Student>> {
    const queryBuilder = this.studentsRepository
      .createQueryBuilder("student")
      .leftJoin("student.enrolledSubjects", "enrolled")
      .leftJoinAndSelect("student.profile", "profile")
      .leftJoinAndSelect("student.department", "department")
      .leftJoinAndSelect("student.startingSchoolYear", "startingSchoolYear")
      .where("enrolled.subjectId = :subjectId", { subjectId })
      .andWhere("enrolled.schoolYear = :schoolYearId", { schoolYearId });

    return paginate<Student>(queryBuilder, options);
  }

  mapStudentToStudentDto(student: Student): StudentDto {
    return {
      id: student.profile.id,
      dateOfBirth: student.profile.dateOfBirth,
      email: student.profile.email,
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      departmentId: student.department.id,
      startingSchoolYearId: student.startingSchoolYear.id,
    };
  }
}
