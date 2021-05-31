import { Test, TestingModule } from "@nestjs/testing";
import { UnverifiedProfilesController } from "./unverified-profiles.controller";
import { UnverifiedProfilesService } from "./unverified-profiles.service";

describe("UnverifiedProfilesController", () => {
  let controller: UnverifiedProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnverifiedProfilesController],
      providers: [UnverifiedProfilesService],
    }).compile();

    controller = module.get<UnverifiedProfilesController>(
      UnverifiedProfilesController,
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
