import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DepartmentsService } from "src/departments/departments.service";
import { ProfessorsService } from "src/users/professors/professors.service";
import { Repository } from "typeorm";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { SubjectDto } from "./dto/subject.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { Subject } from "./entities/subject.entity";

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    private readonly departmentsService: DepartmentsService,
    private readonly professorsService: ProfessorsService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject();
    subject.name = createSubjectDto.name;
    subject.compulsory = createSubjectDto.compulsory;
    subject.ectsPoints = createSubjectDto.ectsPoints;
    subject.semester = createSubjectDto.semester;

    const department = await this.departmentsService.findOne(
      createSubjectDto.departmentId,
    );
    subject.department = Promise.resolve(department);

    const professor = await this.professorsService.findOne(
      createSubjectDto.professorId,
    );
    subject.professor = Promise.resolve(professor);

    return this.subjectsRepository.save(subject);
  }

  async findOne(id: number) {
    const subject = await this.subjectsRepository.findOne(id);

    if (!subject) {
      throw new NotFoundException("Subject not found");
    }

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne(id);

    subject.name = updateSubjectDto.name ?? subject.name;
    subject.compulsory = updateSubjectDto.compulsory ?? subject.compulsory;
    subject.ectsPoints = updateSubjectDto.ectsPoints ?? subject.ectsPoints;
    subject.semester = updateSubjectDto.semester ?? subject.semester;

    if (updateSubjectDto.departmentId) {
      const department = await this.departmentsService.findOne(
        updateSubjectDto.departmentId,
      );

      subject.departmentId = department.id;
    }

    if (updateSubjectDto.professorId) {
      const professor = await this.professorsService.findOne(
        updateSubjectDto.professorId,
      );

      subject.professorId = professor.id;
    }

    return this.subjectsRepository.save(subject);
  }

  async remove(id: number) {
    const subject = await this.findOne(id);

    this.subjectsRepository.remove(subject);
    subject.id = id;

    return subject;
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
    };
  }
}
