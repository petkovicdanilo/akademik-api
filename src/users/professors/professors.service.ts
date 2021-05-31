import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import { ProfessorSpecificDto } from "./dto/professor-specific.dto";
import { Profile } from "../profiles/entities/profile.entity";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
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
    const profile = await this.profilesRepository.findOne(id);
    if (!profile || profile.type != ProfileType.Professor) {
      throw new NotFoundException("Professor not found");
    }

    if (!profile.hasAdditionalInfo) {
      throw new BadRequestException(
        "Professor has not filled in additional information",
      );
    }

    return this.professorsRepository.findOne(id);
  }

  async addProfessorSpecificInfo(
    id: number,
    professorSpecificDto: ProfessorSpecificDto,
  ) {
    const profile = await this.profilesService.findOne(id);

    if (profile.hasAdditionalInfo) {
      throw new BadRequestException(
        "Professor specific information already added. Please use patch method for further updates",
      );
    }

    profile.hasAdditionalInfo = true;

    await this.professorsRepository.save({
      profile,
    });

    return this.findOne(id);
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
