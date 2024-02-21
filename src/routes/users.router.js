import express from "express";
import { prisma } from "../utils/index.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.post("/sign-up", usersController.userSignUp);
router.post("/sign-in", usersController.userSignIn);
router.get("/me", authMiddleware, usersController.findMyInfo);
router.get("/:userId", usersController.findUserInfoById);

export default router;
