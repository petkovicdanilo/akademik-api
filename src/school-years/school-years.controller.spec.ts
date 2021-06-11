import { Test, TestingModule } from "@nestjs/testing";
import { SchoolYearsController } from "./school-years.controller";
import { SchoolYearsService } from "./school-years.service";

describe("SchoolYearsController", () => {
  let controller: SchoolYearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolYearsController],
      providers: [SchoolYearsService],
    }).compile();

    controller = module.get<SchoolYearsController>(SchoolYearsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
