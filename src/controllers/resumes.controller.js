import { InvalidInputError } from "../utils/common.error.js";

export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }

  findAllResumes = async (req, res, next) => {
    try {
      const { sort } = req.query;
      const resumes = await this.resumesService.findAllResumes(sort);

      return res.status(200).json({ data: resumes });
    } catch (err) {
      next(err);
    }
  };

  findResumeById = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const resume = await this.resumesService.findResumeById(resumeId);

      return res.status(200).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  createResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { title, content } = req.body;

      const resume = await this.resumesService.createResume(
        userId,
        title,
        content
      );

      return res.status(201).json({ data: resume });
    } catch (err) {
      next(err);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;
      const { title, content, status } = req.body;
      if (!title && !content && !status)
        throw new InvalidInputError("수정할 값을 입력해주세요.");

      await this.resumesService.updateResume(
        userId,
        resumeId,
        title,
        content,
        status
      );

      return res.status(201).json({ message: "수정이 완료되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { resumeId } = req.params;

      await this.resumesService.deleteResume(userId, resumeId);

      return res.status(201).json({ message: "삭제가 완료되었습니다." });
    } catch (err) {
      next(err);
    }
  };
}
