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
import { ProfessorDto } from "./dto/professor.dto";
import { ProfilesService } from "../profiles/profiles.service";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
    private readonly profilesService: ProfilesService,
  ) {}

  create(professorDto: RegisterDto): Promise<Professor> {
    return this.professorsRepository.save({
      profile: professorDto,
    });
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Professor>> {
    return paginate<Professor>(this.professorsRepository, options);
  }

  async findOne(id: number): Promise<Professor> {
    const professor = await this.professorsRepository.findOne(id);

    if (!professor) {
      throw new NotFoundException("Professor not found");
    }

    return professor;
  }

  async update(
    id: number,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<Professor> {
    await this.profilesService.update(id, updateProfessorDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Professor> {
    const professor = await this.findOne(id);

    await this.profilesService.remove(id);

    return professor;
  }

  mapProfessorToProfessorDto(professor: Professor): ProfessorDto {
    return {
      id: professor.profile.id,
      dateOfBirth: professor.profile.dateOfBirth,
      email: professor.profile.email,
      firstName: professor.profile.firstName,
      lastName: professor.profile.lastName,
    };
  }
}
