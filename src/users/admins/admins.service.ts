import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { ProfilesService } from "../profiles/profiles.service";
import { ProfileType } from "../profiles/types";
import { UpdateStudentDto } from "../students/dto/update-student.dto";
import { AdminDto } from "./dto/admin.dto";
import { Admin } from "./entities/admin.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepostiory: Repository<Admin>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(adminDto: CreateUserDto): Promise<Admin> {
    const salt = await bcrypt.genSalt();
    adminDto.password = await bcrypt.hash(adminDto.password, salt);

    return this.adminsRepostiory.save({
      profile: {
        type: ProfileType.Admin,
        salt,
        hasAdditionalInfo: true,
        ...adminDto,
      },
    });
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Admin>> {
    return paginate<Admin>(this.adminsRepostiory, options);
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepostiory.findOne(id);

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Admin> {
    await this.profilesService.update(id, updateStudentDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Admin> {
    const admin = await this.findOne(id);

    await this.profilesService.remove(id);

    return admin;
  }

  mapAdminToAdminDto(admin: Admin): AdminDto {
    return {
      id: admin.profile.id,
      dateOfBirth: admin.profile.dateOfBirth,
      email: admin.profile.email,
      firstName: admin.profile.firstName,
      lastName: admin.profile.lastName,
    };
  }
}
