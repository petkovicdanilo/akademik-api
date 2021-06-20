import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDepartmentDto } from "src/departments/dto/create-department.dto";
import { Department } from "src/departments/entities/department.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartmentsSeederService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  departments: CreateDepartmentDto[] = [
    {
      name: "computer science",
    },
    {
      name: "mathematics",
    },
    {
      name: "physics",
    },
    {
      name: "chemistry",
    },
    {
      name: "biology",
    },
    {
      name: "geography",
    },
  ];

  async seed() {
    try {
      await this.departmentsRepository.save(this.departments);
    } catch (e) {
      console.log(e);
    }
  }
}
