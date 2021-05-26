import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { Professor } from "./entities/professor.entity";
import { RegisterDto } from "src/auth/dto/register.dto";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
  ) {}

  async create(professor: RegisterDto): Promise<Professor> {
    return this.professorsRepository.save(professor);
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Professor>> {
    const queryBuilder = this.professorsRepository.createQueryBuilder();
    return paginate<Professor>(queryBuilder, options);
  }

  async findOne(id: number): Promise<Professor> {
    const professor = await this.professorsRepository.findOne(id);

    if (!professor) {
      throw new NotFoundException("Professor not found");
    }

    return professor;
  }

  async findByEmail(email: string) {
    const students = await this.professorsRepository.find({
      where: {
        email: email,
      },
    });

    return students[0];
  }

  async update(
    id: number,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<Professor> {
    const updateResult = await this.professorsRepository.update(
      id,
      updateProfessorDto,
    );

    if (updateResult.affected == 0) {
      throw new NotFoundException("Professor not found");
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<Professor> {
    const professor = await this.findOne(id);
    await this.professorsRepository.delete(id);

    return professor;
  }
}
