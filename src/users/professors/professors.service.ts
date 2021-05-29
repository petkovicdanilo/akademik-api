import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { Professor } from "./entities/professor.entity";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { ProfessorDto } from "./dto/professor.dto";
import { ProfilesService } from "../profiles/profiles.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { ProfileType } from "../profiles/types";
import * as bcrypt from "bcrypt";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(professorDto: CreateUserDto): Promise<Professor> {
    const salt = await bcrypt.genSalt();
    professorDto.password = await bcrypt.hash(professorDto.password, salt);

    return this.professorsRepository.save({
      profile: {
        type: ProfileType.Professor,
        salt,
        ...professorDto,
      },
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
