import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "src/subjects/entities/subject.entity";
import { Repository } from "typeorm";
import * as faker from "faker";
import { CreateSubjectDto } from "src/subjects/dto/create-subject.dto";
import { Professor } from "src/users/professors/entities/professor.entity";
import { Department } from "src/departments/entities/department.entity";

@Injectable()
export class SubjectsSeederService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
  ) {}

  async seed() {
    try {
      const professors = await this.professorsRepository.find();
      const departments = await this.departmentsRepository.find();

      const subjects: Map<string, CreateSubjectDto> = new Map();
      for (let i = 0; i < 200; i++) {
        const subject = this.generateSubject(professors, departments);
        const key = [subject.name, subject.departmentId].join(",");

        if (!subjects.has(key)) {
          subjects.set(key, subject);
        }
      }

      await this.subjectsRepository.save(Array.from(subjects.values()));
    } catch (e) {
      console.log(e);
    }
  }

  private generateSubject(
    professors: Professor[],
    departments: Department[],
  ): CreateSubjectDto {
    const professor = faker.random.arrayElement(professors);
    const department = faker.random.arrayElement(departments);

    return {
      name: faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
      professorId: professor.id,
      departmentId: department.id,
      compulsory: faker.datatype.boolean(),
      ectsPoints: faker.datatype.number({ min: 3, max: 8 }),
      semester: faker.random.arrayElement([1, 2]),
      year: faker.random.arrayElement([1, 2, 3, 4]),
    };
  }
}
