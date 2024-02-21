export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllResumes = async (sort) => {
    const resumes = await this.prisma.resumes.findMany({
      orderBy: {
        [sort]: "desc",
      },
    });

    return resumes;
  };

  findResumeById = async (resumeId) => {
    const resumeData = await this.prisma.resumes.findUnique({
      where: { resumeId: +resumeId },
    });

    return resumeData;
  };

  createResume = async (userId, title, content) => {
    const createdResume = await this.prisma.resumes.create({
      data: {
        userId: +userId,
        title,
        content,
        status: "APPLY",
      },
    });

    return createdResume;
  };

  updateResume = async (resumeId, title, content, status) => {
    await this.prisma.resumes.update({
      where: { resumeId: +resumeId },
      data: {
        title,
        content,
        status,
      },
    });
  };

  deleteResume = async (resumeId) => {
    await this.prisma.resumes.delete({
      where: { resumeId: +resumeId },
    });
  };
}
