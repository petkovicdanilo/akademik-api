import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";
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

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    try {
      return await this.departmentsRepository.save(createDepartmentDto);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
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
      throw new EntityNotFoundException(Department);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      await this.departmentsRepository.update(id, updateDepartmentDto);
      return this.findOne(id);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
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
