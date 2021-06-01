import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import { Department } from "src/departments/entities/department.entity";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly profilesService: ProfilesService,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  findAll(options: IPaginationOptions): Promise<Pagination<Student>> {
    return paginate<Student>(this.studentsRepository, options);
  }

  async findOne(id: number): Promise<Student> {
    const profile = await this.profilesRepository.findOne(id);
    if (!profile || profile.type != ProfileType.Student) {
      throw new NotFoundException("Student not found");
    }

    if (!profile.hasAdditionalInfo) {
      throw new BadRequestException(
        "Student has not filled in additional information",
      );
    }

    return this.studentsRepository.findOne(id);
  }

  async addStudentSpecificInfo(
    id: number,
    studentSpecificDto: StudentSpecificDto,
  ) {
    const profile = await this.profilesService.findOne(id);

    if (profile.hasAdditionalInfo) {
      throw new BadRequestException(
        "Student specific information already added. Please use patch method for further updates",
      );
    }

    profile.hasAdditionalInfo = true;

    const department = await this.departmentsRepository.findOne(
      studentSpecificDto.departmentId,
    );

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    await this.studentsRepository.save({
      profile,
      department,
    });

    return this.findOne(id);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(id);

    if (updateStudentDto.departmentId) {
      const department = await this.departmentsRepository.findOne(
        updateStudentDto.departmentId,
      );

      if (!department) {
        throw new NotFoundException("Department not found");
      } else {
        student.department = department;
      }
    }

    student.profile.firstName =
      updateStudentDto.firstName ?? student.profile.firstName;
    student.profile.lastName =
      updateStudentDto.lastName ?? student.profile.lastName;
    student.profile.email = updateStudentDto.email ?? student.profile.email;
    student.profile.dateOfBirth =
      updateStudentDto.dateOfBirth ?? student.profile.dateOfBirth;

    return await this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<Student> {
    const student = await this.findOne(id);

    await this.profilesService.remove(id);

    return student;
  }

  mapStudentToStudentDto(student: Student): StudentDto {
    return {
      id: student.profile.id,
      dateOfBirth: student.profile.dateOfBirth,
      email: student.profile.email,
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      departmentId: student.department.id,
    };
  }
}
