import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../dto/update-user.dto";
import { ProfileDto } from "./dto/profile.dto";
import { Profile } from "./entities/profile.entity";
import * as bcrypt from "bcrypt";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { EntityNotFoundException } from "src/common/exceptions/entity-not-found.exception";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  findAll(options: IPaginationOptions): Promise<Pagination<Profile>> {
    return paginate<Profile>(this.profilesRepository, options);
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne(id);

    if (!profile) {
      throw new EntityNotFoundException(Profile, "User");
    }

    return profile;
  }

  async findByEmail(email: string): Promise<Profile> {
    const users = await this.profilesRepository.find({
      email: email,
    });

    return users[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Profile> {
    const profile = await this.findOne(id);

    profile.firstName = updateUserDto.firstName ?? profile.firstName;
    profile.lastName = updateUserDto.lastName ?? profile.lastName;
    profile.email = updateUserDto.email ?? profile.email;
    profile.dateOfBirth = updateUserDto.dateOfBirth ?? profile.dateOfBirth;
    profile.password = updateUserDto.password
      ? await this.hashPassword(updateUserDto.password, profile.salt)
      : profile.password;

    return this.profilesRepository.save(profile);
  }

  async remove(id: number): Promise<Profile> {
    const profile = await this.findOne(id);

    await this.profilesRepository.remove(profile);
    profile.id = id as number;

    return profile;
  }

  setPasswordResetToken(id: number, token: string) {
    return this.profilesRepository.update(id, {
      passwordResetToken: token,
    });
  }

  async resetPassword(profile: Profile, password: string) {
    password = await bcrypt.hash(password, profile.salt);

    return this.profilesRepository.update(profile.id, {
      password,
      passwordResetToken: null,
    });
  }

  hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  mapProfileToProfileDto(user: Profile): ProfileDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      type: user.type,
    };
  }
}
