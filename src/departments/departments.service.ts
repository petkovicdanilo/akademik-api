import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentDto } from "./dto/department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Department } from "./entities/department.entity";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentsRepository.save(createDepartmentDto);
  }

  findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({
      order: {
        id: "ASC",
      },
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne(id);

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    await this.departmentsRepository.update(id, updateDepartmentDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Department> {
    const department = await this.findOne(id);

    await this.departmentsRepository.remove(department);
    department.id = id;

    return department;
  }

  mapDepartmentToDepartmentDto(department: Department): DepartmentDto {
    return {
      id: department.id,
      name: department.name,
    };
  }
}
