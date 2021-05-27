import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { RegisterDto } from "src/auth/dto/register.dto";
import { Repository } from "typeorm";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Student } from "./entities/student.entity";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async create(student: RegisterDto): Promise<Student> {
    return this.studentsRepository.save(student);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Student>> {
    const queryBuilder = this.studentsRepository.createQueryBuilder();
    return paginate<Student>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne(id);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const students = await this.studentsRepository.find({
      where: {
        email: email,
      },
    });

    return students[0];
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const updateResult = await this.studentsRepository.update(
      id,
      updateStudentDto,
    );

    if (updateResult.affected == 0) {
      throw new NotFoundException("Student not found");
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<Student> {
    const student = await this.findOne(id);
    await this.studentsRepository.delete(id);

    return student;
  }

  setPasswordResetToken(id: number, token: string) {
    return this.studentsRepository.update(id, {
      passwordResetToken: token,
    });
  }

  resetPassword(id: number, password: string) {
    return this.studentsRepository.update(id, {
      password,
      passwordResetToken: null,
    });
  }
}
