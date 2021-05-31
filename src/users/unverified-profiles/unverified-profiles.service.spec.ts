import { Test, TestingModule } from "@nestjs/testing";
import { UnverifiedProfilesService } from "./unverified-profiles.service";

describe("UnverifiedProfilesService", () => {
  let service: UnverifiedProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnverifiedProfilesService],
    }).compile();

    service = module.get<UnverifiedProfilesService>(UnverifiedProfilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
