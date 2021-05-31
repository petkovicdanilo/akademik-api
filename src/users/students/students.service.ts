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
import { CreateUserDto } from "../dto/create-user.dto";
import { ProfilesService } from "../profiles/profiles.service";
import { ProfileType } from "../profiles/types";
import { StudentDto } from "./dto/student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Student } from "./entities/student.entity";
import * as bcrypt from "bcrypt";
import { StudentSpecificDto } from "./dto/student-specific.dto";
import { Profile } from "../profiles/entities/profile.entity";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(studentDto: CreateUserDto): Promise<Student> {
    const salt = await bcrypt.genSalt();
    studentDto.password = await bcrypt.hash(studentDto.password, salt);

    return this.studentsRepository.save({
      profile: {
        type: ProfileType.Student,
        salt,
        ...studentDto,
      },
    });
  }

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

    await this.studentsRepository.save({
      profile,
    });

    return this.findOne(id);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    await this.profilesService.update(id, updateStudentDto);

    return this.findOne(id);
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
    };
  }
}
