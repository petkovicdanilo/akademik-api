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
import { Admin } from "./entity/admin.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepostiory: Repository<Admin>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(adminDto: CreateUserDto): Promise<Admin> {
    const salt = await bcrypt.genSalt();
    adminDto.password = await bcrypt.hash(adminDto.password, salt);

    return this.adminRepostiory.save({
      profile: {
        type: ProfileType.Admin,
        salt,
        ...adminDto,
      },
    });
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Admin>> {
    return paginate<Admin>(this.adminRepostiory, options);
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepostiory.findOne(id);

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
