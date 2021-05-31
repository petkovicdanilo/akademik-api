import { Injectable } from "@nestjs/common";
import { DepartmentsService } from "src/departments/departments.service";
import { CreateDepartmentDto } from "src/departments/dto/create-department.dto";

@Injectable()
export class DepartmentsSeederService {
  constructor(private readonly departmentsService: DepartmentsService) {}

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
      this.departments.forEach(async (department) => {
        await this.departmentsService.create(department);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
