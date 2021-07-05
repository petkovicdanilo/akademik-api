import { Injectable } from "@nestjs/common";
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
import { AdminDto } from "./dto/admin.dto";
import { Admin } from "./entities/admin.entity";
import * as bcrypt from "bcrypt";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";
import { InvalidDataException } from "src/common/exceptions/invalid-data.exception";

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

    try {
      return await this.adminsRepostiory.save({
        profile: {
          type: ProfileType.Admin,
          salt,
          hasAdditionalInfo: true,
          ...adminDto,
        },
      });
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Admin>> {
    return paginate<Admin>(this.adminsRepostiory, options);
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepostiory.findOne(id);

    if (!admin) {
      throw new EntityNotFoundException(Admin);
    }

    return admin;
  }

  async update(id: number, updateAdmin: UpdateAdminDto): Promise<Admin> {
    try {
      await this.profilesService.update(id, updateAdmin);

      return this.findOne(id);
    } catch (e) {
      throw new InvalidDataException("Bad request");
    }
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
