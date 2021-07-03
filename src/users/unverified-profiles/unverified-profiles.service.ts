import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { RegisterDto } from "src/auth/dto/register.dto";
import { Repository } from "typeorm";
import { UnverifiedProfileDto } from "./dto/unverified-profile.dto";
import { UnverifiedProfile } from "./entities/unverified-profile.entity";
import * as bcrypt from "bcrypt";
import { Profile } from "../profiles/entities/profile.entity";
import { ProfileType } from "../profiles/types";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class UnverifiedProfilesService {
  constructor(
    @InjectRepository(UnverifiedProfile)
    private readonly unverifiedProfilesRepository: Repository<UnverifiedProfile>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly mailService: MailService,
  ) {}

  findAll(options: IPaginationOptions): Promise<Pagination<UnverifiedProfile>> {
    return paginate<UnverifiedProfile>(
      this.unverifiedProfilesRepository,
      options,
    );
  }

  async findOne(id: number) {
    const profile = await this.unverifiedProfilesRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException("Unverified user not found");
    }

    return profile;
  }

  async create(profile: RegisterDto) {
    if (profile.type == ProfileType.Admin) {
      throw new BadRequestException("Type 'admin' not valid");
    }

    profile.salt = await bcrypt.genSalt();
    profile.password = await bcrypt.hash(profile.password, profile.salt);

    const existingProfile = await this.profilesRepository.find({
      where: {
        email: profile.email,
      },
    });

    if (existingProfile[0]) {
      throw new BadRequestException("Email is taken");
    }

    return this.unverifiedProfilesRepository.save(profile);
  }

  async verify(id: number, sendEmail = true): Promise<Profile> {
    const profile = await this.findOne(id);

    const verifiedProfile = await this.profilesRepository.save({
      hasAdditionalInfo: false,
      ...profile,
      id: null, // don't copy id
    });

    await this.unverifiedProfilesRepository.remove(profile);

    if (sendEmail) {
      await this.mailService.sendVerifiedEmail(verifiedProfile);
    }

    return verifiedProfile;
  }

  async remove(id: number, sendEmail = true): Promise<UnverifiedProfile> {
    const profile = await this.findOne(id);

    await this.unverifiedProfilesRepository.remove(profile);
    profile.id = id;

    if (sendEmail) {
      await this.mailService.sendRejectedEmail(profile);
    }

    return profile;
  }

  mapToDto(unverifiedProfile: UnverifiedProfile): UnverifiedProfileDto {
    return {
      id: unverifiedProfile.id,
      email: unverifiedProfile.email,
      firstName: unverifiedProfile.firstName,
      lastName: unverifiedProfile.lastName,
      dateOfBirth: unverifiedProfile.dateOfBirth,
      type: unverifiedProfile.type,
      createdAt: unverifiedProfile.createdAt,
    };
  }
}
