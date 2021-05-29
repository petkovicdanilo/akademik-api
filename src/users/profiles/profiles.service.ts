import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../dto/update-user.dto";
import { ProfileDto } from "./dto/profile.dto";
import { Profile } from "./entities/profile.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profilesRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException("Profile not found");
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
    const updateResult = await this.profilesRepository.update(
      id,
      updateUserDto,
    );

    if (updateResult.affected == 0) {
      throw new NotFoundException("Profile not found");
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<Profile> {
    const profile = await this.findOne(id);
    await this.profilesRepository.remove(profile);

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
