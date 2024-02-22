import { jest } from "@jest/globals";
import { ResumesRepository } from "../../../src/repositories/resumes.repository.js";

let mockPrisma = {
  resumes: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let resumesRepository = new ResumesRepository(mockPrisma);

describe("Resumes Repository Unit Test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("findAllResumes Method", async () => {
    const mockReturn = "prisma findmany";
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const resumes = await resumesRepository.findAllResumes();

    expect(resumes).toBe(mockReturn);
  });

  test("findResumeById Method", async () => {
    const mockReturn = "prisma findUnique";
    mockPrisma.resumes.findUnique.mockReturnValue(mockReturn);

    const resume = await resumesRepository.findResumeById();

    expect(resume).toBe(mockReturn);
  });

  test("createResume Method", async () => {
    const mockReturn = "prisma create";
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    const createResumeParams = {
      userId: "2",
      title: "create title",
      content: "create content",
    };

    const createdResume = await resumesRepository.createResume(
      createResumeParams.userId,
      createResumeParams.title,
      createResumeParams.content
    );

    expect(createdResume).toBe(mockReturn);
    expect(resumesRepository.prisma.resumes.create).toHaveBeenCalledWith({
      data: {
        userId: +createResumeParams.userId,
        title: createResumeParams.title,
        content: createResumeParams.content,
        status: "APPLY",
      },
    });
  });

  test("updateResume Method", async () => {
    const updateResumeParams = {
      resumeId: "3",
      title: "update title",
      content: "update content",
      status: "update status",
    };

    await resumesRepository.updateResume(
      updateResumeParams.resumeId,
      updateResumeParams.title,
      updateResumeParams.content,
      updateResumeParams.status
    );

    expect(resumesRepository.prisma.resumes.update).toHaveBeenCalledWith({
      where: { resumeId: +updateResumeParams.resumeId },
      data: {
        title: updateResumeParams.title,
        content: updateResumeParams.content,
        status: updateResumeParams.status,
      },
    });
  });

  test("deleteResume Method", async () => {
    const resumIdParam = "4";

    await resumesRepository.deleteResume(resumIdParam);

    expect(resumesRepository.prisma.resumes.delete).toHaveBeenCalledWith({
      where: { resumeId: +resumIdParam },
    });
  });
});
