import { NotFoundError, NotAuthorizedError } from "../utils/common.error.js";

export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }

  findAllResumes = async (sort) => {
    sort = sort || "createdAt";

    const resumes = await this.resumesRepository.findAllResumes(sort);

    if (!resumes[0]) throw new NotFoundError("이력서 데이터가 없습니다.");

    return resumes;
  };

  findResumeById = async (resumeId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume)
      throw new NotFoundError("해당 id의 이력서가 존재하지 않습니다.");

    return resume;
  };

  createResume = async (userId, title, content) => {
    const resume = await this.resumesRepository.createResume(
      userId,
      title,
      content
    );

    return resume;
  };

  updateResume = async (userId, resumeId, title, content, status) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume)
      throw new NotFoundError("해당 id의 이력서가 존재하지 않습니다.");

    if (+userId !== resume.user.userId)
      throw new NotAuthorizedError("본인의 이력서만 수정할 수 있습니다.");

    const updatedTitle = title || resume.title;
    const updatedContent = content || resume.content;
    const updatedStatus = status ? status.toUpperCase() : resume.status;

    await this.resumesRepository.updateResume(
      resumeId,
      updatedTitle,
      updatedContent,
      updatedStatus
    );
  };

  deleteResume = async (userId, resumeId) => {
    const resume = await this.resumesRepository.findResumeById(resumeId);
    if (!resume)
      throw new NotFoundError("해당 id의 이력서가 존재하지 않습니다.");

    if (+userId !== resume.user.userId)
      throw new NotAuthorizedError("본인의 이력서만 삭제할 수 있습니다.");

    await this.resumesRepository.deleteResume(resumeId);
  };
}
