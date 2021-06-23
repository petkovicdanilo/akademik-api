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
import { ProfileType } from "../profiles/types";
import { ProfessorSpecificDto } from "./dto/professor-specific.dto";
import { Profile } from "../profiles/entities/profile.entity";
import { Department } from "src/departments/entities/department.entity";

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorsRepository: Repository<Professor>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly profilesService: ProfilesService,
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

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

    const department = await this.departmentsRepository.findOne(
      professorSpecificDto.departmentId,
    );

    if (!department) {
      throw new NotFoundException("Department not found");
    }

    await this.professorsRepository.save({
      profile,
      department,
      title: professorSpecificDto.title,
    });

    return this.findOne(id);
  }

  async update(
    id: number,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<Professor> {
    const professor = await this.findOne(id);

    if (updateProfessorDto.departmentId) {
      const department = await this.departmentsRepository.findOne(
        updateProfessorDto.departmentId,
      );

      if (!department) {
        throw new NotFoundException("Department not found");
      } else {
        professor.department = department;
      }
    }

    professor.profile.firstName =
      updateProfessorDto.firstName ?? professor.profile.firstName;
    professor.profile.lastName =
      updateProfessorDto.lastName ?? professor.profile.lastName;
    professor.profile.email =
      updateProfessorDto.email ?? professor.profile.email;
    professor.profile.dateOfBirth =
      updateProfessorDto.dateOfBirth ?? professor.profile.dateOfBirth;
    professor.profile.password = updateProfessorDto.password
      ? await this.profilesService.hashPassword(
          updateProfessorDto.password,
          professor.profile.salt,
        )
      : professor.profile.password;

    return await this.professorsRepository.save(professor);
  }

  async remove(id: number): Promise<Professor> {
    const professor = await this.findOne(id);

    await this.profilesService.remove(id);

    return professor;
  }

  findByDepartment(departmentId: number): Promise<Professor[]> {
    return this.professorsRepository
      .createQueryBuilder("professor")
      .leftJoinAndSelect("professor.profile", "profile")
      .leftJoinAndSelect("professor.department", "department")
      .where("professor.departmentId = :departmentId", { departmentId })
      .getMany();
  }

  mapProfessorToProfessorDto(professor: Professor): ProfessorDto {
    return {
      id: professor.profile.id,
      dateOfBirth: professor.profile.dateOfBirth,
      email: professor.profile.email,
      firstName: professor.profile.firstName,
      lastName: professor.profile.lastName,
      departmentId: professor.department.id,
      title: professor.title,
    };
  }
}
