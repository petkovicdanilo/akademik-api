import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { Professor } from "./entities/professor.entity";
import { RegisterDto } from "src/auth/dto/register.dto";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
  ) {}

  async create(professor: RegisterDto): Promise<Professor> {
    return this.professorsRepository.save(professor);
  }

  findAll() {
    return `This action returns all professors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} professor`;
  }

  async findByEmail(email: string) {
    const students = await this.professorsRepository.find({
      where: {
        email: email,
      },
    });

    return students[0];
  }

  update(id: number, updateProfessorDto: UpdateProfessorDto) {
    return `This action updates a #${id} professor`;
  }

  remove(id: number) {
    return `This action removes a #${id} professor`;
  }
}
