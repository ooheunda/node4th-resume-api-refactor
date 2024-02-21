export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllResumes = async (sort) => {
    const resumes = await this.prisma.resumes.findMany({
      select: {
        resumeId: true,
        title: true,
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sort]: "desc",
      },
    });

    return resumes;
  };

  findResumeById = async (resumeId) => {
    const resumeData = await this.prisma.resumes.findUnique({
      where: { resumeId: +resumeId },
      select: {
        resumeId: true,
        title: true,
        content: true,
        user: {
          select: {
            userId: true,
            email: true,
            name: true,
            age: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
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
