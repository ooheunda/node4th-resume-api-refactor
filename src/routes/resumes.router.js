import express from "express";
import { prisma } from "../utils/index.js";
import { ResumesController } from "../controllers/resumes.controller.js";
import { ResumesService } from "../services/resumes.service.js";
import { ResumesRepository } from "../repositories/resumes.repository.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);

router.get("/", resumesController.findAllResumes);
router.get("/:resumeId", resumesController.findResumeById);
router.post("/", authMiddleware, resumesController.createResume);
router.patch("/:resumeId", authMiddleware, resumesController.updateResume);
router.delete("/:resumeId", authMiddleware, resumesController.deleteResume);

export default router;
